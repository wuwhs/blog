---
title: 前端面试之高级javascript
date: 2021-10-17 11:45:40
tags: [面试, javascript]
categories: 面试
---

### 垃圾回收机制

Javascript 垃圾回收机制分为：标记清除和引用计数。
常用的垃圾回收方式是标记清除。垃圾收集器在运行的时候会给存储在内存中的所有变量都加上标记，然后，它会去掉环境中的变量以及被环境中的变量引用的变量的标记。在此之后再被加上标记的变量将被视为准备删除的变量。最后垃圾收集器销毁那些带标记的值并且回收它们所占用的内存空间。
另一种不常用的垃圾收集策略是引用计数。引用计数的含义是跟踪记录每个值被引用的次数。当声明了一个变量并将一个引用类型值赋值给该变量时，则这个值的引用次数就是 1。如果同一个值又赋值给另外一个变量，则改值的引用次数加 1。相反，如果包含对这个值引用的变量有得到了另外一个值，则这个值的引用次数减 1。当这个值的引用次数变成 0 时，说明没办法再访问这个值了。当垃圾收集器下次再运行，就会释放那些引用次数为 0 的值所占内存。

### V8 引擎垃圾回收工作原理

- 栈中数据回收：执行状态指针 ESP 在执行栈中移动，移过某执行上下文，就会被销毁；
- 堆中数据回收：V8 引擎采用标记-清除算法；
- V8 把堆分为两个区域——新生代和老生代，分别使用副、主垃圾回收器；
- 副垃圾回收器负责新生代垃圾回收，小对象（1 ～ 8M）会被分配到该区域处理；
- 新生代采用 scavenge 算法处理：将新生代空间分为两半，一半空闲，一半存对象，对对象区域做标记，存活对象复制排列到空闲区域，没有内存碎片，完成后，清理对象区域，角色反转；
- 新生代区域两次垃圾回收还存活的对象晋升至老生代区域；
- 主垃圾回收器负责老生区垃圾回收，大对象，存活时间长；
- 新生代区域采用标记-清除算法回收垃圾：从根元素开始，递归，可到达的元素活动元素，否则是垃圾数据；
- 为了不造成卡顿，标记过程被切分为一个个子标记，交替进行。

### 事件循环（Event Loop）机制

** 浏览中 Event Loop 运行机制 **

Javascript 是单线程语言。

1、所有同步任务都在主线程上执行，形成一个执行栈；
2、主线程之外，还存在一个“任务队列”。只要异步任务有了运行结果，就在“任务队列”中放置一个事件；
3、一旦“执行栈”中所有同步任务执行完毕，系统就会读取“任务队列”，看看里面有哪些事件。那些对应的异步任务，于是结束等待状态，进入执行栈，开始执行；
4、主线程不断重复上面的第三步。

** Node.js 的 Event Loop **

Node.js 也是单线程 Event Loop。

1、V8 引擎解析 JavaScript 脚本；
2、解析后的代码，调用 Node API；
3、libuv 库负责 Node API 的执行。它将不同的任务分配给不同的线程，形成一个事件循环（Event Loop），以异步的方式将任务的执行结果返回给 V8 引擎；
4、V8 引擎再将结果返回给用户。

Node.js 中 libuv 引用的事件循环分为 6 个阶段：

1、timers 阶段：这个阶段执行 timer（setTimeout、setInterval）的回调；
2、I/O callbacks 阶段：处理一些上一轮循环中的少数未执行的 I/O 回调；
3、idle，prepare 阶段：仅 node 内部使用；
4、poll 阶段：获取新的 I/O 事件，适当的条件下 node 将阻塞在这里；
5、check 阶段：执行 setImmediate 的回调；
6、close callbacks 阶段：执行 socket 的 close 事件回调；

顺序：外部输入数据-->轮询阶段（poll）-->检查阶段（check）-->关闭事件回调阶段（close callback）-->定时器检查阶段（timer）-->I/O 事件回调阶段（I/O callbacks）-->闲置阶段（idle，prepare）-->轮询阶段

process.nextTick 独立于 Event Loop 之外，它有一个自己的队列，当每个阶段完成后，如果存在 nextTick 队列，就会清空队列中所有回调函数，并且优先于其他 microtask 执行。

** 浏览器和 Node.js 的 Event Loop 区别 **

浏览器环境下，microtask 的任务队列是每个 macrotask 执行完后执行。而在 Node.js 中，microtask 会在事件循环的各个阶段之间执行，也就是一个阶段执行完毕，就会去执行 microtask 队列的任务。

参考：[JavaScript 运行机制详解：再谈 Event Loop](http://www.ruanyifeng.com/blog/2014/10/event-loop.html)

### 从输入一个 URL 地址到浏览器完成渲染的整个过程

简单版：

- 浏览器查找当前 URL 是否存在缓存，并比较缓存是否过期；
- DNS 解析 URL 对应的 IP；
- 根据 IP 建立 TCP 连接（三次握手）；
- 发送 HTTP 请求；
- 服务器处理请求，浏览器接受 HTTP 响应；
- 浏览器解析并渲染页面；
- 关闭 TCP 连接（四次挥手）。

### 图片懒加载方案

- 原生支持 Chrome76+支持，标签 loading 属性设为 'lazy'。
- element.getBoundingClientRect().top < document.documentElement.clientHeight。
- element.offsetTop - document.documentElement.scrollTop < document.documentElement.clientHeight
- IntersectionObserver

### babel 是什么，原理是什么？

Babel 是一个 Javascript 编译器。他把最新版的 JavaScript 编译成目标浏览器环境可执行版本。

Babel 处理分为 3 步：解析（parse），转换（transform）和 生成（generate）。

- 解析。将代码解析成抽象语法树（AST），每个 js 引擎都有自己的 AST 解析器，而 Babel 是通过 Babylon 实现。在解析过程中有两个阶段：词法分析和语法分析。词法分析阶段把字符串形式的代码转换为令牌（tokens）流，令牌类似 AST 中节点；而语法分析阶段则会把一个令牌流转化成 AST 的形式，同时这个阶段会把令牌中的信息转换成 AST 的表述结构。
- 转换。Babel 接受得到 AST 并通过 babel-traverse 对其进行深度优先遍历，在此过程中对节点进行添加、更新及移除操作。这部分也是 Babel 插件介入工作的部分。
- 生成。将经过转换的 AST 通过 babel-generator 再转换成 js 代码，过程就是深度优先遍历整个 AST，然后构建可以表示转换后的代码的字符串。

### PureComponent 组件和 memo 组件

- React.PureComponent 中实现了 shouldComponentUpdate()，是以浅层比较 prop 和 state 的方式实现该函数。如果对象中包含复杂的数据结构，可能无法检查深层差别，产生错误对比结果。在 state 和 prop 比较简单时，才使用，或者在深层次数据结构发生变化时调用 forceUpdate 来确保组件正确更新，可以考虑用 immutable 对象加速数据比较。
- React.memo 为高阶组件，仅检查 props 变更，且实现中拥有 useState，useReducer 或 useContent 的 hook。

### React hook

- 函数式组件没有 this，不能分配和读取 this.state。
- 引入 useState Hook，它让我们函数组件中存储内部 state。
- 解构出 state 中的变量和对应的赋值函数，从将更新 state 变量总是替换它变成合并它的形式。
- useEffect Hook 看做 componentDidMount、componentDidUpdate 和 componentWillUnmount 这三个函数的组合。
- Hook 一个目的是解决 class 生命周期经常包含不相关逻辑，但又把相关逻辑分离到不同方法中的问题。比如订阅逻辑分割到 componentDidMount 和 componentWillUnmount 中。
- hook 需要在我们组建的最顶层调用，不能放到 if、which 等语句里面。
- 自定义 Hook 是一个函数，其名称以 use 开头，函数内部可以调用其他的 Hook。每次使用自定义 Hook，其中的所有 state 和副作用都是完全隔离的。

### useCallback 和 useMemo

- ClassComponent 中父组件向子组件传的值是匿名函数，在父组件更新时，该匿名函数都会生成新函数，导致子组件也会更新；
- FunctionComponent 中父组件向子组件传的值是函数，在父组建更新时，该函数也会生成新函数，导致子组建也会更新；
- useCallback 第一个参数回调函数，第二个参数是依赖变量。返回一个 memoized 回调函数，在依赖参数不变的情况下返回回调函数是同一个引用地址；
- useMemo 将调用 fn 函数并返回结果，useCallback 将返回 fn 函数而不调用它；
- useCallback 针对于子组建重复渲染的优化，useMemo 针对于当前组建高开销的计算；

参考：[彻底理解 useCallback 和 useMemo](https://juejin.cn/post/6844904032113278990)

### Fiber 原理

React 渲染页面分为两个阶段：

- 协调阶段（reconciliation）：在这个阶段 React 会更新数据生成新的 Virtual DOM，然后通过 Diff 算法快速找出需要更新的元素，放在更新队列中去，得到新的更新队列；
- 提交阶段（commit）：这个阶段 React 会遍历更新队列，将所有的变更一次性更新到 DOM 上。

React 面临的挑战是更新数据多了会造成不响应问题：假如我们更新一个 state，有 1000 组件需要更新，每个组件更新需要 1ms，那么我们就会将近 1s 的时间，主线程被 React 占用，这段时间用户的操作不会得到任何的反馈，只有当 React 中需要同步更新的任务完成后，主线程才被释放。这 1s 期间浏览器会失去响应，用户体验差。

**Fiber 解决方案**。Fiber 中文解释 纤程，是线程颗粒化的一个概念。Fiber 可以让大量同步计算被拆解、异步化，使得浏览器主线程得以调控。

Fiber 的协调阶段可以：

- 暂停运行任务；
- 恢复并继续执行任务；
- 跟不同的任务分配不同的优先级；

这样把一个耗时长的任务分成很多小片，每一个小片的运行时间很短，虽然总时间依旧很长，但是在每个小片执行完之后，都给其他任务一个执行机会，这样唯一的主线程不会被独占，其他任务依然会有运行机会。

因为协调阶段可能被中断、恢复，甚至重做，React 协调阶段的生命周期钩子可能会被调用多次，产生副作用。比如 componentWillMount、componentWillReceiveProps 和 componentWillUpdate 可能会被调用两次。

**Fiber 实现原理** React Fiber 的做法是不使用 javascript 的栈，通过链表的数据结构，模拟函数调用栈，将需要递归处理的事情分解成增量的执行单元，将递归转换为迭代。

- 将一个 state 更新需要执行的同步任务拆分成一个 Fiber 任务队列；
- 在任务队列中选出优先级高的任务执行，如果执行时间超过 deathLine，则设置为 pending 状态挂起状态；
- 一个 Fiber 执行结束或者挂起，会调用基于 requestIdleCallback/requestAnimation 实现调度器，返回一个新的 Fiber 任务队列继续进行上述过程。

参考：
[浅谈 React 16 中的 Fiber 机制](https://tech.youzan.com/react-fiber/)
[这可能是最通俗的 React Fiber(时间分片) 打开方式](https://juejin.cn/post/6844903975112671239)

### Set 与 WeakSet，Map 与 WeakMap 的区别

- Set 和 WeakSet 中的数据会去重，Set 的每一项可以是任意类型，但是 WeakSet 的每一项只能是对象类型。WeakSet 构造函数参数数组每一项都会生成 WeakSet 成员，WeakSet 中的对象是弱引用，即垃圾回收机制不考虑 WeakSet 对该对象的引用，也就是说，如果其他对象都不再引用该对象，那么垃圾回收机制会自动回收该对象的内存，不考虑该对象还存不存在 WeakSet 中，因此，WeakSet 不可被遍历。
- Map 的键名可以是任意类型，WeakMap 只接受对象作为键名（null 除外）。WeakMap 的键名所引用的对象都是弱引用，即垃圾回收机制不将该引用考虑在内，只要所引用的对象的其他引用都被清除，垃圾回收机制就会被释放该对象所占用的内存，也就是说，一旦不需要，WeakMap 里面的键名对象和所对应的键值对会自动消失。

### webpack5 做了哪些改进？

- 优化了持久化缓存和缓存算法。配置 `cache: {type: 'filesystem'}` 来缓存生成的 webpack 模块和 chunk，改善构建速度。这样就无须 dll pulgin 和 cache loader。当使用[contenthash]时，webpack5 将使用真正的文件内容哈希值，之前它只使用内部结构的哈希值。
- webpack5 默认使用 terser-webpack-plugin 进行多线程压缩和缓存，无须再引入 parallel-uglify-plugin。
- 新增“模块联邦”功能，允许多个 webpack 构建一起工作，模块可以从指定的远程构建中导入，并以最小的限制使用。
- 嵌套、内部模块和 CommonJS 的 tree-shaking。 跟踪对导出的嵌套属性的访问。这可以改善重新导出命名空间对象时的 tree-shaking（清除未使用的导出和混淆导出）。对模块中的标记进行分析，找出导出和引用的依赖关系。
- 允许启动单个文件的目标现在支持运行时自动加载引导所需的依赖代码片段。

参考：
[阔别两年，webpack5 正式发布](https://mp.weixin.qq.com/s/sh7rcv6hdhYfWr1bv_ssbg)
