---
title: 前端面试之代码实现
date: 2021-10-16 11:08:09
tags: [面试, javascript]
categories: 面试
---

### 浮点数整数位每三位添加一个逗号

```javascript
function commafy(num) {
  return num.toString().replace(/(\d)(?=(\d{3})+\.)/g, function ($1) {
    return $1 + ','
  })
}
```

### 如何实现数组的随机排序？

1. 方法一：依次取出一个位置和随机一个位置交换

```javascript
var arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
function randSort1(arr) {
  for (var i = 0, len = arr.length; i < len; i++) {
    var rand = parseInt(Math.random() * len)
    var temp = arr[rand]
    arr[rand] = arr[i]
    arr[i] = temp
  }
  return arr
}
console.log(randSort1(arr))
```

2. 方法二：随机取出一个位置值，然后删除这个值，加入到新数组中，知道元素组为空

```javascript
var arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
function randSort2(arr) {
  var mixedArray = []
  while (arr.length > 0) {
    var randomIndex = parseInt(Math.random() * arr.length)
    mixedArray.push(arr[randomIndex])
    arr.splice(randomIndex, 1)
  }
  return mixedArray
}
console.log(randSort2(arr))
```

3. 方法三：利用排序函数`sort()`

```javascript
var arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
arr.sort(function () {
  return Math.random() - 0.5
})
console.log(arr)
```

### 实现 call()、apply、bind()

```js
// call
Function.prototype.call = function call(context, ...args) {
  const self = this
  const key = Symbol('key')
  // null undefined
  context == null ? (context = window) : null
  // string number
  !/^(object|function)$/i.test(typeof context) ? (context = Object(context)) : null

  // array function object
  context[key] = self
  const result = context[key](...args)
  delete context[key]
  return result
}

// bind
Function.prototype.bind = function bind(context, ...args) {
  const self = this
  return function proxy() {
    self.apply(context, args)
  }
}
```

### 实现节流（throttle）和防抖（debounce）

函数节流: 频繁触发，但只在特定的时间内才执行一次代码

```js
function throttle(func, wait) {
  let canRun = true
  return function (...args) {
    if (!canRun) {
      return
    }
    canRun = false
    setTimeout(() => {
      func.apply(this, args)
      canRun = true
    }, wait)
  }
}
```

函数防抖: 频繁触发，但只在特定的时间内没有触发执行条件才执行一次代码

```js
function debounce(func, wait) {
  let timer = null
  return function (...args) {
    clearTimeout(timer)
    setTimeout(() => {
      func.apply(this, args)
    }, wait)
  }
}
```

### 写一个通用的事件绑定对象

```javascript
var EventUtil = {
  // 添加事件
  addHandler: function (element, type, handler) {
    if (element.addEventListener) {
      element.addEventListener(type, handler, false)
    } else if (element.attachEvent) {
      element.attachEvent('on' + type, handler)
    }
  },
  // 获取事件对象
  getEvent: function (ev) {
    return ev || window.event
  },
  // 获取事件目标
  getTarget: function (ev) {
    return ev.target || ev.srcElement
  },
  // 阻止默认事件
  preventDefault: function (ev) {
    if (ev.preventDefault) {
      ev.preventDefault()
    } else {
      ev.returnValue = false
    }
  },
  // 阻止冒泡
  stopPropagation: function (ev) {
    if (ev.stopPropagation) {
      ev.stopPropagation()
    } else {
      ev.cancelBubble = true
    }
  },
  // 移除事件
  removeHandler: function (element, type, handler) {
    if (element.removeEventListener) {
      element.removeEventListener(type, handler, false)
    } else if (element.detachEvent) {
      element.detachEvent('on' + type, handler)
    }
  },
  // 获取相关元素
  getRelatedTarget: function (ev) {
    if (ev.relatedTarget) {
      return ev.relatedTarget
    } else if (ev.toElement) {
      return ev.toElement
    } else if (ev.fromElement) {
      return ev.fromElement
    }
  },
  // 获取鼠标滚动
  getWheelDelta: function (ev) {
    // Firefox
    if (ev.DOMMouseScroll) {
      return -ev.detail * 40
    }
    // 其他
    else {
      return ev.wheelDelta
    }
  },
  // 获取keypress按下键字符的ASCLL码
  getCharCode: function (ev) {
    if (typeof ev.charCode == 'number') {
      return ev.charCode
    } else {
      return ev.keyCode
    }
  },
  // 获取剪贴板数据
  getClipboardText: function (ev) {
    var clipboardData = ev.clipboardData || window.clipboardData
    return clipboardData.getData('text')
  },
  // 设置剪贴板数据
  setClipboardText: function (ev, value) {
    if (ev.clipboardData) {
      return ev.clipboardData.setData('text/plain', value)
    } else if (window.clipboardData) {
      return window.clipboardData.setData('text', value)
    }
  }
}
```

参考 https://juejin.cn/post/7018337760687685669
