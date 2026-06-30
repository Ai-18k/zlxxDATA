/**
 * WebEnv 使用示例
 * 
 * 本示例展示如何在 Node.js 中使用 WebEnv 包来补充浏览器环境
 */

const { createWindow } = require('./Window');
const getEnv = require('./jsProxy');
const { envOption } = require('./utility');
const { loadFun, loadBody } = require('./loadFun');
const fs = require('fs');
const path = require('path');

/**
 * 示例 1: 基础使用 - 创建浏览器环境并执行代码
 */
function example1_basic() {
    console.log('=== 示例 1: 基础使用 ===\n');
    
    // 1. 创建 window 对象（包含完整的浏览器环境）
    const window = createWindow();
    
    // 2. 设置全局对象
    global.window = window;
    global.document = window.document;
    global.navigator = window.navigator;
    global.location = window.location;
    
    // 3. 执行一些浏览器代码
    console.log('User Agent:', navigator.userAgent);
    console.log('Document readyState:', document.readyState);
    console.log('Window location:', location.href);
    
    console.log('\n');
}

/**
 * 示例 2: 启用日志记录 - 追踪所有对象操作
 */
function example2_withLogging() {
    console.log('=== 示例 2: 启用日志记录 ===\n');
    
    // 1. 配置日志选项
    envOption.log = true;
    envOption.logFileName = 'example-env.log';
    
    // 2. 创建环境
    const window = createWindow();
    
    // 3. 应用代理（启用日志记录）
    const proxiedWindow = getEnv({
        obj: window,
        name: 'window'
    });
    
    // 4. 设置全局对象
    global.window = proxiedWindow;
    global.document = proxiedWindow.document;
    
    // 5. 执行一些操作（这些操作会被记录到日志文件）
    const div = document.createElement('div');
    div.id = 'test';
    div.className = 'example';
    console.log('创建了元素:', div.tagName);
    console.log('日志已保存到:', envOption.logFileName);
    
    // 6. 关闭日志（避免后续操作产生日志）
    envOption.log = false;
    
    console.log('\n');
}

/**
 * 示例 3: 调试模式 - 设置断点触发条件
 */
function example3_debugMode() {
    console.log('=== 示例 3: 调试模式 ===\n');
    
    // 1. 配置调试选项
    envOption.debugProxyProp = ['cookie'];  // 访问 cookie 时触发断点
    envOption.debugProxyFunArg = ['token']; // 函数参数包含 token 时触发断点
    
    // 2. 创建并代理环境
    const window = createWindow();
    const proxiedWindow = getEnv({
        obj: window,
        name: 'window'
    });
    
    global.window = proxiedWindow;
    global.document = proxiedWindow.document;
    
    console.log('调试模式已启用');
    console.log('访问 document.cookie 时会触发断点');
    console.log('调用函数时，如果参数包含 "token" 也会触发断点');
    
    // 注意：在实际调试时，这些操作会在调试器中暂停
    
    console.log('\n');
}

/**
 * 示例 4: 加载特定 DOM 函数
 */
function example4_loadFunctions() {
    console.log('=== 示例 4: 加载特定 DOM 函数 ===\n');
    
    const window = createWindow();
    global.window = window;
    global.document = window.document;
    
    // 加载必要的 DOM 操作函数
    loadFun({
        createElement: true,
        getElementsByTagName: true,
        getElementById: true,
        appendChild: true,
        removeChild: true,
        getAttribute: true
    });
    
    // 创建 body 元素
    loadBody({});
    
    // 现在可以使用这些函数
    const div = document.createElement('div');
    div.id = 'myDiv';
    div.className = 'container';
    
    const body = document.body;
    if (body) {
        body.appendChild(div);
        console.log('成功创建并添加 div 元素');
        console.log('Body 子元素数量:', body.children.length);
    }
    
    console.log('\n');
}

/**
 * 示例 5: 执行外部 JavaScript 文件
 */
function example5_executeExternalFile() {
    console.log('=== 示例 5: 执行外部 JavaScript 文件 ===\n');
    
    // 1. 创建环境
    const window = createWindow();
    
    // 2. 应用代理（可选）
    const proxiedWindow = getEnv({
        obj: window,
        name: 'window'
    });
    
    // 3. 设置全局对象
    global.window = proxiedWindow;
    global.document = proxiedWindow.document;
    global.navigator = proxiedWindow.navigator;
    global.location = proxiedWindow.location;
    global.screen = proxiedWindow.screen;
    global.localStorage = proxiedWindow.localStorage;
    global.sessionStorage = proxiedWindow.sessionStorage;
    
    // 4. 加载必要的函数
    loadFun({
        createElement: true,
        getElementsByTagName: true,
        getElementById: true
    });
    
    loadBody({});
    
    // 5. 读取并执行外部文件
    const targetFile = path.join(__dirname, '../rs-code/专利.js');
    
    if (fs.existsSync(targetFile)) {
        try {
            const code = fs.readFileSync(targetFile, 'utf-8');
            
            // 执行代码
            eval(code);
            
            console.log('代码执行成功！');
            
            // 检查执行结果
            if (document.cookie) {
                console.log('Document cookie:', document.cookie);
            }
            
        } catch (error) {
            console.error('执行出错:', error.message);
            console.error('堆栈:', error.stack);
        }
    } else {
        console.log('目标文件不存在:', targetFile);
    }
    
    console.log('\n');
}

/**
 * 示例 6: 自定义配置
 */
function example6_customConfig() {
    console.log('=== 示例 6: 自定义配置 ===\n');
    
    // 1. 自定义 Navigator MIME 类型
    const window = createWindow({
        mimeTypesOptions: {
            enabledPluginAlike: true,
            mimeTypes: [
                {
                    type: 'application/pdf',
                    suffixes: 'pdf',
                    description: 'Portable Document Format'
                }
            ]
        },
        hasChromeApp: true  // Chrome 包含 app 属性
    });
    
    global.window = window;
    global.navigator = window.navigator;
    
    console.log('Navigator MIME Types:', navigator.mimeTypes.length);
    console.log('Chrome app exists:', typeof window.chrome !== 'undefined');
    
    console.log('\n');
}

/**
 * 示例 7: 使用 vm 模块执行代码（更安全）
 */
function example7_withVM() {
    console.log('=== 示例 7: 使用 vm 模块执行代码 ===\n');
    
    const vm = require('vm');
    
    // 1. 创建环境
    const window = createWindow();
    const proxiedWindow = getEnv({
        obj: window,
        name: 'window'
    });
    
    // 2. 准备上下文
    const context = {
        window: proxiedWindow,
        document: proxiedWindow.document,
        navigator: proxiedWindow.navigator,
        location: proxiedWindow.location,
        screen: proxiedWindow.screen,
        localStorage: proxiedWindow.localStorage,
        sessionStorage: proxiedWindow.sessionStorage,
        console: console,
        setTimeout: proxiedWindow.setTimeout,
        setInterval: proxiedWindow.setInterval,
        clearTimeout: proxiedWindow.clearTimeout,
        clearInterval: proxiedWindow.clearInterval
    };
    
    // 3. 创建 VM 上下文
    const vmContext = vm.createContext(context);
    
    // 4. 执行代码
    const code = `
        console.log('User Agent:', navigator.userAgent);
        console.log('Location:', location.href);
        
        const div = document.createElement('div');
        div.id = 'vm-test';
        console.log('Created element:', div.id);
    `;
    
    try {
        vm.runInContext(code, vmContext);
        console.log('VM 执行成功！');
    } catch (error) {
        console.error('VM 执行出错:', error.message);
    }
    
    console.log('\n');
}

/**
 * 主函数 - 运行所有示例
 */
function main() {
    console.log('WebEnv 使用示例\n');
    console.log('='.repeat(50) + '\n');
    
    // 运行示例（根据需要取消注释）
    example1_basic();
    // example2_withLogging();
    // example3_debugMode();
    // example4_loadFunctions();
    // example5_executeExternalFile();
    // example6_customConfig();
    // example7_withVM();
    
    console.log('='.repeat(50));
    console.log('示例运行完成！');
}

// 如果直接运行此文件，执行主函数
if (require.main === module) {
    main();
}

module.exports = {
    example1_basic,
    example2_withLogging,
    example3_debugMode,
    example4_loadFunctions,
    example5_executeExternalFile,
    example6_customConfig,
    example7_withVM
};

