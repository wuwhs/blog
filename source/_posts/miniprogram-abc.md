---
title: 小程序入门
date: 2018-10-31 14:36:53
tags: 小程序
categories: 小程序
---

小程序目录结构

```js
--|-- pages 页面
  |-- resources 资源
  |-- utils 小程序公用方法
  |-- app.js 小程序逻辑
  |-- app.json 小程序公共配置
  |-- app.wxss 小程序公共样式表
  |-- project.config.json 小程序项目配置

> 每一个页面由四个文件组成，分别是`js`、`wxml`、`json`、`wxss`，为了方便开发者减少配置，描述页面的四个文件必须具有相同的路径与文件名

```

`App(Object)`初始化注册一个小程序，`Object`参数指定小程序的生命周期回调。
> `App()`必须在`app.js`中调用，有且只能调用一次

--生命周期--

- `onLaunch` 小程序初始化完成
- `onShow` 小程序启动，或从后台进入前台显示
- `onHide` 小程序从前台进入后台时
- `onError` 小程序发生脚本错误，或者api调用失败时触发，会带上错误信息
- `onPageNotFound` 小程序要打开的页面不存在时触发，会带上页面信息回调该函数

`getApp()`全局获取小程序`App`实例

`Page(Object)` 函数用来注册一个页面。

`Object`指定页面的初始数据、生命周期、事件处理函数等

- `data` 页面初始数据
- `onLoad` 生命周期回调-监听页面加载
- `onShow` 生命周期回调-监听页面显示
- `onReady` 生命周期回调-监听页面初次渲染完成
- `onHide` 生命周期回调-监听页面隐藏
- `onUnload` 生命周期回调-监听页面卸载
- `onPullDownRefresh`监听用户下拉动作
- `onReachBotton` 页面上拉触底事件的处理函数
- `onShareAppMessage` 用户点击右上角转发
- `onPageScroll` 页面滚动触发事件的处理函数
- `onTabItemTap` 当前是 `tab` 页时，点击 `tab` 触发
- 其它 可以添加任意函数和数据

注意点：

1. `onShareAppMessage` 用户点击右上角转发或者点击页面转发按钮（ `<button>` 组件 `open-type="share"` ），只有定义了此事件处理函数，右上角菜单才会显示“转发”按钮
2. `Page`对象原型上的 `setData` 函数用于将数据从逻辑层发送到视图层（异步），同时改变对应的 `this.data` 的值（同步）。
3. `Page.prototype.setData(Object data, Function callback)`，`data`以`key: value`的形式给出。妻子 `key` 可以以数据路径的形式给出，支持改变数组中的某一项或对象的某个属性，如 `arr[2].msg`，并且不需要在 `this.data` 中预先定义。
4. 直接修改 `this.data` 而不调用 `this.setData` 是无法改变页面的状态的，还会造成数据不一致。

页面路由https://developers.weixin.qq.com/miniprogram/dev/component/navigator.html