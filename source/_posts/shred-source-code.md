---
title: 手撕源码
date: 2021-03-25 16:16:01
tags: [面试, javascript]
---

### 实现 call()、apply、bind()

```js
// call
Function.prototype.call = function call(context, ...args) {
  const self = this
  const key = Symbol('key')
  // null undefined
  context == null ? (context = window) : null
  // string number
  !/^(object|function)$/i.test(typeof context) ? (context = Object(context)) : null

  // array function object
  context[key] = self
  const result = context[key](...args)
  delete context[key]
  return result
}

// bind
Function.prototype.bind = function bind(context, ...args) {
  const self = this
  return function proxy() {
    self.apply(context, args)
  }
}
```
