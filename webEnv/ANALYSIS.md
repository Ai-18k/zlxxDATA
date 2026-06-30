# WebEnv 包分析文档

## 一、包概述

**WebEnv** 是一个用于在 Node.js 环境中模拟浏览器环境的工具包，主要用于爬虫开发中的"补环境"场景。它通过 JavaScript Proxy 机制，完整模拟了浏览器中的各种 API 和对象，使得原本只能在浏览器中运行的 JavaScript 代码可以在 Node.js 环境中执行。

## 二、核心架构

### 2.1 主要模块结构

```
webEnv/
├── jsProxy.js          # 核心代理模块，使用 Proxy 拦截对象操作
├── utility.js          # 工具函数集合
├── loadFun.js          # 函数加载器
├── Window/             # Window 对象相关 API
├── Document/           # Document 对象相关 API
├── CommonApi/          # 通用浏览器 API
├── Navigator/          # Navigator 对象相关
├── PerformanceApi/     # Performance API
├── IndexedDB/          # IndexedDB API
├── CanvasApi/          # Canvas API
├── HTML/               # HTML 元素相关
├── TagApi/             # HTML 标签元素
├── TextApi/            # 文本节点 API
├── FileSystem/         # 文件系统 API
├── Media/              # 媒体查询 API
├── WebSocket/          # WebSocket API
└── NodePlugin/         # Node.js 原生插件（用于特殊功能）
```

### 2.2 核心机制

#### 2.2.1 Proxy 代理机制 (`jsProxy.js`)

`jsProxy.js` 是整个包的核心，它使用 JavaScript Proxy 来拦截和记录所有对象操作：

- **get**: 拦截属性访问
- **set**: 拦截属性设置
- **apply**: 拦截函数调用
- **construct**: 拦截构造函数调用
- **has**: 拦截 `in` 操作符
- **deleteProperty**: 拦截 `delete` 操作

**关键特性：**
- 自动为所有对象创建代理，形成代理链
- 记录完整的对象操作日志（可选）
- 通过 Symbol 属性管理代理对象和原始对象的映射关系
- 支持调试断点功能

#### 2.2.2 环境配置 (`utility.js`)

`envOption` 对象提供了全局配置：

```javascript
{
    log: false,                    // 是否打印日志
    dev: true,                     // 开发模式
    symbolProxyObj: Symbol(...),   // 代理对象标识
    symbolOriginObj: Symbol(...),  // 原始对象标识
    symbolFullName: Symbol(...),   // 对象全名标识（用于日志）
    logFileName: 'getEnv',         // 日志文件名
    filtersProxyObj: [],           // 需要过滤的代理对象
    debugProxyProp: [],            // 需要调试的属性
    debugProxyFunArg: []           // 需要调试的函数参数
}
```

## 三、使用方法

### 3.1 基本使用

#### 步骤 1: 创建 Window 对象

```javascript
const { createWindow } = require('./webEnv/Window');

// 创建完整的浏览器环境
const window = createWindow({
    mimeTypesOptions: {
        // Navigator.mimeTypes 配置
        enabledPluginAlike: true,
        mimeTypes: [...]
    },
    hasChromeApp: true  // Chrome 是否包含 app 属性
});

// 将 window 设置为全局对象
global.window = window;
global.document = window.document;
global.navigator = window.navigator;
global.location = window.location;
// ... 其他全局对象
```

#### 步骤 2: 启用代理和日志（可选）

```javascript
const getEnv = require('./webEnv/jsProxy');
const { envOption } = require('./webEnv/utility');

// 启用日志记录
envOption.log = true;
envOption.logFileName = 'my-env.log';

// 启用调试
envOption.debugProxyProp = ['cookie', 'userAgent'];  // 访问这些属性时触发断点
envOption.debugProxyFunArg = ['token'];              // 函数参数包含这些值时触发断点

// 对 window 对象应用代理
const proxiedWindow = getEnv({
    obj: window,
    name: 'window'
});
```

#### 步骤 3: 加载特定函数（可选）

```javascript
const { loadFun, loadBody } = require('./webEnv/loadFun');

// 加载特定的 DOM 操作函数
loadFun({
    createElement: true,           // 加载 createElement
    getElementsByTagName: true,     // 加载 getElementsByTagName
    getElementById: true,           // 加载 getElementById
    getAttribute: true,             // 加载 getAttribute
    appendChild: true,              // 加载 appendChild
    removeChild: true               // 加载 removeChild
});

// 或者指定特定标签名（用于调试）
loadFun({
    createElement: ['div', 'script'],  // 只对 div 和 script 标签生效
    getElementsByTagName: ['body']
});

// 创建 body 元素
loadBody({
    // body 元素的属性
});
```

#### 步骤 4: 执行目标代码

```javascript
// 现在可以执行原本需要在浏览器中运行的代码
const fs = require('fs');
const targetCode = fs.readFileSync('./rs-code/专利.js', 'utf-8');

// 执行代码
eval(targetCode);

// 或者使用 vm 模块
const vm = require('vm');
vm.runInNewContext(targetCode, {
    window: window,
    document: document,
    navigator: navigator,
    // ... 其他全局对象
});
```

### 3.2 完整示例

```javascript
// example.js
const { createWindow } = require('./webEnv/Window');
const getEnv = require('./webEnv/jsProxy');
const { envOption } = require('./webEnv/utility');
const { loadFun, loadBody } = require('./webEnv/loadFun');

// 1. 配置环境选项
envOption.log = true;  // 启用日志
envOption.logFileName = 'spider-env.log';

// 2. 创建浏览器环境
const window = createWindow({
    mimeTypesOptions: {
        enabledPluginAlike: true,
        mimeTypes: []
    },
    hasChromeApp: true
});

// 3. 应用代理（可选，用于调试和日志）
const proxiedWindow = getEnv({
    obj: window,
    name: 'window'
});

// 4. 设置全局对象
global.window = proxiedWindow;
global.document = proxiedWindow.document;
global.navigator = proxiedWindow.navigator;
global.location = proxiedWindow.location;
global.screen = proxiedWindow.screen;
global.localStorage = proxiedWindow.localStorage;
global.sessionStorage = proxiedWindow.sessionStorage;

// 5. 加载必要的 DOM 函数
loadFun({
    createElement: true,
    getElementsByTagName: true,
    getElementById: true,
    appendChild: true
});

// 6. 创建 body 元素
loadBody({});

// 7. 执行目标代码
const fs = require('fs');
const targetCode = fs.readFileSync('./rs-code/专利.js', 'utf-8');

try {
    eval(targetCode);
    console.log('执行成功！');
    console.log('document.cookie:', document.cookie);
} catch (error) {
    console.error('执行出错:', error);
}
```

## 四、主要功能模块

### 4.1 Window 对象 (`Window/index.js`)

提供了完整的 `window` 对象，包括：
- `document`: Document 对象
- `navigator`: Navigator 对象
- `location`: Location 对象
- `screen`: Screen 对象
- `localStorage` / `sessionStorage`: 存储对象
- `indexedDB`: IndexedDB 数据库
- `performance`: Performance API
- `history`: History API
- `XMLHttpRequest`: XHR 对象
- `WebSocket`: WebSocket 对象
- `setTimeout` / `setInterval`: 定时器
- 等等...

### 4.2 Document 对象 (`Document/`)

提供了完整的 DOM 操作能力：
- `createElement()`: 创建元素
- `getElementById()`: 通过 ID 获取元素
- `getElementsByTagName()`: 通过标签名获取元素
- `appendChild()` / `removeChild()`: 节点操作
- 各种 HTML 元素类型（Div, Script, Body, Form 等）

### 4.3 Navigator 对象 (`Navigator/`)

模拟浏览器信息：
- `userAgent`: 用户代理字符串
- `platform`: 平台信息
- `language` / `languages`: 语言设置
- `mimeTypes`: MIME 类型数组
- `plugins`: 插件数组
- `battery`: 电池信息（如果支持）
- 等等...

### 4.4 其他 API

- **PerformanceApi**: 性能监控 API
- **IndexedDB**: 浏览器数据库 API
- **CanvasApi**: Canvas 绘图 API
- **FileSystem**: 文件系统 API
- **WebSocket**: WebSocket 通信 API
- **Media**: 媒体查询 API

## 五、调试功能

### 5.1 日志记录

启用日志后，所有对象操作都会被记录到文件中：

```javascript
envOption.log = true;
envOption.logFileName = 'debug.log';
```

日志格式示例：
```
{ get|obj：[window] -> prop：[document]，type：[object HTMLDocument] }
{ apply|function：[document.createElement]，args：[div]，type：[object HTMLDivElement] }
{ set|obj：[document] -> prop：[cookie]，value：[token=abc123] }
```

### 5.2 调试断点

可以设置特定属性或函数参数触发断点：

```javascript
// 访问 cookie 属性时触发断点
envOption.debugProxyProp = ['cookie'];

// 函数参数包含 'token' 时触发断点
envOption.debugProxyFunArg = ['token'];
```

### 5.3 过滤代理对象

某些对象不需要代理（如 document.all）：

```javascript
envOption.filtersProxyObj = ['$_ts', 'constructor', 'prototype'];
```

## 六、注意事项

### 6.1 NodePlugin 依赖

如果遇到 `NodePlugin\build\Release\faker.node` 错误：
- 该插件用于处理 `document.all` 的特殊行为（既是 undefined 又是 object）
- 需要重新编译 NodePlugin（基于 Node.js v23.11.0）
- 或者直接使用 Node.js v23.11.0 版本

### 6.2 性能考虑

- Proxy 代理会增加性能开销，生产环境建议关闭日志
- 大量对象操作时，日志文件可能很大
- 建议只在需要调试时启用完整代理

### 6.3 兼容性

- 该工具主要模拟现代浏览器环境（Chrome/Edge）
- 某些浏览器特定行为可能不完全一致
- 需要根据实际目标网站调整配置

## 七、最佳实践

1. **分阶段启用功能**：
   - 先创建基本环境（window, document）
   - 根据目标代码需求逐步加载 API
   - 最后启用代理和日志进行调试

2. **日志分析**：
   - 先运行目标代码，查看日志
   - 找出缺失或异常的 API 调用
   - 针对性补充或修复

3. **错误处理**：
   - 使用 try-catch 包裹代码执行
   - 检查关键对象是否存在
   - 验证 API 调用是否正常

4. **性能优化**：
   - 生产环境关闭日志
   - 只代理必要的对象
   - 使用缓存避免重复创建对象

## 八、总结

WebEnv 是一个功能强大的浏览器环境模拟工具，通过 Proxy 机制实现了完整的浏览器 API 模拟。它特别适用于：

- 爬虫开发中的反爬虫绕过
- JavaScript 代码的 Node.js 环境执行
- 浏览器环境的自动化测试
- 代码调试和逆向分析

通过合理配置和使用，可以在 Node.js 环境中完美模拟浏览器环境，使得原本只能在浏览器中运行的代码能够顺利执行。

