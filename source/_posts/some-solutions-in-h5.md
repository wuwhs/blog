---
title: 移动端开发中的一些解决方案
date: 2019-11-11 11:00:30
tags: [css, html, js]
categories: mobile
---

## H5调用系统某些功能

```html
<!-- 拨号 -->
<a href="tel:10086">打电话给: 10086</a>

<!-- 发送短信 -->
<a href="sms:10086">发短信给: 10086</a>

<!-- 发送邮件 -->
<a href="mailto:example@qq.com">example@qq.com</a>

<!-- 选择照片或者拍摄照片 -->
<input type="file" accept="image/*">

<!-- 选择视频或者拍摄视频 -->
<input type="file" accept="video/*">

<!-- 多选 -->
<input type="file" multiple>
```

## URL Scheme 页面唤醒app

```js
     行为(应用的某个功能/页面)
            |
scheme://[path][?query]
   |               |
应用标识       功能需要的参数
```

## 忽略自动识别

```html
<!-- 忽略浏览器自动识别数字为电话号码 -->
<meta name="format-detection" content="telephone=no">

<!-- 忽略浏览器自动识别邮箱账号 -->
<meta name="format-detection" content="email=no">
```

## 禁止长按

```css
/* 禁止长按图片保存 */
img {
    -webkit-touch-callout: none;
    pointer-events: none;
}

/* 禁止长按选择文字 */
div {
    -webkit-user-select: none;
}
```

## 屏幕旋转为横屏，字体大小会变

```css
body {
    -webkit-text-size: 100%;
}
```

## 最简单的 rem 自适应

```css
html {
    font-size: calc(100vw / 7.5);
}

body {
    font-size: .14rem;
}
```

## 通过js去动态计算根元素的font-size，这样所有设备分辨率都能兼容适应

```js
//designWidth:设计稿的实际宽度值，需要根据实际设置
//maxWidth:制作稿的最大宽度值，需要根据实际设置
//这段js的最后面有两个参数记得要设置，一个为设计稿实际宽度，一个为制作稿最大宽度，例如设计稿为750，最大宽度为750，则为(750,750)
;
(function(designWidth, maxWidth) {
    var doc = document,
        win = window,
        docEl = doc.documentElement,
        remStyle = document.createElement("style"),
        tid;

    function refreshRem() {
        var width = docEl.getBoundingClientRect().width;
        maxWidth = maxWidth || 540;
        width > maxWidth && (width = maxWidth);
        var rem = width * 100 / designWidth;
        remStyle.innerHTML = 'html{font-size:' + rem + 'px;}';
    }

    if (docEl.firstElementChild) {
        docEl.firstElementChild.appendChild(remStyle);
    } else {
        var wrap = doc.createElement("div");
        wrap.appendChild(remStyle);
        doc.write(wrap.innerHTML);
        wrap = null;
    }
    //要等 wiewport 设置好后才能执行 refreshRem，不然 refreshRem 会执行2次；
    refreshRem();

    win.addEventListener("resize", function() {
        clearTimeout(tid); //防止执行两次
        tid = setTimeout(refreshRem, 300);
    }, false);

    win.addEventListener("pageshow", function(e) {
        if (e.persisted) { // 浏览器后退的时候重新计算
            clearTimeout(tid);
            tid = setTimeout(refreshRem, 300);
        }
    }, false);

    if (doc.readyState === "complete") {
        doc.body.style.fontSize = "16px";
    } else {
        doc.addEventListener("DOMContentLoaded", function(e) {
            doc.body.style.fontSize = "16px";
        }, false);
    }
})(640, 750);
```

## 当然也可以用media query设置适配集中主流的屏幕尺寸

```css
html {
    font-size : 20px;
}
@media only screen and (min-width: 401px){
    html {
        font-size: 25px !important;
    }
}
@media only screen and (min-width: 428px){
    html {
        font-size: 26.75px !important;
    }
}
@media only screen and (min-width: 481px){
    html {
        font-size: 30px !important;
    }
}
@media only screen and (min-width: 569px){
    html {
        font-size: 35px !important;
    }
}
@media only screen and (min-width: 641px){
    html {
        font-size: 40px !important;
    }
}
```

## 提供一个移动端base.css

```
body,
dl,
dd,
ul,
ol,
h1,
h2,
h3,
h4,
h5,
h6,
pre,
form,
input,
textarea,
p,
hr,
thead,
tbody,
tfoot,
th,
td {
    margin: 0;
    padding: 0;
}

ul,
ol {
    list-style: none;
}

a {
    text-decoration: none;
}

html {
    -ms-text-size-adjust: none;
    -webkit-text-size-adjust: none;
    text-size-adjust: none;
}

body {
    line-height: 1.5;
    font-size: 14px;
}

body,
button,
input,
select,
textarea {
    font-family: 'helvetica neue', tahoma, 'hiragino sans gb', stheiti, 'wenquanyi micro hei', \5FAE\8F6F\96C5\9ED1, \5B8B\4F53, sans-serif;
}

b,
strong {
    font-weight: bold;
}

i,
em {
    font-style: normal;
}

table {
    border-collapse: collapse;
    border-spacing: 0;
}

table th,
table td {
    border: 1px solid #ddd;
    padding: 5px;
}

table th {
    font-weight: inherit;
    border-bottom-width: 2px;
    border-bottom-color: #ccc;
}

img {
    border: 0 none;
    width: auto\9;
    max-width: 100%;
    vertical-align: top;
    height: auto;
}

button,
input,
select,
textarea {
    font-family: inherit;
    font-size: 100%;
    margin: 0;
    vertical-align: baseline;
}

button,
html input[type="button"],
input[type="reset"],
input[type="submit"] {
    -webkit-appearance: button;
    cursor: pointer;
}

button[disabled],
input[disabled] {
    cursor: default;
}

input[type="checkbox"],
input[type="radio"] {
    box-sizing: border-box;
    padding: 0;
}

input[type="search"] {
    -webkit-appearance: textfield;
    -moz-box-sizing: content-box;
    -webkit-box-sizing: content-box;
    box-sizing: content-box;
}

input[type="search"]::-webkit-search-decoration {
    -webkit-appearance: none;
}

input:focus {
    outline: none;
}

select[size],
select[multiple],
select[size][multiple] {
    border: 1px solid #AAA;
    padding: 0;
}

article,
aside,
details,
figcaption,
figure,
footer,
header,
hgroup,
main,
nav,
section,
summary {
    display: block;
}

audio,
canvas,
video,
progress {
    display: inline-block;
}

body {
    background: #fff;
}

input::-webkit-input-speech-button {
    display: none
}

button,
input,
textarea {
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
}

```