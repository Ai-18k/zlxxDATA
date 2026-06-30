# WebEnv 快速入门指南

## 快速开始

### 1. 安装依赖

```bash
cd webEnv
npm install
```

### 2. 最简单的使用方式

创建一个文件 `test.js`：

```javascript
// 引入 WebEnv
const { createWindow } = require('./webEnv/Window');

// 创建浏览器环境
const window = createWindow();

// 设置全局对象
global.window = window;
global.document = window.document;
global.navigator = window.navigator;
global.location = window.location;

// 现在可以使用浏览器 API 了
console.log('User Agent:', navigator.userAgent);
console.log('Document:', document.readyState);

// 创建 DOM 元素
const div = document.createElement('div');
div.id = 'test';
console.log('Created div:', div.id);
```

运行：
```bash
node test.js
```

### 3. 执行目标网站代码

假设你有一个需要执行的 JavaScript 文件 `target.js`：

```javascript
const { createWindow } = require('./webEnv/Window');
const { loadFun, loadBody } = require('./webEnv/loadFun');
const fs = require('fs');

// 1. 创建环境
const window = createWindow();
global.window = window;
global.document = window.document;
global.navigator = window.navigator;
global.location = window.location;
global.screen = window.screen;
global.localStorage = window.localStorage;
global.sessionStorage = window.sessionStorage;

// 2. 加载必要的 DOM 函数
loadFun({
    createElement: true,
    getElementsByTagName: true,
    getElementById: true,
    appendChild: true
});

// 3. 创建 body
loadBody({});

// 4. 读取并执行目标代码
const code = fs.readFileSync('target.js', 'utf-8');
eval(code);

// 5. 检查结果
console.log('Cookie:', document.cookie);
```

### 4. 启用调试和日志

如果需要调试代码执行过程：

```javascript
const { createWindow } = require('./webEnv/Window');
const getEnv = require('./webEnv/jsProxy');
const { envOption } = require('./webEnv/utility');

// 启用日志
envOption.log = true;
envOption.logFileName = 'debug.log';

// 创建环境并应用代理
const window = createWindow();
const proxiedWindow = getEnv({
    obj: window,
    name: 'window'
});

global.window = proxiedWindow;
global.document = proxiedWindow.document;
// ... 其他全局对象

// 执行代码后，查看 debug.log 文件了解所有对象操作
```

### 5. 常见问题解决

#### 问题 1: document.all 相关错误

如果遇到 `faker.node` 错误：
- 确保使用 Node.js v23.11.0，或
- 重新编译 NodePlugin（参考 README.md）

#### 问题 2: 某些 API 不存在

根据目标代码的需求，可能需要加载更多 API：

```javascript
loadFun({
    createElement: true,
    getElementsByTagName: true,
    getElementById: true,
    getAttribute: true,
    appendChild: true,
    removeChild: true
});
```

#### 问题 3: 代码执行失败

1. 启用日志查看缺少什么 API
2. 检查错误堆栈
3. 逐步加载需要的 API

### 6. 完整示例模板

```javascript
const { createWindow } = require('./webEnv/Window');
const getEnv = require('./webEnv/jsProxy');
const { envOption } = require('./webEnv/utility');
const { loadFun, loadBody } = require('./webEnv/loadFun');
const fs = require('fs');

// 配置
envOption.log = false;  // 生产环境关闭日志
// envOption.log = true;  // 调试时启用
// envOption.logFileName = 'spider.log';

// 创建环境
const window = createWindow({
    mimeTypesOptions: {
        enabledPluginAlike: true,
        mimeTypes: []
    },
    hasChromeApp: true
});

// 应用代理（如果启用了日志）
let proxiedWindow = window;
if (envOption.log) {
    proxiedWindow = getEnv({
        obj: window,
        name: 'window'
    });
}

// 设置全局对象
global.window = proxiedWindow;
global.document = proxiedWindow.document;
global.navigator = proxiedWindow.navigator;
global.location = proxiedWindow.location;
global.screen = proxiedWindow.screen;
global.localStorage = proxiedWindow.localStorage;
global.sessionStorage = proxiedWindow.sessionStorage;
global.history = proxiedWindow.history;
global.XMLHttpRequest = proxiedWindow.XMLHttpRequest;
global.WebSocket = proxiedWindow.WebSocket;

// 加载 DOM 函数
loadFun({
    createElement: true,
    getElementsByTagName: true,
    getElementById: true,
    appendChild: true,
    removeChild: true,
    getAttribute: true
});

// 创建 body
loadBody({});

// 执行目标代码
try {
    const code = fs.readFileSync('./target.js', 'utf-8');
    eval(code);
    
    // 获取结果
    console.log('执行成功');
    console.log('Cookie:', document.cookie);
    
} catch (error) {
    console.error('执行失败:', error.message);
    console.error('堆栈:', error.stack);
}
```

## 下一步

- 查看 `ANALYSIS.md` 了解详细架构
- 查看 `USAGE_EXAMPLE.js` 查看更多示例
- 查看各个模块的源码了解具体实现

