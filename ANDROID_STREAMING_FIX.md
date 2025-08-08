# Android 应用流式输出修复说明

## 问题描述

Android 应用中的对话接口没有流式输出，导致用户体验不佳。

## 根本原因

1. **Capacitor HTTP 插件限制**：Capacitor 的 HTTP 插件不支持 ReadableStream，无法处理流式响应
2. **移动端环境检测不完善**：原有代码没有完全覆盖 Android 环境的检测
3. **缺少 Android 专用的网络请求处理**

## 解决方案

### 1. 更新 Capacitor 配置 (`capacitor.config.json`)

```json
{
  "server": {
    "androidScheme": "https"
  }
}
```

### 2. 创建 Android 专用 fetch 处理器 (`src/utils/android-fetch.ts`)

- 提供 Android 环境检测
- 创建绕过 Capacitor HTTP 的原生 fetch 处理器
- 添加流式响应验证

### 3. 更新 HTTP 请求工具 (`src/utils/request.ts`)

- 集成 Android 专用处理器
- 改进移动端环境检测
- 为流式请求添加验证逻辑

## 修改内容

### 文件变更列表

1. `src/utils/request.ts` - 更新流式请求处理逻辑
2. `src/utils/android-fetch.ts` - 新增 Android 专用处理器
3. `capacitor.config.json` - 添加 HTTPS 支持配置

### 关键改进

1. **环境检测增强**：

   ```typescript
   static isAndroidEnvironment(): boolean {
     const userAgent = navigator.userAgent.toLowerCase();
     return (
       window.location.protocol === 'capacitor:' ||
       (window as any).Capacitor?.isNativePlatform() ||
       userAgent.includes('android')
     );
   }
   ```

2. **原生 Fetch 使用**：

   ```typescript
   if (options.isStream && this.isMobileApp()) {
     fetchFunction = AndroidFetchHandler.createStreamFetchHandler(
       this.defaultTimeout
     );
   }
   ```

3. **流式响应验证**：
   ```typescript
   static validateStreamResponse(response: Response): boolean {
     if (!response.body || !response.body.getReader) {
       console.warn('流式功能不可用');
       return false;
     }
     return true;
   }
   ```

## 测试验证

### 1. 构建和部署

```bash
# 安装依赖
pnpm install

# 构建项目
pnpm build

# 同步到Android
npx cap sync android

# 在Android设备上运行
npx cap run android
```

### 2. 验证流式输出

1. 在 Android 应用中发送聊天消息
2. 检查控制台日志确认使用了 Android 专用 fetch
3. 验证消息是否实时流式显示

### 3. 关键日志

查看以下日志确认修复生效：

- "流式请求检测 - isStream: true, isMobileApp: true"
- "使用 Android 专用 fetch 处理流式请求"
- "Android 流式请求 - URL: ..."
- "Android 流式响应 - Status: 200"

## 注意事项

1. **网络权限**：确保 Android 应用有网络访问权限
2. **HTTPS 支持**：配置使用 HTTPS 协议避免安全限制
3. **调试模式**：在开发环境中启用详细日志输出
4. **兼容性**：保持与 Web 端的兼容性

## 后续优化

1. 添加网络状态监听
2. 实现重连机制
3. 优化错误处理
4. 添加性能监控

修复完成后，Android 应用应该能够正常显示流式对话输出。
