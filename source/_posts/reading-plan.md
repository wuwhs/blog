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

1. 聊天消息确认机制

```js
// 观察者模式
// 某个事件拥有唯一标识作为键名，与之绑定的事件队列作为值
// {
//   [key1]: [fn1a, fn1b, fn1c],
//   [key2]: [fn2a, fn2b, fn2c],
// }

class Observer {
  constructor () {
    this.data = {}
  }
  // 监听
  listen (key, callback) {
    if (!this.data.hasOwnProperty(key)) {
      this.data[key] = []
    }
    this.data[key].push(callback)
  }
  // 触发
  trigger (...args) {
    const key = args[0]
    const callbacks = this.data[key]
    if (!callbacks || !Array.isArray(callbacks) || !callbacks.length) return

    callbacks.forEach((callback) => callback.apply(this, args.slice(1)))
  }
  // 删除
  remove (key, callback) {
    const callbacks = this.data[key]
    if (!callbacks) return

    if (!callback) {
      callbacks.length = 0
    } else {
      const index = callbacks.findIndex((value) = value === callback)
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

[手写async await的最简实现（20行）](https://juejin.im/post/5e79e841f265da5726612b6e)