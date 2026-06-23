---
title: "MobileFileEditor Unified Technical Design Document"
date: 2026-06-18T11:30:00+09:00
draft: true
tags: ["AppMatrix", "MobileFileEditor", "React Native", "Expo"]
categories: ["Engineering Practice", "Mobile Architecture"]
description: "Dual-platform independent project architecture, sandbox file system design, dual-platform specific interaction difference handling, and screen orientation adaptation strategy for the Mobile File Editor (MobileFileEditor)."
---

This design document is for the **Mobile File Editor (MobileFileEditor)** project under the AppMatrix platform. Although at the release and project management level, the platform needs to simultaneously develop and release independent **Android apps (MobileFileEditor_Android)** and **iOS apps (MobileFileEditor_iOS)**, they share the same screen design and fundamental business logic.

This design is built on React Native (Expo) and aims to provide completely consistent, exquisite frosted glass card management and smooth editing experiences on both platforms, while deeply differentiating and adapting specific components and gesture interactions on their respective native platforms.

---

## 1. Dual-Platform Independent Project Architecture

Sharing the same screen design and utility code, but split into two independent release engineering projects under the `apps/` directory.

```text
apps/
├── MobileFileEditor_iOS/       # Independent iOS platform release project
│   ├── app/                    # Routing and page rendering layer (Shared page logic)
│   └── src/                    # Platform-specific encapsulation (e.g., iOS exclusive Action Sheet)
└── MobileFileEditor_Android/   # Independent Android platform release project
    ├── app/                    # Routing and page rendering layer (Shared page logic)
    └── src/                    # Platform-specific encapsulation (e.g., Android physical back interception)
```

---

## 2. File System and Local Storage Design

Both platforms adopt Scoped Storage (partitioned storage/sandbox storage), each operating on text in their private directories, avoiding the need to apply for dangerous external storage read/write permissions.

### 2.1 Dual-Platform Sandbox Path Differences
*   **iOS Platform**: Stored in `FileSystem.documentDirectory`, the actual path is `/var/mobile/Containers/Data/Application/<UUID>/Documents/`. This data can be automatically backed up by iCloud during device upgrades or replacements.
*   **Android Platform**: Stored in `FileSystem.documentDirectory`, the actual path is `/data/user/0/com.appmatrix.mobilefileeditor.android/files/`. It belongs to Android internal Scoped Storage; when the app is uninstalled, this data will be cleared along with it.

### 2.2 Dual-Platform Shared File System Interface Wrapper (`src/utils/fileSystem.ts`)
```typescript
import * as FileSystem from 'expo-file-system';

export const getBaseDir = (): string => FileSystem.documentDirectory;
export const SUPPORTED_EXTENSIONS = ['.txt', '.md', '.json', '.css', '.html'];
export const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB size limit

export interface FileItem {
  name: string;
  path: string;
  size: number;
  modifiedTime: number;
}

/**
 * Scan and filter text format files
 */
export async function listTextFiles(): Promise<FileItem[]> {
  const dir = getBaseDir();
  const fileNames = await FileSystem.readDirectoryAsync(dir);
  const items: FileItem[] = [];

  for (const name of fileNames) {
    const ext = name.substring(name.lastIndexOf('.')).toLowerCase();
    if (SUPPORTED_EXTENSIONS.includes(ext)) {
      const info = await FileSystem.getInfoAsync(dir + name);
      if (info.exists && !info.isDirectory) {
        items.push({
          name,
          path: dir + name,
          size: info.size,
          modifiedTime: info.modificationTime * 1000
        });
      }
    }
  }
  return items.sort((a, b) => b.modifiedTime - a.modifiedTime);
}
```

---

## 3. Dual-Platform Specific Interaction Difference Handling

In order to make the applications appear sufficiently refined on their respective native platforms under the premise of sharing screen design, we will introduce specific operational behaviors through platform judgment (`Platform.OS`).

### 3.1 Intercepting Unsaved Exits
When there are unsaved modifications on the editor page and the user clicks back, both platforms activate their respective native interception logic:
*   **iOS side-swipe back and navigation back**: Disables the iOS native side-swipe gesture by default to prevent modifications from being lost due to insensible exits. When clicking back, an Action Sheet slides out from the bottom for a secondary confirmation to discard.
*   **Android physical back button interception**: Hard-intercepts physical back events and virtual gestures via `BackHandler`, popping up a Material centered confirmation Dialog with Elevation shadows in the center of the screen.

```typescript
import { useEffect } from 'react';
import { BackHandler, Platform, Alert } from 'react-native';

export function useBackInterception(hasChanges: boolean, onBackConfirm: () => void) {
  useEffect(() => {
    if (Platform.OS !== 'android') return;

    const handleAndroidBack = () => {
      if (hasChanges) {
        showAndroidConfirmDialog({
          title: 'Discard unsaved changes?',
          onConfirm: onBackConfirm
        });
        return true; // Intercept physical back
      }
      return false;
    };

    BackHandler.addEventListener('hardwareBackPress', handleAndroidBack);
    return () => BackHandler.removeEventListener('hardwareBackPress', handleAndroidBack);
  }, [hasChanges]);
}
```

### 3.2 Virtual Keyboard Conflict Issue and Fix Scheme

#### Background: Dual popup conflict between self-built simulated keyboard vs. system virtual keyboard

`editor.html` contains a complete self-built simulated keyboard (`.virtual-keyboard`, height 290px) to provide an enhanced input experience with Markdown shortcut symbols within the WebView. However, due to the following design flaws, the self-built simulated keyboard and the system virtual keyboard popped up simultaneously, causing the editing area to be doubly compressed, reducing the actual editable space to almost zero:

**Root Cause of Conflict (Original erroneous logic)**:
1. Called `toggleVirtualKeyboard(true)` in the `DOMContentLoaded` event to automatically expand the simulated keyboard (Lines 817~820).
2. Immediately called `document.getElementById('textarea').focus()` to make the `<textarea>` gain focus, triggering the system virtual keyboard to pop up.
3. Two sets of keyboards simultaneously occupied the bottom space of the screen: system keyboard (approx. 250~340px) + self-built simulated keyboard (290px), totaling a compressed height of 580~630px, exceeding 70% of the screen height of most mobile phones, rendering the editing area completely unusable.

**Fix Scheme**:

Adopt a "mutually exclusive mode" — choose either the self-built simulated keyboard or the system keyboard; never activate both simultaneously:

- **Completely forbid the system keyboard from popping up**: Add the `inputmode="none"` attribute to the `<textarea>`. This attribute informs the browser/WebView that this input box does not need the system input method, fundamentally preventing the system keyboard from popping up while retaining the cursor and selection capabilities of the `<textarea>`.
- **Remove automatic expansion logic**: Delete the code that automatically calls `toggleVirtualKeyboard(true)` in `DOMContentLoaded`, changing it to expand the simulated keyboard only when the user actively clicks the "K" button on the toolbar or the floating keyboard icon.
- **Simulated keyboard completely takes over input**: All text input, backspace, and line breaks are written to the `<textarea>`'s value via the simulated keyboard's `typeKey()` / `typeBackspace()` / `handleEnterKey()` functions, without system keyboard intervention.
- **`<textarea>` keeps focus available**: `inputmode="none"` does not affect cursor positioning and selection; all operations of the simulated keyboard still correctly locate the insertion point via `textarea.selectionStart` / `setSelectionRange()`.

**Dual-platform keyboard avoidance parameters** (maintain original logic, now only layout against the simulated keyboard's own height):
- **iOS**: When the simulated keyboard is expanded (290px), `editor-container` automatically shrinks via flexbox, the visible height of `textarea` decreases accordingly, no extra `keyboardVerticalOffset` is needed (because the system keyboard has been completely forbidden).
- **Android**: `windowSoftInputMode` maintains `adjustResize`, but since the system keyboard no longer pops up, this configuration no longer produces a practical effect; retained for future feature expansion.


### 3.3 Visual Component Specific Mechanisms
*   **Press Effects**:
    *   Android cards default to a ripple diffusion effect (`android_ripple`).
    *   iOS uniformly presents an `opacity` gradient press feedback (opacity is adjusted to 0.6 in the Active state).
*   **Operation Panels**:
    *   Long-pressing an Android list card activates a Material 3 style rounded Dialog menu in the center of the screen.
    *   Long-pressing an iOS card slides out an Action Sheet at the frosted glass level from the bottom.


---

## 4. Screen Orientation Adaptation Matrix

To ensure the best reading and editing experience in different scenarios, `MobileFileEditor` has formulated differentiated screen rotation strategies and layout schemes for different pages, completely eliminating proportional scaling or forced stretching.

| Page Name | Default Orientation | Rotation Strategy | Core Reason |
|---|---|---|---|
| **File List Page (Index)** | Portrait | **Portrait Only** | Pure card list and file management logic; locking to portrait avoids mistakenly triggering rotation due to slight shaking during one-handed operation, thereby reducing usage efficiency. |
| **Text Editor Page (Editor)** | Portrait | **Adaptive** | During text/code editing, landscape can provide ample single-line width. Landscape supports a Split View between the editing area and Markdown preview area, significantly enhancing the writing experience. |

### 4.1 Text Editor Page (Editor) Landscape/Portrait Adaptation Details

The self-built simulated keyboard and interface reflow strategies in landscape and portrait modes are as follows:

#### A. Portrait Layout
```text
+------------------------------------------+
|  [< Back]     Filename.md        [Save]  | <-- Top Navigation Bar (60px)
+------------------------------------------+
|                                          |
|  This is a Markdown file.                |
|  The cursor flashes in the input box...  | <-- Text Editing Area (Flex: 1)
|                                          |
|                                          |
+------------------------------------------+
| [ # ] [ * ] [ - ] [ > ] [ ` ] [ [ ] [ K ]| <-- Shortcut Symbol Bar (45px)
+------------------------------------------+
| [ A ] [ B ] [ C ] [ D ] [ E ] [ F ] [ G ]|
| [ H ] [ I ] [ J ] [ K ] [ L ] [ M ] [ N ]| <-- Self-built Simulated Keyboard (290px)
| [  Space  ]   [ Enter ]     [ Back ]     |     (inputmode="none" disables system keyboard)
+------------------------------------------+
```

#### B. Landscape Split Screen & Sidebar Layout
In landscape mode, vertical height is extremely precious (usually between 360px~420px). If the 290px high simulated keyboard continues to be expanded, the editing area will be almost completely consumed. Therefore, a **split-screen + simulated keyboard folded** design is adopted in landscape mode:

```text
+---+--------------------+--------------------+
| < |                    |                    |
|   | This is a Markdown | This is a Markdown |
| # | file.              | file.              |
|   | The cursor flashes |                    |
| * | in the input box...| The cursor flashes |
|   |                    | in the input box...|
| - |                    |                    |
|   |                    |                    |
| K |                    |                    |
|   |                    |                    |
| S |                    |                    |
+---+--------------------+--------------------+
  ^            ^                   ^
Sidebar      Edit Area (50%)      Real-time Preview (50%)
(80px)
```

**Landscape Reflow and Adaptation Logic**:
1. **Hide large keyboard, keep side shortcut bar**: In landscape mode, the self-built simulated keyboard (290px version) is forced to fold; only a vertical operation bar with a width of `80px` is rendered on the far left of the screen. It includes: Back (`<`), Save (`S`), Keyboard state toggle (`K`), and high-frequency shortcut symbols (`#`, `*`, `-`).
2. **Split Screen**: The single-page editing mode in portrait is changed to equal left-and-right columns in landscape: the left 50% width is the `<textarea>` editing area; the right 50% width is the real-time Markdown HTML rendering preview area, separated by a frosted glass boundary line.
3. **Safe Area Dynamic Compensation**:
   - In landscape mode, if the phone has a notch (e.g., iPhone 14 Pro horizontal), the left padding (`padding-left`) of the left navigation bar must add `env(safe-area-inset-left)` (approx. 47px) to ensure the back button and shortcut symbols are not obscured by the notch.
   - The right padding (`padding-right`) of the right real-time preview area automatically matches `env(safe-area-inset-right)` to maintain visual symmetry and gesture safety.

---

## 5. Project Release and Grayscale Strategy

Based on the business characteristics of the `MobileFileEditor` app (local file reading, prone to OOM crashes caused by large files, etc.), the following customized dual-platform release strategies are formulated:

### 5.1 iOS Release Strategy (MobileFileEditor_iOS)
1.  **Internal Beta Distribution (TestFlight)**:
    *   Phase One: Submit to the TestFlight internal testing track for closed testing targeting the platform verification team (approx. 50 people in total), focusing on verifying the large file error interception logic of the sandbox file system.
    *   Phase Two: Open the TestFlight external public testing link (quota 1000 people) to collect experience feedback on keyboard pushing and avoidance across different device models (including Dynamic Island, notch screens, iPads, etc.).
2.  **App Store Submission and Review**:
    *   Because the app involves sensitive local file reading and writing, the purpose declaration of permissions must be precisely filled out in the compiled `Info.plist`.
    *   Provide the App Store review team with a set of simulated sandbox file test suites and screen recording demonstrations to prevent being misjudged as a "functionless app" and rejected due to an initially empty state list (Apple review red line interception).
3.  **Phased Release**:
    *   Initiate a 7-day phased release via App Store Connect:
        *   Day 1: 1% -> Day 2: 2% -> Day 3: 5% -> Day 4: 10% -> Day 5: 20% -> Day 6: 50% -> Day 7: 100%.
    *   During this grayscale phase, use Firebase Crashlytics to monitor in real-time the `iOSError` and OOM hang rates caused by reading excessive text files on the main thread. If a fatal exception occurs, immediately click "Pause Release" and create a hotfix package within 24 hours.

### 4.2 Android Release Strategy (MobileFileEditor_Android)
1.  **Internal Beta Distribution (Firebase App Distribution)**:
    *   Generate the internal beta APK and automatically distribute it to the platform Android verification team members via the integrated Firebase App Distribution, focusing on testing the effectiveness of the BackHandler's physical back button hard interception under various Android deeply customized systems.
2.  **Google Play Closed Testing**:
    *   Establish a closed testing track in the Google Play Console, import the specified tester list, and ensure it passes running on at least 20 mainstream Android devices (covering different system versions and screen punch-hole specifications) before entering the public track.
3.  **Staged Rollout**:
    *   When entering the Google Play production track for release, initiate a staged rollout:
        *   Initial proportion: **10%** of active users.
        *   Observation period: **3 days**. Focus on collecting the background ANR (App Not Responding) occurrence rate (to prevent ANR exceptions caused by synchronously executing large file IO operations blocking the UI thread).
        *   Gradual release: If ANR and crash rates are within safe metrics (<0.1%), sequentially increase the release proportion to 20%, 50%, and 100%.
