# ConsoleWindow 组件

一个可拖拽的控制台窗口组件，支持桌面端和移动端。

## 功能特性

- ✅ **可拖拽**: 通过拖拽标题栏可以移动窗口位置
- ✅ **桌面端支持**: 支持鼠标拖拽
- ✅ **移动端支持**: 支持触摸拖拽
- ✅ **边界检测**: 自动限制在视窗范围内
- ✅ **响应式设计**: 在移动端有优化的显示效果
- ✅ **性能优化**: 使用 requestAnimationFrame 优化拖拽性能
- ✅ **窗口大小适配**: 窗口大小改变时自动调整位置

## 使用方法

```tsx
import ConsoleWindow from './components/ConsoleWindow';

function App() {
  return (
    <div>
      <ConsoleWindow />
    </div>
  );
}
```

## 拖拽操作

### 桌面端

- 点击并拖拽标题栏来移动窗口
- 鼠标指针会变为抓取状态

### 移动端

- 触摸并拖拽标题栏来移动窗口
- 支持多点触控

## 样式定制

组件使用 CSS Modules，可以通过修改 `index.module.scss` 文件来自定义样式：

```scss
.consoleWindow {
  // 自定义样式
  background-color: #your-color;
  border-radius: 8px;

  .header {
    // 标题栏样式
    background-color: #your-header-color;
  }

  .logs {
    // 日志区域样式
    font-family: 'Your Font', monospace;
  }
}
```

## 技术实现

- 使用 React Hooks (useState, useRef, useCallback, useEffect)
- 支持鼠标事件 (mousedown, mousemove, mouseup)
- 支持触摸事件 (touchstart, touchmove, touchend)
- 使用 requestAnimationFrame 优化性能
- 自动边界检测和位置限制
