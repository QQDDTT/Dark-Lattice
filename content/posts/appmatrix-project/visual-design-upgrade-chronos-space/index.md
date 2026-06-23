---
title: "AppMatrix 画面设计的全新升级：基于 Gestalt Workflow 的时空留白应用"
date: "2026-06-23"
draft: false
description: "本文重点探讨 AppMatrix 是如何引入 gestalt-prompt-workflow 来实施 5D 架构约束，实现画面设计的全新升级。以全新子项目「时空留白」(Chronos Space) 为例，详解莫兰迪风格及高冷极简视觉的设计落地。"
---

# 📝 技术设计文档：「时空留白」(Chronos Space) App

## 一、 产品概述
「时空留白」是一款极简私人日志与情绪沉淀空间 App。产品对标高审美、反社交疲劳群体，强调“呼吸感”与“高级感”，核心体验围绕“拾光发布”、“流年回顾”与“留白冥想”三大功能展开。

---

## 二、 移动端原生能力矩阵 (Mobile Native Capabilities Matrix)

在多端设备上，应用将深度整合以下原生能力。对于所有需要用户授权的能力，均设计了完善的降级策略。

| 原生能力 | 业务场景 | 双端实现方案 (React Native) | 权限申请时机与策略 | 拒绝后的降级方案 (Fallback) |
| --- | --- | --- | --- | --- |
| **相册读取** | 「拾光」发布时选择每日照片。 | `expo-image-picker` | 用户点击“+”号选择图片时弹窗申请，配以前置解释弹窗 (Rationale Dialog) 说明用途。 | 用户可手动拒绝。降级方案：引导进入纯浏览画廊模式，或建议通过设置开启以体验完整日记功能。 |
| **本地存储** | 沉淀每日图文日志。 | `expo-sqlite` & `expo-file-system` | 无需动态权限，断网自动生效。 | N/A |
| **虚拟键盘** | 在发布页输入文字时唤起。 | `KeyboardAvoidingView` | 无需系统弹窗权限。采用 **Push（视图顶起）** 策略，保障文字输入框不被遮挡。 | N/A |
| **应用生命周期** | “留白”冥想状态维持。 | `AppState` (React Native) | 感知前后台切换。 | 在冥想 1 分钟内切入后台时暂停动画，返回前台时根据时间戳补全动画进度。 |
| **系统手势拦截** | “留白”状态下防止误触退出。 | `BackHandler` (Android) | 仅拦截 Android 物理返回键。 | 如果强制退出，提供温和提示框确认放弃当前冥想。 |

---

## 三、 屏幕方向适配矩阵 (Screen Orientation Adaptation Matrix)

本应用主打沉浸式和版式美学，对不同页面的旋转策略做出了严格约束：

| 核心页面 | 旋转策略 (Rotation Strategy) | 业务理由 | 横竖屏差异说明 |
| --- | --- | --- | --- |
| **主页 (Index)** | 锁定竖屏 | 维持极简的文字排版与“留白”负空间。横屏容易破坏“天空与地平线”的视觉隐喻。 | 仅提供竖屏版，横屏锁定。 |
| **发布页 (Publish)** | 锁定竖屏 | “1图+3行文字”的杂志内页布局在竖屏下拥有最佳宽高比，横屏输入会导致键盘严重遮挡图片。 | 仅提供竖屏版，横屏锁定。 |
| **画廊页 (Gallery)** | 锁定竖屏 | 垂直时间轴滚动逻辑，横屏单图显示不够高效且破坏流式体验。 | 仅提供竖屏版，横屏锁定。 |
| **冥想模式 (Meditation)**| **双向适配** | 用户可能将手机横放于桌面或床头进行冥想。需保证核心图片在任意姿态下居中律动。 | **竖屏**：图片居中，上下留白；**横屏**：图片自适应高度，左右留白，均保持暗色背景与平滑呼吸动效。 |

---

## 四、 格式塔与界面美学规范 (Gestalt & UI/UX Constraints)

根据 `gestalt-prompt-workflow` 及莫兰迪/高冷审美风格要求，实施以下五维（5D）架构约束：

### 1. GII (知觉完形指数)
* **无界布局**：严格禁止使用实线边框 (Borders)。利用元素的接近性 (Proximity) 和大面积留白 (Negative Space) 划分视觉层级。
* **莫兰迪色系**：使用低饱和度的黑、灰、白以及大地色/灰蓝色调，禁用纯色 (#FF0000, #00FF00 等)。

### 2. TPF (时序缓动与物理拟真度)
* **平滑入场**：所有组件呈现时必须应用非线性淡入 (Fade In)。
* **取消涟漪**：禁用 Android 默认的 Material Ripple，统一使用透明度下降 (Opacity drop) 搭配缓动曲线 (`cubic-bezier(0.4, 0.0, 0.2, 1)`) 作为点击反馈。

### 3. COE (图层合成渲染优化)
* **强制 GPU 加速**：冥想模式的“呼吸动效”以及页面转场必须且只能使用 `transform` (scale, translate) 和 `opacity` 进行驱动，绝对禁止操作 `width`, `height`, `margin` 等引发重排的属性，以保证 60fps 的绝对丝滑。

### 4. SCR (源码视觉清澈度)
* HTML/CSS 代码及后续 RN 组件需语义清晰，CSS 类名避免随意嵌套，提倡高复用原子类与明确的布局容器分离。

### 5. OCC (组件内聚与网格重用)
* 抽象出可复用的 `<Layout>` 容器组件，统一处理深色模式/浅色模式的融合，与全面屏SafeArea 的内边距。

---

## 五、 数据流与技术栈映射
- **UI 框架**：Expo / React Native (Expo Router)。
- **动效库**：`react-native-reanimated`。
- **存储方案**：本地 SQLite 日志表 (`id, date, image_uri, text_content`)，配合图片本地沙盒压缩 (`expo-image-manipulator`) 防止内存溢出。

---

## 六、 测试用假数据 (Mock Data)

为了在开发阶段真实还原界面排版与视觉意境，需采用以下假数据结构与占位图片。图片选型严格遵从“留白”、“高冷”、“莫兰迪色调”的审美基调。

### 1. 结构化假数据示例 (JSON)

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

这些数据将被注入至 `gallery.html` 和 `publish.html` 的原型展示中，以确保布局对各种内容的兼容性表现符合预期。
