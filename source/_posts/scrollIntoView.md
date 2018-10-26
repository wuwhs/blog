---
title: scrollIntoView
date: 2018-10-25 17:02:40
tags: javascript
categories: javascript
---

# 前言

在实际应用中，经常用到滚动到页面顶部或某个位置，一般简单用锚点处理或用js将`document.body.scrollTop`设置为0，结果是页面一闪而过滚到指定位置，不是特别友好。我们想要的效果是要有点缓冲效果。

scrollIntoView意思是滚动到可视，css有`scroll-bahavior`属性，js有`Element.scrollIntoView()`方法。

# scroll-behavior

`scroll-behavior`属性可取值`auto`|`smooth`|`inherit`|`unset`

`scroll-behavior: smooth;`是我们想要的缓冲效果。在PC浏览器中，页面默认滚动是在`<html>`标签上，移动端大多数在`<body>`标签上，在我们想要实现平滑“回到顶部”，只需：

```css
html, body {
  scroll-behavior: smooth;
}
```

准确的说，写在容器元素上，可以让容器（非鼠标手势触发）的滚动变得平滑。

利用这个属性可以做一个标签切换平滑运动效果

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

效果图

![css-tab](/gb/scrollIntoView/css-tab.gif)

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

可以看到对于有参数的该API在浏览器中支持不是很好，我们可以同时结合CSS设置`scroll-behavior: smooth;`滚动效果，在执行滚动使用`target.scrollIntoView()`，即可达到“完美滚动”效果。

# 向下兼容
