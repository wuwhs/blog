---
title: 可能这些是你想要的H5键盘兼容方案
date: 2019-03-19 11:14:42
tags: [javascript, html]
categories: javascript
---

# 前言

在做 `H5` 聊天项目中，踩过其中一大坑：输入框获取焦点，软键盘弹起，要求输入框吸附（或顶）在输入法框上。需求很明确，看似很简单，其实不然。从实验过一些机型上看，发现主要存在以下问题：

- 在 `Android` 和 `IOS` 上，获知软键盘弹起和收起状态存在差异，且页面 `webview` 表现不同。
- 在 `IOS` 上，使用第三方输入法，高度计算存在偏差，导致在有些输入法弹起，将输入框挡住一部分。
- 在`IOS12` 上，微信版本 `v6.7.4` 及以上，输入框获取焦点，键盘弹起，页面（`webview`）整体往上滚动，当键盘收起后，不回到原位，导致键盘原来所在位置是空白的。
- 在有些浏览器上使用一些操作技巧，还是存在输入框被输入法遮挡。

下面就上述发现的问题，逐个探索一下解决方案。

# 获知软键盘弹起和收起状态

获知软键盘的弹起还是收起状态很重要，后面的兼容处理都要以此为前提。然而，`H5` 并没有直接监听软键盘的原生事件，只能通过软键盘弹起或收起，引发页面其他方面的表现间接监听，曲线救国。并且，在 `IOS` 和 `Android` 上的表现不尽相同。

## `IOS` 软键盘弹起表现

在 `IOS` 上，输入框（`input`、`textarea` 或 富文本）获取焦点，键盘弹起，页面（`webview`）并没有被压缩，或者说高度（`height`）没有改变，只是页面（`webview`）整体往上滚了，且最大滚动高度（`scrollTop`）为软键盘高度。

## `Android` 软键盘弹起表现

同样，在 `Android` 上，输入框获取焦点，键盘弹起，但是页面（`webview`）高度会发生改变，一般来说，高度为可视区高度（原高度减去软键盘高度），除了因为页面内容被撑开可以产生滚动，`webview` 本身不能滚动。

## `IOS` 软键盘收起表现

触发软键盘上的“收起”按钮键盘或者输入框以外的页面区域时，输入框失去焦点，软键盘收起。

## `Android` 软键盘收起表现

触发输入框以外的区域时，输入框失去焦点，软键盘收起。但是，触发键盘上的收起按钮键盘时，输入框并不会失去焦点，同样软键盘收起。

## 监听软键盘弹起和收起

综合上面键盘弹起和收起在 `IOS` 和 `Android` 上的不同表现，我们可以分开进行如下处理来监听软键盘的弹起和收起：

- 在 `IOS` 上，监听输入框的 `focus` 事件来获知软键盘弹起，监听输入框的 `blur` 事件获知软键盘收起。
- 在 `Android` 上，监听 `webview` 高度会变化，高度变小获知软键盘弹起，否则软键盘收起。

```js
// 判断设备类型
var judgeDeviceType = function () {
  var ua = window.navigator.userAgent.toLocaleLowerCase();
  var isIOS = /iphone|ipad|ipod/.test(ua);
  var isAndroid = /android/.test(ua);
  var isMiuiBrowser = /miuibrowser/.test(ua);

  return {
    isIOS: isIOS,
    isAndroid: isAndroid,
    isMiuiBrowser: isMiuiBrowser
  }
}()

// 获取到焦点元素滚动到可视区
function activeElementScrollIntoView(activeElement, delay) {
  var editable = activeElement.getAttribute('contenteditable')

  // 输入框、textarea或富文本获取焦点后没有将该元素滚动到可视区
  if (activeElement.tagName == 'INPUT' || activeElement.tagName == 'TEXTAREA' || editable === '' || editable) {
    setTimeout(() => {
      activeElement.scrollIntoView();
    }, delay)
  }
}

// 监听输入框的软键盘弹起和收起事件
function listenKeybord($input) {
  if (judgeDeviceType.isIOS) {
    // IOS 键盘弹起：IOS 和 Android 输入框获取焦点键盘弹起
    $input.addEventListener('focus', function () {
      console.log('IOS 键盘弹起啦！');
      activeElementScrollIntoView(this, 1000);
    }, false)

    // IOS 键盘收起：IOS 点击输入框以外区域或点击收起按钮，输入框都会失去焦点，键盘会收起，
    $input.addEventListener('blur', () => {
      console.log('IOS 键盘收起啦！');

      // 微信浏览器版本6.7.4+IOS12会出现键盘收起后，视图被顶上去了没有下来
      /* var wechatInfo = window.navigator.userAgent.match(/MicroMessenger\/([\d\.]+)/i);
      if (!wechatInfo) return;

      var wechatVersion = wechatInfo[1];
      var version = (navigator.appVersion).match(/OS (\d+)_(\d+)_?(\d+)?/);

      if (+wechatVersion.replace(/\./g, '') >= 674 && +version[1] >= 12) {
        window.scrollTo(0, Math.max(document.body.clientHeight, document.documentElement.clientHeight));
      } */
    })
  }

  // Andriod 键盘收起：Andriod 键盘弹起或收起页面高度会发生变化，以此为依据获知键盘收起
  if (judgeDeviceType.isAndroid) {
    var originHeight = document.documentElement.clientHeight || document.body.clientHeight;

    window.addEventListener('resize', function () {
      var resizeHeight = document.documentElement.clientHeight || document.body.clientHeight;
      if (originHeight < resizeHeight) {
        console.log('Android 键盘收起啦！');

        // 修复小米浏览器下，输入框依旧被输入法遮挡问题
        if (judgeDeviceType.isMiuiBrowser) {
          document.body.style.marginBottom = '0px';
        }
      } else {
        console.log('Android 键盘弹起啦！');

        // 修复小米浏览器下，输入框依旧被输入法遮挡问题
        if (judgeDeviceType.isMiuiBrowser) {
          document.body.style.marginBottom = '40px';
        }
        activeElementScrollIntoView($input, 1000);
      }

      originHeight = resizeHeight;
    }, false)
  }
}

var $inputs = document.querySelectorAll('.input');

for (var i = 0; i < $inputs.length; i++) {
  listenKeybord($inputs[i]);
}

```


# 兼容第三方输入法


# 兼容 `IOS12` + `V6.7.4+`

#













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

实验证明，`IOS` 的 `height` 没有发生变化，`scrollTop` 发生变化，页面可以滚动，且始终保证输入框处于可视区域中。`Android` 页面高度变小，页面可以上下滚动，`fixed` 元素的 `bottom` 属性的基线为键盘。页面是否可以滚动由处于正常文档流中元素决定，高度大于键盘弹起页面调整后的高度就会产生滚动条，否则没有滚动条。
