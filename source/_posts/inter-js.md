---
title: 前端面试之javascript
date: 2018-03-04 19:40:30
tags: [面试, javascript]
categories: 面试
---

### 介绍 js 的基本数据类型

Undefined、Null、Boolean、Number、String、ECMAScript 2015 新增 Symbol（创建后独一无二且不可变的数据类型）、ES2020 新增 BigInt（表示整数，没有位置限制）。

### 介绍 js 有哪些内置对象？

- Object 是 JavaScript 中所有对象的父对象
- 数据封装类对象：Object、Array、Boolean、Number 和 String
- 其他对象：Function、Arguments、Math、Date、RegExp、Error

### 说几条写 JavaScript 的基本规范？

1. 不要在同一行声明多个变量。
2. 请使用 ===/!==来比较 true/false 或者数值
3. 使用对象字面量替代 new Array 这种形式
4. 不要使用全局函数。
5. Switch 语句必须带有 default 分支
6. 函数不应该有时候有返回值，有时候没有返回值。
7. For 循环必须使用大括号
8. If 语句必须使用大括号
9. for-in 循环中的变量 应该使用 var 关键字明确限定作用域，从而避免作用域污染。

### JavaScript 原型

每个对象会在内部初始化一个属性，就是`property`，当我们访问一个对象的属性时，如果这个对象内部不存在这个属性，就会去`property`里去找这个属性。这个`property`又有自己的`property`，于是一直找下去。

关系：`instance.constructor.property = instance.__proto__`

### JavaScript 有几种类型的值？你能画一下他们的内存图吗？

栈：原始数据类型（Undefined，Null，Boolean，Number、String）

堆：引用数据类型（对象、数组和函数）

两种类型的区别是：存储位置不同；

原始数据类型直接存储在栈(stack)中的简单数据段，占据空间小、大小固定，属于被频繁使用数据，所以放入栈中存储；

引用数据类型存储在堆(heap)中的对象,占据空间大、大小不固定。如果存储在栈中，将会影响程序运行的性能；引用数据类型在栈中存储了指针，该指针指向堆中该实体的起始地址。当解释器寻找引用值时，会首先检索其在栈中的地址，取得地址后从堆中获得实体

![堆和栈](https://note.youdao.com/yws/public/resource/bb7792e904a30442f11cb6c88c33cce8/xmlnote/59441F709E514A1C900E0A930F8D8E89/13064)

### typeof、instanceOf、constructor、Object.prototype.toString

**typeof**：

- 直接在计算机底层基于数据类型的值（二进制）检测。
- `typeof null => Object` 对象存储在计算机中，都是以 `000` 二进制存储，`null` 也是，所以检测出来的结果是对象。
- `typeof` 普通对象/数组对象/正则对象/日期对象 => Object

**instanceof**：

- 检测当前实例是否属于这个类。
- 底层机制：只要当前类出现在实例的原型上，结果为 `true`。
- 不能检测基础数据类型，`1 instanceof Number => false`。
- 原型可以被修改，因此检测会不准确

**constructor**：

- constructor 可以被修改，因此检测不准确

**Object.prototype.toString**：

- 标准检测数据类型的办法，不是转化成字符串，而是返回当前实例所属类的信息

### 三类循环和性能分析

- `for` 循环及 `forEach` 底层：
  `for` 是自己控制循环过程
  基于 `var` 声明的时候，`for` 和 `while` 差不多。
  基于 `let` 声明的时候，`for` 循环性能更好【原理：没有创造全局不释放的变量】。
- `for of` 循环底层：
  迭代器 规范，具备 `next` 方法，每次返回一个对象，具备 `value/done` 属性。
  让对象具备可迭代性并且使用 `for of` 循环

### 请解释事件委托（event delegation）

事件委托是将事件监听器添加到父元素，而不是每个子元素单独设置事件监听器。当触发子元素时，事件会冒泡到父元素，监听器就会触发，这种技术的好处是：

1. 内存使用减少，因为只需一个父元素的事件处理程序，而不必为每个后代都添加事件处理程序。
2. 无需从已删除的元素的元素中解绑处理程序，也无需将处理程序绑定到新元素上。

### 0.1+0.2 != 0.3

`JS` 采用 `IEEE 754` 双精度版本（64 位），即 8 个字节表示一个数字。第 1 位是符号位，决定正负；中间 11 位是指数位，决定数值大小；后面 52 位是小数位，决定精度。浮点数 0.1 用二进制表示的时候是无穷的，两个浮点数相加造成截断丢失精度。

解决方案：1、差值小于 ES6 的 Number.EPSILON 极小值认为是相等；2、将数值转化成字符串，小数部分转化成整数计算；3、浮点树扩大到整数，相加，再除回去；

[深度：JS 的 7 种数据类型以及它们的底层数据结构](https://mp.weixin.qq.com/s/sXFsH_TxFD9BQbEoifOc6w)

### JavaScript 创建对象的几种方式？

- 对象字面量

  ```javascript
  var person = {
      gender: 'male'
      getDesc: function () {
          return 'My gender is' + this.gender;
      }
  }
  ```

  缺点：重复创建对象

- 工厂模式

  ```javascript
  function creatPerson() {
    var person = {}
    person.gender = 'male'
    person.getDesc = function () {
      return 'My gender is' + this.gender
    }

    return person
  }
  creatPerson()
  ```

  缺点：无法识别对象类型

- 构造函数模式

  ```javascript
  function Person() {
    this.gender = 'male'
    this.getDesc = function () {
      return 'My gender is' + this.gender
    }
  }

  var person = new Person()
  ```

  缺点：不能复用方法

- 原型模式

  ```javascript
  function Person() {
    this.gender = 'male'
  }

  CreatFruit.prototype.getDesc = function () {
    return 'My gender is' + this.gender
  }

  var person = new Person()
  ```

### JavaScript 继承的几种实现方式？

1. 原型链继承

   父类

   ```javascript
   function Person() {
     this.gender = 'male'
   }

   Fruit.prototype.getDesc = function () {
     return 'My gender is' + this.gender
   }
   ```

   子类

   ```javascript
   function Student() {
     this.task = 'study'
   }

   Student.prototype = new Person()
   Student.prototype.constructor = Student

   Student.prototype.getTask = function () {
     return 'My task is' + this.task
   }
   ```

   缺点：1. 原型对象上的引用类型属性所有实例共享；2. 不能向超类型的构造函数传参；3. 不支持多重继承。

2. 组合继承

   父类

   ```javascript
   function Person(height) {
     this.gender = 'male'
     this.height = height
   }

   Fruit.prototype.getDesc = function () {
     return 'My gender is' + this.gender
   }
   ```

   子类

   ```javascript
   function Student(height, marjor) {
     Person.call(this, height)
     this.task = 'study'
     this.marjor = marjor
   }

   Student.prototype = new Person()
   Student.prototype.constructor = Student

   Student.prototype.getTask = function () {
     return 'My task is' + this.task
   }
   ```

   缺点：父类构造函数会被调用两次。

3. 寄生组合继承

   父类

   ```javascript
   function Person(height) {
     this.gender = 'male'
     this.height = height
   }

   Fruit.prototype.getDesc = function () {
     return 'My gender is' + this.gender
   }
   ```

   子类

   ```javascript
   function Student(height, marjor) {
     Person.call(this, height)
     this.task = 'study'
     this.marjor = marjor
   }

   Student.prototype = Person.prototype
   // Student.prototype = Object.create(Person.prototype);
   Student.prototype.constructor = Student

   Student.prototype.getTask = function () {
     return 'My task is' + this.task
   }
   ```

4. 拷贝继承

   父类

   ```javascript
   function Person(height) {
     this.gender = 'male'
     this.height = height
   }

   Fruit.prototype.getDesc = function () {
     return 'My gender is' + this.gender
   }
   ```

   子类

   ```javascript
   function Student(height, marjor) {
     Person.call(this, height)
     this.task = 'study'
     this.marjor = marjor
   }

   for (var p in Person.prototype) {
     Student.prototype[p] = Person.prototype[p]
   }

   Student.prototype.getTask = function () {
     return 'My task is' + this.task
   }
   ```

   缺点：父级和子级原型链关系断开。

### Javascript 作用链域?

作用域链的作用保证执行环境里有权访问的变量和函数时有序的。

全局函数无法查看局部函数的内部细节，但局部函数可以查看其上层的函数细节，直至全局细节。

当需要从局部函数查找某一属性或方法时，如果当前作用域没有找到，就会上溯到上层作用域查找，
直至全局函数，这种组织形式就是作用域链。

从底层来看，函数在编译时会创建一个执行上下文，声明的变量和函数都会保存在执行上下文，如果在当前执行上下文没有找到变量，就会沿着 outer 指针查找到上一级执行上下文，直到找到全局执行上下文。那么 outer 指针是怎么知道指向的执行上下文呢？是通过词法作用域决定，而词法作用域是变量或者函数声明位置决定。

### 谈谈 This 对象的理解

- 如果有 new 关键字，this 指向 new 出来的那个对象；
- 如果 apply、call 或 bind 方法用于调用、创建一个函数，函数内的 this 就是作为传入这些方法的对象；
- 当函数作为对象里的方法被调用时，函数内的 this 是调用该函数的对象；
- 在事件中，this 指向触发这个事件的对象，特殊的是，IE 中的 attachEvent 中的 this 总是指向全局对象 Window；
- 如果函数调用不符合上述规则，那么 this 的值指向全局对象（global object）。浏览器环境下 this 的值指向 window 对象，在严格模式下（"user strict"），this 的值为 undefined；
- 综上所述多个规则，较高（第一个最高，上一条最低）将决定 this 的值；
- ES2015 中的箭头函数，将忽略上面的所有规则，this 被设置为它被创建时的上下文；

### eval 是做什么的？

- 它的功能是把对应的字符串解析成 JS 代码并运行；
- 应该避免使用 eval，不安全，非常耗性能（2 次，一次解析成 js 语句，一次执行）。
- 由 JSON 字符串转换为 JSON 对象的时候可以用 eval，var obj =eval('('+ str +')');

### 什么是 window 对象？什么是 document 对象？

- window 对象是指浏览器打开的窗口
- document 对象 HTML 文档对象的一个只读引用，window 对象的一个属性

### `undefined`和`null`的区别？

- `undefined`表示变量声明了，但没有初始化
- `null`表示一个对象“没有值”的值，也就是值为“空”

### 什么是闭包（closure），为什么要用它？

MDN 的解释：一个函数和对其周围状态（词法环境）的引用捆绑在一起，这样的组合就是闭包（closure）。也就是说，闭包让你可以在一个内层函数中访问到其外层函数的作用域。
红宝书的解释：闭包是指有权访问另一个函数作用域中变量的函数，创建闭包最常见的方式是一个函数内创建另一个函数，通过另一个函数访问这个函数的局部变量，利用闭包可以突破作用域链，将函数内部的变量和方法传递到外部。
浏览器基本原理的解释：根据词法作用域的规则，内部函数总是可以访问其外部函数中声明的变量，当通过调用一个外部函数返回一个内部函数后，即使外部函数已经执行结束了，但是内部函数引用外部函数的变量依旧保存在内存中，把这些变量的集合称为闭包；

**闭包特性**

- 内部函数再嵌套内部函数。
- 内部函数可以引用外层参数和变量。
- 参数和变量不会被垃圾回收机制回收。

**作用**

- 读取函数内部变量，变量能始终保存在内存中。
- 封装对象的私有属性和私有方法。

### 哪些操作会造成内存泄漏？

内存泄漏是任何对象在你不再拥有或需要它之后仍然存在。

- setTimeout 的第一个参数使用字符串而非函数的话，会引起内存泄漏。
- 在早版本 IE，HTML 和 DOM 相互引用。
- 闭包使用不当。

### XML 和 JSON 区别

- 数据体积方面：JSON 相对于 XML，数据体积小，传递的速度快。
- 数据交互方面：JSON 先对于 XML，交互更方便，更容易解析处理，更好数据交互。
- 数据描述方面：JSON 对数据的描述性比 XML 较差。
- 传输速度方面：JSON 的速补远远快于 XML。

### javascript 代码中的"use strict";是什么意思？使用它区别是什么？

use strict 是一种 ECMAscript 5 添加的（严格）运行模式,这种模式使得 Javascript 在更严格的条件下运行,

- 使 JS 编码更加规范化的模式,消除 Javascript 语法的一些不合理、不严谨之处，减少一些怪异行为。
- 默认支持的糟糕特性都会被禁用，比如不能用 with，也不能在意外的情况下给全局变量赋值;
- 全局变量的显示声明,函数必须声明在顶层，不允许在非函数代码块内声明函数,arguments.callee 也不允许使用；
- 消除代码运行的一些不安全之处，保证代码运行的安全,限制函数中的 arguments 修改，严格模式下的 eval 函数的行为和非严格模式的也不相同;

- 提高编译器效率，增加运行速度；
- 为未来新版本的 Javascript 标准化做铺垫。

### new 操作符具体干什么的？

- 创建一个空对象；
- 根据原型链，设置空对象的 `__proto__` 为构造函数的 `prototype`；
- 构造函数的 `this` 指向这个对象，执行构造函数，为这个新对象添加属性；
- 判断函数的返回值类型，如果是引用类型，就返回这个引用类型对象，否则返回这个新对象。

```js
function myNew(Fn) {
  // ES6 中 new.target 指向构造函数
  myNew.target = Fn

  // const obj = {}
  // obj.__proto__=Fn.prototype
  // 创建一个对象，对象原型指向构造函数原型
  const obj = Object.create(Fn.prototype)

  // 调用构造函数，并将this绑定到该对象
  const result = Fn.apply(obj, [...arguments])

  // 构造函数执行返回值，如果是非引用类型，返回创建的对象，否则直接返回构造函数的返回值
  const type = typeof result
  return (type === 'object' && result !== null) || type === 'function' ? res : obj
}
```

### js 延迟加载的方式有哪些？

defer 和 async、动态创建 DOM 方式（用得最多）、按需异步载入 js

### `defer` 与 `async` 区别？

`defer` 是 渲染完再执行，`async` 是下载完就执行。

- `defer` 要等到整个页面在内存中正常渲染结束（DOM 结构完全生成 DOMContentLoaded，以及其他脚本执行完成），才会执行；
- `async` 一旦下载完，渲染引擎就会中断渲染，执行整个脚本以后，再继续渲染。

### Ajax 是什么？如何创建一个 Ajax？

Ajax 全称：Asynchronous Javascript And XML
异步传输+js+xml

所谓异步，在这里简单地解释就是：向服务器发送请求的时候，我们不必等待结果，而是可以同时做其他的事情，等到有了结果它自己会根据设定进行后续操作，与此同时，页面是不会发生整页刷新的，提高了用户体验。

Ajax 原理简单来说实在用户和服务器之间加一个中间层（Ajax 引擎），通过 XMLHttpRequest 对象来向服务器发送异步请求，从服务器获取数据，而后用 JavaScript 来操作 DOM 更新页面。使得用户操作和服务器响应异步化。

步骤：

1. 创建 XMLHttpRequest 对象,也就是创建一个异步调用对象
2. 创建一个新的 HTTP 请求,并指定该 HTTP 请求的方法、URL 及验证信息
3. 设置响应 HTTP 请求状态变化的函数
4. 发送 HTTP 请求
5. 获取异步调用返回的数据
6. 使用 JavaScript 和 DOM 实现局部刷新

```javascript
var xhr = new XMLHttpRequest()
xhr.open('get', url, true)
xhr.onreadystatechange = function () {
  if (xhr.readyState == 4) {
    if (xhr.status == 200) {
      success(xhr.responseText)
    } else {
      error(xhr.status)
    }
  }
}
xhr.send(null)
```

### Ajax 解决浏览器缓存问题？

- 在 ajax 发送请求前加上 `anyAjaxObj.setRequestHeader("If-Modified-Since","0")`
- 在 ajax 发送请求前加上 `anyAjaxObj.setRequestHeader("Cache-Control","no-cache")`
- 在 URL 后面加上一个随机数：`"fresh=" + Math.random()`
- 在 URL 后面加上时间戳

### Ajax 的优缺点？

优点：

- 异步模式，局部刷新，提示用户体验
- 优化了浏览器和服务器之间的传输，减少不必要的数据返回，减少减少带宽
- Ajax 在客户端运行，承担了一部分本来由服务器承担的工作，减少了大用户量下的服务器负载

缺点：

- 安全问题，暴露与服务器交互细节
- 对搜索引擎支持比较弱

### 模块化开发怎么做？

立即执行函数，不暴露已有成员。

```javascript
var module1 = function () {
  var a = 100
  var private1 = function () {}
  var public1 = function () {
    // ...
  }

  return {
    public1: public1
  }
}
```

### 如何解决跨域问题?

jsonp、 iframe、window.name、window.postMessage、服务器上设置代理页面、CORS、Proxy、Nginx

#### JSONP

客户端

```js
window.func = (data) => {
  console.log('data: ', data)
}
const script = document.createElement('script')
script.src = 'http://domain.com/list?callback=func'
script.onload = () => {
  console.log('script loaded')
}
const body = document.body
body.append(script)
body.removeChild(script)
```

服务器端

```js
const express = require('express')
const app = express()
app.listen(8080, () => {
  console.log('ok')
})
app.get('/list', (req, res) => {
  const { callback = Function.prototype } = req.query
  const data = { name: 'winfar', age: 18 }
  res.send(`${callback}(${JSON.stringify(data)})`)
})
```

#### CORS

客户端

```js
fetch('http://otherdomain.com/list', { method: 'get' }).then((response) => {
  console.log('response: ', response)
})
```

服务端

```js
const express = require('express')
const app = express()

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://domain.com')
  res.header('Access-Control-Allow-Credentials', true)
  res.header('Access-Control-Allow-Headers', 'Content-Type,Content-Length,Authorization,Accept,X-Requested-with')
  res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS,HEAD')
  req.method === 'OPTIONS' ? res.send('CURRENT SERVICES SUPPORT CROSS DOMAIN REQUESTS') : next()
})
app.listen(80)
app.get('/list', (req, res) => {
  const data = { name: 'winfar', age: 18 }
  res.send(JSON.stringify(data))
})
```

#### Proxy

webpack && dev-server

```js
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = {
  mode: 'development',
  entry: './src/main.js',
  output: {
    filename: 'main.[hash].min.js',
    path: path.resolve(__dirname, 'build')
  },
  devServer: {
    port: '8080',
    proxy: {
      '/': {
        target: 'http://otherdomain.com',
        changeOrigin: true
      }
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
      filename: 'index.html'
    })
  ]
}
```

#### nginx

```js
server {
  listen 80;
  server_name http://domain.com;
  location / {
    proxy_pass http://otherdomain.com;
    root html;
    index index.html index.htm;
  }
}
```

### 页面编码和被请求的资源编码如果不一致如何处理？

在引入资源设置响应的编码格式，`<script src="http://xxx.com/a.js" charset="utf-8"></script>`

### AMD（Modules/Asynchronous-Definition）、CMD（Common Module Definition）规范区别？

- AMD 异步模块定义，是 RequireJS 在推广过程中对模块定义的规范化产出
- CMD 通用模块定义，是 SeaJS 在推广过程中对模块定义的规范化产出
- 这些规范的目的都是为了 JavaScript 的模块化开发，特别是在浏览器端的， 目前这些规范的实现都能达成浏览器端模块化开发的目的

区别：

1. 对于依赖的模块，AMD 是提前执行，CMD 是延迟执行。不过 RequireJS 从 2.0 开始，也改成可以延迟执行（根据写法不同，处理方式不同）。CMD 推崇 as lazy as possible
2. CMD 推崇依赖就近，AMD 推崇依赖前置
3. AMD 的 API 默认是一个当多个用，CMD 的 API 严格区分，推崇职责单一

### 说说你对 AMD 和 CommonJS 的了解

他们都是实现模块提示的方式，知道 ES2015 出现之前，javascript 一直没有模块化体系。CommonJS 是同步的，而 AMD（Asynchronous Module Definition）从全称中可以明显看出是异步的。CommonJS 的设计是为服务器端开发考虑的，而 AMD 支持异步加载模块，更适合浏览器。

我发现 AMD 的语法非常冗长，CommonJS 更接近其他语言 import 声明语句的用法习惯。大多数情况下，我认为 AMD 没有使用的必要，因为如果把所有 JavaScript 都捆绑进一个文件中，将无法得到异步加载的好处。此外，CommonJS 语法上更接近 Node 编写模块的风格，在前后端都使用 JavaScript 开发之间进行切换时，语境的切换开销较小。

### ES6 模块与 CommonJS 模块的差异

- `CommonJS` 模块输出的是一个值的拷贝，`ES6` 模块输出的是值的引用；
- `CommonJS` 模块是运行时加载，`ES6` 模块是编译时输出接口（静态编译）；
- `CommonJS` 是单值导出， `ES6 Module` 可以是导出多个；
- `CommonJS` 是动态语法可以写在判断里，`ES6 Module` 静态语法只能写在顶层；
- `CommonJS` 模块的 `require()` 是同步加载模块，`ES6` 模块的 `import` 命令是异步加载，有一个独立的模块依赖的解析阶段；
- `CommonJS` 模块的顶层 `this` 指向当前模块，`ES6` 模块之中，顶层的 `this` 指向 `undefined`。

### CommonJS 中的 require/exports 和 ES6 中的 import/export 区别？

- CommonJS 模块的重要特性是加载时执行，即脚本代码在 require 的时候，就会全部执行。一旦出现某个模块被”循环加载”，就只输出已经执行的部分，还未执行的部分不会输出。

- ES6 模块是动态引用，如果使用 import 从一个模块加载变量，那些变量不会被缓存，而是成为一个指向被加载模块的引用，需要开发者自己保证，真正取值的时候能够取到值。

- import/export 最终都是编译为 require/exports 来执行的。

- CommonJS 规范规定，每个模块内部， module 变量代表当前模块。这个变量是一个对象，它的 exports 属性（即 module.exports ）是对外的接口。加载某个模块，其实是加载该模块的 module.exports 属性。

- export 命令规定的是对外的接口，必须与模块内部的变量建立一一对应关系。

参考:
[Module 的加载实现](https://es6.ruanyifeng.com/#docs/module-loader)
[「万字进阶」深入浅出 Commonjs 和 Es Module](https://mp.weixin.qq.com/s/y_uk7wXAfvq8FzcUZrR93w)

### tree-shaking 原理

tree-shaking 是通过清除多余代码方式来优化打包体积的技术。ES6 Module 引入进行静态分析，故而编译的时候正确判断到底加载了那些模块。静态分析程序流，判断那些模块和变量未被使用或者引用，进而删除对应代码。

### `import`引入脚本文件省略后缀名，Node 会怎样查找？

如果脚本文件省略了后缀名，比如`import './foo'`，Node 会依次尝试四个后缀名：`./foo.mjs`、`./foo.js`、`./foo.json`、`./foo.node`。如果这些脚本文件都不存在，Node 就会去加载`./foo/package.json`的 main 字段指定的脚本。如果`./foo/package.json`不存在或者没有 main 字段，那么就会依次加载`./foo/index.mjs`、`./foo/index.js`、`./foo/index.json`、`./foo/index.node`。如果以上四个文件还是都不存在，就会抛出错误。

### 请解释下面代码为什么不能用作 IIFE：`function foo(){ }();`，需要作出哪些修改才能使其成为 IIFE？

IIFE（Immediately Invoked Function Expressions）代表立即执行函数。 JavaScript 解析器将 `function foo(){ }();`解析成`function foo(){ }`和`();`。其中，前者是函数声明；后者（一对括号）是试图调用一个函数，却没有指定名称，因此它会抛出`Uncaught SyntaxError: Unexpected token`的错误。

修改方法是：再添加一对括号，形式上有两种：`(function foo(){ })()`和`(function foo(){ }())`。以上函数不会暴露到全局作用域，如果不需要在函数内部引用自身，可以省略函数的名称。

### documen.write 和 innerHTML 的区别？

document.write 只能重绘整个页面，innerHTML 可以重绘页面的一部分

### DOM 操作——怎样添加、移除、移动、复制、创建和查找节点？

1. 创建节点
   - `document.createDocumentFragment()` // 文档碎片
   - `document.createElement(元素标签)` // 创建元素节点
   - `document.createTextNode(文本内容)` // 创建文本节点
2. 添加、移除、复制系节点
   - `父节点.appendChildren(要添加的子节点)` // 添加子节点
   - `父节点.removeChildren(要删除的子节点)` // 移除子节点
   - `被复制的节点.cloneNode(true/false)` //复制节点
3. 查找
   - `DOM.getElementsByTagName()` // 标签查找
   - `DOM.getElementsByName()` // name 属性查找
   - `DOM.getElementById()` // id 查找

### 数组和对象有哪些原生方法，列举一下？

- 数组：
  `push`, `pop`, `shift`, `unshift`, `concat`, `splice`, `slice`

  其中队列方法：`push`, `shift`
  栈方法：`push`, `pop`

- 对象：
  `assign`, `create`, `defineProperty`, `defineProperty`, `entries`, `freeze`, `getOwnPropertyDescriptor`, `getOwnPropertyDescriptors`, `getOwnPropertyNames`, `getOwnPropertySymbols`, `getPropertyOf`, `is`, `isExtensible`, `isFrozen`, `hasOwnPropertyOf`

### jquery.extend 与 jquery.fn.extend 的区别？

- `jquery.extend` 为 jquery 类添加类方法，可以理解为添加静态方法
- 源码中`jquery.fn = jquery.prototype`，所以对 jquery.fn 的扩展，就是为 jquery 类添加成员函数
  使用
- `jquery.extend`扩展，需要通过 jquery 类来调用，而 jquery.fn.extend 扩展，所有 jquery 实例都可以直接调用

### 什么是 polyfill？

polyfill 是“在旧版浏览器上复制标准 API 的 JavaScript 补充”,可以动态地加载 JavaScript 代码或库，在不支持这些标准 API 的浏览器中模拟它们。

例如，geolocation（地理位置）polyfill 可以在 navigator 对象上添加全局的 geolocation 对象，还能添加 getCurrentPosition 函数以及“坐标”回调对象，
所有这些都是 W3C 地理位置 API 定义的对象和函数。因为 polyfill 模拟标准 API，所以能够以一种面向所有浏览器未来的方式针对这些 API 进行开发，
一旦对这些 API 的支持变成绝对大多数，则可以方便地去掉 polyfill，无需做任何额外工作。

### 谈谈你对 webpack 的看法？

WebPack 是一个模块打包工具，你可以使用 WebPack 管理你的模块依赖，并编绎输出模块们所需的静态文件。它能够很好地管理、打包 Web 开发中所用到的 HTML、Javascript、CSS 以及各种静态文件（图片、字体等），让开发过程更加高效。对于不同类型的资源，webpack 有对应的模块加载器。webpack 模块打包器会分析模块间的依赖关系，最后 生成了优化且合并后的静态资源

### Webpack 热更新实现原理?

1. Webpack 编译期，为需要热更新的 entry 注入热更新代码(EventSource 通信)
2. 页面首次打开后，服务端与客户端通过 EventSource 建立通信渠道，把下一次的 hash 返回前端
3. 客户端获取到 hash，这个 hash 将作为下一次请求服务端 hot-update.js 和 hot-update.json 的 hash
4. 修改页面代码后，Webpack 监听到文件修改后，开始编译，编译完成后，发送 build 消息给客户端
5. 客户端获取到 hash，成功后客户端构造 hot-update.js script 链接，然后插入主文档
6. hot-update.js 插入成功后，执行 hotAPI 的 createRecord 和 reload 方法，获取到 Vue 组件的 render 方法，重新 render 组件， 继而实现 UI 无刷新更新。

### ES6 中变量声明的 6 中方法

`var`、`function`、`let`、`const`、`import`、`class`

### `Object.is()` 与原来的比较操作符“ ===”、“ ==”的区别？

- 两等号判等，会在比较时进行类型转换
- 三等号判等，比较时不进行隐式类型转换
- `Object.is`在三等号基础上处理了`NaN`、`-0` 和`+0`，使得`-0`和`+0`不同，`Object.is(NaN, NaN)`返回`true`

### 页面重构怎么操作？

网站重构：在不改变外部行为的前提下，简化结构、添加可读性，而在网站前端保持一致的行为。
也就是说是在不改变 UI 的情况下，对网站进行优化，在扩展的同时保持一致的 UI。

对于传统的网站来说重构通常是：

- 表格(table)布局改为 DIV+CSS
- 使网站前端兼容于现代浏览器(针对于不合规范的 CSS、如对 IE6 有效的)
- 对于移动平台的优化
- 针对于 SEO 进行优化
- 深层次的网站重构应该考虑的方面

- 减少代码间的耦合
- 让代码保持弹性
- 严格按规范编写代码
- 设计可扩展的 API
- 代替旧有的框架、语言(如 VB)
- 增强用户体验
- 通常来说对于速度的优化也包含在重构中

- 压缩 JS、CSS、image 等前端资源(通常是由服务器来解决)
- 程序的性能优化(如数据读写)
- 采用 CDN 来加速资源加载
- 对于 JS DOM 的优化
- HTTP 服务器的文件缓存

### 设计模式 知道什么是 singleton, factory, strategy, decrator 么？

- **Singleton，单例模式**：保证一个类只有一个实例，并提供一个访问它的全局访问点
- **Factory Method**，工厂方法：定义一个用于创建对象的接口，让子类决定实例化哪一个类，Factory Method 使一个类的实例化延迟到了子类
- **Strategy，策略模式**：定义一系列的算法，把他们一个个封装起来，并使他们可以互相替换，本模式使得算法可以独立于使用它们的客户
- **Decrator，装饰模式**：动态地给一个对象增加一些额外的职责，就增加的功能来说，Decorator 模式相比生成子类更加灵活

### 什么叫优雅降级和渐进增强？

- **优雅降级**：Web 站点在所有新式浏览器中都能正常工作，如果用户使用的是老式浏览器，则代码会针对旧版本的 IE 进行降级处理了,使之在旧式浏览器上以某种形式降级体验却不至于完全不能用。如：border-shadow

- **渐进增强**：从被所有浏览器支持的基本功能开始，逐步地添加那些只有新版本浏览器才支持的功能,向页面增加不影响基础浏览器的额外样式和功能的。当浏览器支持时，它们会自动地呈现出来并发挥作用。如：默认使用 flash 上传，但如果浏览器支持 HTML5 的文件上传功能，则使用 HTML5 实现更好的体验

### WEB 应用从服务器主动推送 Data 到客户端有那些方式？

- html5 提供的 Websocket
- 不可见的 iframe
- WebSocket 通过 Flash
- XHR 长时间连接
- XHR Multipart Streaming
- `<script>`标签的长时间连接(可跨域)

### 对 Node 的优点和缺点提出了自己的看法？

- 优点：Node 是基于事件驱动和无阻塞的，所以非常适合处理并发请求
- 缺点：Node 是一个相对新的开源项目，所以不太稳定，它总是一直在变，
  而且缺少足够多的第三方库支持。

### http 状态码有那些？分别代表是什么意思？

简单版：

- 100 Continue 继续，一般在发送 post 请求时，已发送了 http
- header 之后服务端将返回此信息，表示确认，之后发送具体参数信息
- 200 OK 正常返回信息
- 201 Created 请求成功并且服务器创建了新的资源
- 202 Accepted 服务器已接受请求，但尚未处理
- 301 Moved Permanently 请求的网页已永久移动到新位置。
- 302 Found 临时性重定向。
- 303 See Other 临时性重定向，且总是使用 GET 请求新的 URI。
- 304 Not Modified 自从上次请求后，请求的网页未修改过。

- 400 Bad Request 服务器无法理解请求的格式，客户端不应当尝试再次使用相同的内容发起请求。
- 401 Unauthorized 请求未授权。
- 403 Forbidden 禁止访问。
- 404 Not Found 找不到如何与 URI 相匹配的资源。

- 500 Internal Server Error 最常见的服务器端错误。
- 503 Service Unavailable 服务器端暂时无法处理请求（可能是过载或维护）。

完整版

1. (信息类)：表示接收到请求并且继续处理

   - 100——客户必须继续发出请求
   - (信息类)：表示接收到请求并且继续处理 - 100——客户必须继续发出请求 - 101——客户要求服务器根据请求转换 HTTP 协议版本

2. (响应成功)：表示动作被成功接收、理解和接受

   - 200——表明该请求被成功地完成，所请求的资源发送回客户端
   - 201——提示知道新文件的 URL
   - 202——接受和处理、但处理未完成
   - 203——返回信息不确定或不完整
   - 204——请求收到，但返回信息为空
   - 205——服务器完成了请求，用户代理必须复位当前已经浏览过的文件
   - 206——服务器已经完成了部分用户的 GET 请求

3. (重定向类)：为了完成指定的动作，必须接受进一步处理

   - 300——请求的资源可在多处得到
   - 301——本网页被永久性转移到另一个 URL
   - 302——请求的网页被转移到一个新的地址，但客户访问仍继续通过原始 URL 地址，重定向，新的 URL 会在 response 中的 Location 中返回，浏览器将会使用新的 URL 发出新的 Request。
   - 303——建议客户访问其他 URL 或访问方式
   - 304——自从上次请求后，请求的网页未修改过，服务器返回此响应时，不会返回网页内容，代表上次的文档已经被缓存了，还可以继续使用
   - 305——请求的资源必须从服务器指定的地址得到
   - 306——前一版本 HTTP 中使用的代码，现行版本中不再使用
   - 307——申明请求的资源临时性删除

4. (客户端错误类)：请求包含错误语法或不能正确执行

   - 400——客户端请求有语法错误，不能被服务器所理解
   - 401——请求未经授权，这个状态代码必须和 WWW-Authenticate 报头域一起使用
   - HTTP 401.1 - 未授权：登录失败
     　　- HTTP 401.2 - 未授权：服务器配置问题导致登录失败
     　　- HTTP 401.3 - ACL 禁止访问资源
     　　- HTTP 401.4 - 未授权：授权被筛选器拒绝
   - HTTP 401.5 - 未授权：ISAPI 或 CGI 授权失败
   - 402——保留有效 ChargeTo 头响应
   - 403——禁止访问，服务器收到请求，但是拒绝提供服务
   - HTTP 403.1 禁止访问：禁止可执行访问
     　　- HTTP 403.2 - 禁止访问：禁止读访问
     　　- HTTP 403.3 - 禁止访问：禁止写访问
     　　- HTTP 403.4 - 禁止访问：要求 SSL
     　　- HTTP 403.5 - 禁止访问：要求 SSL 128
     　　- HTTP 403.6 - 禁止访问：IP 地址被拒绝
     　　- HTTP 403.7 - 禁止访问：要求客户证书
     　　- HTTP 403.8 - 禁止访问：禁止站点访问
     　　- HTTP 403.9 - 禁止访问：连接的用户过多
     　　- HTTP 403.10 - 禁止访问：配置无效
     　　- HTTP 403.11 - 禁止访问：密码更改
     　　- HTTP 403.12 - 禁止访问：映射器拒绝访问
     　　- HTTP 403.13 - 禁止访问：客户证书已被吊销
     　　- HTTP 403.15 - 禁止访问：客户访问许可过多
     　　- HTTP 403.16 - 禁止访问：客户证书不可信或者无效
   - HTTP 403.17 - 禁止访问：客户证书已经到期或者尚未生效
   - 404——一个 404 错误表明可连接服务器，但服务器无法取得所请求的网页，请求资源不存在。eg：输入了错误的 URL
   - 405——用户在 Request-Line 字段定义的方法不允许
   - 406——根据用户发送的 Accept 拖，请求资源不可访问
   - 407——类似 401，用户必须首先在代理服务器上得到授权
   - 408——客户端没有在用户指定的饿时间内完成请求
   - 409——对当前资源状态，请求不能完成
   - 410——服务器上不再有此资源且无进一步的参考地址
   - 411——服务器拒绝用户定义的 Content-Length 属性请求
   - 412——一个或多个请求头字段在当前请求中错误
   - 413——请求的资源大于服务器允许的大小
   - 414——请求的资源 URL 长于服务器允许的长度
   - 415——请求资源不支持请求项目格式
   - 416——请求中包含 Range 请求头字段，在当前请求资源范围内没有 range 指示值，请求也不包含 If-Range 请求头字段
   - 417——服务器不满足请求 Expect 头字段指定的期望值，如果是代理服务器，可能是下一级服务器不能满足请求长。

5. (服务端错误类)：服务器不能正确执行一个正确的请求
   - HTTP 500 - 服务器遇到错误，无法完成请求
     　　- HTTP 500.100 - 内部服务器错误 - ASP 错误
     　　- HTTP 500-11 服务器关闭
     　　- HTTP 500-12 应用程序重新启动
     　　- HTTP 500-13 - 服务器太忙
     　　- HTTP 500-14 - 应用程序无效
     　　- HTTP 500-15 - 不允许请求 global.asa
     　　- Error 501 - 未实现
   - HTTP 502 - 网关错误
   - HTTP 503：由于超载或停机维护，服务器目前无法使用，一段时间后可能恢复正常 101——客户要求服务器根据请求转换 HTTP 协议版本

### 一个页面从输入 URL 到页面加载显示完成，这个过程中都发生了什么？（流程说的越详细越好）

详细版：

1. 浏览器会开启一个线程来处理这个请求，对 URL 分析判断如果是 http 协议就按照 Web 方式来处理;
2. 调用浏览器内核中的对应方法，比如 WebView 中的 loadUrl 方法;
3. 通过 DNS 解析获取网址的 IP 地址，设置 UA 等信息发出第二个 GET 请求;
4. 进行 HTTP 协议会话，客户端发送报头(请求报头);
5. 进入到 web 服务器上的 Web Server，如 Apache、Tomcat、Node.JS 等服务器;
6. 进入部署好的后端应用，如 PHP、Java、JavaScript、Python 等，找到对应的请求处理;
7. 处理结束回馈报头，此处如果浏览器访问过，缓存上有对应资源，会与服务器最后修改时间对比，一致则返回 304;
8. 浏览器开始下载 html 文档(响应报头，状态码 200)，同时使用缓存;
9. 文档树建立，根据标记请求所需指定 MIME 类型的文件（比如 css、js）,同时设置了 cookie;
10. 页面开始渲染 DOM，JS 根据 DOM API 操作 DOM,执行事件绑定等，页面显示完成。

简洁版：

1. 浏览器根据请求的 URL 交给 DNS 域名解析，找到真实 IP，向服务器发起请求；
2. 服务器交给后台处理完成后返回数据，浏览器接收文件（HTML、JS、CSS、图象等）；
3. 浏览器对加载到的资源（HTML、JS、CSS 等）进行语法解析，建立相应的内部数据结构（如 HTML 的 DOM）；
4. 载入解析到的资源文件，渲染页面，完成。

### 什么是持久连接？

HTTP 协议采用“请求-应答”模式，当使用普通模式，即非 keep-alive 模式时，每个请求和服务器都要新建一个链接，完成后立即断开连接（HTTP 协议为无连接的协议）

当使用 keep-alive 模式（又称持久连接、连接重用）时，keep-alive 功能是客户端到服务器端的连接持续有效，当出校对服务器的后继请求时，keep-alive 功能避免了建立或者重新建立连接

### 什么是管线化？

在使用持久连接的情况下，某个链接上消息的传递类似于请求 1 -> x 响应 1 -> 请求 2 -> 响应 2

管线化，在持久连接的基础上，类似于请求 1 -> 请求 2 -> 响应 1 -> 响应 2

管线化特点：

1. 管线化机制通过持久化完成，仅 HTTP/1.1 支持
2. 只有 GET 和 HEAD 请求可以进行管线化，而 POST 有所限制
3. 管线化不会影响响应到来的顺序
4. 服务器端支持管线化，并不要求服务器端也对响应进行管线化处理，只是要求对于管线化的请求不失败

### HTTP/1.1 与 HTTP/2.0 的区别

1. **多路复用**

   HTTP/2.0 使用多路复用技术，使用同一个 TCP 连接来处理多个请求。

2. **首部压缩**

   HTTP/1.1 的首部带有大量信息，而且每次都要重复发送。HTTP/2.0 要求通讯双方各自缓存一份首部字段表，从而避免了重复传输。

3. **服务端推送**

   在客户端请求一个资源时，会把相关的资源一起发送给客户端，客户端就不需要再次发起请求了。例如客户端请求 index.html 页面，服务端就把 index.js 一起发送给客户端。

4. **二进制格式**

   HTTP/1.1 的解析基于文本的，而 HTTP/2.0 采用二级制格式。

### React 和 Vue 相似之处和不同之处？

React 和 Vue 相似之处：

- 使用 Virtual DOM
- 提供了响应式（Reactive）和组件化（Composable）的视图组件
- 将注意力集中保持在和核心库，而将其他功能如路由和全局状态交给相关的库

不同之处：

- React 有更丰富的生态系统
- React 在某个组件状态发生变化时，它会以该组件为根，重新渲染整个组件子树，而 Vue 自动追踪，精确知晓哪个组件需要被重渲染
- React 渲染功能依靠 JSX，支持类型检查、编译器自动完成，linting，Vue 默认推荐的还是模板
- CSS 作用域在 React 中是通过 CSS-in-JS 方案实现，Vue 设置样式的默认方法时单文件组件里类似 style 的标签
- 编写有本地渲染能力的 APP，React 有 React Native，比较成熟。Vue 有 Weex，还在快速发展中

### 对 MVVM 的认识？

1. 先聊一下 MVC

MVC：Model（模型） View（视图） Controller（控制器），主要是基于分层的目的，让彼此的职责分开。

View 通过 Controller 和 Model 联系，Controller 是 View 和 Model 的协调者，view 和 Model 不直接联系，基本联系都是单向的。

![](https://note.youdao.com/yws/public/resource/813e8f68e489060d70ccfdff42b3aecc/xmlnote/5D8BB99FBC214D8C970E9C870FA49A7E/17046)

2. 顺带提下 MVP

MVP：是从 MVC 模式演变而来的，都是通过 Controller/Presenter 负责逻辑的处理+Model 提供数据+View 负责显示。

在 MVP 中，Presenter 完全把 View 和 Model 进行分离，主要的程序逻辑在 Presenter 里实现。并且，Presenter 和 View 是没有直接关联的，是通过定义好的接口进行交互，从而使得在变更 View 的时候可以保持 Presenter 不变。这样可以在没有 view 层就可以单元测试。

![](https://note.youdao.com/yws/public/resource/813e8f68e489060d70ccfdff42b3aecc/xmlnote/2E48C84A45C644EA85FAF979D88C8790/17044)

3. 再聊聊 MVVN

MVVM：Model + View + ViewModel，把 MVC 中的 Controller 和 MVP 中的 Presenter 改成 ViewModel

view 的变化会自动更新到 ViewModel，ViewModel 的变化也会自动同步到 View 上显示。这种自动同步是因为 ViewModel 中的属性实现了 Observer，当属性变更时都能触发对应操作。

- View 是 HTML 文本的 js 模板；
- ViewModel 是业务逻辑层（一切 js 可视业务逻辑，比如表单按钮提交，自定义事件的注册和处理逻辑都在 viewmodel 里面负责监控两边的数据）；
- Model 数据层，对数据的处理（与后台数据交互的增删改查）

提一下我熟悉的 MVVM 框架：vue.js，Vue.js 是一个构建数据驱动的 web 界面的渐进式框架。Vue.js 的目标是通过尽可能简单的 API 实现响应的数据绑定和组合的视图组件。核心是一个响应的数据绑定系统。

4. 一句话总结下不同之处

MVC 中联系是单向的，MVP 中 P 和 V 通过接口交互，MVVM 的联系是双向的

### DOM 元素 e 的 e.getAttribute(propName)和 e.propName 有什么区别和联系？

- e.getAttribute()，是标准 DOM 操作文档元素属性的方法，具有通用性可在任意文档上使用，返回元素在源文件中设置的属性；
- e.propName 通常是在 HTML 文档中访问特定元素的特性，浏览器解析元素后生成对应对象（如 a 标签生成 HTMLAnchorElement），这些对象的特性会根据特定规则结合属性设置得到，对于没有对应特性的属性，只能使用 getAttribute 进行访问；
- 一些 attribute 和 property 不是一一对应如：form 控件中<input value="hello"/>对应的是 defaultValue，修改或设置 value property 修改的是控件当前值，setAttribute 修改 value 属性不会改变 value property；

### offsetWidth/offsetHeight,clientWidth/clientHeight 与 scrollWidth/scrollHeight 的区别？

- offsetWidth/offsetHeight 返回值包含 content + padding + border，效果与 e.getBoundingClientRect()相同
- clientWidth/clientHeight 返回值只包含 content + padding，如果有滚动条，也不包含滚动条
- scrollWidth/scrollHeight 返回值包含 content + padding + 溢出内容的尺寸

![](https://note.youdao.com/yws/public/resource/bb7792e904a30442f11cb6c88c33cce8/xmlnote/ACF07159847B4EA28246D4B1296834DB/14414)

### XMLHttpRequest 通用属性和方法

1. readyState:表示请求状态的整数，取值：
   - UNSENT（0）：对象已创建
   - OPENED（1）：open()成功调用，在这个状态下，可以为 xhr 设置请求头，或者使用 send()发送请求
   - HEADERS_RECEIVED(2)：所有重定向已经自动完成访问，并且最终响应的 HTTP 头已经收到
   - LOADING(3)：响应体正在接收
   - DONE(4)：数据传输完成或者传输产生错误
2. onreadystatechange：readyState 改变时调用的函数
3. status：服务器返回的 HTTP 状态码（如，200， 404）
4. statusText:服务器返回的 HTTP 状态信息（如，OK，No Content）
5. responseText:作为字符串形式的来自服务器的完整响应
6. responseXML: Document 对象，表示服务器的响应解析成的 XML 文档
7. abort():取消异步 HTTP 请求
8. getAllResponseHeaders(): 返回一个字符串，包含响应中服务器发送的全部 HTTP 报头。每个报头都是一个用冒号分隔开的名/值对，并且使用一个回车/换行来分隔报头行
9. getResponseHeader(headerName):返回 headName 对应的报头值
10. open(method, url, asynchronous [, user, password]):初始化准备发送到服务器上的请求。method 是 HTTP 方法，不区分大小写；url 是请求发送的相对或绝对 URL；asynchronous 表示请求是否异步；user 和 password 提供身份验证
11. setRequestHeader(name, value):设置 HTTP 报头
12. send(body):对服务器请求进行初始化。参数 body 包含请求的主体部分，对于 POST 请求为键值对字符串；对于 GET 请求，为 null

### focus/blur 与 focusin/focusout 的区别和联系

1. focus/blur 不冒泡，focusin/focusout 冒泡；
2. focus/blur 兼容好，focusin/focusout 在除 FireFox 外的浏览器下都保持良好兼容性；
3. 可获得焦点的元素：
   - window
   - 链接被点击或键盘操作
   - 表单空间被点击或键盘操作
   - 设置 tabindex 属性的元素被点击或键盘操作

### mouseover/mouseout 与 mouseenter/mouseleave 的区别与联系？

- mouseover/mouseout 是冒泡事件；mouseenter/mouseleave 不冒泡。需要为多个元素监听鼠标移入/出事件时，推荐 mouseover/mouseout 托管，提高性能

### 函数内部 arguments 变量有哪些特性,有哪些属性,如何将它转换为数组

- arguments 所有函数中都包含的一个局部变量，是一个类数组对象，对应函数调用时的实参。如果函数定义同名参数会在调用时覆盖默认对象
- arguments[index]分别对应函数调用时的实参，并且通过 arguments 修改实参时会同时修改实参
- arguments.length 为实参的个数（Function.length 表示形参长度）
- arguments.callee 为当前正在执行的函数本身，使用这个属性进行递归调用时需注意 this 的变化
- arguments.caller 为调用当前函数的函数（已被遗弃）
- 转换为数组：`var args = Array.prototype.slice.call(arguments, 0);`

### 解释原型继承的工作原理

所有的 js 对象都有一个 prototype 属性，指向它的原型对象。当试图访问一个对象，如果在该对象上没有找到，它还会搜寻该对象的原型，以及该对象的原型的原型，依次向上搜索，直到找到一个名称匹配的属性或到达原型链的末尾。

### 你觉得 jQuery 源码有哪些写的好的地方？

- jquery 源码封装在一个匿名函数的自执行环境中，有助于防止变量的全局污染，然后通过传入 window 对象参数，可以使 window 对象作为局部变量使用，好处是当 jquery 中访问 window 对象的时候，就不用将作用域链退回到顶层作用域了，从而可以更快的访问 window 对象。同样，传入 undefined 参数，可以缩短查找 undefined 时的作用域链
- jquery 将一些原型属性和方法封装在了 jquery.prototype 中，为了缩短名称，又赋值给了 jquery.fn，这是很形象的写法
- 有一些数组或对象的方法经常能使用到，jQuery 将其保存为局部变量以提高访问速度
- jquery 实现的链式调用可以节约代码，所返回的都是同一个对象，可以提高代码效率

### ES6 相对 ES5 有哪些新特性？

```
新增let、const命令声明变量

变量的解构赋值
    |--数组的解构
    |--对象的解构
    |--字符串的解构
    |--数值、布尔值的解构
    |--函数参数的解构

正则表达式的扩展
    |--允许 new RegExp(/abc/, 'i')
    |--match()、replace()、search()和split()添加到RegExp实例方法
    |--u修饰符，正确匹配四字节，UTF-16编码
    |--y修饰符，从第一个位置开始匹配
    |--sticky属性，表示是否设置了y修饰符
    |--flags属性，返回正则修饰符
    |--s修饰符，是.可以匹配任意单个字符
    |--dotAll属性，表示是否设置了s修饰符
    |--后行断言，/(?<=y)x/，x在y的后面才匹配

数值的扩展
    |--二进制（0b或0B）和八进制（0o或0O）
    |--Number.isFinite()，Number.isNaN
    |--Number.parseInt()，Number.parseFloat()
    |--Number.isInteger()
    |--Number.EPSION
    |--Number.isSafeInteger()
    |--指数运算符（**）

函数的扩展
    |--函数默认值
    |--rest参数
    |--严格模式，不允许使用默认值、解构赋值、或者扩展运算符
    |--name属性，构造函数name为anonymous，函数bind作用域后，name为bound name
    |--箭头函数
    |--双冒号运算符，箭头函数可以绑定this对象
    |--尾调用优化
    |--函数参数的尾逗号

数组的扩展
    |--[...likeArr]扩展运算符
    |--Array.from()
    |--Array.of()
    |--数组实例的copyWithin()
    |--数组实例的find()和findIndex()
    |--数组实例的fill()
    |--数组实例的entries()，keys()和values()
    |--数组实例的includes()
    |--数组的空位

对象的扩展
    |--属性的简洁表示法 {foo}表示{foo:foo}
    |--属性名表达式 {[propKey]: true}
    |--Object.is()解决 NaN!==NaN 和 +0===-0 问题
    |--Object.assign()
    |--属性的遍历
    |--Object.setPropertyOf()、Object.getPropertyOf()
    |--super关键字，指向对象的原型
    |--Object.keys()、Object.values()、Object.entries()
    |--解构赋值
    |--扩展运算符

新增一种数据类型 Symbol
    |--遍历Object.getOwnPropertySymbols()
    |--Symbol.for()、Symbol.keyFor()

Set和Map数据解构

Proxy

Reflect

Promise对象
    |--Promise.prototype.then()
    |--Promise.prototype.catch()
    |--Promise.prototype.finally()
    |--Promise.all()
    |--Promise.race()
    |--Promise.resolve()
    |--Promise.reject()

Iterator和for...of循环

Generator

async

Class

Decorator

```

### let 和 const 的特点

- 不会被提升
- 重复什么报错
- 不绑定全局作用域

### 提升页面性能的方法有哪些？

1. 资源压缩合并，减少 HTTP 请求

2. 非核心代码异步加载

   追问：异步加载的方式？
   （1）动态脚本加载（2）`defer`（3）`async`
   追问：异步加载的区别？
   （1）`defer`是在 HTML 解析完后才执行，如果是多个，按照执行加载顺序依次执行（2）`async`是在加载完之后立即执行，如果是多个，执行顺序和加载顺序无关。

3. 利用浏览器缓存

   追问：缓存的分类，缓存的原理？

   强缓存：不询问服务器直接用

   服务器响应头
   Expires Expires: Thu,21 Jan... 这是个绝对时间，由于服务器和客户端有时差，后来在 HTTP/1.1 中就改成了 Cache-Control。
   Cache-Control Cache-Control:max-age=3600 这个是时长，从当前时间起缓存时长。

   协商缓存：询问服务器当前缓存是否过期
   服务器下发 Last-Modified 浏览器请求 If-Modifield-Since Thu,21 Jan... 修改时间
   服务器下发 Etag 浏览器请求 If-None-Match 资源是否被改动过

4. 使用 CDN

5. 预解析 DNS

`<a>`标签浏览器默认模式是预解析的，但是对于 https 是关闭的，需要在`header`中添加

```javascript
<meta http-equip="x-dns-prefetch-control" content="on">
<link rel="dns-prefetch" href="//host_name_to_prefetch.com">
```

可参考 [前端性能优化 24 条建议（2020）](https://juejin.cn/post/6892994632968306702)

### 错误监控

1.  前端错误分类：（1）及时运行错误（2）资源加载错误

2.  及时运行错误的捕获方式：
    （1）try..catch 捕获代码块运行错误；
    （2）window.onerror 捕获 js 运行错误，但是无法捕获静态资源异常和 js 代码错误；
    （3）unhandledrejection 捕获 Promise 错误；
    （4）React 的捕获错误 componentDidCatch；
    （5）Vue 的捕获错误 Vue.config.errorHandler；
3.  资源加载错误：

    （1）object.onerror

    （2）performance.getEntries()
    获取成功加载资源的 api，对比一下现有资源，就可以知道失败加载的资源。

    （3）Error 事件捕获

        ps:资源加载错误不会冒泡到`body`上，但是捕获事件可以

        ```javascript
        window.addEventListener('error', function(e) {
            console.log(e);
        }, true)
        ```

拓展：跨域错误可以捕获到吗？怎么处理错误？

属于资源加载错误，可以被捕获到。处理：在客户端，script 标签增加`crossorigin`属性，服务端增加 HTTP 响应头增加`Access-Control-Allow-Origin:*/`

4.  上报错误的基本原理
    （1）优先使用`Navigator.sendBeacon`，它通过 HTTP POST 将数据一步传输到服务器且不会影响页面卸载
    （2）用`Ajax`通信上报
    （3）用`Image`对象上报

        ```javascript
        new Image().src = 'http://xxx.com/posterror?error=xxx'
        ```

5.  检测卡顿和奔溃
    （1）卡顿是显示器刷新下一帧画面还没准备好，导致连续多次展示相同画面，从而让用户感知不流畅（丢帧），可以用 requestAnimationFrame 方法模拟实现，在浏览器下一次执行重绘之前执行 rAF 回调，可以通过每秒内 rAF 执行次数来计算 FPS。
    （2）奔溃时主线程被阻塞，对于奔溃的监控只能在独立于 JS 主线程的 Worker 线程中进行，Web Worker 心跳检测的方式对主线程进行探测。

### 性能监控

- FP（First Paint）：当前页面首次渲染的时间点，通常开始访问 Web 页面的时间点到 FP 的时间点的这段时间视为白屏时间，简单来说就是有屏幕中像素点开始渲染的时刻为 FP。
- FCP（First Contentful Paint）：当前页面首次有内容渲染的时间点，这里的内容通常指的是文本、图片、svg 或 canvas 元素。

  ```js
  function getPaintTimings() {
    const { performance } = window
    if (performance) {
      const paintEntries = performance.getEntriesByType('paint')
      return {
        FP: paintEntries.find((entry) => entry.name === 'first-paint').startTime,
        FCP: paintEntries.find((entry) => entry.name === 'first-contentful-paint').startTime
      }
    }
  }
  ```

- FMP（First Meaningful Paint）：首次绘制有意义内容，在这个时刻，页面整体布局和文字内容全部渲染完成，用户能看到主要内容，产品通常也关注该指标。
  通过 MutationObserve 监听 document 整体的 DOM 变化，在回调计算之前 DOM 树的分数，分数变化最剧烈的时刻即为 FMP 的时间点。
- LCP（Largest Contentful Paint）：用于度量视口中最大的内容元素何时可见，可以用来确定页面的主要内容何时在屏幕上完成渲染。

  ```js
  const observer = new PerformanceObserver((entryList) => {
    for (const entry of entryList.getEntries()) {
      console.log('LCP Candidate: ', entry.startTime, entry)
    }
  })
  observer.observe({ type: 'largest-contentful-paint', buffered: true })
  ```

- TTI（Time To Interactive）：从页面加载开始到页面处于完全可交互状态所花费的时间。
- FID（First Input Delay）：用户第一次与页面交互的延迟时间。

Lighthouse 几项重要指标：
Performance（性能）、Accessibility（可访问性）、Best practices（最佳实践）、SEO 和 PWA。
其中 Performance 指标矩阵由以下组成：FCP、TTI、LCP、Speed index

参考：[深入浅出前端监控](https://mp.weixin.qq.com/s/I9tTlYjKmnfrpyc6hibY1Q)

### 哈希碰撞

两个不同的 key 经过 hash 计算后，得到相同的 hash 值。解决方法：开放寻址法、再 hash 法和拉链法。
开放寻址法：地址冲突，探测其他存储单元；
再 hash 法：使用第二、三 hash 法；
拉链法：每一格都是链表，冲突往后插；
