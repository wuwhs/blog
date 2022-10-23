---
title: 我的阅读清单
date: 2020-05-29 22:33:41
tags: [前端]
---

## 2020-5-29

[傻傻分不清之 Cookie、Session、Token、JWT](https://juejin.im/post/5e055d9ef265da33997a42cc)
PS：明扼要的对比了四者之间的异同点，加深前后端身份校验的认识，相关阅读阮一峰的[JSON Web Token 入门教程](http://www.ruanyifeng.com/blog/2018/07/json_web_token-tutorial.html)

## 2020-5-31

[面试官：你可以用纯 CSS 判断鼠标进入的方向吗？](https://mp.weixin.qq.com/s/nwH2mmxY0ugSSGM3OuEBoQ)
PS：实际用途不大，但是思路清晰，利用鼠标进入区域 `:hover`，和动画过渡效果 `transition`

[面试官问了一下三次握手，我甩出这张脑图，他服了！](https://mp.weixin.qq.com/s/xXHW_NZqF6qmi7JBB_mTEw)
PS：深入 `HTTP` 三次握手部分

## 2020-6-1

现在当前做的项目中遇到的难题：

参考：
规避功能型问题&业务性问题，除非是功能和业务确实很复杂，例如：

- 单点登录
- 权限的多维度管控
- 多组建信息的复杂共享类问题
- 产品安全解决策略
- 直播类、音视频类、实时通信类、可视化处理类...功能性突破
  性能优化方案：

- webpack 层面
- http 层面 移动端项目将 http1.1 -> http2，通过升级 Nginx-openresty 的 ssl，要求高于 1.0.2，然后配置 listen 443 端口加上 ssl http2 即可。
- 页面渲染层面
- 骨架屏
- 延迟/异步加载
- 大数据渲染优化
  强调结果，之前打包/加载时间 N 秒，我处理后优化

组建封装：

- 公共方法库
- 插件/组建封装 & 开源级插件组建的打造
- vue 自定义指令
  除了强调结果「例如：之前半个月开发周期，现在只需 7 天」还可以突出自己在源码方面的阅读能力

1. 聊天消息确认机制

```js
// 观察者模式
// 某个事件拥有唯一标识作为键名，与之绑定的事件队列作为值
// {
//   [key1]: [fn1a, fn1b, fn1c],
//   [key2]: [fn2a, fn2b, fn2c],
// }

class Observer {
  constructor() {
    this.data = {}
  }
  // 监听
  listen(key, callback) {
    if (!this.data.hasOwnProperty(key)) {
      this.data[key] = []
    }
    this.data[key].push(callback)
  }
  // 触发
  trigger(...args) {
    const key = args[0]
    const callbacks = this.data[key]
    if (!callbacks || !Array.isArray(callbacks) || !callbacks.length) return

    callbacks.forEach((callback) => callback.apply(this, args.slice(1)))
  }
  // 删除
  remove(key, callback) {
    const callbacks = this.data[key]
    if (!callbacks) return

    if (!callback) {
      callbacks.length = 0
    } else {
      const index = callbacks.findIndex((value = value === callback))
      callbacks.splice(index, 1)
    }
  }
}

const fn = () => {
  console.log('fn')
}
const ob = new Observer()
ob.listen('key1', fn)
console.log('ob: ', ob)
ob.trigger('key1')
ob.remove('key1')
console.log('ob: ', ob)
```

2. 图片压缩问题

获取不到图片大小
base64 -> formData

压缩黑屏问题

3. 键盘兼容方案

### 2020-6-7

[手写 async await 的最简实现（20 行）](https://juejin.im/post/5e79e841f265da5726612b6e)

### 2020-7-18

[Chrome DevTools 中的这些骚操作，你都知道吗？](https://mp.weixin.qq.com/s/CfzKwfiJ7AVnv6m7CEhAVg)
介绍了一些在 Chrome DevTools 中的一些有用而少有人知的操作，Snippets 最骚，`Sources -> Snippets` 即可在浏览器上生成 js 文件

### 2020-7-21

[10 个 Vue 开发技巧助力成为更好的工程师](https://juejin.im/post/5e8a9b1ae51d45470720bdfa) 介绍了 Vue 的 10 个高阶用法，让人眼前一亮的用法是同时监听多个变量的用法：定义一个计算属性，它的值为多个变量组成的对象，多个变量其中有发生变化，则计算属性也会变化，监听这个计算属性就可以知道这些变量有变化了！再者，使用 `@hook` 即可监听组件生命周期，比如：`<List @hook:mounted="listenMounted"></List>`

### 2020-7-30

[React 源码剖析系列 － 不可思议的 react diff](https://zhuanlan.zhihu.com/p/20346379)

### 2020-9-1

[在淘宝优化了一个大型项目，分享一些干货（Webpack，SplitChunk 代码实例，图文结合）](https://juejin.im/post/6844904183917871117)

### 2020-10-30

[阔别两年，webpack5 正式发布](https://mp.weixin.qq.com/s/sh7rcv6hdhYfWr1bv_ssbg)

### 2020-10-31

[预测最近面试会考 Cookie 的 SameSite 属性](https://juejin.im/post/6844904095711494151)
2020 年 2 月份 `Chrome 80` 版本中默认屏蔽了第三方的 `Cookie`，这样会造成一些跨站 `Cookie` 鉴权问题，解决方案是在响应头加上 `set-cookie: SameSite: None;`

[微前端究竟是什么，可以带来什么收益](https://juejin.cn/post/6893307922902679560) 微前端概念是从微服务概念扩展而来的，摒弃大型单体方式，将前端整体分解为小而简单的块，这些块可以独立开发、测试和部署，同时仍然聚合为一个产品出现在客户面前。可以理解微前端是一种将多个可独立交付的小型前端应用聚合为一个整体的架构风格。

### 2021-3-7

[ES2021 新特性提前知，附案例](https://juejin.cn/post/6914538946751889422)

[ES7-ES12](https://mp.weixin.qq.com/s/QxaHOQIJW2nx0a_cVd824g)

- 空值合并运算符（`??`），左侧的数为 undefined 或者 null 时，返回右侧操作数，否则返回左侧；
- 可选链操作符（`?.`），读取对象链深处属性的值，不必验证链中的每个属性是否有效；
- BigInt，表示任意大的整数，不能和 Math 和 Number 对象混合运算，否则会丢失精度；
- String.prototype.matchAll()，返回一个包含所有匹配正则表达式的结果及分组捕获组的迭代器；
- Promise.allSettled()，并发任务中，无论一个任务正常或者异常，都返回对应的状态；
- 逻辑运算法符和赋值表达式 `a&&=b` -> `a&&a=b`，`a||=b` -> `a||a=b`，`a??=b` -> `a??a=b`；
- String.prototype.replaceAll()，返回一个新字符串，新字符串中所有满足 pattern 的部分会被 replacement 替换；
- 数字分隔符，较长数字每 3 位添加一个分隔符（`_`或者`,`）；
- Promise.any()，返回第一个成功（resolve）的结果，全部为失败（reject）走 catch；
- WeakRef 创建一个弱引用；

### 2021-3-13

[跨域资源共享 CORS 详解](https://www.ruanyifeng.com/blog/2016/04/cors.html)

### 2022-3-21

[跨域请求如何携带 cookie?](https://juejin.cn/post/7066420545327218725)

分为两步处理，处理跨域，响应头设置 `Access-Control-Allow-Origin: https://simple.com` 允许特定的域名发送跨域请求；处理携带 cookie，响应头设置`Access-Control-Allow-Credentials：true` 允许携带身份（Cookie，authorization）。

### 2022-9-19

[嗨，你真的懂 this 吗？](https://juejin.cn/post/6844903805587619854)
[JS 的 this 指向](https://juejin.cn/post/6844903805587619854)
[图解 javascript 的 this 指向](https://juejin.cn/post/6844903941021384711)
[nvm](https://www.jianshu.com/p/cb5265434d91)
[this,call,bind,apply](https://juejin.cn/post/6844903496253177863)
