---
title: FE-resource
date: 2020-11-04 15:43:57
tags: [interview]
---

## 面筋

[霖呆呆的中大厂面试记录及 2 年前端薪资对比(附赠学习方法)](https://juejin.im/post/6844904181627781128)

[面试分享：两年工作经验成功面试阿里 P6 总结](https://juejin.im/post/6844903928442667015)

[大厂面试过程复盘(微信/阿里/头条,附答案篇)](https://mp.weixin.qq.com/s/7NjxEAo7nPNsBCV7UwTz1A)

[「查缺补漏」我的 2020 前端面试秘籍，为你秋招保驾护航](https://juejin.im/post/6864398060702760968)

[最新的前端大厂面经（详解答案）](https://juejin.cn/post/7004638318843412493)

[2020 三元同学春招阿里淘系、阿里云、字节跳动面经 & 个人成长经验分享 | 掘金技术征文
](https://juejin.im/post/6844904106537009159)

[面试被问项目经验不用慌，按这个步骤回答绝对惊艳](https://mp.weixin.qq.com/s/5sUyIfU3yD_RgicSm4512w)
面试 STAR 法则：

- **Situation** 事情是在什么情况下发生，基于一个怎样的背景；
- **TASK** 你是如何明确你的任务的；
- **Action** 针对这样的情况分析，你采用了什么行动方式，具体做了哪些工作内容；
- **Result** 结果怎样，带来什么价值，在整个过程中你学到了什么，有什么新的体会。

Babel parse AST 的过程

在解析 AST 过程中有连个阶段：词法分析和语法分析。

- 词法分析阶段：字符串形式的代码转换为令牌（tokens）流，令牌类似于 AST 中的节点；
- 语法分析阶段：把一个令牌流转化为 AST 形式，同时把令牌中的信息转化为 AST 表述结构。

Babel 在处理一个节点时，是以访问者的形式获取节点信息并进行相关操作。这种方式是通过 Vistor 对象来完成的，Vistor 对象中定义来对于各种节点的访问函数，这样就可以针对不同的节点做出不同的处理。

Webpack 插件问题点：

- Compiler 和 Compilation 以及它们的区别？
- Webpack 是通过什么方式实现来插件之间的关系以及保证它们的有序性？
- 开发插件时需要依据当前配置是否使用来某个其他的插件而做下一步决定，如何判断 Webpack 当前使用来哪些插件；
- 开发插件过程中借鉴了其他插件的思路，我对这个插件源码的理解？

[阿里前端攻城狮们写了一份前端面试题答案，请查收](https://juejin.cn/post/6844904097556987917)

## 浏览器原理

[一文搞懂 V8 引擎的垃圾回收](https://juejin.cn/post/6844904016325902344)

[图解浏览器基本工作原理](https://zhuanlan.zhihu.com/p/47407398)

从整体到细节概括了浏览器的工作原理：
**大的方面**：浏览器的工作由由进程（Process）和线程（Thread）协作完成。一个进程可能有多个线程，进程与进程之间可通过 IPC 进行通信，浏览器是通过 browser process 对其他进程（比如 network process、plugin process、render process、GPU process）进行调度、分工。
**小的方面**：浏览器具体渲染某个页面，这部分是由 render process 完成，加载解析 html，构建 DOM 树。加载解析 css，遍历 DOM 节点计算样式和位置信息，构建成布局（layout）树。主线程会遍历布局树，生成绘制记录，然后创建层（layer）树。合成器（compositor）将每层分成多个磁贴，栅格线程栅格每一个磁贴，栅格完成后创建合成帧，然后发送给 GPU 显示。
**passive 应用原理**：页面滚动，render process 通知合成器生成新的帧，如果合成器发现有绑定事件，会通知并等待主线程的响应，才合成下一帧，这样就造成了页面卡顿。passive 参数就是为了告诉合成器不用等待，直接去生成新帧。

## 计算机网络

[查缺补漏」巩固你的 HTTP 知识体系](https://juejin.cn/post/6857287743966281736)

[【原】老生常谈-从输入 url 到页面展示到底发生了什么](https://www.cnblogs.com/xianyulaodi/p/6547807.html)

[从 URL 输入到页面展现到底发生什么？](https://juejin.cn/post/6844903717259444232)

[预测最近面试会考 Cookie 的 SameSite 属性](https://juejin.cn/post/6844904095711494151)

[跨域资源共享 CORS 详解](https://www.ruanyifeng.com/blog/2016/04/cors.html)

阮一峰老师对 CORS 的定义理解

[CORS 完全手冊](https://blog.huli.tw/2021/02/19/cors-guide-3/)
讲述小明提交表单的故事，一层层讲解 `CORS` 在现实应用出错的一些情景：

- 首先用 `fetch` 跨域请求会报错 `mode to 'no-cors'` ，需要后端加上 `Access-Contron-Allow-Origin: origin` 响应头制定某个或者所有域名，告诉浏览器允许的 `origin`。
- 如果设置 `cookie`，需要后端响应头加上 `set-cookie` 和 `Access-Control-Allow-credential: origin`，如果前端的请求需要携带 `cookie`，前端也许加上这个请求头 `Access-Control-Allow-credential: true`。
- 如果 `Access-Contron-Allow-Origin: *` 则不能携带 cookie，`Access-Control-Allow-credential: true` 不起作用。
- 跨域请求分为简单请求和非简单请求。判断是简单请求：1. `method` 是 `GET`、`HEAD` 或 `POST`，2. 没有自订 `header`，3. `Content-Type`是这三种：`application/x-www-form-urlencoded`、`multipart/form-data` 和 `text-plain`。其他都是非简单请求。非简单请求在正是请求前都会发送一个预检请求（`preflight request`），也就是 `method` 为 `OPTIONS` 请求，浏览器会加上两个 `header`：`Access-Control-Request-Headers` 和 `Access-Control-Request-Method`，告诉服务器正式请求的请求头和请求方法，后端需要返回响应头 `Access-Control-Allow-Headers` 让浏览器通过预检，浏览器才会发送正式请求。
- `Access-Control-max-age: second` 可以在 second 秒内不针对每个请求进行预检，减少资源浪费。
- 若想渠道自订 header ，需要后端的响应头设置 `Access-Control-Expose-Headers: self-header,other-header` 指定。

## 缓存

[浅解强缓存和协商缓存](https://juejin.cn/post/6844903736196726798)

[HTTP 中的 ETag 是如何生成的？](https://mp.weixin.qq.com/s/3v5ZPExKpm4Tn8cyqesa3A)

在 HTTP 缓存中协商缓存有一种是 ETag，它可以看成是资源的指纹，资源发生改变就会生成一个新的 ETag。
`Etag:W/"<etag_value>"` `\W`（大小写敏感）表示使用弱验证器，容易生成，不利于比较。相反，强验证器难生成。
没有明确指定生成 ETag 值的方法，通常使用内容的散列、最后修改时间戳的哈希值或者简单地使用版本号。
本地强缓存过期后，询问协商缓存，请求报文 `If-None-Match: "xx-xxxx"`，内容没有发生改变，响应报文 `ETag: "xx-xxxx"`。

`Last-Modified` 和 `ETag` 比较：

- 精度上，ETag 要优于 Last-Modified。Last-Modified 的时间单位是秒，如果某个文件在 1 秒被改变多次，那么它们的 Last-Modified 并没有体现出来修改，但是 ETag 每次都会改变，从而确保了精度；此外，如果是负载均衡服务器，各个服务生成的 Last-Modified 也可能不一致。
- 性能上，ETag 要逊于 Last-Modified，毕竟 Last-Modified 只需要记录时间，而 ETag 需要服务器通过消息摘要算法计算出一个 hash 值。
- 优先级上，在资源新鲜度校验时，服务器会优先考虑 ETag。即如果条件请求的请求透你同时携带 If-Modified-Since 和 If-None-Match 字段，会优先判断资源的 ETag 值是否发生变化。

## 性能优化

[前端性能优化 24 条建议（2020）
](https://juejin.cn/post/6892994632968306702)

[前端虚拟列表实现原理](https://mp.weixin.qq.com/s/VTH10pCV_AOOyYcsNQtnRQ)

实现前提，列表容器定高，容器内有一个影子容器，高度为算出的实际内容高度，这样就有真实的滚动条及滚动效果。而真实展示给用户视窗中的是绝对定位的元素构成的真实容器，影子容器滚动，真实容器也跟着滚动，监听影子容器的 onscroll 事件，获取影子容器的 scrollTop，算出视窗中第一项渲染的数据索引 startIndex 有没有更新，有，则重新截取列表数据渲染可视区。虽然说是重新渲染，但是下一帧和当前滚动位置元素一样，所以用户无感知。

确定影子容器的高度：

1. 列表内容每一项定高，影子容器的高度=每一项定高 x total
2. 列表内容每一项不定高，可以初始假设每一项定高，算出影子容器高度，这样容器可滚动，待真实容器渲染后，算出每一项元素的高度、位置信息，再去更新影子容器高度。算出了影子容器的高度及其每一项的位置信息，又已知 scrollTop，可以通过二分法找到当前的 startIndex。

## react 原理

[从零开始实现一个 React](https://github.com/hujiulong/blog/issues/4)
[Vuex、Flux、Redux、Redux-saga、Dva、MobX](https://zhuanlan.zhihu.com/p/53599723)

## HTML5

[种文件上传攻略](https://juejin.cn/post/6844903968338870285)
[实现一个大文件上传和断点续传](https://juejin.cn/post/6844904046436843527)

- **文件分片** 利用 Blob 原生方法 Blob.prototype.slice 切割文件，每个切片并行上传，服务端创建临时目录存储上传分片，前端上传完毕，服务端利用 createWriteStream 创建可写流，将切片整合成一个文件，然后删除临时分片的临时文件。
- **断点续传** 前端记录当前上传的分片信息到 localStorage，下次续传重新读取，不过这种方式的前提是不换浏览器和更改文件名。严格的解决方案是按照文件内容生成 hash 值标志作为文件名：用 spark-md5 可以实现，不过当读取的文件内容特别大时，会出现“假死“，解决方案可以在 webWorker 线程中计算。
- **文件秒传** 服务端已经存在了上传的资源，当再次上传时直接提示上传成功

## 工程化

[@babel/plugin-transform-runtime 到底是什么？](https://zhuanlan.zhihu.com/p/147083132)
[关于 Babel 那些事儿](https://mp.weixin.qq.com/s/3lNlJKcgrdNzWEqaEx-7jQ)

- Babel 只负责编译新标准引入的新语法，比如 Arrow function、Class、ES Modul 等，它不会编译原生对象新引入的方法和 API，比如 Array.includes，Map，Set 等，这些需要通过 Polyfill 来解决。
- preset 预设是插件 plugins 的集合，预设数组加载的顺序是从从右到左，为了向后兼容，一般用户会把 `prest-es2015` 写在 `stage-0` 的前面。
- @babel/preset-env 可以按需引入预设插件，设置参数 useBuiltIns: "usage" 可以按照用户使用 ES6 API 相应引入 Polyfill。
- @babel/plugin-transform-runtime 可以让 Babel 在编译中复用辅助函数，从而减小打包文件体积 。

[嘿，不要给 async 函数写那么多 try/catch 了](https://juejin.cn/post/6844903886898069511)

[Webpack 插件开发如此简单！](https://mp.weixin.qq.com/s/adu7ZL0BA1X4672VqIkCtA)

一个 Webpack 插件的构成：

- 一个具名 JavaScript 函数；
- 在它的原型上定义 apply 方法；
- 指定一个触及到 webpack 本身的事件钩子；
- 操作 webpack 内部的实例特定数据；
- 在实现功能后调用 webpack 提供的 callback。

[【编译篇】AST 实现函数错误的自动上报](https://segmentfault.com/a/1190000037630766)
实现全局数据上报中 try catch 在 babel 编译层面上的拦截

[微前端究竟是什么，可以带来什么收益](https://juejin.cn/post/6893307922902679560) 微前端概念是从微服务概念扩展而来的，摒弃大型单体方式，将前端整体分解为小而简单的块，这些块可以独立开发、测试和部署，同时仍然聚合为一个产品出现在客户面前。可以理解微前端是一种将多个可独立交付的小型前端应用聚合为一个整体的架构风格。

[DevOps到底是什么意思？](https://zhuanlan.zhihu.com/p/91371659) 从瀑布式开发、敏捷开发到如今的DevOps开发。DevOps是一组过程、方法与系统的统称，用于促进开发、技术运营和质量保证部门之间的沟通、协作与整合。最终将开发、测试运维紧密联系在一起。

## js 原理实现

[JavaScript 专题之跟着 underscore 学防抖](https://juejin.cn/post/6844903480239325191)
