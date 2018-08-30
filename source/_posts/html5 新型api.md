---
title: html5 新型api
date: 2018-08-27 19:42:30
tags: [javascript, html5]
categories: html
---

### Page Visibility API

为了解决隐藏或最小化标签页，让开发人员知道，有哪些功能可以停下来，``` document.hidden ```,```  visibilitychange ```事件

```
document.addEventListener('msvisibilitychange', handleVisibilityChange);
document.addEventListener('webkitvisibilitychange', handleVisibilityChange);

function handleVisibilityChange () {
    var msg = '';

    // 检测当前页面是否被隐藏
    if (document.hidden || document.msHidden || document.webkitHidden) {
        msg = 'Page has hidden' + new Date();
    } else {
        msg = 'Page is visible now ' + new Date();
    }

    console.log(msg);
}
```

### requestAnimationFrame

使用原始的`setTimeout`和`setInterval`定时器方法创建动画不精确，HTML5优化这个问题，提供一个api，避免过度渲染，解决精度低问题。

```javascript
var requestAnimationFrame = window.requestAnimationFrame ||
  window.msRequestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  window.webkitRequestAnimationFrame;

var startTime = window.mozRequestAnimationStartTime || Date.now();

requestAnimationFrame(draw);

var dist = 500;
var start = 0;
var step = 10;
var $block = document.getElementById('block');

function draw (timestamp) {
  var drawStart = (timestamp || Date.now());
  var diff = drawStart - startTime;
  var next = start + step;
  $block.style.left = next + 'px';

  start = next;

  if(start > dist) {
    // cancelAnimationFrame();
    return false;
  }

  console.log('diff:', diff);
  // 把startTime重写为这一次的绘制时间
  startTime = drawStart;

  // 重绘UI
  requestAnimationFrame(draw);
}
```
