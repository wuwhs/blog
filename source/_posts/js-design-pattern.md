---
title: js-design-pattern
date: 2021-03-27 17:03:04
tags: [javascript]
---

### 单例（Singleton）模式

基于单独的实例，来管理某一个模块中的内容，实现模块之间的独立划分，但是，也可以实现模块之间方法的相互调用。

早期的模块化编程
AMD -> require.js
CMD/CommonJS -> sea.js & Node
ES6 Module

```js
// 程序员A开发的模块
var AModule = (function () {
  var data = []
  function bindHTML() {
    //...
  }
  function change() {
    //...
  }

  return {
    bindHTML: bindHTML
  }
})()

// 程序员B开发的模块
var BModule = (function () {
  var data = []
  function bindHTML() {
    //...
  }

  return {
    bindHTML: bindHTML
  }
})()
```

```js
var serchModule = function () {
  var body = document.body
  function queryData() {}
  function bindHtml() {}
  function handle() {}
  return {
    init: function () {
      queryData()
      bindHtml()
      handle()
    }
  }
}
```

### 代理模式

### 装饰模式

### 观察者模式

### 发布-订阅者模式

### 策略模式
