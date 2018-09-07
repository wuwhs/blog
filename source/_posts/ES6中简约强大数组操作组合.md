---
title: ES6中简约强大数组操作组合
date: 2018-09-07 18:25:20
tags: javascript
categories: ES6
---

参考：

https://www.zhangxinxu.com/wordpress/2013/04/es5%E6%96%B0%E5%A2%9E%E6%95%B0%E7%BB%84%E6%96%B9%E6%B3%95/

https://segmentfault.com/a/1190000005921341

https://segmentfault.com/a/1190000013972464

https://segmentfault.com/a/1190000013121115

## reduce

`array.reduce(callback[, initialValue])`


数组求和

```js
const numbers = [10, 20, 30, 40]
numbers.reduce((prev, cur, index, arr) => {
  console.log('prev: ' + prev + '; ' + 'cur: ' + cur + ';');
  return prev + cur;
})
```

```js
prev: 10; cur: 20;
prev: 30; cur: 30;
prev: 60; cur: 40;
```

这第二个参数就是设置prev的初始类型和初始值，比如为0，就表示prev的初始值为number类型，值为0，因此，reduce的最终结果也会是number类型。

```js
const numbers = [10, 20, 30, 40]
numbers.reduce((prev, cur, index, arr) => {
  console.log('prev: ' + prev + '; ' + 'cur: ' + cur + ';');
  return prev + cur;
}, 0)
```

```js
prev: 0; cur: 10;
prev: 10; cur: 20;
prev: 30; cur: 30;
prev: 60; cur: 40;
```
