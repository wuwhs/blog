---
title: 小程序bug集合
date: 2019-01-18 17:00:11
tags: [小程序]
categories: 小程序
---

1. 本地目录下的背景图加载不出来

使用线上图片链接，或者压缩成base64，常用做法可以用云存储功能

2. 区域滚动，`<view>` 加滚动属性 overflow: auto; 在真机上滑动卡顿

区域滚动使用 `<scroll-view>` 组件

3. `<scroll-view>` 分页加载，上拉滚动到底部，没有触发scrolltolower 事件

需要设置 `<scroll-view>` 的 height 属性

4. 小程序底部 `tabBar` 图标模糊

icon 大小限制为 40kb，建议尺寸为 81px * 81px

5. `WXML` 中数据绑定 `Mustache` 语法（双括号）不可执行函数

双括号内不能执行任何方法，只能做简单的试着运算和 `Boolen` 判断，也可以用 `wxs` 处理，比如 `{ {m.parse(item)} }`

6. `wx.navigateBack()` 无法向回退页面传参

小程序的几个导航 `api` 都可以通过 `url` 给对应页面传参。而 `wx.navigateBack(delta)` 只接受一个 `delta` 参数，但是有时候确实有向回退页面传参，这时候只能通过 `localstorage` 或 `redux` 来处理。

7. 不能正常加载字体文件

基础库 2.1.0 开始支持，字体链接必须是同源下的，或开启了 `cors` 支持，小程序的域名是 `servicewechat.com`

8. 在真机上，`Canvas` 组件不随 `<scroll-view>` 一起滚动

`Canvas` 渲染完成后，wx.canvasToTempFilePath 获取地址生成图片，用图片代替。或者在 `<scroll-view>` 滚动时触发 bindscroll 事件同步调整 Canvas 位置跟随滚动。

9. 为什么 `map` 组件总是在最上层

`map`、`canvas`、`video`、`textarea` 是由客户端创建的原生组件，原生组件的层级是最高的，所以页面中的其他组件无论设置 `z-index` 为多少，都无法盖在原生组件上。 原生组件暂时还无法放在 `scroll-view` 上，也无法对原生组件设置 `css` 动画。