---
title: 前端面试之javascript
date: 2018-03-04 19:40:30
tags: [面试, javascript]
categories: 面试
---

### 介绍js的基本数据类型

Undefined、Null、Boolean、Number、String、ECMAScript 2015 新增Symbol（创建后独一无二且不可变的数据类型）

### 介绍js有哪些内置对象？

- Object 是 JavaScript 中所有对象的父对象
- 数据封装类对象：Object、Array、Boolean、Number 和 String
- 其他对象：Function、Arguments、Math、Date、RegExp、Error

### 说几条写JavaScript的基本规范？

1. 不要在同一行声明多个变量。
2. 请使用 ===/!==来比较true/false或者数值
3. 使用对象字面量替代new Array这种形式
4. 不要使用全局函数。
5. Switch语句必须带有default分支
6. 函数不应该有时候有返回值，有时候没有返回值。
7. For循环必须使用大括号
8. If语句必须使用大括号
9. for-in循环中的变量 应该使用var关键字明确限定作用域，从而避免作用域污染。

### JavaScript原型

每个对象会在内部初始化一个属性，就是`property`，当我们访问一个对象的属性时，如果这个对象内部不存在这个属性，就会去`property`里去找这个属性。这个`property`又有自己的`property`，于是一直找下去。

关系：`instance.constructor.property = instance.__proto__`

### JavaScript有几种类型的值？你能画一下他们的内存图吗？

栈：原始数据类型（Undefined，Null，Boolean，Number、String）

堆：引用数据类型（对象、数组和函数）

两种类型的区别是：存储位置不同；

原始数据类型直接存储在栈(stack)中的简单数据段，占据空间小、大小固定，属于被频繁使用数据，所以放入栈中存储；

引用数据类型存储在堆(heap)中的对象,占据空间大、大小不固定。如果存储在栈中，将会影响程序运行的性能；引用数据类型在栈中存储了指针，该指针指向堆中该实体的起始地址。当解释器寻找引用值时，会首先检索其在栈中的地址，取得地址后从堆中获得实体

![堆和栈](https://note.youdao.com/yws/public/resource/bb7792e904a30442f11cb6c88c33cce8/xmlnote/59441F709E514A1C900E0A930F8D8E89/13064)

### 请解释事件委托（event delegation）

事件委托是将事件监听器添加到父元素，而不是每个子元素单独设置事件监听器。当触发子元素时，事件会冒泡到父元素，监听器就会触发，这种技术的好处是：
1. 内存使用减少，因为只需一个父元素的事件处理程序，而不必为每个后代都添加事件处理程序。
2. 无需从已删除的元素的元素中解绑处理程序，也无需将处理程序绑定到新元素上。

### 浮点数整数位每三位添加一个逗号

```javascript
function commafy(num) {
  return num.toString().replace(/(\d)(?=(\d{3})+\.)/g, function($1) {
    return $1 + ','
  });
}
```

### 如何实现数组的随机排序？

1. 方法一：依次取出一个位置和随机一个位置交换

```javascript
var arr = [1,2,3,4,5,6,7,8,9,10];
function randSort1(arr){
  for(var i = 0,len = arr.length;i < len; i++ ){
  	var rand = parseInt(Math.random()*len);
  	var temp = arr[rand];
  	arr[rand] = arr[i];
  	arr[i] = temp;
  }
  return arr;
}
console.log(randSort1(arr));
```
2. 方法二：随机取出一个位置值，然后删除这个值，加入到新数组中，知道元素组为空

```javascript
var arr = [1,2,3,4,5,6,7,8,9,10];
function randSort2(arr){
  var mixedArray = [];
  while(arr.length > 0){
  	var randomIndex = parseInt(Math.random()*arr.length);
  	mixedArray.push(arr[randomIndex]);
  	arr.splice(randomIndex, 1);
  }
  return mixedArray;
}
console.log(randSort2(arr));
```
3. 方法三：利用排序函数`sort()`

```javascript
var arr = [1,2,3,4,5,6,7,8,9,10];
arr.sort(function(){
  return Math.random() - 0.5;
})
console.log(arr);
```

### JavaScript创建对象的几种方式？

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
    function creatPerson () {
        var person = {};
        person.gender = 'male';
        person.getDesc = function () {
            return 'My gender is' + this.gender;
        }

        return person;
    }
    creatPerson();
    ```
    缺点：无法识别对象类型

- 构造函数模式

    ```javascript
    function Person () {
        this.gender = 'male';
        this.getDesc = function () {
            return 'My gender is' + this.gender;
        }
    }

    var person = new Person();
    ```
    缺点：不能复用方法

- 原型模式

    ```javascript
    function Person () {
        this.gender = 'male';
    }

    CreatFruit.prototype.getDesc = function () {
        return 'My gender is' + this.gender;
    }

    var person = new Person();
    ```

### 使用`new`操作符创建对象过程？

1. 创建一个新对象；
2. 将构造函数的作用域赋值给新函数（因此`this`就指向了这个新对象）；
3. 执行构造函数中的代码（为这个新对象添加属性）；
4. 返回新对象。

### JavaScript继承的几种实现方式？

1. 原型链继承

    父类

    ```javascript
    function Person () {
        this.gender = 'male';
    }

    Fruit.prototype.getDesc = function () {
        return 'My gender is' + this.gender;
    }
    ```

    子类

    ```javascript
    function Student () {
        this.task = 'study';
    }

    Student.prototype = new Person();
    Student.prototype.constructor = Student;

    Student.prototype.getTask = function () {
        return 'My task is' + this.task;
    }
    ```

    缺点：1. 原型对象上的引用类型属性所有实例共享；2. 不能向超类型的构造函数传参；3. 不支持多重继承。

2. 组合继承

    父类

    ```javascript
    function Person (height) {
        this.gender = 'male';
        this.height = height;
    }

    Fruit.prototype.getDesc = function () {
        return 'My gender is' + this.gender;
    }
    ```

    子类

    ```javascript
    function Student (height, marjor) {
        Person.call(this, height);
        this.task = 'study';
        this.marjor = marjor;
    }

    Student.prototype = new Person();
    Student.prototype.constructor = Student;

    Student.prototype.getTask = function () {
        return 'My task is' + this.task;
    }
    ```

    缺点：父类构造函数会被调用两次。

3. 寄生组合继承

    父类

    ```javascript
    function Person (height) {
        this.gender = 'male';
        this.height = height;
    }

    Fruit.prototype.getDesc = function () {
        return 'My gender is' + this.gender;
    }
    ```

    子类

    ```javascript
    function Student (height, marjor) {
        Person.call(this, height);
        this.task = 'study';
        this.marjor = marjor;
    }

    Student.prototype = Person.prototype;
    // Student.prototype = Object.create(Person.prototype);
    Student.prototype.constructor = Student;

    Student.prototype.getTask = function () {
        return 'My task is' + this.task;
    }
    ```
4. 拷贝继承

    父类

    ```javascript
    function Person (height) {
        this.gender = 'male';
        this.height = height;
    }

    Fruit.prototype.getDesc = function () {
        return 'My gender is' + this.gender;
    }
    ```

    子类

    ```javascript
    function Student (height, marjor) {
        Person.call(this, height);
        this.task = 'study';
        this.marjor = marjor;
    }

    for(var p in Person.prototype) {
        Student.prototype[p] = Person.prototype[p];
    }

    Student.prototype.getTask = function () {
        return 'My task is' + this.task;
    }
    ```
    缺点：父级和子级原型链关系断开。

### Javascript作用链域?

作用域链的作用保证执行环境里有权访问的变量和函数时有序的。

全局函数无法查看局部函数的内部细节，但局部函数可以查看其上层的函数细节，直至全局细节。

当需要从局部函数查找某一属性或方法时，如果当前作用域没有找到，就会上溯到上层作用域查找，
直至全局函数，这种组织形式就是作用域链。

### 谈谈This对象的理解

- 如果有new关键字，this指向new出来的那个对象；
- 如果apply、call或bind方法用于调用、创建一个函数，函数内的this就是作为传入这些方法的对象；
- 当函数作为对象里的方法被调用时，函数内的this是调用该函数的对象；
- 在事件中，this指向触发这个事件的对象，特殊的是，IE中的attachEvent中的this总是指向全局对象Window；
- 如果函数调用不符合上述规则，那么this的值指向全局对象（global object）。浏览器环境下this的值指向window对象，在严格模式下（"user strict"），this的值为undefined；
- 综上所述多个规则，较高（第一个最高，上一条最低）将决定this的值；
- ES2015中的箭头函数，将忽略上面的所有规则，this被设置为它被创建时的上下文；

### eval是做什么的？

- 它的功能是把对应的字符串解析成JS代码并运行；
- 应该避免使用eval，不安全，非常耗性能（2次，一次解析成js语句，一次执行）。
- 由JSON字符串转换为JSON对象的时候可以用eval，var obj =eval('('+ str +')');

### 什么是window对象？什么是document对象？

- window对象是指浏览器打开的窗口
- document对象HTML文档对象的一个只读引用，window对象的一个属性

### `undefined`和`null`的区别？

- `undefined`表示变量声明了，但没有初始化
- `null`表示一个对象“没有值”的值，也就是值为“空”

### 写一个通用的事件绑定对象

```javascript
var EventUtil = {
    // 添加事件
    addHandler: function(element, type, handler) {
        if(element.addEventListener) {
            element.addEventListener(type, handler, false);
        }
        else if(element.attachEvent) {
            element.attachEvent("on" + type, handler);
        }
    },
    // 获取事件对象
    getEvent: function(ev) {
        return ev || window.event;
    },
    // 获取事件目标
    getTarget: function(ev) {
        return ev.target || ev.srcElement;
    },
    // 阻止默认事件
    preventDefault: function(ev) {
        if(ev.preventDefault) {
            ev.preventDefault();
        }
        else {
            ev.returnValue = false;
        }
    },
    // 阻止冒泡
    stopPropagation: function(ev) {
      if(ev.stopPropagation) {
        ev.stopPropagation();
      }
      else {
          ev.cancelBubble = true;
      }
    },
    // 移除事件
    removeHandler: function(element, type, handler) {
        if(element.removeEventListener) {
            element.removeEventListener(type, handler, false);
        }
        else if(element.detachEvent) {
            element.detachEvent("on" + type, handler);
        }
    },
    // 获取相关元素
    getRelatedTarget: function(ev) {
        if(ev.relatedTarget) {
            return ev.relatedTarget;
        }
        else if(ev.toElement) {
            return ev.toElement;
        }
        else if(ev.fromElement) {
            return ev.fromElement;
        }
    },
    // 获取鼠标滚动
    getWheelDelta: function(ev) {
        // Firefox
        if(ev.DOMMouseScroll) {
            return -ev.detail * 40;
        }
        // 其他
        else {
            return ev.wheelDelta;
        }
    },
    // 获取keypress按下键字符的ASCLL码
    getCharCode: function(ev) {
        if(typeof ev.charCode == "number") {
            return ev.charCode;
        }
        else {
            return ev.keyCode;
        }
    },
    // 获取剪贴板数据
    getClipboardText: function(ev) {
        var clipboardData = (event.clipboardData || window.clipboardData);
        return clipboardData.getData("text");
    },
    // 设置剪贴板数据
    setClipboardText: function(ev, value) {
        if(ev.clipboardData) {
            return ev.clipboardData.setData("text/plain", value);
        }
        else if(windwo.clipboardData) {
            return window.clipboardData.setData("text", value);
        }
    }
}
```

### 什么是闭包（closure），为什么要用它？

闭包是指有权访问另一个函数作用域中变量的函数，创建闭包最常见的方式是一个函数内创建另一个函数，通过另一个函数访问这个函数的局部变量，利用闭包可以突破作用域链，将函数内部的变量和方法传递到外部。

**闭包特性**
- 内部函数再嵌套内部函数。
- 内部函数可以引用外层参数和变量。
- 参数和变量不会被垃圾回收机制回收。

**作用**
- 读取函数内部变量，变量能始终保存在内存中。
- 封装对象的私有属性和私有方法。

### 哪些操作会造成内存泄漏？

内存泄漏是任何对象在你不再拥有或需要它之后仍然存在。

- setTimeout的第一个参数使用字符串而非函数的话，会引起内存泄漏。
- 在早版本IE，HTML和DOM相互引用。
- 闭包使用不当。

### XML和JSON区别

- 数据体积方面：JSON相对于XML，数据体积小，传递的速度快。
- 数据交互方面：JSON先对于XML，交互更方便，更容易解析处理，更好数据交互。
- 数据描述方面：JSON对数据的描述性比XML较差。
- 传输速度方面：JSON的速补远远快于XML。

### javascript 代码中的"use strict";是什么意思？使用它区别是什么？

use strict是一种ECMAscript 5 添加的（严格）运行模式,这种模式使得 Javascript 在更严格的条件下运行,

- 使JS编码更加规范化的模式,消除Javascript语法的一些不合理、不严谨之处，减少一些怪异行为。
- 默认支持的糟糕特性都会被禁用，比如不能用with，也不能在意外的情况下给全局变量赋值;
- 全局变量的显示声明,函数必须声明在顶层，不允许在非函数代码块内声明函数,arguments.callee也不允许使用；
- 消除代码运行的一些不安全之处，保证代码运行的安全,限制函数中的arguments修改，严格模式下的eval函数的行为和非严格模式的也不相同;

- 提高编译器效率，增加运行速度；
- 为未来新版本的Javascript标准化做铺垫。

### new操作符具体干什么的？

- 创建一个空对象，并且`this`变量引用该对象，同时还继承了该函数的原型
- 属性和方法被加入到`this`引用的对象中
- 新创建的对象由`this`所引用，并且最后隐式的返回`this`

```javascript
var obj = {};
obj.__proto__ = Base.prototype;
Base.call(obj);
```

### js延迟加载的方式有哪些？

defer和async、动态创建DOM方式（用得最多）、按需异步载入js

### Ajax是什么？如何创建一个Ajax？

Ajax全称：Asynchronous Javascript And XML
异步传输+js+xml

所谓异步，在这里简单地解释就是：向服务器发送请求的时候，我们不必等待结果，而是可以同时做其他的事情，等到有了结果它自己会根据设定进行后续操作，与此同时，页面是不会发生整页刷新的，提高了用户体验。

Ajax原理简单来说实在用户和服务器之间加一个中间层（Ajax引擎），通过XMLHttpRequest对象来向服务器发送异步请求，从服务器获取数据，而后用JavaScript来操作DOM更新页面。使得用户操作和服务器响应异步化。

步骤：
1. 创建XMLHttpRequest对象,也就是创建一个异步调用对象
2. 创建一个新的HTTP请求,并指定该HTTP请求的方法、URL及验证信息
3. 设置响应HTTP请求状态变化的函数
4. 发送HTTP请求
5. 获取异步调用返回的数据
6. 使用JavaScript和DOM实现局部刷新

```javascript
var xhr = new XMLHttpRequest();
xhr.open('get', url, true);
xhr.onreadystatechange = function () {
    if(xhr.readyState == 4) {
        if(xhr.status == 200) {
            success(xhr.responseText);
        } else {
            error(xhr.status);
        }
    }
}
xhr.send(null);
```

### Ajax 解决浏览器缓存问题？

- 在ajax发送请求前加上 `anyAjaxObj.setRequestHeader("If-Modified-Since","0")`
- 在ajax发送请求前加上 `anyAjaxObj.setRequestHeader("Cache-Control","no-cache")`
- 在URL后面加上一个随机数：`"fresh=" + Math.random()`
- 在URL后面加上时间戳

### Ajax的优缺点？

优点：

- 异步模式，局部刷新，提示用户体验
- 优化了浏览器和服务器之间的传输，减少不必要的数据返回，减少减少带宽
- Ajax在客户端运行，承担了一部分本来由服务器承担的工作，减少了大用户量下的服务器负载

缺点：

- 安全问题，暴露与服务器交互细节
- 对搜索引擎支持比较弱

### 模块化开发怎么做？

立即执行函数，不暴露已有成员。

```javascript
var module1 = (function () {
    var a = 100;
    var private1 = function () {

    }
    var public1 = function () {
        // ...
    };

    return {
        public1: public1
    }
});
```

### 如何解决跨域问题?

jsonp、 iframe、window.name、window.postMessage、服务器上设置代理页面

### 页面编码和被请求的资源编码如果不一致如何处理？

在引入资源设置响应的编码格式，`<script src="http://xxx.com/a.js" charset="utf-8"></script>`

### AMD（Modules/Asynchronous-Definition）、CMD（Common Module Definition）规范区别？

- AMD 异步模块定义，是 RequireJS 在推广过程中对模块定义的规范化产出
- CMD  通用模块定义，是 SeaJS 在推广过程中对模块定义的规范化产出
- 这些规范的目的都是为了 JavaScript 的模块化开发，特别是在浏览器端的， 目前这些规范的实现都能达成浏览器端模块化开发的目的

区别：

1. 对于依赖的模块，AMD 是提前执行，CMD 是延迟执行。不过 RequireJS 从 2.0 开始，也改成可以延迟执行（根据写法不同，处理方式不同）。CMD 推崇 as lazy as possible
2. CMD 推崇依赖就近，AMD 推崇依赖前置
3. AMD 的 API 默认是一个当多个用，CMD 的 API 严格区分，推崇职责单一

### 说说你对AMD和CommonJS的了解

他们都是实现模块提示的方式，知道ES2015出现之前，javascript一直没有模块化体系。CommonJS是同步的，而AMD（Asynchronous Module Definition）从全称中可以明显看出是异步的。CommonJS 的设计是为服务器端开发考虑的，而 AMD 支持异步加载模块，更适合浏览器。

我发现 AMD 的语法非常冗长，CommonJS 更接近其他语言 import 声明语句的用法习惯。大多数情况下，我认为 AMD 没有使用的必要，因为如果把所有 JavaScript 都捆绑进一个文件中，将无法得到异步加载的好处。此外，CommonJS 语法上更接近 Node 编写模块的风格，在前后端都使用 JavaScript 开发之间进行切换时，语境的切换开销较小。

### CommonJS 中的 require/exports 和 ES6 中的 import/export 区别？

- CommonJS 模块的重要特性是加载时执行，即脚本代码在 require 的时候，就会全部执行。一旦出现某个模块被”循环加载”，就只输出已经执行的部分，还未执行的部分不会输出。

- ES6 模块是动态引用，如果使用 import 从一个模块加载变量，那些变量不会被缓存，而是成为一个指向被加载模块的引用，需要开发者自己保证，真正取值的时候能够取到值。

- import/export 最终都是编译为 require/exports 来执行的。

- CommonJS 规范规定，每个模块内部， module 变量代表当前模块。这个变量是一个对象，它的 exports 属性（即module.exports ）是对外的接口。加载某个模块，其实是加载该模块的 module.exports 属性。

- export 命令规定的是对外的接口，必须与模块内部的变量建立一一对应关系。

### `import`引入脚本文件省略后缀名，Node会怎样查找？

如果脚本文件省略了后缀名，比如`import './foo'`，Node 会依次尝试四个后缀名：`./foo.mjs`、`./foo.js`、`./foo.json`、`./foo.node`。如果这些脚本文件都不存在，Node 就会去加载`./foo/package.json`的main字段指定的脚本。如果`./foo/package.json`不存在或者没有main字段，那么就会依次加载`./foo/index.mjs`、`./foo/index.js`、`./foo/index.json`、`./foo/index.node`。如果以上四个文件还是都不存在，就会抛出错误。

### 请解释下面代码为什么不能用作 IIFE：`function foo(){ }();`，需要作出哪些修改才能使其成为 IIFE？

IIFE（Immediately Invoked Function Expressions）代表立即执行函数。 JavaScript 解析器将 `function foo(){ }();`解析成`function foo(){ }`和`();`。其中，前者是函数声明；后者（一对括号）是试图调用一个函数，却没有指定名称，因此它会抛出`Uncaught SyntaxError: Unexpected token`的错误。

修改方法是：再添加一对括号，形式上有两种：`(function foo(){ })()`和`(function foo(){ }())`。以上函数不会暴露到全局作用域，如果不需要在函数内部引用自身，可以省略函数的名称。

### documen.write和 innerHTML的区别？

document.write只能重绘整个页面，innerHTML可以重绘页面的一部分

### DOM操作——怎样添加、移除、移动、复制、创建和查找节点？

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
    - `DOM.getElementsByName()` // name属性查找
    - `DOM.getElementById()` // id查找

### 数组和对象有哪些原生方法，列举一下？

- 数组：
    `push`, `pop`, `shift`, `unshift`, `concat`, `splice`, `slice`

    其中队列方法：`push`, `shift`
    栈方法：`push`, `pop`
- 对象：
    `assign`, `create`, `defineProperty`, `defineProperty`, `entries`, `freeze`, `getOwnPropertyDescriptor`, `getOwnPropertyDescriptors`, `getOwnPropertyNames`, `getOwnPropertySymbols`, `getPropertyOf`, `is`, `isExtensible`, `isFrozen`, `hasOwnPropertyOf`

### jquery.extend 与 jquery.fn.extend的区别？

- `jquery.extend` 为jquery类添加类方法，可以理解为添加静态方法
- 源码中`jquery.fn = jquery.prototype`，所以对jquery.fn的扩展，就是为jquery类添加成员函数
 使用
- `jquery.extend`扩展，需要通过jquery类来调用，而jquery.fn.extend扩展，所有jquery实例都可以直接调用

### 什么是polyfill？

polyfill 是“在旧版浏览器上复制标准 API 的 JavaScript 补充”,可以动态地加载 JavaScript 代码或库，在不支持这些标准 API 的浏览器中模拟它们。

例如，geolocation（地理位置）polyfill 可以在 navigator 对象上添加全局的 geolocation 对象，还能添加 getCurrentPosition 函数以及“坐标”回调对象，
所有这些都是 W3C 地理位置 API 定义的对象和函数。因为 polyfill 模拟标准 API，所以能够以一种面向所有浏览器未来的方式针对这些 API 进行开发，
一旦对这些 API 的支持变成绝对大多数，则可以方便地去掉 polyfill，无需做任何额外工作。

### 谈谈你对webpack的看法？

WebPack 是一个模块打包工具，你可以使用WebPack管理你的模块依赖，并编绎输出模块们所需的静态文件。它能够很好地管理、打包Web开发中所用到的HTML、Javascript、CSS以及各种静态文件（图片、字体等），让开发过程更加高效。对于不同类型的资源，webpack有对应的模块加载器。webpack模块打包器会分析模块间的依赖关系，最后 生成了优化且合并后的静态资源

### Webpack热更新实现原理?

1. Webpack编译期，为需要热更新的 entry 注入热更新代码(EventSource通信)
2. 页面首次打开后，服务端与客户端通过 EventSource 建立通信渠道，把下一次的 hash 返回前端
3. 客户端获取到hash，这个hash将作为下一次请求服务端 hot-update.js 和 hot-update.json的hash
4. 修改页面代码后，Webpack 监听到文件修改后，开始编译，编译完成后，发送 build 消息给客户端
5. 客户端获取到hash，成功后客户端构造hot-update.js script链接，然后插入主文档
6. hot-update.js 插入成功后，执行hotAPI 的 createRecord 和 reload方法，获取到 Vue 组件的 render方法，重新 render 组件， 继而实现 UI 无刷新更新。

### 函数截流和函数防抖？

函数节流: 频繁触发,但只在特定的时间内才执行一次代码

```javascript
// 函数节流
var canRun = true;
document.getElementById("throttle").onscroll = function(){
    if(!canRun){
        // 判断是否已空闲，如果在执行中，则直接return
        return;
    }

    canRun = false;
    setTimeout(function(){
        console.log("函数节流");
        canRun = true;
    }, 300);
};
```

函数防抖: 频繁触发,但只在特定的时间内没有触发执行条件才执行一次代码

```javascript
// 函数防抖
var timer = false;
document.getElementById("debounce").onscroll = function(){
    clearTimeout(timer); // 清除未执行的代码，重置回初始化状态

    timer = setTimeout(function(){
        console.log("函数防抖");
    }, 300);
};
```

### `Object.is()` 与原来的比较操作符“ ===”、“ ==”的区别？

- 两等号判等，会在比较时进行类型转换
- 三等号判等，比较时不进行隐式类型转换
- `Object.is`在三等号基础上处理了`NaN`、`-0` 和`+0`，使得`-0`和`+0`不同，`Object.is(NaN, NaN)`返回`true`

### 页面重构怎么操作？

网站重构：在不改变外部行为的前提下，简化结构、添加可读性，而在网站前端保持一致的行为。
也就是说是在不改变UI的情况下，对网站进行优化，在扩展的同时保持一致的UI。

对于传统的网站来说重构通常是：

- 表格(table)布局改为DIV+CSS
- 使网站前端兼容于现代浏览器(针对于不合规范的CSS、如对IE6有效的)
- 对于移动平台的优化
- 针对于SEO进行优化
- 深层次的网站重构应该考虑的方面

- 减少代码间的耦合
- 让代码保持弹性
- 严格按规范编写代码
- 设计可扩展的API
- 代替旧有的框架、语言(如VB)
- 增强用户体验
- 通常来说对于速度的优化也包含在重构中

- 压缩JS、CSS、image等前端资源(通常是由服务器来解决)
- 程序的性能优化(如数据读写)
- 采用CDN来加速资源加载
- 对于JS DOM的优化
- HTTP服务器的文件缓存

### 设计模式 知道什么是singleton, factory, strategy, decrator么？

- **Singleton，单例模式**：保证一个类只有一个实例，并提供一个访问它的全局访问点
- **Factory Method**，工厂方法：定义一个用于创建对象的接口，让子类决定实例化哪一个类，Factory Method使一个类的实例化延迟到了子类
- **Strategy，策略模式**：定义一系列的算法，把他们一个个封装起来，并使他们可以互相替换，本模式使得算法可以独立于使用它们的客户
- **Decrator，装饰模式**：动态地给一个对象增加一些额外的职责，就增加的功能来说，Decorator模式相比生成子类更加灵活

### 什么叫优雅降级和渐进增强？

- **优雅降级**：Web站点在所有新式浏览器中都能正常工作，如果用户使用的是老式浏览器，则代码会针对旧版本的IE进行降级处理了,使之在旧式浏览器上以某种形式降级体验却不至于完全不能用。如：border-shadow

- **渐进增强**：从被所有浏览器支持的基本功能开始，逐步地添加那些只有新版本浏览器才支持的功能,向页面增加不影响基础浏览器的额外样式和功能的。当浏览器支持时，它们会自动地呈现出来并发挥作用。如：默认使用flash上传，但如果浏览器支持 HTML5 的文件上传功能，则使用HTML5实现更好的体验

### WEB应用从服务器主动推送Data到客户端有那些方式？

- html5提供的Websocket
- 不可见的iframe
- WebSocket通过Flash
- XHR长时间连接
- XHR Multipart Streaming
- `<script>`标签的长时间连接(可跨域)

### 对Node的优点和缺点提出了自己的看法？

- 优点：Node是基于事件驱动和无阻塞的，所以非常适合处理并发请求
- 缺点：Node是一个相对新的开源项目，所以不太稳定，它总是一直在变，
    而且缺少足够多的第三方库支持。

### http状态码有那些？分别代表是什么意思？

简单版：

- 100 Continue	继续，一般在发送post请求时，已发送了http
- header之后服务端将返回此信息，表示确认，之后发送具体参数信息
- 200 OK 		正常返回信息
- 201 Created  	请求成功并且服务器创建了新的资源
- 202 Accepted 	服务器已接受请求，但尚未处理
- 301 Moved Permanently  请求的网页已永久移动到新位置。
- 302 Found  		临时性重定向。
- 303 See Other  	临时性重定向，且总是使用 GET 请求新的 URI。
- 304 Not Modified 自从上次请求后，请求的网页未修改过。

- 400 Bad Request  服务器无法理解请求的格式，客户端不应当尝试再次使用相同的内容发起请求。
- 401 Unauthorized 请求未授权。
- 403 Forbidden  	禁止访问。
- 404 Not Found  	找不到如何与 URI 相匹配的资源。

- 500 Internal Server Error  最常见的服务器端错误。
- 503 Service Unavailable 服务器端暂时无法处理请求（可能是过载或维护）。

完整版

1. (信息类)：表示接收到请求并且继续处理
  	- 100——客户必须继续发出请求
  	- (信息类)：表示接收到请求并且继续处理
      	- 100——客户必须继续发出请求
      	- 101——客户要求服务器根据请求转换HTTP协议版本

2. (响应成功)：表示动作被成功接收、理解和接受
  	- 200——表明该请求被成功地完成，所请求的资源发送回客户端
  	- 201——提示知道新文件的URL
  	- 202——接受和处理、但处理未完成
  	- 203——返回信息不确定或不完整
  	- 204——请求收到，但返回信息为空
  	- 205——服务器完成了请求，用户代理必须复位当前已经浏览过的文件
  	- 206——服务器已经完成了部分用户的GET请求

3. (重定向类)：为了完成指定的动作，必须接受进一步处理
    - 300——请求的资源可在多处得到
    - 301——本网页被永久性转移到另一个URL
    - 302——请求的网页被转移到一个新的地址，但客户访问仍继续通过原始URL地址，重定向，新的URL会在response中的Location中返回，浏览器将会使用新的URL发出新的Request。
    - 303——建议客户访问其他URL或访问方式
    - 304——自从上次请求后，请求的网页未修改过，服务器返回此响应时，不会返回网页内容，代表上次的文档已经被缓存了，还可以继续使用
    - 305——请求的资源必须从服务器指定的地址得到
    - 306——前一版本HTTP中使用的代码，现行版本中不再使用
    - 307——申明请求的资源临时性删除

4. (客户端错误类)：请求包含错误语法或不能正确执行
    - 400——客户端请求有语法错误，不能被服务器所理解
    - 401——请求未经授权，这个状态代码必须和WWW-Authenticate报头域一起使用
    - HTTP 401.1 - 未授权：登录失败
    　　- HTTP 401.2 - 未授权：服务器配置问题导致登录失败
    　　- HTTP 401.3 - ACL 禁止访问资源
    　　- HTTP 401.4 - 未授权：授权被筛选器拒绝
    - HTTP 401.5 - 未授权：ISAPI 或 CGI 授权失败
    - 402——保留有效ChargeTo头响应
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
  	- 404——一个404错误表明可连接服务器，但服务器无法取得所请求的网页，请求资源不存在。eg：输入了错误的URL
  	- 405——用户在Request-Line字段定义的方法不允许
  	- 406——根据用户发送的Accept拖，请求资源不可访问
  	- 407——类似401，用户必须首先在代理服务器上得到授权
  	- 408——客户端没有在用户指定的饿时间内完成请求
  	- 409——对当前资源状态，请求不能完成
  	- 410——服务器上不再有此资源且无进一步的参考地址
  	- 411——服务器拒绝用户定义的Content-Length属性请求
  	- 412——一个或多个请求头字段在当前请求中错误
  	- 413——请求的资源大于服务器允许的大小
  	- 414——请求的资源URL长于服务器允许的长度
  	- 415——请求资源不支持请求项目格式
  	- 416——请求中包含Range请求头字段，在当前请求资源范围内没有range指示值，请求也不包含If-Range请求头字段
  	- 417——服务器不满足请求Expect头字段指定的期望值，如果是代理服务器，可能是下一级服务器不能满足请求长。

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
    - HTTP 503：由于超载或停机维护，服务器目前无法使用，一段时间后可能恢复正常101——客户要求服务器根据请求转换HTTP协议版本

### 一个页面从输入 URL 到页面加载显示完成，这个过程中都发生了什么？（流程说的越详细越好）

详细版：
1. 浏览器会开启一个线程来处理这个请求，对 URL 分析判断如果是 http 协议就按照 Web 方式来处理;
2. 调用浏览器内核中的对应方法，比如 WebView 中的 loadUrl 方法;
3. 通过DNS解析获取网址的IP地址，设置 UA 等信息发出第二个GET请求;
4. 进行HTTP协议会话，客户端发送报头(请求报头);
5. 进入到web服务器上的 Web Server，如 Apache、Tomcat、Node.JS 等服务器;
6. 进入部署好的后端应用，如 PHP、Java、JavaScript、Python 等，找到对应的请求处理;
7. 处理结束回馈报头，此处如果浏览器访问过，缓存上有对应资源，会与服务器最后修改时间对比，一致则返回304;
8. 浏览器开始下载html文档(响应报头，状态码200)，同时使用缓存;
9. 文档树建立，根据标记请求所需指定MIME类型的文件（比如css、js）,同时设置了cookie;
10. 页面开始渲染DOM，JS根据DOM API操作DOM,执行事件绑定等，页面显示完成。

简洁版：
1. 浏览器根据请求的URL交给DNS域名解析，找到真实IP，向服务器发起请求；
2. 服务器交给后台处理完成后返回数据，浏览器接收文件（HTML、JS、CSS、图象等）；
3. 浏览器对加载到的资源（HTML、JS、CSS等）进行语法解析，建立相应的内部数据结构（如HTML的DOM）；
4. 载入解析到的资源文件，渲染页面，完成。

### 什么是持久连接？

HTTP协议采用“请求-应答”模式，当使用普通模式，即非keep-alive模式时，每个请求和服务器都要新建一个链接，完成后立即断开连接（HTTP协议为无连接的协议）

当使用keep-alive模式（又称持久连接、连接重用）时，keep-alive功能是客户端到服务器端的连接持续有效，当出校对服务器的后继请求时，keep-alive功能避免了建立或者重新建立连接

### 什么是管线化？

在使用持久连接的情况下，某个链接上消息的传递类似于请求1 -> x响应1 -> 请求2 -> 响应2

管线化，在持久连接的基础上，类似于请求1 -> 请求2 -> 响应1 -> 响应2

管线化特点：
1. 管线化机制通过持久化完成，仅HTTP/1.1支持
2. 只有GET和HEAD请求可以进行管线化，而POST有所限制
3. 管线化不会影响响应到来的顺序
4. 服务器端支持管线化，并不要求服务器端也对响应进行管线化处理，只是要求对于管线化的请求不失败

### HTTP/1.1与HTTP/2.0的区别

1. **多路复用**

    HTTP/2.0使用多路复用技术，使用同一个TCP连接来处理多个请求。

2. **首部压缩**

    HTTP/1.1的首部带有大量信息，而且每次都要重复发送。HTTP/2.0要求通讯双方各自缓存一份首部字段表，从而避免了重复传输。

3. **服务端推送**

    在客户端请求一个资源时，会把相关的资源一起发送给客户端，客户端就不需要再次发起请求了。例如客户端请求index.html页面，服务端就把index.js一起发送给客户端。

4. **二进制格式**

    HTTP/1.1的解析基于文本的，而HTTP/2.0采用二级制格式。

### React和Vue相似之处和不同之处？
React和Vue相似之处：
- 使用Virtual DOM
- 提供了响应式（Reactive）和组件化（Composable）的视图组件
- 将注意力集中保持在和核心库，而将其他功能如路由和全局状态交给相关的库

不同之处：
- React有更丰富的生态系统
- React在某个组件状态发生变化时，它会以该组件为根，重新渲染整个组件子树，而Vue自动追踪，精确知晓哪个组件需要被重渲染
- React渲染功能依靠JSX，支持类型检查、编译器自动完成，linting，Vue默认推荐的还是模板
- CSS作用域在React中是通过CSS-in-JS方案实现，Vue设置样式的默认方法时单文件组件里类似style的标签
- 编写有本地渲染能力的APP，React有React Native，比较成熟。Vue有Weex，还在快速发展中

### 对MVVM的认识？

1. 先聊一下MVC

MVC：Model（模型） View（视图） Controller（控制器），主要是基于分层的目的，让彼此的职责分开。

View通过Controller和Model联系，Controller是View和Model的协调者，view和Model不直接联系，基本联系都是单向的。

![](https://note.youdao.com/yws/public/resource/813e8f68e489060d70ccfdff42b3aecc/xmlnote/5D8BB99FBC214D8C970E9C870FA49A7E/17046)

2. 顺带提下MVP

MVP：是从MVC模式演变而来的，都是通过Controller/Presenter负责逻辑的处理+Model提供数据+View负责显示。

在MVP中，Presenter完全把View和Model进行分离，主要的程序逻辑在Presenter里实现。并且，Presenter和View是没有直接关联的，是通过定义好的接口进行交互，从而使得在变更View的时候可以保持Presenter不变。这样可以在没有view层就可以单元测试。

![](https://note.youdao.com/yws/public/resource/813e8f68e489060d70ccfdff42b3aecc/xmlnote/2E48C84A45C644EA85FAF979D88C8790/17044)

3. 再聊聊MVVN

MVVM：Model + View + ViewModel，把MVC中的Controller和MVP中的Presenter改成ViewModel

view的变化会自动更新到ViewModel，ViewModel的变化也会自动同步到View上显示。这种自动同步是因为ViewModel中的属性实现了Observer，当属性变更时都能触发对应操作。

- View 是HTML文本的js模板；
- ViewModel是业务逻辑层（一切js可视业务逻辑，比如表单按钮提交，自定义事件的注册和处理逻辑都在viewmodel里面负责监控两边的数据）；
- Model数据层，对数据的处理（与后台数据交互的增删改查）

提一下我熟悉的MVVM框架：vue.js，Vue.js是一个构建数据驱动的 web 界面的渐进式框架。Vue.js 的目标是通过尽可能简单的 API 实现响应的数据绑定和组合的视图组件。核心是一个响应的数据绑定系统。

4. 一句话总结下不同之处

MVC中联系是单向的，MVP中P和V通过接口交互，MVVM的联系是双向的

### DOM元素e的e.getAttribute(propName)和e.propName有什么区别和联系？

- e.getAttribute()，是标准DOM操作文档元素属性的方法，具有通用性可在任意文档上使用，返回元素在源文件中设置的属性；
- e.propName通常是在HTML文档中访问特定元素的特性，浏览器解析元素后生成对应对象（如a标签生成HTMLAnchorElement），这些对象的特性会根据特定规则结合属性设置得到，对于没有对应特性的属性，只能使用getAttribute进行访问；
- 一些attribute和property不是一一对应如：form控件中<input value="hello"/>对应的是defaultValue，修改或设置value property修改的是控件当前值，setAttribute修改value属性不会改变value property；

### offsetWidth/offsetHeight,clientWidth/clientHeight与scrollWidth/scrollHeight的区别？

- offsetWidth/offsetHeight返回值包含content + padding + border，效果与e.getBoundingClientRect()相同
- clientWidth/clientHeight返回值只包含content + padding，如果有滚动条，也不包含滚动条
- scrollWidth/scrollHeight返回值包含content + padding + 溢出内容的尺寸

![](https://note.youdao.com/yws/public/resource/bb7792e904a30442f11cb6c88c33cce8/xmlnote/ACF07159847B4EA28246D4B1296834DB/14414)

### XMLHttpRequest通用属性和方法

1. readyState:表示请求状态的整数，取值：
    - UNSENT（0）：对象已创建
    - OPENED（1）：open()成功调用，在这个状态下，可以为xhr设置请求头，或者使用send()发送请求
    - HEADERS_RECEIVED(2)：所有重定向已经自动完成访问，并且最终响应的HTTP头已经收到
    - LOADING(3)：响应体正在接收
    - DONE(4)：数据传输完成或者传输产生错误
2. onreadystatechange：readyState改变时调用的函数
3. status：服务器返回的HTTP状态码（如，200， 404）
4. statusText:服务器返回的HTTP状态信息（如，OK，No Content）
5. responseText:作为字符串形式的来自服务器的完整响应
6. responseXML: Document对象，表示服务器的响应解析成的XML文档
7. abort():取消异步HTTP请求
8. getAllResponseHeaders(): 返回一个字符串，包含响应中服务器发送的全部HTTP报头。每个报头都是一个用冒号分隔开的名/值对，并且使用一个回车/换行来分隔报头行
9. getResponseHeader(headerName):返回headName对应的报头值
10. open(method, url, asynchronous [, user, password]):初始化准备发送到服务器上的请求。method是HTTP方法，不区分大小写；url是请求发送的相对或绝对URL；asynchronous表示请求是否异步；user和password提供身份验证
11. setRequestHeader(name, value):设置HTTP报头
12. send(body):对服务器请求进行初始化。参数body包含请求的主体部分，对于POST请求为键值对字符串；对于GET请求，为null

### focus/blur与focusin/focusout的区别和联系

1. focus/blur不冒泡，focusin/focusout冒泡；
2. focus/blur兼容好，focusin/focusout在除FireFox外的浏览器下都保持良好兼容性；
3. 可获得焦点的元素：
    * window
    * 链接被点击或键盘操作
    * 表单空间被点击或键盘操作
    * 设置tabindex属性的元素被点击或键盘操作

### mouseover/mouseout与mouseenter/mouseleave的区别与联系？

- mouseover/mouseout是冒泡事件；mouseenter/mouseleave不冒泡。需要为多个元素监听鼠标移入/出事件时，推荐mouseover/mouseout托管，提高性能

### 函数内部arguments变量有哪些特性,有哪些属性,如何将它转换为数组

- arguments所有函数中都包含的一个局部变量，是一个类数组对象，对应函数调用时的实参。如果函数定义同名参数会在调用时覆盖默认对象
- arguments[index]分别对应函数调用时的实参，并且通过arguments修改实参时会同时修改实参
- arguments.length为实参的个数（Function.length表示形参长度）
- arguments.callee为当前正在执行的函数本身，使用这个属性进行递归调用时需注意this的变化
- arguments.caller为调用当前函数的函数（已被遗弃）
- 转换为数组：`var args = Array.prototype.slice.call(arguments, 0);`

### 解释原型继承的工作原理

所有的js对象都有一个prototype属性，指向它的原型对象。当试图访问一个对象，如果在该对象上没有找到，它还会搜寻该对象的原型，以及该对象的原型的原型，依次向上搜索，直到找到一个名称匹配的属性或到达原型链的末尾。

### 你觉得jQuery源码有哪些写的好的地方？

- jquery源码封装在一个匿名函数的自执行环境中，有助于防止变量的全局污染，然后通过传入window对象参数，可以使window对象作为局部变量使用，好处是当jquery中访问window对象的时候，就不用将作用域链退回到顶层作用域了，从而可以更快的访问window对象。同样，传入undefined参数，可以缩短查找undefined时的作用域链
- jquery将一些原型属性和方法封装在了jquery.prototype中，为了缩短名称，又赋值给了jquery.fn，这是很形象的写法
- 有一些数组或对象的方法经常能使用到，jQuery将其保存为局部变量以提高访问速度
- jquery实现的链式调用可以节约代码，所返回的都是同一个对象，可以提高代码效率

### ES6相对ES5有哪些新特性？

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

### 提升页面性能的方法有哪些？

1. 资源压缩合并，减少HTTP请求

2. 非核心代码异步加载

    追问：异步加载的方式？
    （1）动态脚本加载（2）`defer`（3）`async`
    追问：异步加载的区别？
    （1）`defer`是在HTML解析完后才执行，如果是多个，按照执行加载顺序依次执行（2）`async`是在加载完之后立即执行，如果是多个，执行顺序和加载顺序无关。

3. 利用浏览器缓存

    追问：缓存的分类，缓存的原理？

    强缓存：不询问服务器直接用

    服务器响应头
    Expires Expires: Thu,21 Jan... 这是个绝对时间，由于服务器和客户端有时差，后来在HTTP/1.1中就改成了Cache-Control。
    Cache-Control Cache-Control:max-age=3600 这个是时长，从当前时间起缓存时长。


    协商缓存：询问服务器当前缓存是否过期
    服务器下发Last-Modified 浏览器请求If-Modifield-Since Thu,21 Jan... 修改时间
    服务器下发Etag 浏览器请求If-None-Match 资源是否被改动过
4. 使用CDN

5. 预解析DNS

`<a>`标签浏览器默认模式是预解析的，但是对于https是关闭的，需要在`header`中添加
```javascript
<meta http-equip="x-dns-prefetch-control" content="on">
<link rel="dns-prefetch" href="//host_name_to_prefetch.com">
```
开启DNS预解析

### 错误监控

1. 前端错误分类：（1）及时运行错误（2）资源加载错误

2. 及时运行错误的捕获方式：（1）try..catch（2）window.onerror

3. 资源加载错误：

    （1）object.onerror

    （2）performance.getEntries()
        获取成功加载资源的api，对比一下现有资源，就可以知道失败加载的资源。

    （3）Error事件捕获

        ps:资源加载错误不会冒泡到`body`上，但是捕获事件可以

        ```javascript
        window.addEventListener('error', function(e) {
            console.log(e);
        }, true)
        ```

拓展：跨域错误可以捕获到吗？怎么处理错误？

属于资源加载错误，可以被捕获到。处理：在客户端，script标签增加`crossorigin`属性，服务端增加HTTP响应头增加`Access-Control-Allow-Origin:*/`

4. 上报错误的基本原理

1. 用`Ajax`通信上报
2. 用`Image`对象上报

    ```javascript
    (new Image()).src = 'http://xxx.com/posterror?error=xxx'
    ```
