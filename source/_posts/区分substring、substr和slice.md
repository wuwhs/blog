---
title: 区分substring、substr和slice
date: 2018-08-27 19:42:30
tags: javascript
categories: javascript
---

1. 参数为正数的情况
slice()和substring()的第二个参数指定的是字符串最后一个字符后面的位置，而substr()的第二个擦输指定的则是返回的字符串个数。
```
var stringValue = "hello world";
console.log(stringValue.slice(3)); // "lo world"
console.log(stringValue.substring(3)); // "lo world"
console.log(stringValue.substr(3)); // "lo world"

console.log(stringValue.slice(3, 7)); // "lo w"
console.log(stringValue.substring(3, 7)); // "lo w"
console.log(stringValue.substr(3, 7)); // "lo worl"
```

2. 参数有负数的情况
slice()方法会将传入的负数与字符串的长度相加，substr()方法将负的第一个参数加上字符串的长度，而将负的第二个参数转化为0。最后，substring()方法会把所有负值参数都转化为0。

```
var stringValue = "hello world";
console.log(stringValue.slice( -3 )); // "rld"
console.log(stringValue.substring( -3 )); // "hellow world"
console.log(stringValue.substr( -3 )); // "rld"

console.log(stringValue.slice( 3, -4 )); // "lo w"
console.log(stringValue.substring( 3, -4 )); // "hel"
console.log(stringValue.substr( 3, -4 )); // ""
```
