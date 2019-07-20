---
title: 如何优雅监听容器高度变化
date: 2019-07-11 18:22:34
tags: [javascript, html]
---

# 如何优雅监听容器高度变化

啦啦啦

## 前言

老鸟：怎样去监听 `DOM` 元素的高度变化呢？
菜鸟：哈哈哈哈哈，这都不知道哦，用 `onresize` 事件鸭！
老鸟扶了扶眼睛，空气安静几秒钟，菜鸟才晃过神来。对鸭，普通 `DOM` 元素没有 `onresize` 事件，只有在 `window` 对象下有此事件，该死，又双叒叕糗大了。

哈哈哈哈，以上纯属虚构，不过在最近项目中还真遇到过对容器监听高（宽）变化：在使用 `iscroll` 或 `better-scroll` 滚动插件，如果容器内部元素有高度变化要去及时更新外部包裹容器，即调用 `refresh()` 方法。不然就会造成滚动误差（滚动不到底部或滚动脱离底部）。

可能我们一般处理思路：

- 在每次 `DOM` 节点有更新（删除或插入）后就去调用 `refresh()`，更新外部容器。
- 对异步资源（如图片）加载，使用`onload` 监听每次加载完成，再去调用 `refresh()`，更新外部容器。

这样我们会发现，如果容器内部元素比较复杂，调用会越来越繁琐，甚至还要考虑到用户使用的每一个操作都可能导致内部元素宽高变化，进而要去调整外部容器，调用 `refresh()`。

实际上，不管是对元素的哪种操作，都会造成它的属性、子孙节点、文本节点发生了变化，如果能能监听得到这种变化，这时只需比较容器宽高变化，即可实现对容器宽高的监听，而无需关系它外部行为。`DOM3 Events` 规范为我们提供了 [`MutationObserver`](https://developer.mozilla.org/zh-CN/docs/Web/API/MutationObserver) 接口监视对 `DOM` 树所做更改的能力。

## MutationObserver

`Mutation Observer API` 用来监视 `DOM` 变动。`DOM` 的任何变动，比如节点的增减、属性的变动、文本内容的变动，这个 `API` 都可以得到通知。

### MutationObserver 特点

`DOM` 发生变动都会触发 `Mutation Observer` 事件。但是，它跟事件还是有不用点：事件是同步触发，`DOM` 变化立即触发相应事件；`Mutation Observer` 是异步触发，`DOM` 变化不会马上触发，而是等当前所有 `DOM` 操作都结束后才触发。总的来说，特点如下：

- 它等待所有脚本任务完成后，才会运行（即异步触发方式）。
- 它把 `DOM` 变动记录封装成一个数组进行处理，而不是一条条个别处理 `DOM` 变动。
- 它既可以观察 `DOM` 的所有类型变动，也可以指定只观察某一类变动。

### MutationObserver 构造函数

`MutationObserver` 构造函数的实例传的是一个回调函数，该函数接受两个参数，第一个是变动的数组，第二个是观察器是实例。

```js
var observer = new MutationObserver(function (mutations, observer){
  mutations.forEach(function (mutaion) {
    console.log(mutation);
  })
})
```

### MutationObserver 实例的 observe() 方法
