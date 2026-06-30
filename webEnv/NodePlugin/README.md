## node插件，需要c++环境（可直接安装visual studio中“使用c++桌面开发”负载）

1. 安装gyp环境：npm install -g node-gyp。node-gyp是一个用于编译原生插件的工具，允许使用 C++、C 和其他语言编写Node.js插件。
2. 配置 node-gyp 构建环境：node-gyp configure
3. 生成插件：node-gyp build
