---
title: 浏览器工作原理与实践
date: 2021-05-31 22:33:26
tags: [浏览器]
---

## [浏览器工作原理与实践](https://blog.poetries.top/browser-working-principle/)

### [Chrome 架构：仅仅打开了 1 个页面，为什么有 4 个进程](https://blog.poetries.top/browser-working-principle/guide/part1/lesson01.html)

**线程和进程区别**：多线程可以并行处理任务，线程不能单独存在，它是由进程来启动和管理的。一个进程是一个程序的运行实例。

**线程和进程的关系**：1、进程中任意一线程执行出错，都会导致整个进程的崩溃。2、线程之间共享进程中的数据。当 3、一个进程关闭后，操作系统会回收进程所占用的内存。4、进程之间的内容相互隔离。

**单进程浏览器**：1、不稳定。单进程中的插件、渲染线程崩溃导致整个浏览器崩溃。2、不流畅。脚本（死循环）或插件会使浏览器卡顿。3、不安全。插件和脚本可以获取到操作系统任意资源。

**多进程浏览器**：1、解决不稳定。进程相互隔离，一个页面或者插件崩溃时，影响仅仅时当前插件或者页面，不会影响到其他页面。2、解决不流畅。脚本阻塞当前页面渲染进程，不会影响到其他页面。3、解决不安全。采用多进程架构使用沙箱。沙箱看成时操作系统给进程上来一把锁，沙箱的程序可以运行，但是不能在硬盘上写入任何数据，也不能在敏感位置读取任何数据。

**多进程架构**：分为 浏览器进程、渲染进程、GPU 进程、网络进程、插件进程。

**缺点**：1、资源占用高。2、体系架构复杂。

**面向服务架构**：把原来的各种模块重构成独立的服务，每个服务都可以在独立的进程中运行，访问服务必须使用定义好的接口，通过 IPC 通讯，使得系统更内聚、松耦合、易维护和拓展。

### [TCP 协议：如何保证页面文件能被完整送达浏览器](https://blog.poetries.top/browser-working-principle/guide/part1/lesson02.html)

- 互联网中的数据是通过数据包来传输的，数据包在传输过程中容易丢失或出错。
- IP 负责把数据包送达目的主机。
- UDP 负责把数据包送达具体应用。
- 而 TCP 保证来数据完整地传输，它的连接可分为三个阶段：建立连接、传输数据和断开连接。

### [HTTP 请求流程：为什么很多站点第二次打开速度会很快](https://blog.poetries.top/browser-working-principle/guide/part1/lesson03.html)

- 浏览器中的 HTTP 请求从发起到结束一共经历如下八个阶段：构建请求、查找缓存、准备 IP 和端口、等待 TCP 队列、建立 TCP 连接、发起 HTTP 请求、服务器处理请求、服务器返回请求和断开连接。

### [导航流程：从输入 URL 到页面展示这中间发生了什么](https://blog.poetries.top/browser-working-principle/guide/part1/lesson04.html)

- 用户输入 URL 并回车
- 浏览器进程检查 URL，组装协议，构成完整 URL
- 浏览器进程通过进程通信（IPC）把 URL 请求发送给网络进程
- 网络进程接收到 URL 请求后检查本地缓存是否缓存了该请求资源，如果有则将该资源返回给浏览器进程
- 如果没有，网络进程向 web 服务器发起 http 请求（网络请求），请求流程如下：
  - 进行 DNS 解析，获取服务器 IP 地址，端口
  - 利用 IP 地址和服务器建立 tcp 连接
  - 构建请求头信息
  - 发送请求头信息
  - 服务器响应后，网络进程接收响应头和响应信息，并解析响应内容
- 网络进程解析响应流程：
  - 检查状态码，如果是 301/302，则需要重定向，从 Location 自动读取地址，重新进行第 4 步，如果是 200，则继续处理请求
  - 200 响应处理：检查响应类型 Content-Type，如果是字节流类型，则将该请求提交给下载管理器，该导航流程结束，不再进行后续渲染。如果是 html 则通知浏览器进程准备渲染进程进行渲染
- 准备渲染进程
  - 浏览器进程检查当前 URL 是否和之前打开的渲染进程根域名是否相同，如果相同，则复用原来的进程，如果不同，则开启新的渲染进程
- 传输数据、更新状态
  - 渲染进程准备好后，浏览器向渲染进程发起“提交文档”的消息，渲染进程接收到消息和网络进程建立传输数据的“管道”
  - 渲染进程接收完数据后，向浏览器发送“确认提交”
  - 浏览器进程接收到确认消息后 engine 浏览器界面状态：安全、地址 URL、前进后退的历史状态、更新 web 页面

### [变量提升：javascript 代码是按顺序执行的吗](https://blog.poetries.top/browser-working-principle/guide/part2/lesson07.html)

- javascript 代码执行过程中，需要先做变量提升，而之所以需要实现变量提升，是因为 javascript 代码在执行之前需要先编译。在编译阶段，变量和函数会被存放到变量环境中，变量的默认值会被设置为 undefined；在代码执行阶段，javascript 引擎会从变量环境中去查找自定义的变量和函数。
- javascript 代码经过编译后，会生成两部分内容：执行上下文和可执行代码。
- 如果在编译阶段，存在两个相同的函数，那么最终存放在变量环境中的是最后定义的那个，这是因为后定义的会覆盖掉之前定义的。

[调用栈：为什么 JavaScript 代码会出现栈溢出](https://blog.poetries.top/browser-working-principle/guide/part2/lesson08.html)

- 每调用一个函数，JavaScript 引擎会为其创建执行上下文压入调用栈，然后，JavaScript 引擎开始执行函数代码。
- 如果一个函数 A 调用另外一个函数 B，那么 JavaScript 引擎会为 B 函数创建执行上下文，并将 B 函数的执行上下文压入栈顶。
- 当前函数执行完毕后，JavaScript 引擎会将该函数的执行上下文弹出栈。
- 当分配的调用栈空间被占满时，会引发“堆栈溢出”问题。

### [块级作用域：var 缺陷以及为什么要引入 let 和 const](https://blog.poetries.top/browser-working-principle/guide/part2/lesson09.html)

- let、const 申明的变量不会被提升。在 javascript 引擎编译后，会保存在词法环境中。
- 块级作用域在代码执行时，将 let、const 变量存放在词法环境的一个单独的区域。词法环境内部维护一个小型的栈结构，作用域内部变量压入栈顶。作用域执行完，从栈顶弹出。

### [作用域链和闭包：代码中出现相同的变量，JavaScript 引擎如何选择](https://blog.poetries.top/browser-working-principle/guide/part2/lesson10.html)

-

### [this：从 JavaScript 执行上下文视角讲 this](https://blog.poetries.top/browser-working-principle/guide/part2/lesson11.html)

当执行 new CreateObj 的时候，JavaScript 引擎做了四件事：

- 首先创建一个控对象 tempObj；
- 接着调用 CreateObj.call 方法，并将 tempObj 作为 call 方法的参数，这样当 createObj 的执行上下文创建时，它的 this 就指向 tempObj 对象；
- 然后执行 CreateObj 函数，此时的 CreateObj 函数执行上下文中的 this 指向 tempObj 对象；
- 最后返回 tempObj 对象。

this 的使用分为：

- 当函数最为对象的方法调用时，函数中的 this 就是该对象；
- 当函数被正常调用时，在严格模式下，this 值是 undefined，非严格模式下 this 指向的是全局对象 window；
- 嵌套函数中的 this 不会继承外层函数的 this 值；
- 箭头函数没有自己的执行上下文，this 是外层函数的 this。

### [https://blog.poetries.top/browser-working-principle/guide/part3/lesson12.html](栈空间和堆空间：数据是如何存储的)

动态语言：在使用时需要检查数据类型的语言。
弱类型语言：支持隐式转换的语言。

JavaScript 中的 8 种数据类型，它们可以分为两大类——原始类型和引用类型。
原始类型数据存放在栈中，引用类型数据存放在堆中。堆中的数据是通过引用与变量关系联系起来的。

从内存视角了解闭包：词法扫描内部函数，引用了外部函数变量，堆空间创建一个“closure”对象，保存变量。

### [垃圾回收：垃圾数据如何自动回收](https://blog.poetries.top/browser-working-principle/guide/part3/lesson13.html)

- 栈中数据回收：执行状态指针 ESP 在执行栈中移动，移过某执行上下文，就会被销毁；
- 堆中数据回收：V8 引擎采用标记-清除算法；
- V8 把堆分为两个区域——新生代和老生代，分别使用副、主垃圾回收器；
- 副垃圾回收器负责新生代垃圾回收，小对象会被分配到该区域处理；
- 新生代采用 scavenge 算法处理：将新生代空间分为两半，一半空闲，一半存对象，对对象区域做标记，存活对象复制排列到空闲区域，完成后，清理对象区域，角色反转；
- 新生代区域两次垃圾回收还存活的对象晋升至老生代区域；
- 主垃圾回收器负责老生区垃圾回收，大对象，存活时间长；
- 新生代区域采用标记-清除算法回收垃圾：从根元素开始，递归，可到达的元素活动元素，否则是垃圾数据；
- 为了不造成卡顿，标记过程被切分为一个个子标记，交替进行。

### [编译器和解析器：V8 如何执行一段 JavaScript 代码的](https://blog.poetries.top/browser-working-principle/guide/part3/lesson14.html)

- 计算机语言可以分为两种：编译型和解释型语言。编译型语言经过编译器编译后保留机器能读懂的二进制文件，比如 C/C++，go 语言。解释型语言是在程序运行时通过解释器对程序进行动态解释和执行，比如 Python，JavaScript 语言。
- 编译型语言的编译过程：编译器首先将代码进行词法分析、语法分析，生成抽象语法树（AST），然后优化代码，最后生成处理器能够理解的机器码；
- 解释型语言解释过程：解释器会对代码进行词法分析、语法分析，并生产抽象语法树（AST），不过它会再基于抽象语法树生成字节码，最后根据字节码执行程序；
- AST 的生成：第一阶段是分词（词法分析），将一行行源码拆解成一个个 token（语法上不可再分、最小单个字符）。第二阶段是解析（语法分析），将上一步生成的 token 数据，根据语法规则转为 AST，这一阶段会检查语法错误；
- 字节码存在的意义：直接将 AST 转化为机器码，执行效率是非常高，但是消耗大量内存，从而先转化为字节码解决内存问题；
- 解释器 ignition 在解释执行字节码，同时会手机代码信息，发现某一部分代码是热点代码（HotSpot），编译器把热点的字节码转化为机器码，并保存起来，下次使用；
- 字节码配合解释器和编译器的计数实现称为即时编译（JIT）。

### [消息队列和事件循环：页面是怎么活起来的](https://blog.poetries.top/browser-working-principle/guide/part4/lesson15.html)

- 每个渲染进程都有一个主线程，主线程会处理 DOM，计算样式，处理布局，JavaScript 任务以及各种输入事件；
- 维护一个消息队列，新任务（比如 IO 线程）添加到消息队列尾部，主线程循环地从消息队列头部读取任务，执行任务；
- 解决处理优先级高的任务：消息队列的中的任务称为宏任务，每个宏任务中都会包含一个微任务队列，在执行宏任务的过程中，如果 DOM 有变化，将该变化添加到微任务队列中；
- 解决单个任务执行时长过久：JavaScript 通过回调功能来规避。

### [webapi：setTimeout 是怎么实现的](https://blog.poetries.top/browser-working-principle/guide/part4/lesson16.html)

- JavaScript 调用 setTimeout 设置回调函数的时候，渲染进程会创建一个回调任务，延时执行队列存放定时器任务；
- 当定时器任务到期，就会从延时队列中取出并执行；
- 如果当前任务执行时间过久，会影响延时到期定时器任务的执行；
- 如果 setTimeout 存在嵌套调用（5 次以上），判断该函数方法被阻塞，那么系统会设置最短时间间隔为 4 秒；
- 未激活的页面，setTimeout 执行最小间隔是 1000 毫秒，目的是为了降低加载损耗；
- 延时执行时间最大值是 24.8 天，因为延时值是以 32 个 bit 存储的；
- setTimeout 设置的回调函数中的 this 指向全局 window。

#### [webpai：XMLHttpRequest 是怎么实现的](https://blog.poetries.top/browser-working-principle/guide/part4/lesson17.html)

- XMLHttpRequest onreadystatechange 处理流程：未初始化 -> OPENED -> HEADERS_RECEIVED -> LOADING -> DONE；
- 渲染进程会将请求发送给网络进程，然后网络进程负责资源下载，等网络进程接收到数据后，利用 IPC 通知渲染进程；
- 渲染进程接收到消息之后，会将 xhr 回调函数封装成任务并添加到消息队列中，等主线程循环系统执行到该任务的时候，会根据相关状态来调用回调函数。

#### [宏任务和微任务：不是所有的任务都是一个待遇](https://blog.poetries.top/browser-working-principle/guide/part4/lesson18.html)

- 消息队列中的任务为宏任务。渲染进程内部会维护多个消息队列，比如延时执行队列和普通消息队列，主线程采用 for 循环，不断地从这些任务队列中取出任务并执行；
- 微任务是一个需要异步执行的函数，执行时机是在主函数执行结束之后、当前宏任务结束之前；
- V8 在执行 javascript 脚本时，会为其创建一个全局执行上下文，同事会创建一个微任务队列；
- 执行微任务过程中产生的微任务不会推迟到下个宏任务中执行，而是在当前宏任务中继续执行；

#### [使用 Promise 告别回调函数](https://blog.poetries.top/browser-working-principle/guide/part4/lesson19.html)

- 使用 Promise 解决了回调地狱问题，消灭嵌套和多次处理；
- 模拟实现 Promise

```js
function Bromise(executor) {
  var _onResolve = null
  this.then = function (onResolve) {
    _onResolve = onResolve
  }
  function resolve(value) {
    setTimeout(() => {
      _onResolve(value)
    }, 0)
  }
  executor(resolve, null)
}
```
