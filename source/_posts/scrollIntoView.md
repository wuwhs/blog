---
title: scrollIntoView
date: 2018-10-25 17:02:40
tags: javascript
categories: javascript
---

# 前言

在实际应用中，经常用到滚动到页面顶部或某个位置，一般简单用锚点处理或用js将`document.body.scrollTop`设置为0，结果是页面一闪而过滚到指定位置，不是特别友好。我们想要的效果是要有点缓冲效果。

现代浏览器陆续意识到了这种需求，`scrollIntoView`意思是滚动到可视，css中提供了`scroll-behavior`属性，js有`Element.scrollIntoView()`方法。

# scroll-behavior

`scroll-behavior`属性可取值`auto`|`smooth`|`inherit`|`unset`

`scroll-behavior: smooth;`是我们想要的缓冲效果。在PC浏览器中，页面默认滚动是在`<html>`标签上，移动端大多数在`<body>`标签上，在我们想要实现平滑“回到顶部”，只需在这两个标签上都加上：

```css
html, body {
  scroll-behavior: smooth;
}
```

准确的说，写在容器元素上，可以让容器（非鼠标手势触发）的滚动变得平滑，而不局限于`<html>`，`<body>`标签。

利用这个css属性可以一步将原来纯css标签直接切换，变成平滑过渡切换效果。

```css
.tab label {
  padding: 10px;
  border: 1px solid #ccc;
  margin-right: -1px;
  text-align: center;
  float: left;
  overflow: hidden;
}

.tab::after {
  content: "";
  display: table;
  clear: both;
}

.box {
  height: 200px;
  border: 1px solid #ccc;
  scroll-behavior: smooth;
  overflow: hidden;
  margin-top: 10px;
}

.item {
  height: 100%;
  position: relative;
  overflow: hidden;
}

.item input {
  position: absolute;
  top: 0;
  height: 100%;
  width: 1px;
  border: 0;
  padding: 0;
  margin: 0;
  clip: rect(0 0 0 0);
}
```

```html
<h1>纯CSS选项卡</h1>
<div class="tab">
  <label for="tab1">选项卡1</label>
  <label for="tab2">选项卡2</label>
  <label for="tab3">选项卡3</label>
</div>
<div class="box">
  <div class="item">
    <input type="text" id="tab1">
    <p>选项卡1内容</p>
  </div>
  <div class="item">
    <input type="text" id="tab2">
    <p>选项卡2内容</p>
  </div>
  <div class="item">
    <input type="text" id="tab3">
    <p>选项卡3内容</p>
  </div>
</div>
```

实现效果

![css-tab](/gb/scrollIntoView/css-tab.gif)

也可以戳[这里](/demo/scrollIntoView/css-tab.html)

再来看一下这个css属性[scroll-behavior](https://www.caniuse.com/#search=scroll-behavior)在各大浏览器中的支持情况

![scroll-behavior-compatibility](/gb/scrollIntoView/scroll-behavior-compatibility.png)

呃~支持度不是很好，这样一行css代码能应用上当然是最好的，不行就退化成一闪而过的效果咯。下面再看下js提供的api。

# Element.scrollIntoView()

`Element.scrollIntoView()` 方法让当前的元素滚动到浏览器窗口的可视区域内。

> element.scrollIntoView(); // 等同于element.scrollIntoView(true)
element.scrollIntoView(alignToTop); // Boolean型参数
element.scrollIntoView(scrollIntoViewOptions); // Object型参数

## 参数alignToTop

一个`Boolean`值：

- 如果为`true`，元素的顶端将和其所在滚动区的可视区域的顶端对齐。相应的`scrollIntoViewOptions: {block: "start", inline: "nearest"}`。这是这个参数的默认值。
- 如果为`false`，元素的底端将和其所在滚动区的可视区域的底端对齐。相应的`scrollIntoViewOptions: {block: "end", inline: "nearest"}`。

## 参数scrollIntoViewOptions

一个带有选项的 `object`：

```js
{
  behavior: "auto"  | "instant" | "smooth",
  block:    "start" | "end",
}
```

- `behavior` 可选
  定义缓动动画， "auto", "instant", 或 "smooth" 之一。默认为 "auto"。

- `block` 可选
  `"start"`, `"center"`, `"end"`, 或 `"nearest"`之一。默认为 `"center"`。

- `inline` 可选
  `"start"`, `"center"`, `"end"`, 或 `"nearest"`之一。默认为 `"nearest"`。

浏览器支持

![scrollIntoView浏览器支持](/gb/scrollIntoView/scrollIntoView.png)

可以看到对于无参数的情况支持还是很好的，有参数的该API在浏览器中支持不是很好，我们可以同时结合CSS设置`scroll-behavior: smooth;`滚动效果，在执行滚动使用`target.scrollIntoView()`，即可达到“完美滚动”（不太完美）效果。

# 向下兼容

要达到所有浏览器都有相同（类似）效果，那就要把剩余不支持`scroll-behavior`属性的浏览器揪出来，用js去完成使命了。

## 判断是否支持`scroll-behavior`属性

很简单，用以下这一行代码

```js
if(typeof window.getComputedStyle(document.body).scrollBehavior === 'undefined') {
  // 兼容js代码
} else {
  // 原生滚动api
  // Element.scrollIntoView()
}
```

判断是否支持`scroll-behavior`属性，直接利用原生`Element.scrollIntoView()`滚动，否则向下兼容处理。

## 缓冲算法

缓冲的直观效果是越来越慢，直到停止，也就是在相同时间内运动的距离越来越短。这样可以设置一个定时器，移动到当前点到目标点距离的缓冲率（比如1/2，1/3，...）处，比如，缓冲率设为2，当前距离目标点64px，下一秒就是32px，然后16px，8px...，到达某个阈值结束，也就是：

```js
var position = position + (destination - position) / n;
```

下面来简单实现一个点击右下方的”回到顶部“按钮，页面缓动滚动到顶部的demo。

```html
<div class="content">
    <p>很多内容。。。</p>
    ...
  </div>
  <section class="back-to-top">
    回到顶部
  </section>
```

```css
.content {
  height: 3000px;
  border: 1px solid #ccc;
  box-shadow: 0 0 2px solid;
}

.back-to-top {
  width: 18px;
  padding: 10px;
  border: 1px solid #ccc;
  box-shadow: 0 0 2px #333;
  position: fixed;
  right: 20px;
  bottom: 40px;
}

.back-to-top:hover {
  cursor: pointer;
}
```

```js
var scrollTopSmooth = function (position) {
  // 不存在原生`requestAnimationFrame`，用`setTimeout`模拟替代
  if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = function (cb) {
      return setTimeout(cb, 17);
    };
  }
  // 当前滚动高度
  var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
  // step
  var step = function () {
    var distance = position - scrollTop;
    scrollTop = scrollTop + distance / 5;
    if (Math.abs(distance) < 1) {
      window.scrollTo(0, position);
    } else {
      window.scrollTo(0, scrollTop);
      requestAnimationFrame(step);
    }
  };
  step();
}

$backToTop = document.querySelector('.back-to-top')
$backToTop.addEventListener('click', function () {
  scrollTopSmooth(0);
}, false);
</script>
```

效果图

![croll-to-top](/gb/scrollIntoView/scroll-to-top.gif)

或者戳[这里](/demo/scrollIntoView/index.html)

## 简单封装

上面的小demo中，缓冲算法和当前滚动业务代码耦合在一起了，下面单独拆解出单独一个函数。

```js
/**
* 缓冲函数
* @param {Number} position 当前滚动位置
* @param {Number} destination 目标位置
* @param {Number} rate 缓动率
* @param {Function} callback 缓动结束回调函数 两个参数分别是当前位置和是否结束
*/
var easeout = function (position, destination, rate, callback) {
  if (position === destination || typeof destination !== 'number') {
    return false;
  }
  destination = destination || 0;
  rate = rate || 2;

  // 不存在原生`requestAnimationFrame`，用`setTimeout`模拟替代
  if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = function (fn) {
      return setTimeout(fn, 17);
    }
  }

  var step = function () {
    position = position + (destination - position) / rate;
    if (position < 1) {
      callback(destination, true);
      return;
    }
    callback(position, false);
    requestAnimationFrame(step);
  };
  step();
}
```

拆分后，这个小缓冲算法就可以被重复调用啦，而且，适用于滚动到指定位置（不仅仅是到顶部）和缓冲率（控制滚动快慢），当前小demo调用：

```js
var scrollTopSmooth = function (position) {
  // 当前滚动高度
  var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
  easeout(scrollTop, 0, 5, function (val) {
    window.scrollTo(0, val);
  });
}

$backToTop = document.querySelector('.back-to-top')
$backToTop.addEventListener('click', function () {
  scrollTopSmooth(0);
}, false);
```

# 总结

综合来看，简单实现一个完美滚动注意以下即可

1. `<html>`，`<body>`标签加上`scroll-behavior: smooth;`属性；
2. 判断当前浏览器是否支持`scrollBehavior`属性；
3. 如果支持直接用原生滚动api`Element.scrollIntoView()`；
4. 如果不支持则用js小缓冲算法兼容处理。

完~