---
title: 前端面试之高级javascript
date: 2021-10-17 11:45:40
tags: [面试, javascript]
categories: 面试
---

### 垃圾回收机制

Javascript 垃圾回收机制分为：标记清除和引用计数。
常用的垃圾回收方式是标记清除。垃圾收集器在运行的时候会给存储在内存中的所有变量都加上标记，然后，它会去掉环境中的变量以及被环境中的变量引用的变量的标记。在此之后再被加上标记的变量将被视为准备删除的变量。最后垃圾收集器销毁那些带标记的值并且回收它们所占用的内存空间。
另一种不常用的垃圾收集策略是引用计数。引用计数的含义是跟踪记录每个值被引用的次数。当声明了一个变量并将一个引用类型值赋值给该变量时，则这个值的引用次数就是 1。如果同一个值又赋值给另外一个变量，则该值的引用次数加 1。相反，如果包含对这个值引用的变量有得到了另外一个值，则这个值的引用次数减 1。当这个值的引用次数变成 0 时，说明没办法再访问这个值了。当垃圾收集器下次再运行，就会释放那些引用次数为 0 的值所占内存。

### V8 引擎垃圾回收工作原理

- 栈中数据回收：执行状态指针 ESP 在执行栈中移动，移过某执行上下文，就会被销毁；
- 堆中数据回收：V8 引擎采用标记-清除算法；
- V8 把堆分为两个区域——新生代和老生代，分别使用副、主垃圾回收器；
- 副垃圾回收器负责新生代垃圾回收，小对象（1 ～ 8M）会被分配到该区域处理；
- 新生代采用 scavenge 算法处理：将新生代空间分为两半，一半空闲，一半存对象，对对象区域做标记，存活对象复制排列到空闲区域，没有内存碎片，完成后，清理对象区域，角色反转；
- 新生代区域两次垃圾回收还存活的对象晋升至老生代区域；
- 主垃圾回收器负责老生区垃圾回收，大对象，存活时间长；
- 老生代区域采用标记-清除算法回收垃圾：从根元素开始，递归，可到达的元素活动元素，否则是垃圾数据；
- 标记-清除算法后，会产生大量不连续的内存碎片，标记-整理算法让所有存活的对象向一端移动，然后清理掉边界以外的内存；
- 为降低老生代垃圾回收造成的卡顿，V8 将标记过程被切分为一个个子标记过程，让垃圾回收和 JavaScript 执行交替进行。

### 事件循环（Event Loop）机制

**浏览中 Event Loop 运行机制**

Javascript 是单线程语言。

1、所有同步任务都在主线程上执行，形成一个执行栈；
2、主线程之外，还存在一个“任务队列”。只要异步任务有了运行结果，就在“任务队列”中放置一个事件；
3、一旦“执行栈”中所有同步任务执行完毕，系统就会读取“任务队列”，看看里面有哪些事件。那些对应的异步任务，于是结束等待状态，进入执行栈，开始执行；
4、主线程不断重复上面的第三步。

**Node.js 的 Event Loop**

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

**浏览器和 Node.js 的 Event Loop 区别**

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

### setState 同步和异步

- setState 只在合成事件（onclick、onChange 等）和钩子函数（componentWillUpdate、componentDidMount 等）中是异步的，在原生事件和 setTimeout 中都是同步的；
- setState 异步并不是说内部由异步代码实现，其实本身执行过程和代码都是同步的，只是合成事件和钩子函数的调用顺序在更新之前，导致合成事件和钩子函数中没法拿到更新后的值，可以通过第二个参数 callback 拿到更新后的结果；
- setState 批量更新优化是建立在异步之上，在原生事件和 setTimeout 中不会批量更新。在异步中如果对同一个值进行多次 setState，批量更新策略会对其进行覆盖，取最后一次的执行。

参考
[你真的理解 setState 吗？](https://juejin.cn/post/6844903636749778958)

### Fiber 原理

浏览器在一帧内可能会做执行下列任务，而且它们的执行顺序基本是固定的：

- 处理用户输入事件；
- JavaScript 执行；
- requestAnimation；
- 布局 layout；
- 绘制 paint；

如果浏览器处理上述的任务还有盈余时间，就会调用 requestIdleCallback。

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

首先，在说 React Fiber 架构前，说一下它产生的背景吧，在 React16 之前，数据更新，是通过函数调用栈方式，该过程是同步的，会占据 js 主线程，比如一个组件更新需要 1 毫秒，1000 个组建就需要 1s，在这段时间内，浏览器的其他任务不能得到响应，比如用户的 IO 操作，这样就会出现卡顿现象，影响用户体验。Fiber 架构的思想是，将大量同步任务进行拆解，和异步化。在 React Fiber 实现是将原来的函数调用栈的数据结构，变成链表结构，链表的每一项是任务执行单元，从而可以实现对任务的暂停和重启。React 将一个 state 更新需要执行的同步任务拆分成一个 Fiber 任务队列。
从 Fiber 任务队列中选出优先级高的任务执行，如果执行时间超过 deathLine，设置为 padding 挂起状态，会在浏览器下次空闲时间继续执行，也就在 requestIdleCallback API 实现调度。

参考：
[浅谈 React 16 中的 Fiber 机制](https://tech.youzan.com/react-fiber/)
[这可能是最通俗的 React Fiber(时间分片) 打开方式](https://juejin.cn/post/6844903975112671239)

### React 性能优化

- 使用 React.PuerComponent 和 React.memo 来缓存组建
- 使用 useMemo 缓存大量的计算
- 使用 React.Lazy 配合 Suspense 延时加载组件
- 避免使用内联对象和匿名函数
- 使用 React.Fragment 避免添加额外的 DOM

参考：
[React 性能优化](https://juejin.cn/post/6844903924302888973)

### Vue 性能优化

- v-for 不要和 v-if 一起使用
- v-show 应用在显示和隐藏频繁操作上
- v-for key 尽量不要用 index
- 函数式组件
- 虚拟滚动 virtual-list

### Vue3 和 React 的 hook 区别

- Vue hook 只会在 setup 函数被调用的时候调用一次，react 数据更改时候会导致重新 render，hooks 重新注册，虽然 React 有相应方案，比如 userCallback，userMemo 等；
- 不受调用顺序的限制，可以有条件的被调用；
- 不会在后续更新时产生大量的内联函数而影响引擎优化或者导致 GC 压力；
- 不需要总是使用 useCallback 来缓存传给子组件的回调函数防止过度更新；
- 不需要担心传入错误的依赖数组给 useEffect/useMemo/useCallback 从而导致回调中使用了过期的值，Vue 的依赖追踪是全自动的；

参考
[一文看懂：Vue3 和 React Hook 对比，到底哪里好？](https://cloud.tencent.com/developer/article/1760189)

### Vue 与 React diff 算法差异

- Vue 列表比对，采用双向指针向内收缩算法，而 React 则采用从左到右依次比对方式，通过比较 lastIndex 和上次\_mounteIndex，lastIndex > \_moutedIndex 节点不动。当一个集合，只把最后一个元素移动到第一个，React 会把前面的节点依次移动，而 Vue 只会把最后一个节点移动到第一个。总体上，Vue 比对方式更高效；
- 判断是否是相同节点，Vue 会比对 tag、key，是否是注释节点，是否有 data，是否是 input 相同的 type，而 React 比较简单，只判断 tag 和 key；
- Vue 基于 snabbdom 库，它有较好的速度和模块机制，Vue diff 使用双向链表边比对边更新 DOM，而 React 主要是使用 diff 队列保存需要更新哪些 DOM，得到 patch 树，再统一批量更新 DOM。

参考
[React 和 Vue 的 diff 算法](https://juejin.cn/post/6878892606307172365)

[不可思议的 React diff](https://zhuanlan.zhihu.com/p/20346379)

### Vue2 与 Vue3 diff 差异

- Vue3 事件缓存、静态标记、静态提升
- Vue3 patchKeyedChildren 比对，会基于头和尾比较，尾和尾比较，基于最长递增子序列进行移动、添加和删除。

参考
[深入浅出虚拟 DOM 和 Diff 算法，及 Vue2 与 Vue3 中的区别](https://juejin.cn/post/7010594233253888013)

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

### typescript 中 type 和 interface 区别？

- type 可以定义基本类型别名 `type userName = string`；
- type 可以声明联合类型 `type Student = {stuNo: number} | {classId: number}`；
- type 可以声明元祖类型 `type Arr = [number, string]`；
- interface 可以合并声明，type 不行；

  ```js
  interface Person {
    name: string;
  }
  interface Person {
    age: number;
  }
  const user: Person = {
    name: 'wuwhs',
    age: 20
  }
  ```

### Express 与 Koa 的区别

相同点：

- 对 http 模块进行封装

不同点：

- express 内置了很多中间件可供使用，而 koa 没有；
- express 包含路由，视图渲染等特性，而 koa 只有 http 模块；
- express 中间件模型为线性，而 koa 的中间件模型为 U 型，也可称为洋葱模型构造中间件；
- express 通过回调函数处理异步操作，koa 主要是基于 co 中间件，通过 generator 使用同步方式写异步逻辑；

### Nginx 正向和反向代理

- 客户端向代理服务器发送请求，并且指定目标服务器，之后代理服务器向目标服务器转发请求，将获得的内容返回给客户端。用途：翻墙，数据缓存，隐藏客户端真实 IP；
- 代理服务器接受客户端请求，请求转发给内部网络服务器，再将服务器处理结果返回给客户端。用途：隐藏服务器真实 IP，负载均衡，数据缓存，数据加密；

- Nginx 设置正向代理

  ```nginx
  server {
    listen: 82;
    resolver: 8.8.8.8; # 设置DNS的IP，用来解析 proxy_pass 中的域名
    location / {
      proxy_pass http://$http_host$request_url; # 被代理转发的地址，$http_host 请求的域名和端口，$request_url请求URI
    }
  }
  ```

- Nginx 设置反向代理

  ```nginx
  upstream myServers { # upstream 服务器集合
    server 192.168.30.20:3000 weigth=10; # weight 设置权重
    server 192.168.30.20:3001 weight=5;
    server 192.168.30.20:3002 weight=1;
  }
    server {
      listen 8080;
      server_name localhost;
      location /server {
        proxy_pass http:myServer;
      }
    }
  ```
