---
title: H5键盘兼容处理
date: 2019-03-19 11:14:42
tags: [javascript, html]
categories: javascript
---

# 前言

在 `H5` 项目中，我们经常会遇到页面中存在单个甚至多个 `input/textarea` 输入框与底部固定元素布局情况。在 `input/textarea` 输入框获取焦点时，会自动触发键盘弹起，而键盘弹起在 `IOS` 与 `Android` 的 `webview` 中表现并不一致，同时当我们主动触发键盘收起时同样存在差异化。而无论如何，我们希望功能流畅的同时，尽量保持用户体验一致性。

# 键盘弹起的不同表现

## IOS 键盘弹起表现

`IOS` 的键盘处在窗口的最上层，当键盘弹起时， `webview` 的高度 `height` 并没有改变，只是 `scrollTop` 发生变化，页面可以滚动。且页面可以滚动的最大限度为弹出键盘的高度，而只有键盘弹起时页面恰好也滚动到最底部时， `scrollTop` 的变化值为键盘的高度，其它情况下则无法获取。这就导致在 `IOS` 情况下难以获取键盘的真实高度。

## Android 键盘弹起表现

`webview` 中流出空间，该空间小于等于键盘空间，变化的高度差会随着布局而不同，有人认为 `键盘高度 + 页面高度 = 原页面高度` 是错误的误导，只有在某种很巧合的布局情况下才可套用。

# 键盘收起的不同表现

## IOS 键盘收起表现

触发键盘上的按钮收起键盘或者输入框以外的页面区域时，输入框失去焦点，因此会触发输入框的 `blur` 事件。

## Android 键盘收起表现

触发键盘上的按钮收起键盘时，输入框并不会失去焦点，因此不会触发页面的 `blur` 事件；触发输入框以外的区域时，输入框失去焦点，触发输入框的 `blur` 事件。

## 监听键盘弹起和收起

在 `H5` 中目前没有接口可以直接监听键盘事件，但我们可以分析键盘弹起和收起的触发过程及表现形式，来判断键盘是弹出还是收起状态。

- 键盘弹起。输入框获取焦点时会自动触发键盘的弹起动作，因此，我们可以监听输入框 `focus` 事件，在里面实现键盘弹出后所需的页面逻辑。在 `IOS` 及 `Andriod` 中表现一致。
- 键盘收起。当触发页面其他区域收起键盘，我们可以监听输入框的 `blur` 事件，在里面实现键盘收起后所需的页面逻辑。而在通过键盘按钮收起键盘时，在 `IOS` 和 `Andriod` 端存在差异：
  - 在 `IOS` 上触发了输入框 `blur` 事件，仍然通过该办法监听
  - 在 `Andriod` 上不会触发 `blur` 事件，当时 `webview` 高度会变化，可以通过监听 `webview height` 的变化判断键盘是否收起。

下面举例说明，其中页面中含有一个输入框：

```html
<div class="txd">
  Welcome to TXD!
</div>
<div class="input">
  <input id="input" type="tel" />
</div>
```

`IOS` 和 `Andriod` 键盘弹起

```js
const $input = document.getElementById('input')
$input.addEventListener('focus', () => {
  // 处理键盘弹出后所需页面逻辑
}, false)
```

`IOS` 键盘收起：

```js
const $input = document.getElementById('input')
$input.addEventListener('blur', () => {
  // 处理键盘收起后所需页面逻辑
}, false)
```

`Andriod` 键盘弹出和收起：

```js
const originHeight = document.documentElement.clientHeight || document.body.clientHeight
window.addEventListener('resize', () => {
  const resizeHeight = document.documentElement.clientHeight || document.body.clientHeight
  if (resizeHeight < originHeight) {
    // 键盘弹起所需页面逻辑
  } else {
    // 键盘弹起后所需逻辑
  }
}, false)
```

通过 `userAgent` 来判断决定使用哪种方法：

```js
const ua = window.navigator.userAgent.toLocaleLowerCase()
const isIOS = /iphone|ipad|ipod/.test(ua)
const isAndroid = /andriod/.test(ua)
```

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>键盘兼容</title>
</head>
<body>
  <header class="header">键盘兼容</header>
  <div>
    <input type="text" class="input">
  </div>
  <footer class="footer"></footer>

  <script>
    const ua = window.navigator.userAgent.toLocaleLowerCase()
    const isIOS = /iphone|ipad|ipod/.test(ua)
    const isAndriod = /andriod/.test(ua)

    const $input = document.querySelector('.input')

    // 键盘弹起
    $input.addEventListener('focus', () => {
      console.log('键盘弹起啦！')
    }, false)

    // 键盘收起
    if (isIOS) {
      $input.addEventListener('blur', () => {
        console.log('键盘收起啦！')
      }, false)
    }

    if (isAndriod) {
      document.addEventListener('resize', () => {
        const originHeight = document.documentElement.clientHeight
        console.log('')
      }, false)
    }
  </script>
</body>
</html>
