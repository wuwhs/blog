---
title: 前端面试之原理
date: 2021-09-05 16:14:13
tags:
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

**简单实现**：

参考：
[webpack 打包原理 ? 看完这篇你就懂了 !](https://juejin.cn/post/6844904038543130637)
[深入浅出 webpack](https://webpack.wuhaolin.cn)
