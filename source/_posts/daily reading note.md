---
title: daily reading note
date: 2017-04-02 19:00:00
tags: javascript
categories: javascript
---

### 记录日常看书、看博客小记

##### DOM2 DOM3 有关属性

**检测节点是否相等 isSomeNode isEqualNode**

```
div1 = document.createElement("div");
div2 = document.createElement("div");

div1.isSameNode(div1); // true
div1.isSameNode(div2); // false
div1.isEqualNode(div2); // true
```

**获取框架文档对象 contentDocument contentWindow**

```
var iframe = document.getElementById("myIframe");
var iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
```

**获取行间样式遇到 float 要用 styleFloat**

```
myDiv.styleFloat = "left";
```

**几个重要样式属性和方法**

- cssText
- length
- item(index)
- getPropertyValue(propertyName)
- removeProperty(propertyName)
- setProperty(propertyName, value, priority)

```
var demo = document.getElementById("demo");
var prop, val, i, len;

for(var i = 0, len = demo.style.length; i < len; i++) {
    prop = demo.style[i];
    val = demo.style.getPropertyValue(prop);

    console.log(prop, val);
}
```

**计算样式 computedStyle
ie9-使用 oDiv.currentStyle**

```
var computedStyle = document.getComputedStyle(oDiv, null);

var bl = computedStyle.borderLeftStyle;
```

**对样式表操作**

```
var sheet = null;
for(var i = 0, len = document.styleSheets.length; i++) {
    sheet =document.styleSheets[i];
    console.log(sheet.href);
}
```

```
var sheet = document.styleSheets[0];
var rules = sheet.cssRules || sheet.rules;
var value = rules[0];
rule.style.backgroundColor = "red";
// 插入一条样式到样式表
sheet.insertRule("body", "background-color:red;", 0);
```

——2017/11/24

---

##### 样式相关

**偏移量**

> offsetHeight = 元素高度 + （可见）水平滚动条高度 + 上边框高度 + 下边框高度；

> offsetWidth = 元素宽度 + （可见）垂直滚动条宽度 + 左边框高度 + 右边框高度；

> offsetLeft = 元素左边框至包含元素的左内边框之间的像素距离；

> offsetTop = 元素上边框至包含元素的上内边框之间的像素距离；

```
// 想知道某个元素再页面上的偏移量
function getElementLeft(ele) {
    var actualLeft = ele.offsetLeft;
    var current = ele.offsetParent;

    while(current !== null) {
        actualLeft += current.offsetLeft;
        current = current.offsetParent;
    }

    return actualLeft;
}
```

**客户区大小**

> clientWidth = 元素内容区宽度 + 左右内边距宽度；

> clientHeight = 元素内容区高度 + 左右内边距高度；

**滚动大小**

> scrollHeight: 在没有滚动条的情况下，元素内容的总高度；

> scrollWidth: 在没有滚动条的情况下，元素内容的总宽度；

> scrollLeft: 被隐藏在内容区域左侧的像素数。通过设置这个属性可以改变元素的滚动位置。

> scrollTop: 被隐藏在内容区域上方的像素数。通过设置这个属性可以改变元素的滚动位置。

PS：在不包含滚动条的页面而言，scrollWidth 与 clientWidth，scrollHeight 与 clientHeight 的关系并不是十分清晰。

1. Firefox，这两组属性始终相等，但大小代表的是文档内容区域的实际尺寸，而非视口尺寸；
2. Oprea、safari、chrome 中这两组属性有差别，其中 scrollWidth 和 scrollHeight 等于视口大小，而 clientWidth 和 clientHeight 等于文档区域大小；
3. IE，这两组属性不相等，scrollHeight 和 scrollWidth 等于文档内容区域大小，而 clientHeight 和 clientWidth 等于视口大小；

所以，我们一般采用获取最大值，保证跨浏览器准确：

```
var docHeight = Math.max(document.documentElement.scrollHeight, doucument.documentElment.clientHeight);
```

html4.0 的 `DTD`

```html
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
```

html5 的 `DTD`

```html
<!DOCTYPE html>
```

在文档使用了 `DTD` 时，`document.body.scrollHeight` 值为 0，没有用 `DTD` 时不为 0

**确定元素大小**

getBoundingClientRect()方法，返回一个对象，包括四个属性：left、top、right 和 bottom。这些属性给出了元素相对视口的位置。

——2017/11/26

---

##### 范围

> selectNode() 选择整个节点

> selectNodeContents() 只选择节点的子节点

html

```
<p id="p1"><b>Hello</b>World!</p>
```

js

```
var p1 = document.getElementById("p1"),
    helloNode = p1.firstChild.firstChild,
    worldNode = p1.lastChild,
    range = document.createRange();

var span = document.createElement("span");
span.style.color = "red";

range.selectNode(helloNode); // 选择整个节点
range.surroundContents(span); // 包含选择的节点

```

```
range.deleteContents(); // 删除范围选区
var fragment = range.extractContents(); // 移除范围选区，返回文档片段
var fragment = range.cloneContents(); // 赋值范围选区

span.appendChild(document.createTextNode("Inserted Text"));
range.insertNode(span); // 在选区前插入一个节点

```

##### 事件

为了兼容所有浏览器，一般对元素添加、删除事件做如下处理（不过一般 IE9+都没有必要这么做）

```
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
        return ev ? ev : window.event;
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
    // 移除事件
    removeHandler: function(element, type, handler) {
        if(element.removeEventListener) {
            element.removeEventListener(type, handler, false);
        }
        else if(element.detachEvent) {
            element.detachEvent("on" + type, handler);
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
        // 其他 对应mousewheel事件
        if(ev.wheelDelta) {
            return ev.wheelDelta;
        }
        // 兼容Firefox 对应DOMMouseScroll
        else {
            return -ev.detail * 40;
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
            return event.clipboardData.setData("text/plain", value);
        }
        else if(window.clipboardData){
            return window.clipboardData.setData("text", value);
        }
    }
};
```

扫盲：
以前认为在页面卸载的时候没有办法去控制，当初没有注意到 window 下的 beforeunload 事件

```
EventUtil.addHandler(window, "beforeunload", function(ev) {
    var msg = "before unload?";
    ev.returnValue = "before unload?";
    return "before unload ?";
});
```

新认识一个事件，**DOMContentLoaded**事件在形成完整的 DOM 数之后就触发，不会理会图片、JavaScript 文件、css 文件或其他资源是否已经下载完毕。

—— 2017/11/27

---

##### 自定义事件

```
EventUtil.addHandler(selfBtn, "myEvent", function(ev) {
    ev = EventUtil.getEvent(ev);

    console.log("btn myEvent:", ev.detail);
});

EventUtil.addHandler(document, "myEvent", function (ev) {
    ev = EventUtil.getEvent(ev);

    console.log("document myEvent:", ev.detail);
});

var event = document.createEvent("CustomEvent");
event.initCustomEvent("myEvent", true, false, "hello my event");
selfBtn.dispatchEvent(event);

```

—— 2017/12/6

---

##### 表单

form 表单作为一种古老的数据提交方式，很多细节还真是头回见，下面小记下。

```
<form action="http://xxx.com" method="post" id="form1">
    <p>
        <label>姓名：</label>
        <input type="text" value="" id="username">
    </p>
    <p>
        <label>性别：</label>
        <input type="text" value="" id="username">
        <select name="gender">
            <option value="0">男</option>
            <option value="1">女</option>
        </select>
    </p>
</form>
```

```
var forms = document.forms // 获取页面中所有form集合
var firstForm = document.forms[0]; // 索引获取表单
var form1 = document.forms["form1"]; // 根据名称获取表单
```

单击一下代码生成的按钮，可以提交表单

```
<input type="submit" value="Submit form">
<button type="submit" >Submit form</button>
<input type="image" src="demo.png">
```

这种方式提交表单，浏览器会将请求发送到服务器之前触发 submit 事件。

```
var form = document.querySelector("form");
var firstField = form.elements[0];
var field1 = form.elements["name"];
```

除了<fieldset>元素外，所有表单字段拥有相同的一组属性：disabled、form、name、readonly、tabIndex、type、value。

值得注意的是，对 value 属性所做的修改，不一定会反映在 DOM 中，因此，在处理文本框的值时，最好不要使用 DOM 方法。

为解决不知道用户选择了什么文本的困扰，新认识了两个属性：**selectionStart**、**selectionEnd**。

```
$name.addEventListener("select", function(ev) {
    if(typeof $name.selectionStart == "number") {
        console.log($name.value.substring($name.selectionStart, $name.selectionEnd));
    }
    else if(document.selection) { // IE8-
        console.log(document.selection.createRange().text);
    }
});
```

设置选中部分文本解决方案：**setSelectionRange**

```
$name.value = "hello form";
$name.setSelectionRange(0, 4); // hel
$name.focus();
```

复制&&粘贴问题解决方案：**event.clipboardData**/window.clipboardData 获取到 clipboardData 对象，有 setData 和 getData 方法。只有 opera 不支持。Firefox、safari 和 chrome 只允许在 paste 事件发生时读取剪贴板数据，而 ie 没有这个限制。

以前对 select 的操作过于依赖 jQuery 或者 DOM 操作，其实本身有些很好的方法和属性。
HTMLSelectElement 提供的一些属性和方法：

1. add(newOption, relOption)：向控件中插入新<option>元素，其位置在相关项 relOption 之前。
2. multiple：是否允许多项选择。
3. options：控件中所有<option>元素的 HTMLCollection。
4. remove(index)：移除给定位置的选项。
5. selectedIndex：基于 0 的选中项索引，没有选中项，返回-1.对于多选项，只返回选中项中的第一项索引。
6. size：选择框中可见行数。

HTMLOptionElement 有一下属性：

1. index：当前选项在 options 集合中的索引。
2. label：当前选项的标签。
3. selected：当前选项是否被选中。将这个属性设置位 true 可以选中当前选项。
4. text：选项的文本。
5. value：选项的值。

```
<select name="is-student" id="is-student">
    <option value="0">否</option>
    <option value="1">是</option>
    <option value="2">不清楚</option>
    <option value="3">不明白</option>
    <option value="4">不知道</option>
</select>
```

```
options = $isStudent.options;
// 将第四位置上的option元素插入到第二位前面
$isStudent.add(options[3], options[1]);
// 移除第五位option元素
$isStudent.remove(4);
// 将第三项选中
options[2].selected = true;

console.log("选中了的项索引：", $isStudent.selectedIndex); // 2

console.log("选中项的文本：", options[$isStudent.selectedIndex].text); // 是

console.log("选中项的标签：", options[$isStudent.selectedIndex].label); // 是

console.log("选中项的在options集合中的索引：", options[$isStudent.selectedIndex].index); // 2
```

—— 2017/12/8

---

#### typeof undefined

以前总迷惑，为嘛能够直接

```
if(aaa === undefined)
```

看到别人偏偏

```
if(typeof aaa == "undefined")
```

今天才明白其中道理：因为在 js 中 undefined 可以被重写，这样防止页面中有 undefined 变量存在。下面来看看区别：

```
(function(undefined) {
    var a;
    console.log("test1: ", a === undefined); // false
    console.log("test1: ", "abc" === undefined); // true
})("abc");

(function(undefined) {
    // var a;
    console.log("test2: ", typeof a === "undefined"); // true
    console.log("test2: ", "abc" === undefined); // true
})("abc");
```

**作用于安全构造函数**
构造函数其实是一个使用 new 操作符调用的函数。当使用 new 调用时，构造函数内用到的 this 对象会指向新创建的对象实例。

```
function Person(name, age) {
    this.name = name;
    this.age = age;
}

var person = new Person("wuwh", "22");
console.log( person.name );
console.log( person.age );
```

如果构造函数被当作普通函数调用，this 就会指向 window 对象，添加成 window 下的属性。

```
var person = Person("wuwh", "22");
console.log(window.name);
console.log(window.age);
```

解决这个问题的方法时创建一个作用域安全的构造函数，原理是在进行任何更改前，确认 this 对象是指向正确的实例。

```
function Person(name, age) {
    if(this instanceof Person) {
        this.name = name;
        this.age = age;
    }
    else {
        return new Person(name, age);
    }
}
```

—— 2017/12/9

---

#### HTML5 原生 API

**XDM**

跨文档消息传送（XDM）,HTML5 原生提供了 postMessage 方法。

postMessage()方法接收两个参数：

1. 一条消息
2. 一个表示消息接收方来自哪个域下的字符串

```
var frameWindow = document.querySelector("iframe").contentWindow;
setTimeout(function() {
    frameWindow.postMessage("hello", "http://localhost");
}, 1000);
```

接收到 XDM 消息时，会触发 window 对象的 message 事件，改事件会包含三个重要信息：

1. data：postMessage()第一个参数；
2. origin：发送消息的文档所在的域；
3. source：发送消息的文档 window 对象的代理，用于发送上一条消息的窗口中调用 postMessage()。

```
// 接收XDM消息
window.addEventListener("message", function(ev) {
    console.log("ev.origin:", ev.origin);
    console.log("ev.data:", ev.data);
    console.log("ev.source:", ev.source);
    ev.source.postMessage("Received!", "http://localhost");
});
```

**拖放事件**

在被拖动元素上依次触发事件：

1. dragstart
2. drag
3. dragend

在防止目标上依次触发事件：

1. dragenter
2. dragover
3. dragleave
4. drop
   为了阻止默认行为，一般都要对 dragenter、dragover 和 drop 绑定阻止默认事件。

认识一个新的事件属性 dataTransfer，用于从被拖放元素向放置目标传递字符串格式的数据。

```
// 设置文本和url数据
ev.dataTransfer.setData("URL", location.href);
ev.dataTransfer.setData("text", "hello drag");

// 接收文本和url数据
console.log("dataTransfer url:", dataTransfer.getData("URL") || dataTransfer.getData("text/uri-list"));
console.log("dataTransfer text:", dataTransfer.getData("text"));

console.log("dataTransfer file:", dataTransfer.file);
```

—— 2017/12/9

---

#### 高级函数

**惰性载入函数**

有时候对浏览器的检测，我们执行一次就行，不必每次调用进行分支检测。解决方案就是惰性载入。

1. 在第一次调用过程中，该函数被覆盖为另一个合适方式执行的函。

```
function createXHR() {
    if(typeof XMLHttpRequest != "undefined") {
        createXHR = function() {
            return new XMLHttpRequest();
        }
    }
    else if(typeof ActiveXObject != "undefined") {
        createXHR = function() {
            return new ActiveXObject("MSXML2.XMLHTTP");
        }
    }

    return createXHR();
}
```

2. 函数声明时就自执行指定恰当的函数。

```
var createXHR = (function () {
    if(typeof XMLHttpRequest != "undefined") {
        createXHR = function() {
            return new XMLHttpRequest();
        }
    }
    else if(typeof ActiveXObject != "undefined") {
        createXHR = function() {
            return new ActiveXObject("MSXML2.XMLHTTP");
        }
    }

    return createXHR();
})();
```

**函数绑定**

指定一个函数内 this 环境，ES5 原生可以用 bind，bind 实现原理时这样的：

```
function bind(fn, context) {
    return function() {
        fn.apply(context, arguments);
    }
}
```

bind 一般用于事件处理程序以及 setTimeout()和 setInterval()。因为这些直接用函数名，函数体内 this 时分别指向元素和 window 的。

**函数柯里化**

上面模拟绑定函数的实现，发现不能传参。于是，对绑定函数进行传参处理叫做函数柯里化。

实现可以传参的 bind 函数。

```
function bind(fn, context) {
    var args = Array.prototype.slice.call(arguments);
    return function() {
        var innerArgs = Array.prototype.slice.call(arguments);
        var finalArgs = args.concat(innerArgs);
        return fn.apply(context, finalArgs);
    }
}
```

**防止篡改对象**

Object.preventExtensions() 防止给对象添加新属性和方法。

```
var person = {
    name: "wuwh"
};
Object.preventExtensions(person);
person.age = 22;
console.log(person.age); // undefined
```

Object.seal() 防止删除对象属性和方法。

```
var person = {
    name: "wuwh"
};
Object.seal(person);
delete person.name;
console.log(person.name); // wuwh
```

Object.freeze() 冻结对象，既不可以拓展，也不可以密封，还不可以修改。

```
var person = {
    name: "wuwh"
};
Object.freeze(person);
person.age = 22;
console.log(person.age); // undefined
delete person.name;
console.log(person.name); // wuwh
person.name = "xiohua";
console.log(person.name); // wuwh
```

**定时器**

理解这段话就明白为什么 setInterval 要谨慎使用了。

> 使用 setInterval()创建的定时器确保了定时器代码规则地插入到队列中。问题在于，定时器代码可能在被添加到队列之前还没有完成执行，结果导致定时器代码运行好几次，而之间没有停顿。在这里 js 引擎避免了这个问题。当时用 setInterval()时，仅当没有该定时器的任何其他代码实例时，才将定时器代码添加到队列中。确保了定时器代码加入到队列地最小时间间隔为指定间隔。

造成后果：(1)某些间隔被跳过；(2)多个定时器地代码执行之间地间隔可能会比预期地小。

—— 2017/12/13

---

```
/**自定义事件基于观察者设计模式
* handlers = {
*    type1: [eventFn1_1, event1_2, ...],
*    type2: [eventFn2_1, event2_2, ...]
*}
*/
function EventTarget() {
    this.handlers = {};
}

EventTarget.prototype = {
    constructor: EventTarget,
    // 添加一个自定义事件
    addHandler: function(type, handler) {
        if(typeof this.handlers[type] == "undefined") {
            this.handlers[type] = [];
        }

        this.handlers[type].push(handler);
    },

    // 遍历执行自定义事件程序
    fire: function(ev) {
        if(!ev.target) {
            ev.target = this;
        }

        if(this.handlers[ev.type] instanceof Array) {
            var handlers = this.handlers[ev.type];

            for(var i = 0, len = handlers.length; i < len; i++) {
                handlers[i](ev);
            }
        }
    },

    // 移除一个自定义事件程序
    removeHandler: function(type, handler) {
        if(this.handlers[type] instanceof Array) {
            var handlers = this.handlers[type];

            for(var i = 0, len = handlers.length; i < len; i++) {
                if(handlers[i] === handler) {
                    handlers.splice(i, 1);
                    break;
                }
            }
        }
    }
}

var DragDrop = function (selector) {
    var dragdrop = new EventTarget();

    var draging = null,
        diffX = 0,
        diffY = 0;

    var target = document.querySelector(selector);

    function handleEvent(ev) {

        switch (ev.type) {
            case "mousedown":
                draging = target;
                diffX = ev.clientX - draging.offsetLeft;
                diffY = ev.clientY - draging.offsetTop;

                // 触发自定义事件
                dragdrop.fire({
                    type: "dragstart",
                    target: draging,
                    x: ev.clientX,
                    y: ev.clientY
                });
                break;
            case "mousemove":
                if (draging !== null) {
                    draging.style.left = (ev.clientX - diffX) + "px";
                    draging.style.top = (ev.clientY - diffY) + "px";
                }

                // 触发自定义事件
                dragdrop.fire({
                    type: "drag",
                    target: draging,
                    x: ev.clientX,
                    y: ev.clientY
                });
                break;
            case "mouseup":
            case "mouseout":
                // 触发自定义事件
                dragdrop.fire({
                    type: "dragend",
                    target: draging,
                    x: ev.clientX,
                    y: ev.clientY
                });
                draging = null;
                break;
        }

        ev.stopPropagation();
    }

    // 单例提供出去的公共接口
        dragdrop.enable = function () {
            target.addEventListener("mousedown", handleEvent, false);
            target.addEventListener("mousemove", handleEvent, false);
            target.addEventListener("mouseup", handleEvent), false;
            target.addEventListener("mouseout", handleEvent), false;
        };

        dragdrop.disable = function () {
            target.removeEventListener("mousedown", handleEvent);
            target.removeEventListener("mousemove", handleEvent);
            target.removeEventListener("mouseup", handleEvent);
        }
    return dragdrop;
};



var dg = DragDrop("#drag");
dg.addHandler("drag", function(ev) {
    console.log(ev.x);
});
dg.enable();
```

—— 2017/12/14

---

#### ES6 之 Symbol

Symbol 是 ES6 中引入的一个第七种数据类型（前六种分别是 undefined、null、Boolean、String、Number、Object）。目的是使得属于 Symbol 类型的属性都是独一无二的，可以保证不与其他属性名产生冲突。

Symbol 函数相同入参，返回值不相等

```
let sym1 = Symbol("my symbol");
let sym2 = Symbol("my symbol");
console.log(sym1 == sym2); // false
```

Symbol 值不能和其他类型的值进行运算，包括自身。但是可以显示转化成字符串，也可以转化成布尔值

```
let sym = Symbol("my symbol");
console.log(Boolean(sym));
console.log(sym.toString()); // Symbol(my symbol)
console.log(sym + ".gif"); // Uncaught TypeError
```

Symbol 值作为对象属性

```
let mySymbol = Symbol();

let a = {};
a[mySymbol] = "Hello";
console.log("a:", a);

let b = {
    [mySymbol]: "Hello"
};
console.log("b:", b);

let c = {};
Object.defineProperty(c, mySymbol, {value: "Hello"});
console.log("c:", c);
```

获取对象所有 Symbol 属性名

```
const obj = {};
let a = Symbol("a");
let b = Symbol("b");

obj[a] = "Hello";
obj[b] = "World";

const objSymbols = Object.getOwnPropertySymbols(obj);
console.log("Object.getOwnPropertySymbols(obj):", Object.getOwnPropertySymbols(obj)); // [Symbol(a), Symbol(b)]

console.log("Object.getOwnPropertyNames(obj):", Object.getOwnPropertyNames(obj)); // []

console.log("Reflect.ownKeys(obj):", Reflect.ownKeys(obj)); // [Symbol(a), Symbol(b)]
```

Symbol.for() 搜索返回已有参数名称的 Symbol 值，没有则会新建以改字符串为名称的 Symbol 值

```
let s1 = Symbol.for("foo");
let s2 = Symbol.for("foo");
console.log("symbol for s1 == s2:", s1 === s2);
// Symbol.keyFor 返回已登记Symbol类型值的key
console.log(Symbol.keyFor(s1)); // foo
console.log(Symbol.keyFor(Symbol("aaa"))); // undefined
```

Symbol.for 登记的名字是全局环境的

```
let iframe = document.createElement("iframe");
iframe.src = location.href;

document.body.appendChild(iframe);

console.log(iframe.contentWindow.Symbol.for("foo") === window.Symbol.for("foo"));
```

#### ES6 之 Proxy

Proxy 属于一种“元编程”，即对编程语言进行编程。可以理解成在木匾对象之前架设一层“拦截”

```
let proxy = new Proxy({}, {
    get: function(target, property) {
        return "wuwh";
    }
});

console.log(proxy.time); // wuwh
console.log(proxy.name); // wuwh
```

Proxy 实例可以作为其他对象的原型对象

```
let proxy = new Proxy({}, {
    get: function(target, property) {
        return "wuwh";
    }
});

let obj = Object.create(proxy);
console.log(proxy.time);
```

Proxy 的一些实例方法

```
let handler = {
    get: function(target, name) {
        if(name === "prototype") {
            return Object.prototype;
        }
        return "Hello, " + name;
    },

    apply: function(target, thisBinding, args) {
        return args[0];
    },

    construct: function(target, args) {
        return {value: args[1]};
    }
};

var fproxy = new Proxy(function(x, y) {
    return x + y;
}, handler);

console.log(fproxy(1, 2)); // 1 被apply拦截
console.log(new fproxy(1, 2)); // {value: 2} 被construct拦截
console.log(fproxy.time); // Hello, time 被get拦截
```

writable 和 configurable 属性都为 false 时，则该属性不能被代理，通过 Proxy 对象访问该属性会报错

```
let obj = {};
    Object.defineProperty(obj, "foo", {
        value: 123,
        writable: false,
        configurable: false
    });

    const handler = {
        get: function(target, propKey) {
            return "wuwh";
        }
    };

    const proxy = new Proxy(obj, handler);

    console.log(proxy.foo);
```

—— 2017/12/15

---

#### ES6 之 Reflect

Reflect 对象与 Proxy 对象一样，也是 ES6 为了操作对象提供的新 API。

Reflect 对象一共有 13 个静态方法。

- Reflect.apply(target, thisArg, args)
- Reflect.construct(target, args)
- Reflect.get(target, name, receiver)
- Reflect.set(target, name, value, receiver)
- Reflect.defineProperty(target, name, desc)
- Reflect.deleteProperty(target, name)
- Reflect.has(target, name)
- Reflect.ownKeys(target)
- Reflect.isExtensible(target)
- Reflect.preventExtensions(target)
- Reflect.getOwnPropertyDescriptor(target, name)
- Reflect.getPrototypeOf(target)
- Reflect.setPrototypeOf(target, prototype)

**Reflect.get && Reflect.set**

在 name 属性部署了读取函数（getter）或者是设置函数（setter），this 绑定 receiver

```
var obj = {
    foo: 1,
    set bar(value) {
        return this.foo = value;
    }
};

var receiveObj = {
    foo: 5
}

Reflect.set(obj, "bar", 3, receiveObj);
console.log("obj.bar:", obj.foo);
console.log("receiveObj.bar:", receiveObj.foo);
```

如果 Proxy 对象和 Reflect 对象联合使用，前者拦截赋值操作，后者完成赋值的默认行为，而且传入 receiver，那么 Reflect.set 会触发 Proxy.defineProperty

```
var obj = {
    name: "wuwh"
};

var loggedObj = new Proxy(obj, {
    set: function(target, key, value, receiver) {
        console.log("set...");
        Reflect.set(target, key, value, receiver);
    },
    defineProperty(target, key, attribute) {
        console.log("defineProperty...");
        Reflect.defineProperty(target, key, attribute);
    }
});

loggedObj.name = "xiaohua"; // set... defineProperty...
```

**Reflect.constructor(target, args)**

```
function Geeting(name) {
    this.name = name;
}

// new 的写法
const instance = new Greeting("张三");

// Reflect.construct的写法
const instance = Reflect.construct(Greeting, ["张三"]);
```

**Reflect.getPrototypeOf(obj) && Reflect.setPrototypeOf(obj, newProto)**

设置和读取对象的**proto**属性

```
function FancyThing() {}
const myObj = new FancyThing();
const obj = {
    constructor: FancyThing,
    name: "wuwh"
};

Reflect.setPrototypeOf(myObj, obj);

console.log(Reflect.getPrototypeOf(myObj)); // obj
```

**Reflect.ownKeys**

```
var obj = {
    foo: 1,
    bar: 2,
    [Symbol.for("foo")]: 3,
    [Symbol.for("baz")]: 4
};

console.log(Object.getOwnPropertyNames(obj)); // ["foo", "bar"]

console.log(Object.getOwnPropertySymbols(obj)); // [Symbol(foo), Symbol(baz)]

console.log(Reflect.ownKeys(obj)); // ["foo", "bar", Symbol(foo), Symbol(baz)]

```

#### ES6 之 Set 和 Map

**set**

Set 是 ES6 新数据结构，类似于数组，但是成员都是唯一的，没有重复的值

```
var s = new Set();
[1, 2, 3, 4, 5, 1, 2, 3].forEach(function(x) {
    return s.add(x);
});

for(let i of s) {
    console.log("set i:", i);
}
```

可以看成是一种数组的去重方法 变量解构

```
const set = new Set([1, 2, 3, 4, 1, 2, 3]);
console.log([...set]); */

/* // 在Set内部，两个NaN是相等的
let set = new Set([NaN, NaN]);
console.log(set); //Set {NaN}
```

两个对象被视为不相等

```
let set1 = new Set([{}, {}]);
console.log(set1); // Set {{}, {}}
```

Set 的方法 add、delete、clear 和 has

```
let s = new Set([0, 1]);

s.add(2).add(3);

console.log(s); // Set {0, 1, 2, 3}
console.log(s.has(3)); // true

s.delete(2);
console.log(s); // Set {0, 1, 3}

s.clear();
console.log(s); // Set(0) {}
```

可以看成是一种数组的去重方法 Array.from

```
const set = new Set([1, 2, 3, 4, 1, 2, 3]);
console.log(Array.from(set));
```

实现并集，交集和差集

```
let a = new Set([1, 2, 3]);
let b = new Set([4, 3, 2]);

let union = new Set([...a, ...b]);
console.log(union); // Set(4) {1, 2, 3, 4}

let intersect = new Set([...a].filter(x => b.has(x)));
console.log(intersect); // Set(2) {2, 3}

let difference = new Set([...a].filter(x => !b.has(x)));
console.log(difference); // Set(1) {1}
```

```
// 垃圾回收机制依赖引用计数，如果一个值的引用次数不为0，垃圾回收机制就不会释放这块内存。
// 结束使用该值之后，有时会忘记取消引用，导致内存无法释放，进而可能会引发内存泄漏。
// WeakSet 中的对象都是弱引用，即垃圾回收机制不考虑 WeakSet 对该对象的引用
// WeakSet成员类型只能是对象类型
let ws = new WeakSet([1, 2]); // Uncaught TypeError: Invalid value used in weak set
console.log(ws);
```

Map 数据结构类似对象，也是键值对的集合，但是“键”的范围不限于字符串，各种类型的值都可以

```
let m = new Map();
let o = {msg: "hello"};

m.set(o, "world");

console.log(m); // Map(1) {{…} => "world"}
console.log(m.get(o)); // world

console.log(m.has(o)); // true
console.log(m.delete(o)); // true
console.log(m.has(o)); // false
```

Map 可以接收一个数组作为参数，数组成员是一个个表示键值对的数组

```
let m = new Map([
    ["name", "wuwh"],
    ["age", 22]
]);

console.log(m); // Map(2) {"name" => "wuwh", "age" => 22}
console.log(m.size); // 2
console.log(m.get("name")); // wuwh
```

事实上不仅仅是数组，任何具有 Iterator 接口、 每个成员都是一个双元素的数组，都可以当作 Map 构造函数的参数

```
let set = new Set([
    ["foo", 1],
    ["bar", 2]
]);

console.log(set); // Set(2) {Array(2), Array(2)}

let m = new Map(set);
console.log(m); // Map(2) {"foo" => 1, "bar" => 2}
```

一个键值多次赋值，后面的会覆盖前面的

```
let m = new Map();
m.set(1, "aaa").set(1, "bbb");
console.log(m); // Map(1) {1 => "bbb"}
```

Map 的键实际上是跟内存地址绑定的，只要内存地址不一样，就视为两个键

```
let m = new Map();

m.set(["a"], 1);
console.log(m.get(["a"])); // undefined
```

forEach 方法接受第二个参数，用来绑定 this

```
let reporter = {
    report: function(key, value) {
        console.log(key, value);
    }
};

m.forEach(function(value, key, map) {
    this.report(key, value);
}, reporter);
```

—— 2017/12/18

---

#### ES6 之 Promise

今天复习一下 ES6 中 Promise 的基础用法。ES6 规定，Promise 对象是一个构造函数，用来生成 Promise 实例。Promise 对象有两个特点：

1. 对象的状态不受外界影响；
2. 一旦状态改变，就不会再变，任何时候都可以得到这个结果；

**优点**：

1. 就可以将异步操作以同步操作的流程表达出来，避免了层层嵌套的回调函数。
2. Promise 对象提供统一的接口，使得控制异步操作更加容易。

**缺点**：

1. 无法取消 Promise，一旦新建它就会立即执行，无法中途取消。
2. 如果不设置回调函数，Promise 内部抛出的错误，不会反应到外部。
3. 当处于 pending 状态时，无法得知目前进展到哪一个阶段（刚刚开始还是即将完成）。

Promise 新建后立即执行，所以首先输出的是 Promise。然后，then 方法指定的回调函数，将在当前脚本所有同步任务执行完才会执行，所以 resolved 最后输出。

```
let promise = new Promise(function(resolve, reject) {
  console.log('Promise');
  resolve();
});

promise.then(function() {
  console.log('resolved.');
});

console.log('Hi!');

// Promise
// Hi!
// resolved

```

Promise 实现 ajax

```
const getJSON = function(url) {
    const promise = new Promise(function(resolve, reject) {
        const handler = function() {
            if (this.readyState == 4) {
                if (this.status == 200) {
                    resolve(this.response);
                } else {
                    reject(new Error(this.statusText));
                }
            }
        };

        const xhr = new XMLHttpRequest();
        xhr.open("GET", url);
        xhr.onreadystatechange = handler;
        xhr.responseType = "json";
        xhr.send();
    });

    return promise;
}
```

第一个回调函数完成以后， 会将返回结果作为参数， 传入第二个回调函数。

```
getJSON("js/data.json").then(function(res) {
    console.log("then res:", res);
    return res;
})
.then(function(res) {
    console.log("then then res:", res);
});
```

前一个回调函数，有可能返回的还是一个 Promise 对象，这时后一个回调函数，
就会等待该 promise 对象的状态发生变化，才会被调用，否则不会被调用。

```
getJSON("js/data.json").then(function(res) {
    console.log("then res:", res);
    return getJSON(res.src);
})
.then(function(res) {
    console.log("then then res:", res);
})
.catch(function(error) {
    console.log("error:", error.message);
});
```

resolve 语句后，抛出错误，不会被捕获，等于没有抛出，Promise 状态一旦改变，不会再改变。

```
const promise = new Promise(function(resolve, reject) {
    resolve("ok");
    throw new Error("wrong");
});

promise.then(function(value) {
    console.log("resolve:", value); // ok
}).catch(function(error) {
    console.log("reject:", error.message);
});
```

catch、then 中抛出的错误都会一级一级往后冒泡，直到被后面的 catch 捕获到。

```
const promise = function() {
    return new Promise(function(resolve, reject) {
        resolve(x + 1);
    });
};

promise()
    .catch(function(error) {
        console.error("error:", error.message);
        // error: x is not defined
    })
    .then(function() {
        console.log("carry on"); // carry on
        console.log("carry on", y);
    })
    .catch(function(error) {
        console.error("error:", error.message); // error: y is not defined
    });
```

p1 和 p2 都是 Promise 的实例，但是 p2 的 resolve 方法将 p1 作为参数，这时 p1 的状态就会传递给 p2，也就是说，p1 的状态决定了 p2 的状态

```
const p1 = new Promise(function(resolve, reject) {
    setTimeout(function() {
        console.log("timeout p1");
        resolve("p1");
    }, 3000);
});

const p2 = new Promise(function(resolve, reject) {
    setTimeout(function() {
        console.log("timeout p2");
        resolve(p1);
    }, 1000);
});

p2.then(function(res) {
    console.log("p2 res:", res);
});

// timeout p2
// timeout p1
// p2 res: p1
```

—— 2017/12/21

---

#### ES6 之 Promise

立即 resolved 的 Promise 是在本轮事件循环的末尾执行，总是晚于本轮循环的同步任务

```
new Promise((resolve, reject) => {
    resolve(1);
    console.log("resolve...");
}).then(res => {
    console.log(res);
});
// resolve...
// 1
```

所有 Promise 实例的状态都变成 fulfilled，Promise.all 状态才会变成 fulfiled
只要有一个别被 rejected，Promise.all 状态就变成 rejected

```
let getJSON = function(url) {
    return new Promise(function(resolve, reject) {
        function handler() {
            if(this.readyState == 4) {
                if(this.status == 200 || this.tatus == 304) {
                    resolve(this.response);
                }
                else {
                    reject(this.statusText);
                }
            }
        }

        let xhr = new XMLHttpRequest();
        xhr.open("GET", url);
        xhr.onreadystatechange = handler;
        xhr.responseType = "json";
        xhr.send(null);
    });
};

Promise.all([getJSON("data/data1.json"), getJSON("data/data2.json")])
.then(function(res) {
    console.log("all success:", res);
})
.catch(function(error) {
    console.log("error:", error);
});
```

其中一个实例状态率先发生改变，Promise.race 的状态就跟着改变，这个率先改变实例的返回值作为回调入参

```
Promise.race([fetch("data/data1.json"), fetch("data/data2.json")])
.then(function(res) {
    console.log("all success:", res);
})
.catch(function(error) {
    console.log("error:", error);
});
```

立即 resolve 得 Promise 对象，是本轮“事件循环”得结束时，而不是下一轮“事件循环”的开始

```
setTimeout(() => {
    console.log("tree");
}, 0);

Promise.resolve().then(function() {
    console.log("two");
});

console.log("one");

// one
// two
// three
```

Promise.reject()方法的参数，会原封不动地作为 reject 的理由，变成后续方法的参数

```
const thenable = {
    then(resolve, reject) {
        reject("some wrong!");
    }
};

Promise.reject(thenable)
.catch(function(error) {
    console.log(error === thenable); // true
});
```

捕获最后抛出来的错误

```
Promise.prototype.done = function(fulfiled, rejected) {
    this.then(fulfiled, rejected)
    .catch(function(error) {
        console.error(error);
    });
};

Promise.reject().done();
```

—— 2017/12/22

---

#### ES6 之 Iterator 和 for...of 循环

遍历器（Iterator）就是这样一种机制。它是一种接口，为各种不同的数据结构提供统一的访问机制。任何数据结构只要部署 Iterator 接口，就可以完成遍历操作（即依次处理该数据结构的所有成员）。

模拟 next 方法

```
var it = makeIterator(['a', 'b']);

it.next() // { value: "a", done: false }
it.next() // { value: "b", done: false }
it.next() // { value: undefined, done: true }

function makeIterator(array) {
  var nextIndex = 0;
  return {
    next: function() {
      return nextIndex < array.length ?
        {value: array[nextIndex++], done: false} :
        {value: undefined, done: true};
    }
  };
}
```

解构、拓展运算符都会默认调用 iterator 接口
覆盖原生遍历器

```
let str = new String("hi");

console.log([...str]); // ["h", "i"]

str[Symbol.iterator] = function() {
    return {
        next: function() {
            if(this.first) {
                this.first = false;
                return {value: "wuwh", done: false};
            }
            else {
                return {done: true};
            }
        },
        first: true
    };
};

console.log([...str]); // ["wuwh"]
```

yield\*后面跟的是一个可遍历的结构，它会调用该结构的遍历器接口。

```
let generator = function* () {
    yield 1;
    yield* [2, 3];
    yield 4
};

let iterator = generator();

console.log(iterator.next());
console.log(iterator.next());
console.log(iterator.next());
console.log(iterator.next());
console.log(iterator.next());
```

> 一个数据结构只要部署了 Symbol.iterator 属性，就被视为具有 iterator 接口，就可以用
> for...of 循环遍历它的成员.也就是说,for...of 循环内部调用的是数据结构的 Symbol.iterator 方法
> for...of 循环可以使用的范围包括数组,Set 和 Map 结构,某些类型的数组的对象(arguments 对象,DOM NodeList 对象)
> Generator 对象以及字符串

DOM NodeList 对象部署了 iterator 接口

```
let ps = document.querySelectorAll("p");

for(let p of ps) {
    console.log(p);
}
```

for...of 能正确识别 32 位 UTF-16 字符

```
for(let x of "\a\uD83D\uDC0A") {
    console.log(x);
}
```

并不是所有类似数组的对象都具有 iterator 接口

```
let arrayLike = {
    0: "a",
    1: "b",
    length: 2
};

for(let x of arrayLike) {
    console.log(x); // Uncaught TypeError: arrayLike[Symbol.iterator] is not a function
}

console.log(Array.from(arrayLike));
```

forEach 缺点:break 或 return 不奏效

```
let arr = [1, 2, 3];
arr.forEach(function(item) {
    console.log(item);
    if(item > 2) continue; // Uncaught SyntaxError: Illegal break statement
});
```

—— 2017/12/25

---

#### ES6 之 Generator

Generator 函数调用并不执行,返回的也不是函数运行的结果,而是一个指向内部状态的指针对象,也就是遍历器对象。

```
function * helloWorldGenerator() {
    yield "hello";
    yield "world";
    return "ending";
}

let hw = helloWorldGenerator();

console.log(hw.next()); // {value: "hello", done: false}
console.log(hw.next()); // {value: "world", done: false}
console.log(hw.next()); // {value: "ending", done: false}
console.log(hw.next()); // {value: undefined, done: true}
```

yield 表达式只能用在 Generator 函数里面，用在其他地方都会报错

yield 表达式在另个一表达式中，必须放在圆括号里面。放在函数参数或放到赋值表达式的右边，可以不加括号。

```
function foo() {}

function* demo() {
    foo(yield "a", yield "b");
    let input = "abc" +(yield 123);
}

let f = demo();
console.log("f:", f);
console.log("f.next():", f.next());
console.log("f.next():", f.next());
console.log("f.next():", f.next());
console.log("f.next():", f.next());
```

任意一个对象的 Symbol.iterator 方法，等于该对象的遍历器生成函数，调用该函数会返回该对象的一个遍历器对象。

由于 Generator 函数就是遍历器生成函数，依次可以把 Generator 赋值给对象的 Symbol.iterator,从而使得该对象具有 Interator 接口。

```
let myIterable = {};
myIterable[Symbol.iterator] = function* () {
    yield 1;
    yield 2;
    yield 3;
};
console.log([...myIterable]); // [1, 2, 3]
```

Generator 函数执行后，返回一个遍历器对象。该对象本身也具有 Symbol.iterator 属性，执行后返回自身。

```
function* gen() {}

let g = gen();

console.log( g[Symbol.iterator]() === g ); // true
```

yield 表达式本身没有返回值，或者说总是返回 undefined。next 方法可以带一个参数，该参数就会被当作上一个 yield 表达式的返回值。

```
function* foo(x) {
    let y = 2 * (yield (x + 1));
    let z = yield(y / 3);
    return (x + y + z);
}

let a = foo(5);
console.log(a.next()); // {value: 6, done: false}
console.log(a.next()); // {value: NaN, done: false}
console.log(a.next()); // {value: NaN, done: true}

let b = foo(5);
console.log(b.next());  // {value: 6, done: false}
console.log(b.next(3)); // {value: 2, done: false}
console.log(b.next(6)); // {value: 17, done: true}
```

遍历斐波拉契数列

```
function* fibonacci(large) {
    let [prev, curr] = [0, 1];
    for(let i = 0; i < large; i++) {
        [prev, curr] = [curr, prev + curr];
        yield curr;
    }
}

for(let n of fibonacci(100)) {
    console.log(n);
}
```

原生对象没有 iterator 接口，无法用 for...of 遍历，可以通过 Generator 函数加上遍历接口。

```
function* objectEntries(obj) {
    let propKeys = Reflect.ownKeys(obj);
    for(let propKey of propKeys) {
        yield [propKey, obj[propKey]];
    }
}

let o = {first: "wu", last: "wh"};

for(let [key, value] of objectEntries(o)) {
    console.log(`${key}: ${value}`);
}
```

扩展运算符、解构赋值和 Array.from 方法内部调用都是遍历器接口。

```
function* numbers() {
    yield 1;
    yield 2;
    yield 3;
    return 0;
    yield 4;
}

// 扩展运算符
console.log([...numbers()]);

// Array.from()
console.log(Array.from(numbers()));

// 解构赋值
let [x, y] = numbers();
console.log(x, y);
```

在 Generator 函数内部，调用另一个 Generator 函数，默认情况下是没有效果的。

yield\* 后面的 Generator 函数（没有 return 语句时），等同于在 Generator 内部部署了一个 for...of 函数。

```
function* foo() {
    yield "a";
    yield "b";
}

function* bar() {
    yield "x";
    yield* foo();
    yield "y";
}

for(let v of bar()) {
    console.log(v); // "x"  // "y"
}
```

被代理的 Generator 函数有 return 语句，那么就可以向代理它的 Generator 函数返回数据。

```
function* foo() {
    yield 2;
    yield 3;
    return "foo";
}

function* bar() {
    yield 1;
    let v = yield* foo();
    console.log("v: ", v);
    yield 4;
}

let it = bar();

console.log(it.next()); // {value: 1, done: false}
console.log(it.next()); // {value: 2, done: false}
console.log(it.next()); // {value: 3, done: false}
console.log(it.next()); // v:  foo
console.log(it.next()); // {value: 4, done: false}
console.log(it.next()); // { value: undefined, done: true }
```

将 Generator 函数内部 this 指向它的原型上，可以 new 命令。

```
function* gen() {
    this.a = 1;
    yield this.b = 2;
    yield this.c = 3;
}

function F() {
    return gen.call(gen.prototype);
}

var f = new F();

// 遍历完后，才会有相应的属性
console.log(f.next()); // {value: 2, done: false}
console.log(f.next()); // {value: 3, done: false}
console.log(f.next()); // {value: undefined, done: true}

console.log(f.a); // 1
console.log(f.b); // 2
console.log(f.c); // 3
```

return 方法返回给定的值，并且终结遍历 Generator 函数。

```
function* gen() {
    yield 1;
    yield 2;
    yield 3;
}

let g = gen();

console.log(g.next());
g.return("foo");
console.log(g.next());
```

Generator 函数内部没有部署 try...catch，那么 throw 抛出的错误，被外部 try...catch 捕获。
Generator 函数内部和外部，都没有部署 try...catch，程序将会报错，中断执行。

```
function* gen() {
    while (true) {
        // try {
        //     yield;
        // }
        // catch(e) {
        //     console.log("内部捕获", e);
        // }

        yield;
        console.log("内部捕获", e);
    }
};

let g = gen();
g.next();

// g.throw("a");
// g.throw("b");

try {
    g.throw("a");
    g.throw("b");
}
catch (e) {
    console.log("外部捕获", e);
}
```

next()、throw()、return()这三个方法本质时同一件事，可以放在一起理解。它们的作用都是让 Generator 函数恢复执行，并且使用不同的语句替换 yield 表达式。

```
function* gen(x, y) {
    let res = yield x + y;
    return res;
}

let g = gen(1, 2);

console.log(g.next()); // {value: 3, done: false}
// 相当于把 let res = yield x + y; 换成 let res = 1;
console.log(g.next(1)); // {value: 1, done: true}

// 相当于把 let res = yield x + y; 换成 let res = throw(new Error("something wrong"));
g.throw(new Error("something wrong")); // Uncaught Error: something wrong

// 相当于把 let res = yield x + y; 换成 let res = return 2;
console.log(g.return(2));
```

—— 2017/12/26

---

#### ES6 之 Generator 函数的异步应用

对于多个异步操作，要等到上一个操作完才执行下一个，这时候就需要封装一个，Generator 函数自动执行器。

```
function run(fn) {
    let g = fn();

    function next(err, data) {
        let res = g.next(data);
        if (res.done) return;
        res.value(next);
    }

    next();
}

function* gen() {
    let f1 = yield readFileThunk("fileA");
    let f2 = yield readFileThunk("fileB");
    // ...
    let fn = yield readFileThunk("fileN");
}

run(gen);
```

回调函数。将异步操作包装成 Thunk 函数，在回调函数里面交回执行权。

Promise 对象。将异步操作包装成 Promise 对象，用 then 方法交回执行权。

```
// co函数源码
function co(gen) {
    var ctx = this;

    return new Promise(function (resolve, reject) {
        if (typeof gen === 'function') gen = gen.call(ctx);
        if (!gen || typeof gen.next !== 'function') return resolve(gen);

        onFulfilled();
        function onFulfilled(res) {
            var ret;
            try {
                ret = gen.next(res);
            } catch (e) {
                return reject(e);
            }
            next(ret);
        }
    });
}

function next(ret) {
    if (ret.done) return resolve(ret.value);
    var value = toPromise.call(ctx, ret.value);
    if (value && isPromise(value)) return value.then(onFulfilled, onRejected);
    return onRejected(
        new TypeError(
            'You may only yield a function, promise, generator, array, or object, '
            + 'but the following object was passed: "'
            + String(ret.value)
            + '"'
        )
    );
}
```

—— 2017/12/27

---

```
class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    toString() {
        return '(' + this.x + ', ' + this.y + ')';
    }
}
```

类的数据类型就是函数

```
console.log(typeof Point); // function
```

类本身就指向构造函数

```
console.log(Point === Point.prototype.constructor); // true
```

直接对类使用 new 命令

```
let p = new Point(1, 2);
console.log(p.toString()); // (1, 2)
```

x 和 y 都是对象 point 自身的属性（定义在 this 变量上），toString 是原型对象的属性（定义在 Point 类上）

实例上调用的方法，就是调用原型上的方法

```
console.log(p.toString === Point.prototype.toString); // true
```

给实例的原型上添加方法

```
Reflect.getPrototypeOf(p).getX = function() {
    console.log(this.x);
};

let p1 = new Point(3, 4);
p1.getX(); // 3 */
```

类的属性名，可以采用表达式

```
let methodName = "getArea";

class Square {
    constructor() {

    }

    [methodName]() {
        console.log("get area...");
    }
}

let sq = new Square();
sq.getArea(); // get area...
```

类中没有定义 constructor 方法，js 引擎会自动为它添加一个空的 constructor 方法，constructor 方法默认返回实例对象，也可以指定返回另一个对象

```
class Foo {
    constructor() {
        return Object.create(null);
    }
}

console.log(new Foo() instanceof Foo); // false
```

用表达式表示一个类，类的名称是 MyClass，Me 只在 Class 内部代码可用，指代当前类，如果内部没有使用到的话，可以省略 Me

```
const MyClass = class Me {
    getClassName() {
        return Me.name;
    }
    get prop() {
        return "getter";
    }
    set prop(value) {
        console.log("setter:" + value);
    }
};

let inst = new MyClass();
console.log(inst.getClassName()); // Me

let inst1 = new Me(); // Uncaught ReferenceError: Me is not defined
console.log(inst1.getClassName());
```

在类的内部使用 get 和 set 关键字，对某个属性设置存值函数和取值函数，拦截该属性的存取行为

```
inst.prop = 123; // setter:123
console.log(inst.prop); // getter
```

for...of 循环自动调用遍历器

```
class Foo {
    constructor(...args) {
        this.args = args;
        console.log("new.target:", new.target === Foo);
    }

    *[Symbol.iterator]() {
        for(let arg of this.args) {
            yield arg;
        }
    }

    static sayHi() {
        return this.returnHi();
    }

    static returnHi() {
        return "hi";
    }

    returnHi() {
        return "hello";
    }
}

class Bar extends Foo {
    static childSayHi() {
        return super.sayHi() + " child";
    }
}

for(let x of new Foo("hello", "world")) {
    console.log(x); // hello world
}
```

所有类中定义的方法，都会被实例继承，如果在一个方法前，加上 static 关键字，就表示该方法不会被实例继承，而是直接通过类来调用，成为“静态方法”。

静态方法中的 this 指向 Foo 类，而不是实例。静态方法可以与非静态方法重名

```
console.log(Foo.sayHi()); // hi
console.log(new Foo().sayHi()); //Uncaught TypeError: (intermediate value).sayHi is not a function
```

父类的静态方法可以被子类继承

```
console.log(Bar.sayHi()); // hi
```

静态方法可以从 super 对象上调用

```
console.log(Bar.childSayHi()); // hi child
```

子类继承父类时，new.target 会返回子类

```
console.log(new Bar()); // false
```

#### ES6 之 Class 的继承

子类必须在 constructor 方法中调用 super 方法，否则新建实例时会报错，如果子类没有定义 constructor 方法，这个方法会被默认添加。在子类构造函数中，只有调用 super 之后，才可以使用 this 关键字，否则报错。

```
class ColorPaint extends Point {
    constructor(x, y, color) {
        // this.color = color;
        super(x, y);
        this.color = color;
    }
}

let cp = new ColorPaint(25, 8, "red");
console.log(cp instanceof Point); // true
console.log(cp instanceof ColorPaint); // true
console.log(Reflect.getPrototypeOf(ColorPaint) === Point); // true
```

super 虽然代表了父类 A 的构造函数，但是返回的是子类 B 的实例，即 super 内部 this 指的是 B。

```
class A {
    constructor() {
        console.log(new.target.name);
    }
}

class B extends A {
    constructor() {
        super();
    }
}

new A(); // A
new B(); // B
```

super 作为对象时，在普通方法中，指向父类的原型对象；在静态方法中指向父类。

```
class A {
    p() {
        return 2;
    }
}

class B extends A {
    constructor() {
        super();
        console.log(super.p());
    }
}

let b = new B();
```

ES6 规定，通过调用父类方法时，方法内部的 this 指向子类。

```
class A {
    constructor() {
        this.x = 1;
    }
    print() {
        console.log(this.x);
    }
}

class B extends A {
    constructor() {
        super();
        this.x = 2;
    }
    m() {
        // 实际上执行的是super.print.call(this)
        super.print();
    }
}

let b = new B();
b.m(); // 2
```

如果 super 作为对象，用在静态方法中，这时 super 将指向父类，而不是父类原型对象。

```
class Parent {
    static myMethod(msg) {
        console.log("static ", msg);
    }

    myMethod(msg) {
        console.log("instance ", msg);
    }
}

class Child extends Parent {
    static myMethod(msg) {
        super.myMethod(msg);
    }

    myMethod(msg) {
        super.myMethod(msg);
    }
}

// 调用静态方法
Child.myMethod(1); // static  1

// 调用原型方法
var c = new Child(); // instance  2
c.myMethod(2);
```

```
class A { }

class B extends A { }

console.log(B.__proto__ === A); // true
console.log(B.prototype.__proto__ === A.prototype); // true
```

A 作为一个基类，就是一个普通函数，所以直接继承 Funtion.prototype，A 调用后返回一个空对象，所以，A.prototype.**proto**指向构造函数的 prototype 属性。

```
class A { }

console.log(A.__proto__ === Function.prototype); // true
console.log(A.prototype.__proto__ === Object.prototype); // true
```

原生构造函数可以被继承

```
class VersionedArray extends Array {
    constructor() {
        super();
        this.history = [[]];
    }
    commit() {
        this.history.push(this.slice());
    }
    revert() {
        this.splice(0, this.length, ...this.history[this.history.length - 1]);
    }
}

let x = new VersionedArray();

x.push(1);
x.push(2);
console.log(x);
console.log(x.history);

x.commit();
console.log(x.history);

x.push(3);
console.log(x.history);
```

#### ES6 之 Module

**export**

通常情况下，export 输出的变量就是本来的名字，但是也可以使用 as 关键字重命名。

```
function v1() {}
function v2() {}

export {
    v1 as streamV1,
    v2 as streamV2
}
```

export 命令规定是对外接口，必须与模块内部变量建立一一对应关系。

```
// 变量写法一
export var m = 1;

// 变量写法二
var m = 1;
export {m};

// 变量写法三
var n = 1;
export {n as m};

// 函数写法一
export function f() {};

// 函数写法二
function f() {}
export {f};

```

export 语句输出的接口，与其对应的值是动态绑定关系

```
export var foo = 'bar';
setTimeout(() => foo = 'baz', 500);
```

**import**
import 命令具有提升效果，会提升到整个模块的头部，首先执行。

```
foo();

import { foo } from 'my_module';
```

目前阶段，通过 Babel 转码，CommonJS 模块的 require 命令和 ES6 模块的 import 命令，可以写在同一个模块里面，但是最好不要这样做。因为 import 在静态解析阶段执行，所以它是一个模块之中最早执行的。

注意，模块整体加载所在的那个对象（上例是 circle），应该是可以静态分析的，所以不允许运行时改变。下面的写法都是不允许的。

```
import * as circle from './circle';

// 下面两行都是不允许的
circle.foo = 'hello';
circle.area = function () {};
```

export default 命令为模块指定默认输出。其他模块加载该模块时，import 命令可以为该匿名函数指定任意名字。

第一组是使用 export default 时，对应的 import 语句不需要使用大括号；第二组是不使用 export default 时，对应的 import 语句需要使用大括号。

```
// 第一组
export default function crc32() { // 输出
  // ...
}

import crc32 from 'crc32'; // 输入

// 第二组
export function crc32() { // 输出
  // ...
};

import {crc32} from 'crc32'; // 输入
```

—— 2017/12/28

---

#### ES6 之 Module 加载

ES6 模块与 CommonJS 模块之间的差异：

1. CommonJS 模块输出的是一个值的拷贝，ES6 模块输出的是值的引用。
2. CommonJS 模块是运行时加载，ES6 模块是编译时输出接口。

#### ES6 之编程风格

1. 在 let 和 const 之间，建议优先使用 const，尤其是在全局环境，不应该设置变量，只应设置常量。
2. 所有的函数都应该设置为常量。
3. 静态字符串一律使用单引号或反引号，不使用双引号。动态字符串使用反引号。
4. 箭头函数取代 Function.prototype.bind，不应再用 self/\_this/that 绑定 this。
5. 注意区分 Object 和 Map，只有模拟现实世界的实体对象时，才使用 Object。如果只是需要 key: value 的数据结构，使用 Map 结构。因为 Map 有内建的遍历机制。
6. 如果模块只有一个输出值，就使用 export default，如果模块有多个输出值，就不使用 export default，export default 与普通的 export 不要同时使用。

—— 2017/12/28

---

#### ES6 之数组

复制数组

```
const a1 = [1, 2];
// const a2 = [...a1];
const [...a2] = a1;
a2[0] = 2;
console.log('a1:', a1); // [1, 2]
```

拓展运算符值会部署了 iterator 接口的对象转化为数组，包括字符串、Set、Map、generator 函数、数组、NodeList 等

类似数组的对象（array-like object）和可遍历（iterable）的对象可用 Array.from 方法转化

```
let arrayLike = {
    '0': 'a',
    '1': 'b',
    length: 1
};
console.log(Array.from(arrayLike)); // ["a"]
```

Array.from 还可以接受第二个参数，作用类似于数组的 map 方法，用来对每个元素进行处理，将处理后的值放入返回的数组。

```
console.log(Array.from(arrayLike, x => x.repeat(2)));
```

Array.of 方法用于将一组值，转化为数组

```
console.log(Array.of(3, 10, 9));
console.log(Array.of());
```

将指定位置的成员复制到其他位置

```
console.log([1, 2, 3, 4, 5].copyWithin(0, 3, 4)); // [4, 2, 3, 4, 5]
```

find 找出第一个符合条件数组成员，
findIndex 找出第一个符合条件数组成员索引

```
let f = [1, 3, 5, 7].find(n => n > 3);
console.log(f);
```

fill 填充数组

```
console.log(new Array(3).fill(6));
```

fill 方法还可以接受第二个和第三个参数，用于指定填充的起始位置和结束位置。

```
console.log([1, 2, 3, 4].fill('a', 1, 4)); // [1, "a", "a", "a"]
```

include 表示某个数组是否包含给定的值第二个参数表示搜索的起始位置

```
console.log([1, 2, 3, NaN].includes(NaN)); //true
console.log([1, 2, 3, 4, 5].includes(3, 1)); // true
```

数组空位相关

```
// 数组空位是没有任何值的
console.log(0 in [undefined, undefined, undefined]); // true
console.log(0 in [,,]); // false

let arr = [, 'a'];

// forEach(), filter(), reduce(), every() 和some()都会跳过空位
arr.forEach((item, index) => {
    console.log(index); // 1
});

// join()和toString()会将空位视为undefined，而undefined和null会被处理成空字符串。
console.log([undefined, , 'a'].join(''));

// for...of可以遍历到空位
for(let i of arr) {
    console.log(i); // a undefined
}

// 拓展运算符将空位转为undefined
console.log([...[2, , 3]]); // [2, undefined, 3]

// Array.from将数组空位转化为undefined
console.log(Array.from([4, , 5])); // [4, undefined, 5]

// fill()会将空位视为正常数组位置
console.log(new Array(3).fill('a')); // ["a", "a", "a"]

// entries() 、keys() 、values() 、find()和findIndex()会将空位处理成undefined。
```

#### ES6 之 String

codePointAt 方法在第一个字符上，正确地识别了“𠮷”，返回了它的十进制码点 134071（即十六进制的 20BB7）。在第二个字符（即“𠮷”的后两个字节）和第三个字符“a”上，codePointAt 方法的结果与 charCodeAt 方法相同。

```
let s = '𠮷';
console.log(s.charCodeAt(0)); // 55362
console.log(s.charCodeAt(1)); // 57271

console.log(s.codePointAt(0)); // 134071
console.log(s.codePointAt(1)); // 57271

console.log(s.codePointAt(0).toString(16)); // 134071
console.log(s.codePointAt(1).toString(16)); // 57271

let text = String.fromCodePoint(0x20bb7, 0xdfb7);

// for...of能正确遍历出utf-16字符
for(let t of text) {
    console.log(t);
}
```

endsWith 的行为与其他两个方法有所不同，它针对前 n 个字符，而其他两个方法针对从第 n 个位置直到字符串结束。

```
let str = 'Hello world';
console.log(str.startsWith('llo', 2)); // true
console.log(str.endsWith('d', 11)); // true
console.log(str.includes('wo', 1)); // true
```

repeat()

```
// 小数会被取整
console.log('x'.repeat(3.6));  // "xxx"
//  0 - -1 被视为0
console.log('y'.repeat(-0.1)); // ""
// 非数字，转化成数字
console.log('z'.repeat('z')); // ""
```

padStart() padEnd()

```
// 头部补全
console.log('x'.padStart(5, 'ab')); // "ababx"
// 尾部补全
console.log('x'.padEnd(5, 'ab')); // "xabab"
// 原字符串长度，等于或大于指定最小长度，则返回原字符串
console.log('xxx'.padStart(3, 'ab')); // "xxx"
// 用来补全的字符串与原字符串，两者的长度之和超过了指定的最小长度，则会截去超出位数的补全字符串
console.log('xxx'.padStart(5, 'abcdef')); // "abxxx"
// 省略第二个参数，默认使用空格补全长度
console.log('xxx'.padStart(5)); // "  xxx"

console.log('12'.padStart(10, 'YYYY-MM-DD')); // "YYYY-MM-12"
```

模板字符串里可以嵌套

```
let $body = document.querySelector('body');

const data = [
    {first: 'wu', last: 'wenhua'},
    {first: 'xiao', last: 'hua'}
];

const temp = d => `
    <table>
        ${d.map(item => {
            return `
                <tr>
                    <td>${item.first}</td>
                    <td>${item.last}</td>
                </tr>
            `;
        }).join('')}
    </table>
`;

console.log(temp(data));

$body.innerHTML= temp(data);
```

执行一段字符串

```
let str = `return ` + '`Hello ${name}`';
let func = new Function('name', str);
console.log(func);
console.log(func('wuwh'));
```

标签模板

```
function passthru(literals, ...values) {
    let output = '';
    let index;

    for(index = 0; index < values.length; index++) {
        output += literals[index] + values[index];
    }

    output += literals[index];
    return output;
}

let name = 'wen';
let age = 22;

let str = passthru`My name is ${name}, I am ${age} old`; // tag函数调用

console.log(str);
```

tag 函数的第一个参数 strings，有一个 raw 属性，也指向一个数组

```
tag`abc\nefg`;

function tag(str) {
    console.log(str.raw[0]); // abc\nefg
}

// 充当模板字符串的处理函数，返回一个斜杠都被转义的字符串
console.log(String.raw`abc\nefg`);
```

—— 2018/1/3

---

#### ES6 之 Object

把表达式放到方括号里，作为对象的属性名

```
let propKey = 'foo';
let obj = {
    [propKey]: true,
    ['a' + 'b']: 'ab'
};
console.log(obj.ab); // "ab"
```

把表达式放到方括号里，作为对象下的方法名

```
let obj = {
    ['h' + 'ello']() {
        return 'hi';
    }
};
console.log(obj.hello()); // "hi"
```

属性名表达式如果是一个对象，默认情况下会自动转化为字符串[object Object]

```
const propKey = {a: 1};
const obj = {
    [propKey]: 1
};
console.log(obj);
```

getter 和 setter 函数 name 属性在该方法的属性描述对象的 get 和 set 属性上面

```
const obj = {
    get foo() {},
    set foo(x) {}
};

const descriptor = Object.getOwnPropertyDescriptor(obj, 'foo');
console.log(descriptor.get.name); // "foo"
console.log(descriptor.set.name); // "foo"
```

Function 构造函数创造的函数，name 属性返回 anonymous

```
console.log((new Function()).name); // anonymous
```

bind 方法创造的函数，name 属性返回 bound 加上原函数的名字

```
let doSomething = function() {};
console.log(doSomething.bind().name); // bound doSomething
```

Object.is() 同值相等 不同于运算符（===），一是+0 不等于-0，二是 NaN 等于自身

```
console.log(Object.is(+0, -0)); // false
console.log(Object.is(NaN, NaN)); // true
```

assign

```
let a = Object.assign(2);
console.log(typeof a);

// 由于undefined和null无法转成对象，所以如果它们作为参数，就会报错
// Object.assign(undefined);

// 非首参，undefined和null无法转成对象就会跳过
let b = Object.assign(a, undefined);
console.log(a === b); //true

// 其他类型的值（数值、字符串和布尔值）不会产生效果
let c = Object.assign(a, 2, true, undefined);
console.log(c);
console.log(a === c); // true
// Object.assign拷贝的属性是有限制的，只拷贝源对象的自身属性（不拷贝继承属性），
// 也不拷贝不可枚举的属性（enumerable: false）

// source对象的foo属性是一个取值函数，Object.assign不会复制这个取值函数，
// 只会拿到值以后，将这个值复制过去
const source = {
    get foo() {return 1}
};

const target = {};

console.log( Object.assign(target, source) ); // {foo: 1}
```

ES6 规定，所有 class 的原型方法都是不可枚举的

```
let cd = Object.getOwnPropertyDescriptor(class { foo() { } }.prototype, 'foo').enumerable;
console.log(cd); // false
```

Reflect.ownKeys 遍历对象属性类型顺序 数字 -> 字符串 -> Symbol

```
console.log(Reflect.ownKeys({ [Symbol()]: 0, a: 1, 0: 2 })); // ["0", "a", Symbol()]
```

ES2017 引入了 Object.getOwnPropertyDescriptors 方法，返回指定对象所有自身属性（非继承属性）的描述对象

```
const obj = {
    foo: 123,
    [Symbol('aaa')]: 'aaa',
    get bar() { return 'abc' }
};

console.log(Object.getOwnPropertyDescriptors(obj));
```

getOwnPropertyDescriptors 可应用于将两个对象合并，包括 set 和 get

```
const shallowMerge = (target, source) => Object.defineProperties(
    target,
    Object.getOwnPropertyDescriptors(source)
);

console.log(shallowMerge({}, { set foo(val) { console.log(val) } }));
```

对象上部署**proto**属性，一下三种方法都能达到效果

```
let prot = {};
const obj1 = {
    __proto__: prot,
    foo: 123
};

const obj2 = Object.assign(
    Object.create(prot),
    {
        foo: 123
    }
);

const obj3 = Object.create(
    prot,
    Object.getOwnPropertyDescriptors({
        foo: 123
    })
);

console.log('obj1:', obj1);
console.log('obj2:', obj2);
console.log('obj3:', obj3);
```

super 关键字表示原型对象时，只能用在对象的方法之中，用在其他地方都会报错，super 等价于 Object.getPrototypeOf(this)

```
const obj = {
    a: 2,
    getShow() {
        return super.show();
    }
};

Object.setPrototypeOf(
    obj,
    {
        a: 1,
        show() {
            return this.a;
        }
    }
);

console.log(obj.getShow()); // 2
```

拓展运算符的解构赋值，不能复制继承自原型对象的属性

```
let a = { a: 1 };
let b = { b: 2 };
a.__proto__ = b;
let { ...c } = a;
console.log(c); // {a: 1}
console.log(c.b); // undefined

// 变量y和z是扩展运算符的解构赋值，只能读取对象o自身的属性
const o = Object.create({ x: 1, y: 2 });
o.z = 3;

let { x, ...{ y, z } } = o;

console.log(x); // 1
console.log(y); // undefined
console.log(z); // 3
```

—— 2018/1/4

---

```
{
    // 有默认值的参数不是尾参数，无法只省略该参数
    function f(x = 1, y) {
        return [x, y];
    }

    // f(, 2); // 报错
    // 传入undefined，将触发默认值
    console.log(f(undefined, null)); // [1, null]
}
```

```
// 指定默认值后，函数的length属性将失真
console.log((function (a, b, c = 5) { }).length); // 2
console.log((function (...rest) { }).length); // 0

// 设置了默认值的参数不是尾参数，那么length属性也不再计入后面的参数了
console.log((function (a = 5, b, c) { }).length); // 0
```

—— 2018/1/5

---

#### ES6 之 function

箭头函数不能当作构造函数，原因在于箭头函数内部没有 this，而是引用外层的 this

```
let Fn = () => {
    this.age = '20';
};

let fn = new Fn(); // Uncaught TypeError: Fn is not a constructor
```

箭头函数不能用作 Generator 函数

```
let g = function* () => {
    yield 1;
};

console.log( g().next() ); // Uncaught SyntaxError: Unexpected token =>
```

箭头函数没有自己的 this，所以 bind 方法无效，内部的 this 指向外部的 this

```
let res = (function() {
    return [
        (() => this.x).bind({x: 'inner'})()
    ];
}).call({x: 'outer'});

console.log('res:', res); // ["outer"]
```

"尾调用优化"意义：函数执行到最后一步，不保留外层函数的调用帧，只会保存内部函数调用帧，这样节省了内存。注意，只有不再用到外层函数内部变量，内层函数的调用帧才会取代外层函数的调用帧，否则无法进行“尾调用优化”。

```
function addOne(a) {
    var one = 1;
    function inner(b) {
        return b + one; // 含有外层变量one
    }
    return inner(a);
}
```

尾递归的实现，往往需要改写递归函数，确保最后一步只调用自身，做到这一点的方法，就是把所有用到的内部变量改写成函数的参数。

```
// 普通方法递归
function Fibonacci(n) {
    if(n <= 1) {
        return 1;
    }

    return Fibonacci(n - 1) + Fibonacci(n -2);
}

console.log('Fibonacci 100:', Fibonacci(10)); // 89
console.log('Fibonacci 100:', Fibonacci(100)); // 堆栈溢出
```

```
// 尾递归
function tailFibonacci(n, ac1 = 1, ac2 = 1) {
    if(n <= 1) {return ac2};

    return tailFibonacci(n - 1, ac2, ac1 + ac2);
}

console.log('tailFibonacci 10:', tailFibonacci(10)); // 89
console.log('tailFibonacci 100:', tailFibonacci(100)); // 573147844013817200000
```

ES6 之 class 继承（续）
继承 Object 子类，有一个行为差异，ES6 改变了 Object 构造函数的行为，发现不是通过 new Object()形式调用，Object 构造函数忽略参数

```
class NewObj extends Object {
    constructor() {
        super(...arguments);
    }
}

let o = new NewObj({attr: true});
console.log(o.attr === true); //false
```

将多个类的接口“混入”另一个类

```
function mix(...mixins) {
    class Mix{}

    for(let mixin of mixins) {
        copyProperties(Mix, mixin); // 拷贝实例属性
        copyProperties(Mix.prototype, mixin.prototype); // 拷贝原型属性
    }

    return Mix;

}

function copyProperties(target, source) {
    for(let key of Reflect.ownKeys(source)) {
        if(key !== 'constructor'
        && key !== 'prototype'
        && key !== 'name') {
            let desc = Object.getOwnPropertyDescriptor(source, key);
            Object.defineProperty(target, key, desc);
        }
    }
}

class School {
    constructor() {
        this.name = 'qing';
    }
    getAddress() {
        return 'beijing';
    }
}

class Student {
    constructor() {
        this.name = 'wang xiao';
    }
    getAddress() {
        return'shenzhen';
    }
}

class Ins extends mix(School, Student) {

}

let ins = new Ins();

console.log(ins.getAddress());
```

—— 2018/1/8

---

**关于从页面外部加载 js 文件**

1. 带有 src 属性`<script>` 标签之间还包含 JavaScript 代码，则只会下载并执行外部脚本文件，嵌入的代码会被忽略；
2. 不存在 defer 和 async 属性，浏览器就会按照`<script>`在页面中出现的先后顺序对它们依次进行解析；
3. `<script>`有 defer 属性，浏览器会立刻下载，但延时执行（延时到`</html>`后执行），HTML5 规定按照文件出现的先后顺序执行，先于 DOMContentLoaded 事件执行；
4. `<script>`有 async 属性，浏览器立刻下载，不保证按照先后顺序执行，一定在 load 事件前执行，但不一定在 DOMContentLoaded 之前执行；

**重绘 repaint 与重排 reflow**
重绘：当改变那些不会影响元素在网页中的位置样式时，如 background-color，border，visibility，浏览器只会用新的样式将元素重绘一次。
重排：当改变影响到文本内容或结构，或者元素位置时，重排就会发生。

—— 2018/1/19

---

**输入框弹起数字键盘**

```html
<input type="tel" novalidate="novalidate" pattern="[0-9]*" id="q2" value="" name="q2" verify="学号" />
```

`type="tel"`

- 优点是 iOS 和 Android 的键盘表现都差不多
- 缺点是那些字母好多余，虽然我没有强迫症但还是感觉怪怪的啊。

`type="number"`

- 优点是 Android 下实现的一个真正的数字键盘
- 缺点一：iOS 下不是九宫格键盘，输入不方便
- 缺点二：旧版 Android（包括微信所用的 X5 内核）在输入框后面会有超级鸡肋的小尾巴，好在 Android 4.4.4 以后给去掉了。

不过对于缺点二，我们可以用 webkit 私有的伪元素给 fix 掉：

```css
input[type='number']::-webkit-inner-spin-button,
input[type='number']::-webkit-outer-spin-button {
  -webkit-appearance: none;
  appearance: none;
  margin: 0;
}
```

`pattern`

pattern 用于验证表单输入的内容，通常 HTML5 的 type 属性，比如 email、tel、number、data 类、url 等，已经自带了简单的数据格式验证功能了，加上 pattern 后，前端部分的验证更加简单高效了。

``

`novalidate`

## novalidate 属性规定当提交表单时不对其进行验证。
