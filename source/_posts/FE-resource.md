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

[2020 三元同学春招阿里淘系、阿里云、字节跳动面经 & 个人成长经验分享 | 掘金技术征文
](https://juejin.im/post/6844904106537009159)

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

## 性能优化

[前端性能优化 24 条建议（2020）
](https://juejin.cn/post/6892994632968306702)

## react 原理

[从零开始实现一个 React](https://github.com/hujiulong/blog/issues/4)
