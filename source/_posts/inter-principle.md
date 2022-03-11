---
title: inter-principle
date: 2021-09-05 16:14:13
tags: [interview]
---

### Axios 原理

- 大致步骤：Axios 实例化 -> 执行请求拦截器（request： new InterceptorManager()） -> 派发请求（dispatchRequest） -> 转换请求数据（transformRequest） -> 适配器（adapter）处理请求 -> 转换响应数据（transformResponse） -> 执行响应拦截器（response: new InterceptorManager()） -> axios；
- axios 实际返回的是 Axios.prototype.request 方法，并且将 axios 实例所有方法引用赋值到 request 方法属性上，this 绑定 axios 实例；
- request.use 和 response.use 分别收集用户请求任务队列和响应拦截任务队列，与派发请求合成 chain 任务队列，利用 promise.then(chain.shift(), chain.shift()) 链式执行任务队列；

参考：
[HTTP 请求库 - Axios 源码分析](https://mp.weixin.qq.com/s/9WfIMRgL6f2Tgft2e80PVA)

### Virtual list 原理

实现前提，列表容器定高，容器内有一个影子容器，高度为算出的实际内容高度，这样就有真实的滚动条及滚动效果。而真实展示给用户视窗中的是绝对定位的元素构成的真实容器，影子容器滚动，真实容器也跟着滚动，监听影子容器的 onscroll 事件，获取影子容器的 scrollTop，算出视窗中第一项渲染的数据索引 startIndex 有没有更新，有，则重新截取列表数据渲染可视区。虽然说是重新渲染，但是下一帧和当前滚动位置元素一样，所以用户无感知。

确定影子容器的高度：

1. 列表内容每一项定高，影子容器的高度=每一项定高 x total
2. 列表内容每一项不定高，可以初始假设每一项定高，算出影子容器高度，这样容器可滚动，待真实容器渲染后，算出每一项元素的高度、位置信息，再去更新影子容器高度。算出了影子容器的高度及其每一项的位置信息，又已知 scrollTop，可以通过二分法找到当前的 startIndex。

参考：

[前端虚拟列表实现原理](https://mp.weixin.qq.com/s/VTH10pCV_AOOyYcsNQtnRQ)

### webpack 构建原理

webpack 是一个现代 JavaScript 应用程序的静态模块打包器。当 webpack 处理应用程序时，它会递归地构建一个依赖关系图，包含应用程序需要的每个模块，然后将所有这些模块打包成一个或多个 bundle。
webpack 像一条生产线，其中每个处理流程的职责是单一的，只有当前流程处理完成后才能交给下一个流程处理。
webpack 通过 Tapable 组织这条复杂的生产线。webpack 在运行过程中会广播事件，插件只需要监听它所关心的事件，就能加入到这条生产线，改变生产线的运作。webpack 的事件流机制保证了插件的有序性。

#### webpack plugin 实现

- Plugin 是一个类（Class），类有一个 apply 方法，执行具体的插件方法；
- 调用 apply 方法入参注入一个 compiler 实例，compiler 实例是 webpack 的支柱引擎，代表 CLI 和 Node API 传递的所有配置项；
- compiler 上的 Hook 回调方法注入 compilation 实例，compilation 能够访问当前构建时的模块和相应的依赖；

> compiler 对象包含了 Webpack 环境所有的配置信息，包含 options，loaders，plugins 这些信息，这个对象在 Webpack 启动时候被实例化，它是全局唯一的，可以简单地理解为 Webpack 实例；
> compilation 对象包含了当前的模块资源、编译生成资源、变化的文件等。比如可以获取代码块 compilation.chunks，读取模块 chunk.forEachModule，文件 chunk.files。当 Webpack 以开发模式运行时，每当检测到一个文件变化，一次新的 Compilation 将被创建。Compilation 对象也提供了很多事件回调供插件做拓展，通过 Compilation 也能读取到 Compiler 对象。
> Compiler 和 Compilation 的区别在于：Compiler 代表了整个 Webpack 从启动到关闭的什么周期，而 Compilation 只代表一次新的编译。
> Hook 暴露了 3 个方法：tap、tapAsync 和 tapPromise，定义如何执行 Hook，分别表示注册同步、异步、Promise 形式 Hook。

```js
const pluginName = 'MyPlugin'
class MyPlugin {
  apply(compiler) {
    compiler.hooks.run.tap(pluginName, (compilation) => {
      // ...
    })
  }
}
```

Compiler Hooks

| Hook    | Type            | 调用                                |
| ------- | --------------- | ----------------------------------- |
| run     | AsyncSeriesHook | 开始读取 records 之前               |
| compile | SyncHook        | 一个新的编译（compilation）创建之后 |
| emit    | AsyncSeriesHook | 生成资源到 output 目录之前          |
| done    | SyncHook        | 编译（compilation）完成             |

Compilation Hooks

| Hook         | Type     | 调用                   |
| ------------ | -------- | ---------------------- |
| buildModule  | SyncHook | 在模块构建开始之前触发 |
| finishModule | SyncHook | 所有模块都完成构建     |
| optimize     | SyncHook | 优化阶段开始时触发     |

#### 简单实现一个 webpack

- 传入一个文件路径参数，通过 fs 将文件中的内容读取出来；
- 再通过 babylon 解析代码获取 AST，目的是为了分析代码中是否还引入了别的文件；
- 通过 dependencies 来存储文件中的依赖，然后再将 AST 转化成 ES5代码；
- 最后函数返回一个对象，对象中包含当前文件路径、当前文件依赖和当前文件转化后的代码；
- 这样遍历所有依赖文件，构建出一个函数参数对象；
- 对象的属性就是当前文件的相对路径，属性值是一个函数，函数体是当前文件下的代码，函数接受三个参数 module、exports、require；
- 接下来就是构造一个使用参数的函数require，调用 require('./entry.js')就可以执行 `./entry.js` 对应的函数并执行，通过 `module.export` 方式导出内容。

[实现小型打包工具](https://juejin.cn/book/6844733763675488269/section/6844733763780345864)

#### webpack 打包流程

专业版：

- 首先合并 webpack config 文件和命令行参数，合并为 options；
- 将 options 传入 Compiler 构造方法，生成 compiler 实例，并实例化了 Compiler 上的 Hooks；
- compiler 对象执行 run 方法，并自动触发 beforeRun、run、beforeCompile、compile 等关键 Hooks；
- 调用 Compilation 构造方法创建 compilation 对象，compilation 负责管理所有模块和对应的依赖，创建完成后触发 make Hook；
- 执行 compilation.addEntry() 方法，addEntry 用于分析所有入口文件，逐级递归解析，调用 NormalModuleFactory 方法，为每个依赖生成一个 Module 实例，并在执行过程中触发 beforeResolve、resolver、afterResolve、module 等关键 Hooks；
- 将第 5 步中生成的 Module 实例作为入参，执行 Compilation.addModule() 和 Compilation.buildModule() 方法递归创建模块对象和依赖模块对象。
- 调用 seal 方法生成代码，整理输出主文件和 chunk，并最终输出；

易懂版：

- 初始化参数：从配置文件到 Shell 语句中读取与合并参数，得出最终的参数；
- 开始编译：用上一步的参数初始化 Compiler 对象，加载所有配置的插件，执行对象的 run 方法开始执行编译；
- 确定入口：根据配置中的 entry 找出所有的入口文件；
- 编译模块：从入口文件出发，调用所有配置的 loader 对模块进行翻译，找出该模块依赖的模块，再递归本步骤直到所有入口依赖的文件都经过本步骤的处理；
- 完成模块编译：在经过第 4 步使用 Loader 翻译完所有模块后，得到了每个模块被翻译后的最终内容以及他们之间的依赖关系；
- 输出资源：根据入口和模块之间的依赖关系，组装一个个包含很多模块的 Chunk ，再把每个 Chunk 转换成一个单独的文件加入到输出列表，这步是可以修改输出内容的最后机会；
- 输出完成：在确定好输出内容后，根据配置确定输出的路径和文件名，把文件内容写入到文件系统。

#### Tapable 原理

Tapable 是 Webpack 核心工具库，它提供了所有 Hook 的抽象类定义。

参考：
[webpack 打包原理 ? 看完这篇你就懂了 !](https://juejin.cn/post/6844904038543130637)
[](https://juejin.cn/post/6968988552075952141)
[深入浅出 webpack](https://webpack.wuhaolin.cn)

### 实现一个 webpack 插件

findUnusedfile 插件是递归遍历入口文件它的模块依赖图，保存遍历结果并且去重、排除 node_modules 中的模块，最终找出所有项目使用的文件集合 A。通过 fastGlob 插件正则递归查找项目目录下所有文件集合 B，集合 B 减去 A/B 交集即可得到项目中未使用到的文件。

遍历不同的模块有不同的分析依赖方式：

- js、ts、jsx、tsx 模块根据 es module 的 import 或者 commonjs 的 require 来确定依赖；
- css、less、scss 模块根据 @import 和 url()的语法来确定依赖；

遍历 js 模块需要分析其中的 import 和 require 依赖。我们使用 Babel 来做：

- 读取文件内容；
- 根据后缀名是.jsx、.ts 来决定是否启用 typescript、jsx 的 parse 插件；
- 使用 babel/parse 把代码转成 AST；
- 使用 babel/traverse 对 AST 进行遍历；
- 处理 ImportDeclaration 和 CallExpress 的 AST，从中提取依赖路径；
- 对依赖路径进行处理，变成真实路径之后，继续遍历该路径的模块；

遍历 css 模块需要分析 @import 和 url()。我们使用 postcss 来做：

- 读取文件内容；
- 根据文件路径是.less、scss 来决定是否启动 less、scss 的语法插件；
- 使用 postcss.parse 把文件内容转化成 AST；
- 遍历@import 节点，提取依赖路径；
- 遍历样式声明（declaration），过滤出 url()的值，提取依赖的路径；
- 对依赖路径进行处理，变成真实路径之后，继续遍历该路径的模块；

改成 webpack 插件，webpack 将资源转换输出，中间是可以获取到所有依赖关系图和所有使用资源。emit hook 是在所有源文件转换和组装已经完成，在这里可以读取到最终将输出的资源、代码块、模块及其依赖。`compilaton.fileDependcies` 属性可以获取所有依赖文件，进一步简化了我自己去递归遍历查找依赖模块。
