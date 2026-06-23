---
title: "AppMatrix Visual Design Upgrade: The Chronos Space App Based on Gestalt Workflow"
date: "2026-06-23"
draft: false
description: "This article focuses on how AppMatrix introduced the gestalt-prompt-workflow to implement 5D architectural constraints, achieving a brand new upgrade in visual design. Using the new sub-project 'Chronos Space' as an example, it details the design implementation of the Morandi style and cold, minimalist aesthetics."
---

# 📝 Technical Design Document: "Chronos Space" App

## 1. Product Overview
"Chronos Space" is a minimalist private journaling and emotional precipitation space app. The product targets groups with high aesthetics and anti-social fatigue, emphasizing a "sense of breathing" and "premium feel". The core experience revolves around three main functions: "Light Gathering (Publishing)", "Fleeting Years (Review)", and "Blank Space (Meditation)".

---

## 2. Mobile Native Capabilities Matrix

Across multi-platform devices, the application will deeply integrate the following native capabilities. Comprehensive fallback strategies are designed for all capabilities requiring user authorization.

| Native Capability | Business Scenario | Dual-Platform Implementation (React Native) | Permission Request Timing & Strategy | Fallback Plan after Rejection |
| --- | --- | --- | --- | --- |
| **Read Album** | Selecting daily photos when publishing "Light Gathering". | `expo-image-picker` | Prompts for permission when the user clicks the "+" icon to select an image, accompanied by a Rationale Dialog explaining the purpose. | Users can manually reject. Fallback: Guide to a pure browsing gallery mode, or suggest enabling it via settings to experience the full journaling feature. |
| **Local Storage** | Precipitating daily text and image logs. | `expo-sqlite` & `expo-file-system` | No dynamic permissions needed; works automatically offline. | N/A |
| **Virtual Keyboard** | Invoked when entering text on the publish page. | `KeyboardAvoidingView` | No system popup permission needed. Adopts the **Push (view lifted)** strategy to ensure the text input box is not obstructed. | N/A |
| **App Lifecycle** | Maintaining the "Blank Space" meditation state. | `AppState` (React Native) | Senses foreground/background switching. | Pauses the animation when switching to the background within 1 minute of meditation, and supplements the animation progress based on the timestamp when returning to the foreground. |
| **System Gesture Interception** | Preventing accidental exit during the "Blank Space" state. | `BackHandler` (Android) | Only intercepts the Android physical back button. | If forced to exit, provides a gentle prompt box to confirm abandoning the current meditation. |

---

## 3. Screen Orientation Adaptation Matrix

This application focuses on immersion and layout aesthetics, placing strict constraints on the rotation strategy of different pages:

| Core Page | Rotation Strategy | Business Rationale | Landscape/Portrait Difference |
| --- | --- | --- | --- |
| **Index** | Locked to Portrait | Maintains minimalist text layout and "blank" negative space. Landscape easily destroys the visual metaphor of "sky and horizon". | Portrait version only, landscape locked. |
| **Publish** | Locked to Portrait | The magazine inner-page layout of "1 image + 3 lines of text" has the optimal aspect ratio in portrait mode; landscape input causes the keyboard to severely obstruct the image. | Portrait version only, landscape locked. |
| **Gallery** | Locked to Portrait | Vertical timeline scrolling logic; landscape single-image display is inefficient and destroys the flowing experience. | Portrait version only, landscape locked. |
| **Meditation** | **Bidirectional Adaptation** | Users may place the phone horizontally on a desk or bedside for meditation. It must be ensured that the core image is centered and rhythmically pulsing in any posture. | **Portrait**: Image centered, blank space top and bottom; **Landscape**: Image height adapts, blank space left and right, both maintaining a dark background and smooth breathing animation. |

---

## 4. Gestalt & UI/UX Constraints

According to the `gestalt-prompt-workflow` and the Morandi/cold aesthetic style requirements, the following five-dimensional (5D) architectural constraints are implemented:

### 1. GII (Gestalt Index of Perception)
* **Borderless Layout**: The use of solid Borders is strictly prohibited. Use the Proximity of elements and large areas of Negative Space to divide visual hierarchies.
* **Morandi Color Palette**: Use low-saturation blacks, grays, whites, and earth/gray-blue tones; pure colors (e.g., #FF0000, #00FF00) are forbidden.

### 2. TPF (Temporal Physics & Fidelity)
* **Smooth Entrance**: All components must apply a non-linear Fade In when presented.
* **Cancel Ripple**: Disable Android's default Material Ripple, uniformly using an Opacity drop combined with an easing curve (`cubic-bezier(0.4, 0.0, 0.2, 1)`) as click feedback.

### 3. COE (Composite Optimization & Efficiency)
* **Forced GPU Acceleration**: The "breathing animation" in meditation mode and page transitions must and can only be driven using `transform` (scale, translate) and `opacity`. Manipulating properties that cause reflow, such as `width`, `height`, and `margin`, is absolutely forbidden to ensure absolute 60fps smoothness.

### 4. SCR (Source Code Readability)
* HTML/CSS code and subsequent RN components must have clear semantics. Avoid arbitrary nesting of CSS class names; advocate highly reusable atomic classes separated from explicit layout containers.

### 5. OCC (Object Cohesion & Componentization)
* Abstract reusable `<Layout>` container components to uniformly handle the fusion of dark/light modes and the padding for full-screen SafeArea.

---

## 5. Data Flow and Tech Stack Mapping
- **UI Framework**: Expo / React Native (Expo Router).
- **Animation Library**: `react-native-reanimated`.
- **Storage Solution**: Local SQLite log table (`id, date, image_uri, text_content`), combined with local sandbox image compression (`expo-image-manipulator`) to prevent memory overflow.

---

## 6. Mock Data for Testing

To truly restore the interface layout and visual mood during the development phase, the following mock data structures and placeholder images must be used. Image selection strictly adheres to the aesthetic tone of "blank space," "coldness," and "Morandi tones."

### 1. Structured Mock Data Example (JSON)

```json
[
  {
    "id": "entry-001",
    "date": "2023.10.01",
    "image_uri": "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=600&q=80",
    "text_content": "晨光熹微\n露水打湿了石阶\n今天没有风"
  },
  {
    "id": "entry-002",
    "date": "2023.09.28",
    "image_uri": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80",
    "text_content": "一杯冷掉的咖啡\n窗外的云跑得很慢\n这是留白的一天"
  },
  {
    "id": "entry-003",
    "date": "2023.09.25",
    "image_uri": "https://images.unsplash.com/photo-1449243115464-f6e4364af11b?auto=format&fit=crop&w=600&q=80",
    "text_content": "夜里下了雨\n听不见外面的车流\n只有安静"
  }
]
```

This data will be injected into the prototype displays of `gallery.html` and `publish.html` to ensure that the layout's compatibility performance with various contents meets expectations.
