---
title: "ReceiptTracker Unified Technical Design Document (Scheme A: Local Offline On-Device OCR - Multilingual i18n Version)"
date: 2026-06-18T11:30:00+09:00
draft: true
tags: ["AppMatrix", "ReceiptTracker", "React Native", "OCR", "i18n"]
categories: ["Engineering Practice", "Mobile Architecture"]
description: "Design document for the smart receipt scanning and price classification tracker (ReceiptTracker), discussing in detail on-device image preprocessing, dual-platform native OCR engine integration, line-alignment clustering algorithms, and local SQLite database multilingual/multi-currency design."
---

This design document targets the **Smart Receipt Scanning and Price Classification Tracker (ReceiptTracker)** project under the AppMatrix platform.
This project adopts the **Scheme A (Fully On-Device Offline First)** architecture on the mobile end, and fully supports **Chinese (Simplified/Traditional), Japanese, and English** multilingual OCR compatibility schemes as well as application UI internationalization (i18n).

---

## 1. Dual-Platform Independent Project Architecture

The `ReceiptTracker` project shares the core page logic and UI components, while configuring SDK bridging for multilingual OCR and image preprocessing at the native layer for both platforms:

```text
apps/
└── ReceiptTracker/
    ├── src/
    │   ├── android/             # Android native shell project and ML Kit bridging
    │   │   ├── app/src/main/
    │   │   │   ├── java/com/appmatrix/receipttracker/OCRBridgeModule.kt   # Bridge code supporting dynamic ZH/JA/EN OCR
    │   │   │   └── AndroidManifest.xml   # Camera permissions and hardware requirements declaration
    │   │   └── build.gradle             # Imports ML Kit Chinese and Japanese recognition dependency packages
    │   └── ios/                 # iOS native shell project and Vision.framework bridging
    │       ├── ReceiptTracker/
    │       │   ├── OCRBridgeModule.swift  # Bridge code supporting ZH/JA/EN Vision OCR
    │       │   └── Info.plist            # NSCameraUsageDescription declaration
    │       └── ReceiptTracker.xcodeproj
    └── shared/                  # Shared React Native (Expo) business code for both platforms
        ├── src/
        │   ├── components/      # Shared UI (e.g., Canvas trend line chart component)
        │   ├── screens/         # Three main pages: History, Scanner Verification, Price Analytics
        │   └── utils/
        │       ├── alignLines.ts # Y-axis text line clustering core algorithm
        │       ├── database.ts   # SQLite wrapper supporting multi-currency and language flags
        │       └── i18n.ts       # Lightweight UI multilingual i18n dictionary
        └── package.json
```

---

## 2. On-Device Image Preprocessing Design

Receipt prints are often faint, and paper wrinkles or skewing have a massive impact on OCR accuracy. The system must perform native accelerated preprocessing before feeding the image to the OCR engine:

```text
[Original Large Photo] ──(Native C++/WebGL)──> [1. Grayscale] ──> [2. Contrast Stretching] ──> [3. Binarization/Denoising] ──> [Temporary Clean Image]
```

### 2.1 Preprocessing Flow
1.  **Size Compression**: To prevent OOM crashes caused by large images and accelerate recognition, the image captured by the camera is proportionally scaled down natively, limiting the maximum short edge to within 1080px.
2.  **Grayscale**: Reduces image color channels to a single-channel grayscale image. Formula:
    $$\text{Gray} = 0.299 \times R + 0.587 \times G + 0.114 \times B$$
3.  **Contrast Stretching**: Enhances the visual difference between printed ink and light-colored paper, increasing the sharpness of text edges.
4.  **Temporary PNG Writing**: Generates a temporary lightweight PNG format file in the sandbox cache directory (`CacheDirectory`) to provide to the native OCR engine. It is immediately deleted after parsing is complete.

---

## 3. Dual-Platform Independent Native OCR Engine Integration

Instead of using a bulky local Tesseract dictionary package, both platforms invoke the system's built-in OCR engines, exposing them to the frontend JS via the React Native Bridge:

### 3.1 iOS Native Integration: `Vision.framework`
iOS 13+ provides the powerful offline `Vision` image recognition framework. In Swift, by configuring the language array, simultaneous compatible recognition of Chinese, Japanese, and English is achieved:

```swift
import Vision
import UIKit

@objc(OCRBridgeModule)
class OCRBridgeModule: NSObject {
    
    @objc
    func recognizeReceiptText(_ imagePath: String, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
        // [Image Loading Logic Omitted]
        
        let requestHandler = VNImageRequestHandler(cgImage: cgImage, options: [:])
        
        let request = VNRecognizeTextRequest { (request, error) in
            // [Result Handling Logic Omitted]
        }
        
        // Set Vision Parameters - Enable ZH/JA/EN compatible recognition
        request.recognitionLevel = .accurate
        request.usesLanguageCorrection = true
        // Key Update: Support Simplified Chinese, Traditional Chinese, Japanese, English
        request.recognitionLanguages = ["zh-Hans", "zh-Hant", "ja-JP", "en-US"] 
        
        do {
            try requestHandler.perform([request])
        } catch {
            reject("ERR_OCR_PERFORM", "Failed to perform OCR", error)
        }
    }
}
```

### 3.2 Android Native Integration: `ML Kit Text Recognition`
On the Android side, text recognition for Chinese, Japanese, and English is provided by different underlying ML Kit dependency packages and recognizers. To achieve trilingual compatibility, the bridge module supports dynamically initializing the corresponding language recognition client based on the current language selected by the client:

*   **Dependency Configuration (`android/app/build.gradle`)**:
    ```groovy
    dependencies {
        // Import ML Kit Chinese recognition dependency
        implementation 'com.google.mlkit:text-recognition-chinese:16.0.0'
        // Import ML Kit Japanese recognition dependency
        implementation 'com.google.mlkit:text-recognition-japanese:16.0.0'
    }
    ```

*   **Bridging Logic (`OCRBridgeModule.kt`)**:
    ```kotlin
    // Key Update: Dynamically match the corresponding offline text recognition client based on the target language passed from the frontend
    val recognizer: TextRecognizer = when (targetLang.lowercase()) {
        "ja" -> {
            // Japanese offline text recognition client
            TextRecognition.getClient(JapaneseTextRecognizerOptions.Builder().build())
        }
        "zh" -> {
            // Chinese offline text recognition client
            TextRecognition.getClient(ChineseTextRecognizerOptions.Builder().build())
        }
        else -> {
            // Default English/Latin offline text recognition client
            TextRecognition.getClient(TextRecognizerOptions.DEFAULT_OPTIONS)
        }
    }
    ```

---

## 4. Structured Line Alignment Algorithm for Receipt Text (Y-Axis Align Clustering)

On the offline device side, the OCR engine outputs merely a set of discrete strings with bounding boxes. Due to layout reasons, the product name `"Deluxe Milk 250ml"` on the left and the price `"59.90"` on the right might end up in completely different recognition blocks in the image. An algorithm is needed to restore their horizontal "line-aligned" relationship.

### 4.1 Core Line-Alignment Clustering Algorithm Pseudocode
```typescript
/**
 * Gaussian/interval clustering algorithm based on Y-axis position to restore physical text lines
 */
export function alignOCRBlocksToLines(blocks: OCRBlock[]): string[][] {
  // 1. Sort by Y-axis coordinate from top to bottom
  // 2. Iterate through existing lines, check if the text block is within the Y-axis height tolerance (60% of row height)
  // 3. If it doesn't align with any existing row, it's a new line of text
  // 4. Sort the text blocks within each line by X-axis from left to right, restoring text order and concatenating
}
```

### 4.2 Regex Matching and Field Extraction (i18n Compatible)
For each concatenated pure text line (e.g., Japanese `["特選牛乳 1L", "x1", "248"]` or English `["Organic Milk", "$6.99"]`), the matching pattern differs:
*   **Price Localization (Multi-currency compatible)**:
    Use regex `/(\d+(?:\.\d{2})?)/` to search from the back to the front.
    -   If the current language is Japanese (JA), prices are usually integers, parsed with `parseInt()` and decimals stripped;
    -   Under Chinese and English, parsed with `parseFloat().toFixed(2)`.
*   **Quantity Localization**: Match numbers or characters with prefixes like `x`/`*`.

---

## 5. Local SQLite Database Multilingual/Multi-currency Design

To support multilingual bookkeeping, the local database has added language (`lang`) and currency (`currency`) identifier fields to the main `receipts` table and the products table:

### 5.1 Database Schema Definition
```sql
-- 1. Main receipt table (extended with multilingual and currency fields)
CREATE TABLE IF NOT EXISTS receipts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    merchant TEXT NOT NULL,
    date TEXT NOT NULL,
    total_amount REAL NOT NULL,
    lang TEXT NOT NULL,         -- 'zh', 'ja', 'en'
    currency TEXT NOT NULL      -- 'CNY', 'JPY', 'USD'
);

-- 3. Unified product view (used for price classification tracking)
CREATE TABLE IF NOT EXISTS products (
    product_name TEXT PRIMARY KEY,
    category TEXT NOT NULL,
    first_detected_date TEXT NOT NULL,
    lang TEXT NOT NULL          -- Marks which language category the product belongs to, preventing multilingual mixing
);
```

---

## 6. System Permissions and Security Compliance

To ensure the app successfully passes reviews in mobile app stores (Apple App Store / Google Play), privacy declarations must be configured in the native profile descriptions.

---

## 7. Phone System Versions and Hardware Requirements

Because Scheme A uses **fully offline on-device OCR recognition and local image processing**, the app has explicit compatibility requirements for mobile phones:

### 7.1 iOS Platform Requirements
*   **System Version**: Minimum **iOS 13.0**, recommended **iOS 15.0+** (Vision OCR accuracy for JA/ZH is greatly optimized in iOS 15).
*   **Processor (CPU/NPU)**: Recommended Apple **A12 Bionic and above** (containing NPU Neural Engine, e.g., iPhone XS onwards).

### 7.2 Android Platform Requirements
*   **System Version**: Minimum **Android 8.0 (API 26)** to ensure concurrency efficiency of the local SQLite sandbox.
*   **Memory (RAM)**: Minimum **3.0 GB**, recommended 6.0 GB+.
*   **Service Dependency (GMS)**:
    -   *GMS Devices*: Uses Thin/Shared mode, APK size increases by only ~**1.5MB**.
    -   *Non-GMS Devices*: Switched to Bundled mode (built-in ZH+JA OCR dynamic models) during packaging, final APK size increases by ~**12MB**.

---

## 8. Interface and Data Internationalization (i18n) Design

The app uses `react-i18next` or a lightweight global language management class in the shared frontend logic to adaptively switch between ZH/JA/EN based on the `app_lang` state.

### 8.1 Internationalization Rendering Specs for Canvas Trend Lines
-   **Japanese Yen (JPY)**: Y-axis scales and point coordinate price tags are converted to integers with no decimals via `Math.round(price)`.
-   **RMB / USD (CNY / USD)**: Formatted as amount tags containing two decimal places via `price.toFixed(2)`.

---

## 9. Screen Orientation Adaptation Matrix

To ensure the best shooting, recognition, and chart viewing experience in different scenarios, `ReceiptTracker` has formulated differentiated screen rotation strategies and layout rearrangement specifications for different pages.

| Page Name | Default Orientation | Rotation Strategy | Core Reason |
|---|---|---|---|
| **History Page** | Portrait | **Portrait Only** | Pure list display and historical card flow; locking to portrait facilitates one-handed scrolling review. |
| **Scanner Page** | Portrait | **Adaptive** | Wide/short receipts or longer receipts require pulling the camera closer in landscape to improve resolution and OCR accuracy. In landscape, the operation bar moves to the right for easy gripping. |
| **Analytics Page** | Portrait | **Adaptive** | When the Canvas price history trend line chart is displayed in landscape, the horizontal timeline is lengthened, spacing out points, demonstrating more precise price inflection points and forecast curves. |
