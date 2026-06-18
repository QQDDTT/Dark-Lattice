---
title: "MobileFileEditor 统一技术设计文档"
date: 2026-06-18T11:30:00+09:00
draft: true
tags: ["AppMatrix", "MobileFileEditor", "React Native", "Expo"]
categories: ["工程实践", "移动端架构"]
description: "手机文件编辑器 (MobileFileEditor) 的双端独立工程架构、沙盒文件系统设计、双端特有交互差异处理以及屏幕方向适配策略。"
---

本设计文档为 AppMatrix 平台下的 **手机文件编辑器 (MobileFileEditor)** 项目。虽然在发版和项目管理层面上，本平台需要同时开发并发布独立的 **Android 应用 (MobileFileEditor_Android)** 和 **iOS 应用 (MobileFileEditor_iOS)**，但它们共享同一套页面画面设计与基础业务逻辑。

本设计基于 React Native (Expo) 构建，旨在提供双端完全一致的精美毛玻璃卡片管理和流畅编辑体验，同时在各自的原生平台上对特有组件及手势交互进行深度差异化适配。

---

## 1. 双端独立工程架构

共享相同的画面设计和工具代码，但在 `apps/` 目录下拆分为两个独立发版的工程项目。

```text
apps/
├── MobileFileEditor_iOS/       # 独立 iOS 平台发版工程
│   ├── app/                    # 路由与页面渲染层 (共享页面逻辑)
│   └── src/                    # 平台特有封装 (如 iOS 专属 Action Sheet)
└── MobileFileEditor_Android/   # 独立 Android 平台发版工程
    ├── app/                    # 路由与页面渲染层 (共享页面逻辑)
    └── src/                    # 平台特有封装 (如 Android 物理返回拦截)
```

---

## 2. 文件系统与本地存储设计

双端应用均采用Scoped Storage（分区存储/沙盒存储），各自对私有目录下的文本进行操作，免于申请危险的外部存储读写卡权限。

### 2.1 双端沙盒路径差异
*   **iOS 平台**：存储于 `FileSystem.documentDirectory`，实际路径为 `/var/mobile/Containers/Data/Application/<UUID>/Documents/`。该数据在设备升级或更换时可由 iCloud 自动备份。
*   **Android 平台**：存储于 `FileSystem.documentDirectory`，实际路径为 `/data/user/0/com.appmatrix.mobilefileeditor.android/files/`。属于 Android 内部 Scoped Storage，当应用被卸载时该数据会一并清除。

### 2.2 双端共享文件系统接口包装 (`src/utils/fileSystem.ts`)
```typescript
import * as FileSystem from 'expo-file-system';

export const getBaseDir = (): string => FileSystem.documentDirectory;
export const SUPPORTED_EXTENSIONS = ['.txt', '.md', '.json', '.css', '.html'];
export const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB 大小限制

export interface FileItem {
  name: string;
  path: string;
  size: number;
  modifiedTime: number;
}

/**
 * 扫描并过滤文本格式文件
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

## 3. 双端特有交互差异处理

为了在共享画面设计的前提下，让应用在各自的原生平台上显得足够精致，我们将通过平台判断（`Platform.OS`）引入特有操作行为。

### 3.1 退出未保存拦截
当在编辑器页面有未保存修改并点击返回时，双端激活各自的原生拦截逻辑：
*   **iOS 侧边滑动返回与导航返回**：默认禁用 iOS 原生侧边划动手势，防止无感退出导致修改丢失。点击返回时滑出底部 Action Sheet 进行二次放弃确认。
*   **Android 物理返回键拦截**：通过 `BackHandler` 硬拦截物理返回事件与虚拟手势，在屏幕正中央弹出带有 Elevation 阴影的 Material 居中确认 Dialog。

```typescript
import { useEffect } from 'react';
import { BackHandler, Platform, Alert } from 'react-native';

export function useBackInterception(hasChanges: boolean, onBackConfirm: () => void) {
  useEffect(() => {
    if (Platform.OS !== 'android') return;

    const handleAndroidBack = () => {
      if (hasChanges) {
        showAndroidConfirmDialog({
          title: '放弃未保存的修改？',
          onConfirm: onBackConfirm
        });
        return true; // 拦截物理后退
      }
      return false;
    };

    BackHandler.addEventListener('hardwareBackPress', handleAndroidBack);
    return () => BackHandler.removeEventListener('hardwareBackPress', handleAndroidBack);
  }, [hasChanges]);
}
```

### 3.2 虚拟键盘冲突问题与修复方案

#### 背景：自建仿真键盘 vs 系统虚拟键盘的双重弹出冲突

`editor.html` 包含一套完整的自建仿真键盘（`.virtual-keyboard`，高度 290px），用于在 WebView 内提供带有 Markdown 快捷符号的增强输入体验。然而，由于以下设计缺陷，导致自建仿真键盘与系统虚拟键盘同时弹出，造成编辑区域被双重压缩，实际可编辑空间几乎为零：

**冲突根因（原错误逻辑）**：
1. `DOMContentLoaded` 事件中调用了 `toggleVirtualKeyboard(true)` 自动展开仿真键盘（第 817~820 行）。
2. 紧接着调用 `document.getElementById('textarea').focus()` 使 `<textarea>` 获取焦点，触发系统虚拟键盘弹出。
3. 两套键盘同时占据屏幕底部空间：系统键盘（约 250~340px）+ 自建仿真键盘（290px），合计压缩高度可达 580~630px，超过大多数手机屏幕高度的 70%，导致编辑区完全不可用。

**修复方案**：

采用「互斥模式」——自建仿真键盘与系统键盘二选一，绝不同时激活：

- **彻底禁止系统键盘弹出**：为 `<textarea>` 添加 `inputmode="none"` 属性。该属性告知浏览器/WebView 此输入框不需要系统输入法，从根本上阻止系统键盘弹起，同时保留 `<textarea>` 的光标与选区能力。
- **移除自动展开逻辑**：删除 `DOMContentLoaded` 中自动调用 `toggleVirtualKeyboard(true)` 的代码，改为仅在用户主动点击工具栏「K」按钮或浮动键盘图标时展开仿真键盘。
- **仿真键盘完全接管输入**：所有文字输入、退格、换行均通过仿真键盘的 `typeKey()` / `typeBackspace()` / `handleEnterKey()` 函数写入 `<textarea>` 的值，无需系统键盘介入。
- **`<textarea>` 保持 focus 可用**：`inputmode="none"` 不影响光标定位与选区，仿真键盘的所有操作仍通过 `textarea.selectionStart` / `setSelectionRange()` 正确定位插入点。

**双端键盘避让参数**（保持原有逻辑，现在仅针对仿真键盘自身高度进行布局）：
- **iOS**：仿真键盘展开时（290px），`editor-container` 通过 flexbox 自动收缩，`textarea` 可见高度相应减少，无需额外 `keyboardVerticalOffset`（因系统键盘已被完全禁止）。
- **Android**：`windowSoftInputMode` 保持 `adjustResize`，但由于系统键盘不再弹起，该配置不再产生实际影响，保留以备未来功能扩展。


### 3.3 视觉组件特有机制
*   **按压效果**：
    *   Android 卡片默认具有水波纹扩散效果 (`android_ripple`)。
    *   iOS 统一呈现 `opacity` 渐变按压反馈（不透明度在 Active 状态下调为 0.6）。
*   **操作面板**：
    *   Android 列表卡片长按在屏幕中心激活 Material 3 风格圆角 Dialog 菜单。
    *   iOS 长按卡片从底部滑出毛玻璃层级的 Action Sheet。


---

## 4. 屏幕方向适配矩阵

为保障不同场景下的最佳阅读与编辑体验，`MobileFileEditor` 针对不同页面制定了差异化的屏幕旋转策略及布局方案，彻底杜绝等比缩放或强制拉伸。

| 页面名称 | 默认方向 | 旋转策略 | 核心原因 |
|---|---|---|---|
| **文件列表页 (Index)** | 竖屏 (Portrait) | **锁定竖屏 (Portrait Only)** | 纯卡片列表与文件管理逻辑，锁定竖屏可以避免单手持握操作时，因轻微晃动导致误触发旋转而降低使用效率。 |
| **文本编辑器页 (Editor)** | 竖屏 (Portrait) | **双向适配 (Adaptive)** | 文本/代码编辑时，横屏能提供充足的单行宽度。横屏下支持编辑区与 Markdown 预览区双列分栏（Split View），大幅提升写作体验。 |

### 4.1 文本编辑器页 (Editor) 横竖屏适配细节

自建仿真键盘与界面在横竖屏下的重排策略如下：

#### A. 竖屏版布局结构 (Portrait Layout)
```text
+------------------------------------------+
|  [< 返回]     文件名.md        [保存]     | <-- 顶部导航栏 (60px)
+------------------------------------------+
|                                          |
|  这是一个 Markdown 文件。                 |
|  光标在输入框中闪烁...                     | <-- 文本编辑区 (Flex: 1)
|                                          |
|                                          |
+------------------------------------------+
| [ # ] [ * ] [ - ] [ > ] [ ` ] [ [ ] [ K ]| <-- 快捷符号条 (45px)
+------------------------------------------+
| [ A ] [ B ] [ C ] [ D ] [ E ] [ F ] [ G ]|
| [ H ] [ I ] [ J ] [ K ] [ L ] [ M ] [ N ]| <-- 自建仿真键盘 (290px)
| [  Space  ]   [ Enter ]     [ Back ]     |     (inputmode="none" 禁用系统键盘)
+------------------------------------------+
```

#### B. 横屏版分栏与侧边栏布局 (Landscape Layout)
横屏下，纵向高度极为宝贵（通常在 360px~420px 之间）。若继续展开 290px 高度的仿真键盘，则编辑区几乎被完全蚕食。因此，横屏下采用**分栏 + 仿真键盘折叠**设计：

```text
+---+--------------------+--------------------+
| < |                    |                    |
|   | 这是一个 Markdown  | 这是一个 Markdown  |
| # | 文件。              | 文件。              |
|   | 光标在输入框中闪   |                    |
| * | 烁...              | 光标在输入框中闪   |
|   |                    | 烁...              |
| - |                    |                    |
|   |                    |                    |
| K |                    |                    |
|   |                    |                    |
| S |                    |                    |
+---+--------------------+--------------------+
  ^            ^                   ^
侧边栏      编辑区 (50%)        实时预览区 (50%)
(80px)
```

**横屏重排与适配逻辑**：
1. **隐藏大型键盘，保留侧边快捷栏**：横屏下自建仿真键盘（290px 版）强制收起，仅在屏幕最左侧渲染一个宽度为 `80px` 的纵向操作栏。包含：返回（`<`）、保存（`S`）、键盘状态切换（`K`）以及高频快捷符号（`#`、`*`、`-`）。
2. **双列分栏 (Split Screen)**：原竖屏下的单页编辑模式，在横屏下改为左右对等分栏：左侧 50% 宽度为 `<textarea>` 编辑区域；右侧 50% 宽度为 Markdown HTML 实时渲染的预览区域，两栏之间由一条毛玻璃分界线隔开。
3. **安全区动态补偿 (Safe Area Insets)**：
   - 横屏时若手机带刘海（如 iPhone 14 Pro 横向），左侧导航栏的左内边距（`padding-left`）必须加上 `env(safe-area-inset-left)`（约为 47px），确保返回按钮和快捷符号不会被刘海所遮挡。
   - 右侧实时预览区的右内边距（`padding-right`）自动匹配 `env(safe-area-inset-right)`，保持视觉对称与手势安全。

---

## 5. 项目发布与灰度策略

根据 `MobileFileEditor` 应用的业务特征（本地文件读取、易因大文件引发 OOM 崩溃等），制定以下双端定制化发布策略：

### 5.1 iOS 端发布策略 (MobileFileEditor_iOS)
1.  **内测分发 (TestFlight)**：
    *   第一阶段：提交至 TestFlight 内部测试轨道，面向平台验证团队（共计约 50 人）进行封闭测试，重点验证沙盒文件系统的大文件报错拦截逻辑。
    *   第二阶段：开启 TestFlight 外部公开测试链接（限额 1000 人），收集不同机型（含灵动岛、刘海屏、iPad 等）的键盘推顶避让体验反馈。
2.  **App Store 提交与审核**：
    *   由于应用涉及敏感的本地文件读写，在构建打包的 `Info.plist` 中必须精确填写权限用途声明。
    *   向 App Store 审核团队提供一套模拟沙盒文件测试集与录屏演示，以防因初始状态列表为空被误判为“无功能应用”而遭到拒绝（苹果审核红线拦截）。
3.  **渐进式发布 (Phased Release)**：
    *   通过 App Store Connect 开启为期 7 天的渐进式发布：
        *   第 1 天 1% -> 第 2 天 2% -> 第 3 天 5% -> 第 4 天 10% -> 第 5 天 20% -> 第 6 天 50% -> 第 7 天 100%。
    *   在此灰度阶段，利用 Firebase Crashlytics 实时监控因主线程读取超限文本文件引发的 `iOSError` 及 OOM 挂死率。如有致命异常，立即点击“暂停发布”并在 24 小时内制作修复包。

### 4.2 Android 端发布策略 (MobileFileEditor_Android)
1.  **内测分发 (Firebase App Distribution)**：
    *   生成内测版 APK，通过平台集成的 Firebase App Distribution 自动分发给平台 Android 验证小组成员，重点测试在不同 Android 深度定制系统下 BackHandler 的物理返回键硬拦截成效。
2.  **Google Play 封闭测试 (Closed Testing)**：
    *   在 Google Play Console 建立封闭测试轨道，导入指定测试人员名单，确保在进入公开轨道前，至少在 20 种主流 Android 设备（覆盖不同系统版本和屏幕打孔规格）上运行通过。
3.  **分阶段发布 (Staged Rollout)**：
    *   进入 Google Play 生产轨道发布时，启动分阶段发布：
        *   初始比例：**10%** 活跃用户。
        *   观察周期：**3 天**。重点搜集后台 ANR (App Not Responding) 发生率（防止因同步执行大文件 IO 操作阻塞 UI 线程导致 ANR 异常）。
        *   逐步释放：若 ANR 和崩溃率在安全指标内（<0.1%），依次将发布比例提升至 20%、50% 及 100%。
