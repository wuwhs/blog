---
title: 小程序入门
date: 2018-10-31 14:36:53
tags: 小程序
categories: 小程序
---

学习一门新程序语言，

小程序开发的安装、注册和接入等流程就不罗列了，在[小程序接入指南](https://developers.weixin.qq.com/miniprogram/introduction/index.html)已经写得很清楚了，以下只对开发过程常用到得一些概念进行简单梳理

# 初始化项目目录结构

安装好[开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)，填好申请到的`AppID`，选好项目目录，初始化一个普通小程序目录结构，得到：

```js
--|-- pages
    |-- index
      |-- index.js // 首页js文件
      |-- index.json // 首页json文件
      |-- index.wxml // 首页wxml文件
      |-- index.wxss // 首页wxss文件
    |-- logs
      |-- logs.js // 日志页js文件
      |-- logs.json // 日志页json文件
      |-- logs.wxml // 日志页wxml文件
      |-- logs.wxss // 日志页wxss文件
  |-- utils
    |-- util.js // 小程序公用方法
  |-- app.js // 小程序逻辑
  |-- app.json // 小程序公共配置
  |-- app.wxss // 小程序公共样式表
  |-- project.config.json // 小程序项目配置
```

可以看到，项目文件主要分为`.json`、`.wxml`，`.wxss`和`.js`类型，每一个页面由四个文件组成，为了方便开发者减少配置，描述页面的四个文件必须具有相同的路径与文件名。

# JSON配置

## 小程序配置 app.json

[app.json配置](https://developers.weixin.qq.com/miniprogram/dev/framework/config.html)是当前小程序的全局配置，包括小程序的所有页面路径、界面表现、网络超时时间、底部 tab 等。

## 工具配置 project.config.json

[工具配置](https://developers.weixin.qq.com/miniprogram/dev/devtools/projectconfig.html)在小程序的根目录，对工具做的任何配置都会写入这个文件，使得只要载入同一个项目代码包，开发则工具会自动恢复当时你开发项目时的个性设置。

## 页面配置 page.json

[页面配置](https://developers.weixin.qq.com/miniprogram/dev/framework/config.html#%E9%A1%B5%E9%9D%A2%E9%85%8D%E7%BD%AE) 是小程序页面相关的配置，让开发者可以独立定义每个页面的一些属性，比如顶部颜色，是否下拉等。

# WXML 模板

[`WXML`](https://developers.weixin.qq.com/miniprogram/dev/framework/view/wxml/index.html) 充当类似 `HTML` 的角色，有标签，有属性，但是还是有些区别：

1. 标签名不一样。
  写 `HTML` 常用标签 `<div>`，`<p>`，`<span>`等，而小程序中标签更像是封装好的组件，比如`<scroll-view>`, `<swiper>`, `<map>`，提供相应的基础能力给开发者使用。

2. 提供 `wx:if`，&#123;&#123;&#125;&#125;等模板语法。
  小程序将渲染和逻辑分离，类似于`React`，`Vue`的`MVVM`开发模式，而不是让 `JS` 操作 `DOM`。

下面针对小程序的数据绑定、列表渲染、条件渲染、模板、事件和应用跟Vue类比加深记忆。

## 数据绑定

`WXML` 中的动态数据均来自对应 `Page`（或 `Component`） 的 `data`，而在Vue中来自当前组件。

小程序和Vue的数据绑定都使用 `Mustache` 语法，双括号将变量包起来。区别是Vue中使用`Mustache` 语法不能作用在 `HTML` 特性上

```html
<div v-bind:id="'list-' + id">{{msg}}</div>
```

而小程序作用在标签属性上

```html
<view id="item-{{id}}">{{msg}}</view>
```

## 列表渲染

Vue中使用 `v-for` 指令根据一组数组的选项列表，也可以通过一个对象的属性迭代进行渲染，使用 `(item, index) in items` 或 `(item, index) of items` 形式特殊语法。

```html
<ul>
  <li v-for="(item, index) in items">
    {{ index }} - {{ item.message }}
  </li>
</ul>
```

渲染包含多个元素，利用 `<template>`元素

```html
<ul>
  <template v-for="(item, index) in items">
    <li>{{ index }} - {{ item.message }}</li>
    <li class="divider" role="presentation"></li>
  </template>
</ul>
```

而在小程序中使用 `wx:for` 控制属性绑定一个数组（其实对象也可以），默认数组的当前项的下标变量为 `index` ，当前项变量为 `item`。

```html
<view wx:for="{{items}}"> {{index}} - {{item.message}} </view>
```

也可以用 `wx:for-item` 指定数组当前元素的变量名，用 `wx:for-index` 指定数组当前下标的变量名。

```html
<view wx:for="{{items}}" wx:for-index="idx" wx:for-item="itemName">
  {{idx}}: {{itemName.message}}
</view>
```

渲染一个包含多节点的结构块，利用 `<block>` 标签

```html
<block wx:for="{{items}}">
  <view> {{index}} - {{item.message}} </view>
  <view class="divider" role="presentation"></view>
</block>
```

## 条件渲染

Vue 中使用`v-if`、`v-else-if`、`v-else`指令条件渲染，多个元素使用`<template>`包裹，而小程序中使用`wx:if`、`wx:elseif`、`wx:else`来条件渲染，多个组件标签使用`<block>`包裹。

## 模板

在Vue中定义模板一种方式是在 `<script>` 元素中，带上 `text/x-template` 的类型，然后通过一个id将模板引用过去。

定义模板：

```html
<script type="text/x-template" id="hello-world-template">
  <p>Hello hello hello</p>
  <p>{{msg}}</p>
</script>
```

使用模板：

```js
Vue.component('hello-world', {
  template: '#hello-world-template',
  data () {
    return {
      msg: 'this is a template'
    }
  }
})
```

而在小程序中，在 `<template>` 中使用 `name` 属性作为模板名称，使用 `is` 属性声明需要使用的模板，然后将模板所需的 `data` 传入。

定义模板：

```html
<template name="hello-world-template">
  <view>Hello hello hello</view>
  <view>{{msg}}</view>
</template>
```

使用模板：

```html
<template is="hello-world-template" data="{{...item}}"></template>
```

```js
Page({
  data: {
    item: {
      msg: 'this is a template'
    }
  }
})
```

## 事件

在Vue 中，用 `v-on` 指令监听 `DOM` 事件，并在触发时运行一些 `JavaScript` 代码，对于阻止事件冒泡、事件捕获分别提供事件修饰符`.stop`和`.capture`的形式

```html
<!-- 阻止单击事件继续传播 -->
<a v-on:click.stop="doThis"></a>
<!-- 添加事件监听器时使用事件捕获模式 -->
<!-- 即元素自身触发的事件先在此处理，然后才交由内部元素进行处理 -->
<div v-on:click.capture="doThis">...</div>
```

而在小程序中，绑定事件以 `key`，`value` 的形式，`key` 以 `bind` 或 `catch` 开头，然后跟上事件的类型，如 `bindtap`、`catchtouchstart`，也可紧跟一个冒号形式，如 `bind:tap`、`catch:touchstart`。`bind` 事件绑定不会阻止冒泡事件向上冒泡，`catch` 事件绑定可以阻止冒泡事件向上冒泡。

```html
<!-- 单击事件冒泡继续传播 -->
<view bindtap="doThis">bindtap</view>
<!-- 阻止单击事件冒泡继续传播 -->
<view catchtap="doThis">bindtap</view>
```

采用 `capture-bind`、`capture-catch` 分别捕获事件和中断捕获并取消冒泡。

```html
<!-- 捕获单击事件继续传播 -->
<view capture-bind:tap="doThis">bindtap</view>
<!-- 捕获单击事件阻止继续传播，并且阻止冒泡 -->
<view capture-catch="doThis">bindtap</view>
```

## 引用

在 Vue 中引用用于组件的服用引入

```js
import ComponentA from './ComponentA'
import ComponentC from './ComponentC'
```

在小程序中，`WXML` 提供两种引用方式 `import` 和 `include`。

在 item.wxml 中定义了一个叫item的template：

```html
<!-- item.wxml -->
<template name="item">
  <text>{{text}}</text>
</template>
```

在 index.wxml 中引用了 item.wxml，就可以使用item模板：

```html
<import src="item.wxml" /> <template is="item" data="{{text: 'forbar'}}" />
```

`include` 可以将目标文件除了 `<template>` `<wxs>` 外整个代码引入:

```html
<!-- index.wxml -->
<include src="header.wxml" /> <view> body </view> <include src="footer.wxml" />
<!-- header.wxml -->
<view> header </view>
<!-- footer.wxml -->
<view> footer </view>
```

# WXSS 样式

WXSS(WeiXin Style Sheets) 具有 CSS 大部分的特性，也做了一些扩充和修改。

## 尺寸单位rpx

支持新的尺寸单位 `rpx`，根据屏幕宽度自适应，规定屏幕宽为750rpx，免去开发换算的烦恼（采用浮点计算，和预期结果会有点偏差）。

设备 | rpx换算px（屏宽/750） | px换算rpx（750/屏宽）
-- | -- | --
iPhone5 | 1rpx = 0.42px | 1px = 2.34rpx
iPhone6 | 1rpx = 0.5px | 1px = 2rpx
iPhone6 Plus | 1rpx = 0.552px | 1px = 1.81rpx

iPhone6上，换算相对最简单，1rpx = 0.5px = 1物理像素，建议设计师以 iPhone6 为设计稿。

## 样式导入

使用 `@import` 语句导入外联样式表，注意路径为相对路径。

### 全局样式与局部样式

`app.wxss`中的样式为全局样式，在 `Page` （或 `Component`） 的 `wxss`文件中定义的样式为局部样式，自作用在对应页面，并会覆盖 `app.wxss` 中相同选择器。

# 页面注册

小程序是以 `Page(Object)` 构造页面独立环境，app加载后，初始化某个页面，类似于 Vue 的实例化过程，有自己的初始数据、生命周期和事件处理回调函数。

## 初始化数据

和Vue一样，在构造实例属性上都有一个 `data` 对象，作为初始数据。

Vue 中修改 `data` 中某个属性值直接赋值即可，而在小程序中需要使用 `Page` 的实例方法 `setData(Object data, Function callback)` 才起作用，不需要在 `this.data` 中预先定义，单次设置数据大小不得超过1024kb。

支持以数据路径的形式改变数组某项或对象某项属性：

```js
// 对于对象或数组字段，可以直接修改一个其下的子字段，这样做通常比修改整个对象或数组更好
  this.setData({
    'array[0].text': 'changed data'
  })
```

## 生命周期回调函数

每个 Vue 实例在被创建时都要经过一系列的初始化过程，每一个阶段都有相应钩子函数被调用，`created` `mounted` `updated` `destroyed`。

![vueLifecycle](/gb/miniprogram-abc/vue-lifecycle.png.png)

对于小程序生命周期，分为 `Page` 的生命周期和 `Component` 的生命周期。

`Page` 的生命周期回调函数有：

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

`Component` 的生命周期有：

- `created` 在组件实例刚刚被创建时执行
- `attached` 在组件实例进入页面节点树时执行
- `ready` 在组件在视图层布局完成后执行
- `moved` 在组件实例被移动到节点树另一个位置时执行
- `detached` 在组件实例被从页面节点树移除时执行
- `error` 每当组件方法抛出错误时执行
- `show` 组件所在的页面被展示时执行
- `hide` 组件所在的页面被隐藏时执行
- `resize` 组件所在的页面尺寸变化时执行

![vueLifecycle](/gb/miniprogram-abc/mina-lifecycle.png)

# wxs

`WXS（WeiXin Script）`是小程序的一套脚本语言，结合 `WXML`，可以构建出页面的结构。`wxs` 的运行环境和其他 `JavaScript` 代码是隔离的，`wxs` 中不能调用其他 `JavaScript` 文件中定义的函数，也不能调用小程序提供的API。从语法上看，大部分和 `JavaScript`是一样的，以下列出一些注意点和差别：

- `<wxs>` 模块只能在定义模块的 `WXML` 文件中被访问。使用 `<include>` 或 `<import>` 时， `<wxs>` 模块不会被引用到对应的 `WXML` 文件中；
- `<template>` 标签中，只能使用定义该`<template>` 的 `WXML` 文件中定义的 `<wxs>` 模块；
- `Date`对象，需要使用 `getDate` 函数，返回一个当前时间的对象；
- `RegExp`对象，使用 `getRegExp` 函数；
- 使用 `constructor` 属性判断数据类型。

# 组件间通信

小程序组件间通信和Vue 组件间通信很相似





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

页面路由

- 打开新页面， `wx.navigateTo` 或 `<navigator open-type="navigateTo"/>`
- 页面重定向， `wx.redirectTo` 或 `<navigator open-type="redirectTo"/>`
- 页面返回，`wx.navigateBack` 或 `<navigator open-type="navigateBack"/>`
- Tab 切换，`wx.switchTap` 或 `<navigator open-type="switchTab"/>`
- 重启动， `wx.reLaunch` 或 `<navigator open-type="reLaunch"/>`

文件作用域

JavaScript 文件中声明的变量和函数只在该文件中有效；不同文件中可以声明相同的名字的变量和函数，互不影响。

模块化

可以将一些公共代码抽离成一个单独的 js 文件，作为一个模块。模块只有通过 `module.exports` 或者 `exports` 才能对外暴露接口。

> `exports` 是 `module.exports` 的一个引用

自定义组件

类似于也页面，由`wxml`、`wxss`、`js`和`json`4个文件组成，只不过要在`json`文件中声明（`component: true`）

> 组件的生命周期：`created`、`attached`、`ready`、`moved`、`detached`，可以放在组件属性`lifetimes`下，也可以放在`methods`下，也可以组件根下。

组件间通讯

Behavior

类似其它语言中的`mixin`、`traits`
