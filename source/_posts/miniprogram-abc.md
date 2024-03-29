---
title: 从入门到上线一个天气小程序
date: 2018-10-31 14:36:53
tags: 小程序
categories: 小程序
---

# 前言

学习了一段时间小程序，大致过了两遍开发文档，抽空做个自己的天气预报小程序，全当是练手，在这记录下。小程序开发的安装、注册和接入等流程就不罗列了，在[小程序接入指南](https://developers.weixin.qq.com/miniprogram/introduction/index.html)已经写得很清楚了，以下只对开发过程常用到得一些概念进行简单梳理，类比 `Vue` 加强记忆，最后选取个人项目天气小程序中要注意的几点来说明。

![minWeather](/gb/miniprogram-abc/mina-weather1.gif)

欢迎扫码体验

![minWeather](/gb/miniprogram-abc/mina-qrcode.jpg)

源码请戳[这里](https://github.com/wuwhs/minxiuWeather)，欢迎start~

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

下面针对小程序的数据绑定、列表渲染、条件渲染、模板、事件和应用跟 `Vue` 类比加深记忆。

## 数据绑定

`WXML` 中的动态数据均来自对应 `Page`（或 `Component`） 的 `data`，而在 `Vue`中来自当前组件。

小程序和Vue的数据绑定都使用 `Mustache` 语法，双括号将变量包起来。区别是 `Vue` 中使用`Mustache` 语法不能作用在 `HTML` 特性上

```html
<div v-bind:id="'list-' + id">{{msg}}</div>
```

而小程序作用在标签属性上

```html
<view id="item-{{id}}">{{msg}}</view>
```

## 列表渲染

`Vue` 中使用 `v-for` 指令根据一组数组的选项列表，也可以通过一个对象的属性迭代进行渲染，使用 `(item, index) in items` 或 `(item, index) of items` 形式特殊语法。

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

`Vue` 中使用`v-if`、`v-else-if`、`v-else`指令条件渲染，多个元素使用`<template>`包裹，而小程序中使用`wx:if`、`wx:elseif`、`wx:else`来条件渲染，多个组件标签使用`<block>`包裹。

## 模板

在 `Vue` 中定义模板一种方式是在 `<script>` 元素中，带上 `text/x-template` 的类型，然后通过一个id将模板引用过去。

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

在 `Vue` 中，用 `v-on` 指令监听 `DOM` 事件，并在触发时运行一些 `JavaScript` 代码，对于阻止事件冒泡、事件捕获分别提供事件修饰符`.stop`和`.capture`的形式

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

在 `Vue` 中引用用于组件的服用引入

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

和 `Vue` 一样，在构造实例属性上都有一个 `data` 对象，作为初始数据。

`Vue` 中修改 `data` 中某个属性值直接赋值即可，而在小程序中需要使用 `Page` 的实例方法 `setData(Object data, Function callback)` 才起作用，不需要在 `this.data` 中预先定义，单次设置数据大小不得超过1024kb。

支持以数据路径的形式改变数组某项或对象某项属性：

```js
// 对于对象或数组字段，可以直接修改一个其下的子字段，这样做通常比修改整个对象或数组更好
  this.setData({
    'array[0].text': 'changed data'
  })
```

## 生命周期回调函数

每个 `Vue` 实例在被创建时都要经过一系列的初始化过程，每一个阶段都有相应钩子函数被调用，`created` `mounted` `updated` `destroyed`。

![vueLifecycle](/gb/miniprogram-abc/vue-lifecycle.jpg)

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

## 父组件传值到子组件

在 `Vue` 中，父组件定义一些自定义特性，子组件通过 `props` 实例属性获取，也可通过 `wm.$refs` 可以获取子组件获取子组件所有属性和方法。

```html
<!-- 父组件 -->
<blog-post title="A title"></blog-post>
```

```js
<!-- 子组件 -->
<h3>{{ postTitle }}</h3>
export default {
  props: ['postTitle']
}
```

同样的，在小程序中，父组件定义一些特性，子组件通过 `properties` 实例属性获取，不同的是，提供了 `observer` 回调函数，可以监听传递值的变化。父组件还可以通过 `this.selectComponent` 方法获取子组件实例对象，这样就可以直接访问组件的任意数据和方法。

```js
Component({
  properties: {
    myProperty: { // 属性名
      type: String, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: '', // 属性初始值（可选），如果未指定则会根据类型选择一个
      observer(newVal, oldVal, changedPath) {
        // 属性被改变时执行的函数（可选），也可以写成在methods段中定义的方法名字符串, 如：'_propertyChange'
        // 通常 newVal 就是新设置的数据， oldVal 是旧数据
      }
    },
    myProperty2: String // 简化的定义方式
  }
})
```

## 子组件传值到父组件

在Vue 中通过自定义事件系统触发 `vm.$emit( eventName, […args] )` 回调传参实现。

```html
<!-- 子组件 -->
<button v-on:click="$emit('enlarge-text')">
  Enlarge text
</button>
```

```html
<!-- 父组件 -->
<blog-post
  ...
  v-on:enlarge-text="postFontSize += 0.1"
></blog-post>
```

同样的，在小程序中也是通过触发自定义事件 `triggerEvent` 回调传参形式实现子组件向父组件传递数据。

```html
<!-- page.wxml -->
<my-component bindcustomevent="pageEventListener2"></my-component>
```

```js
// my-component.js
Component({
  methods: {
    onTap () {
      this.triggerEvent('customevent', {})
    }
  }
})
```

# 天气预报小程序

说了很多小程序开发的基础准备，下面就结合个人实际练手项目——天气预报小程序简单说明。

## 物料准备

从需求结果导向，天气程序首先要能获取到当前所在地天气状况，再次可以自由选择某地，知道其天气状况。这样就需要有获取天气的API和搜索地址API。

- 搜集了很多免费天气API，最终选中[和风天气](https://www.heweather.com/)，原因很简单，它提供认证个人开发者申请，拥有更多使用功能和调用次数。
- 地址搜索和城市选择能力选用微信自家产品[腾讯位置服务微信小程序JavaScript SDK](https://lbs.qq.com/qqmap_wx_jssdk/index.html)。

开发前物料（服务能力）准备好了，接下来就是撸小程序了！

## 首页获取用户信息、布局相关

### 布局

微信小程序的样式已支持大部分 `CSS` 特性，不用再去考虑太多传统浏览器兼容性问题了，布局方便直接选用 `flex` 布局。
比如：

```css
/**app.wxss**/
page {
  background: #f6f6f6;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}
```

### 获取用户信息

首页首次加载获取用户，通常会弹窗提示是否允许获取用户信息，用户点击允许获取授权，才能成功获取用户信息，展示用户名和用户头像等，小程序为了优化用户体验，使用 `wx.getUserInfo` 接口直接弹出授权框的开发方式将逐步不再支持。目前开发环境不弹窗了，正式版暂不受影响。提倡使用 `button` 组件，指定 `open-type` 为 `getUserInfo`类型，用户主动点击后才弹窗。
天气小程序获取用户头像和用户名采用的是另一种方式，使用`open-data` 可以直接获取用户基础信息，不用弹窗提示。

```html
  <!-- 用户信息 -->
  <view class="userinfo">
    <open-data type="userAvatarUrl" class="userinfo-avatar"/>
    <text class="userinfo-nickname">{{greetings}}，</text>
    <open-data type="userNickName"/>
</view>
```

## 城市拼音首字母锚点

> 上下滑动城市列表，当滑过当前可视区的城市拼音首字母，右侧字母索引栏对应的字母也会切换到高亮显示。

要满足当前的这个场景需求，首先要为城市列表的拼音首字母标题添加标志（`id`），当`<scroll-view>`滚动触发时获取各个标志位距离视窗顶部的位置，此处用到小程序 `WXML` 节点API `NodesRef.boundingClientRect(function callback)` 获取布局位置，类似于 `DOM` 的 `getBoundingClientRect`。距离大小为最小负数的标志位是当前刚滑过的，右侧索引栏对应字母应当高亮。

```html
<!-- searchGeo.wxml -->
<scroll-view bindscroll="scroll" scroll-y="{{true}}">
  <!-- 城市列表... -->
</scroll-view>
```

```js
Page({
  // ...
  // 城市列表滚动
  scroll () {
    wx.createSelectorQuery().selectAll('.city-list-title')
      .boundingClientRect((rects) => {
        let index = rects.findIndex((item) => {
          return item.top >= 0
        })
        if (index === -1) {
          index = rects.length
        }
        this.setIndex(index - 1)
      }).exec()
  },
  // ...

```

> 点击右侧字母索引栏的字母，城市列表自动滑动使得对应字母标题可视

满足这个需求场景，可以利用 `<scroll-view>` 组件的 `scroll-into-view` 属性，由于已有拼音首字母标题添加标志（`id`），只需将当前点击的字母对应的元素`id`滚动到可视即可。需要注意：

- 频繁 `setData` 造成性能问题，在这里过滤重复赋值；
- 由于设置了 `<scroll-view>` 为动画滚动效果，滚动到标志元素位置需要时间，途中可能会经过其它标志元素，不能立即设置索引焦点，要有一定延时（还没找到其它好解决方案，暂时这样）

```js
// 点击索引条
  tapIndexItem (event) {
    let id = event.currentTarget.dataset.item
    this.setData({
      scrollIntoViewId: `title_${id === '#' ? 0 : id}`
    })

    // 延时设置索引条焦点
    setTimeout(() => {
      this.setData({
        barIndex: this.data.indexList.findIndex((item) => item === id)
      })
    }, 500)
  },
```

![minWeather](/gb/miniprogram-abc/mina-weather2.gif)

## 频繁触发节流处理

频繁输入，或者频繁滚动，回调触发会造成性能问题，而其接口也有限定调用频率，这样就需要做节流处理。节流是再频繁触发的情况下，在大于一定时间间隔才允许触发。

```js
// 节流
const throttle = function(fn, delay) {
  let lastTime = 0
  return function () {
    let nowTime = Date.now()
    if (nowTime - lastTime > delay || !lastTime) {
      fn.apply(this, arguments)
      lastTime = nowTime
    }
  }
}
```

具体对一些场景，比如腾讯位置服务提供的关键字搜索地址，就限定5次/key/秒，很容易就超了，可以做节流处理

```js
Page({
  // ...
  // 输入搜索关键字
  input: util.throttle(function () {
    let val = arguments[0].detail.value
    if (val === '') {
      this.setData({
        suggList: []
      })
      this.changeSearchCls()
      return false
    }

    api.getSuggestion({
      keyword: val
    })
      .then((res) => {
        this.setData({
          suggList: res
        })
        this.changeSearchCls()
      })
      .catch((err) => {
        console.error(err)
      })
  }, 500),
  // ...
})

```

![minWeather](/gb/miniprogram-abc/mina-weather3.gif)

对于上面城市列表滚动，获取标志元素位置也应用节流处理。

# 总结

小程序的基本入门学习门槛不高，小程序的设计应该借鉴了很多现在流行的框架，如果有 `React` 或 `Vue` 的基础会有很多似曾相识的感觉，当然，在深入的探索过程还有很多“坑”要跨越，本文只是简单的梳理，具体问题还能多看[文档](https://developers.weixin.qq.com/miniprogram/dev/index.html)和[小程序社区](https://developers.weixin.qq.com/)，还有什么错误欢迎指正哈，完~