---
title: inter-vue
date: 2020-11-16 17:39:47
tags: [vue, interview]
---

### Vue 响应式原理怎么实现

- 响应式核型是通过 Object.defineProperty 拦截对数据的访问和设置。
- 响应式数据分为两类：
  - 对象。循环遍历对象的所有属性，为每个属性设置 getter、setter，以达到拦截访问和设置的目的的，如果属性值依旧为对象，则递归属性值上的每个 key 设置 getter、setter。
  - 数组。增强数组的那 7 个（push、pop、shift、unshift、splice、reverse 和 sort）可以改变自身的原型方法，然后拦截对这些方法的操作。
  - 访问数据时（obj.key）进行依赖收集，在 dep 中存储相关的 watcher。
  - 设置数据时有 dep 通知相关的 watcher 去更新。

### Vue 中 MVVM 原理

- 深度遍历 `data` 对象，利用 `defineProperty` API 对每个属性数据劫持（Observer）
- 对于每个属性的 getter 绑定一个依赖队列（Dep），setter 触发（Nofity）这个依赖队列遍历执行每一项
- 在模版编译构成中，编译到 `v-modal` 指令、解析出具体的文本节点值或者用户手动 watcher 时，创建一个观察者（Watcher），观察者创建后会调用 getter 方法，将其所有的依赖的观察对象插入当前依赖队列（subs）。
- 通过监听元素的 `input` 事件，当用户输入即可修改数据，这样实现了从视图到数据的更新
- 当数据变化，调用 setter，触发遍历执行依赖队列中的观察者，观察者回调更新（update）视图，这样就实现了从数据到视图的更新。

### Vue 中 Dep && Watcher

一个 obj.key 对应一个 Dep，它是用来收集当前 value 所有依赖，依赖列表（dep.subs） 存放所有依赖的 watcher 实例。

一个组件对应一个 watcher（渲染 watcher）或者一个表达式 watcher（用户 watcher）。Watcher 对依赖（newDeps）去重，设置依赖收集的开关（Dep.target），返回执行获取的值。

当前值发生改变时，就会执行 setter，通知依赖实例（dep）进行更新（notify），遍历依赖列表（subs）中的 watcher 执行 update。

### Vue 中 nextTick 原理

简单：

在下次 DOM 更新循环结束之后执行延时回调。nextTick 主要使用了宏任务和微任务。根据执行环境分别去尝试采用：

- Promise
- MutationObserver
- setImmediate
- setTimeout

具体的：

- 在数据变化，触发观察者（`Watcher`）回调（`update`）时，会分为三种情况：赖处理（`lazy`）、同步（`sync`）和 观察者队列（`queueWatcher`）。
- 观察者队列通过观察者 `id` 进行去重，再去通过 `nextTick` 遍历执行观察者的 `run` 函数视图更新.
- `nextTick` 执行的目的是在 `microtask` 或者 `task` 中推入一个 `function`，当前栈执行完毕以后执行 `nextTick` 传入的 `function`.
- 在 `Vue2.5` 之后的版本，`nextTick` 采取的策略默认走 `microTask`， 对于一些 `DOM` 交互，如 `v-on` 绑定事件回调函数的处理会强制走 `macroTask`。
- 在 `Vue2.4` 前基于 `microTask` 实现，但是 `microTask` 的执行级别非常高，在某些场景之下甚至比事件冒泡还要快，会导致一些诡异的问题。但是全部改成 `macroTask`，对于一些有重绘和动画场景也会有性能影响。
- `Vue` 中检测对于 `macroTask` 支持顺序： `setImmediate`（高版本 IE 和 Edge） -> `MessageChannel` -> `setTimeout`。
- `Vue` 中检测对于 `microTask` 支持顺序： `Promise` -> `fallback macroTask`。

相关拓展：
`macroTask` 包括：`I/O` -> `渲染` -> `setImmediate` -> `requestAnimationFrame` -> `postMessage` -> `setTimeout` -> `setInterval`。
`microTask` 包括：`process.nextTick` -> `Promise` -> `MutationObserve` -> `Object.observe`

参考:
[Vue 番外篇 -- vue.nextTick()浅析](https://juejin.im/post/6844903695935602696)
[JavaScript 运行机制详解：再谈 Event Loop](http://www.ruanyifeng.com/blog/2014/10/event-loop.html)
[Vue.js 升级踩坑小记](https://github.com/DDFE/DDFE-blog/issues/24) 这里黄毅老师遇到的音乐播放跟我遇到的在线客服提示音乐一样的问题：`nextTick` 异步调用时使用 `messageChannel` API 被认定为不是用户行为，音乐播放器不会被调用。
[Tasks, microtasks, queues and schedules](https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules/)

### Vue3 中 Proxy 和 Vue2 中 Object.defineProperty 对比

### Vue 初始化过程（new Vue(options)）都做了什么？

- 处理组建配置项。
  - 初始化根组件时进行选项合并操作，将全局配置合并到根组件。
  - 初始化每个子组件时做了一些性能优化，将组件配置对象上的一些深层次属性放到 vm.$options 选项中，以提高代码的执行效率。
- 初始化组件实例的关系属性，比如 $parent、$children、$root、$refs 等。
- 处理自定义事件。
- 处理插槽。
- 调用 beforeCreate 钩子函数。
- 初始化组件的 inject 配置项，得到 ret[key]=val 形式的配置对象，然后对该配置对象进行相应处理，并代理每个 key 到 vm 实例上。
- 数据响应式，处理 props、methods、data、computed、watch 等选项。
- 解析组件配置项上的 provide 对象，将其挂载到 vm.\_provided 属性上。
- 调用 created 钩子函数。
- 如果发现配置项上有 el 选项，则自动调用$mount  方法，否则手动调用$mount。
- 接下来进入挂载阶段。

参考：[Vue 源码解读（2）—— Vue 初始化过程](https://juejin.cn/post/6950084496515399717)

### methods、computed 和 watch 区别

#### 使用场景

- methods 一般用于封装一些较为复杂的处理逻辑（同步、异步）。
- computed 一般用于封装简单的同步逻辑，将记过处理的数据返回，然后显示，减轻模版重量。
- watch 一般用于当需要数据变化时执行异步或开销较大的操作。

#### 区别

- methods 每次执行都调用。
- computed 第一次执行数据被缓存，实现原理它本质是一个 watcher，缓存是因为 watcher.dirty 属性控制。
- watch Watcher 对象的实例。

### Vue 的异步更新机制是如何实现的？

Vue 的异步更新机制的核心是利用浏览器的异步任务队列来实现的，首选微任务队列，宏任务队列次之。

当响应式数据更新后，会调用 dep.notify 方法，通知 dep 中收集的 watcher 去执行 update 方法，watcher.update 将 watcher 自己放入一个 watcher 队列（全局 queue 数组）。

然后通过 nextTick 方法将一个刷新 watcher 队列的方法（flushSchedulerQueue）放入全局的 callbacks 数组中。

如果此时浏览器的异步任务队列中没有一个叫 flushCallbacks 的函数，则执行 timeFunc 函数，将 flushCallbacks 函数放入异步任务队列。如果异步任务队列中已经存在 flushCallbacks 函数，等待其执行完成以后再放入下一个 flushCallbacks 函数。

flushSchedulerQueue 函数负责刷新 watcher 队列，即执行 queue 数组中每一个 watcher 的 run 方法，从而进入更新阶段，比如执行组件更新函数或者执行用户 watch 的回调函数。

### Vue 的 nexttick API 的实现

- 将传递的回调函数用 try catch 包裹，然后放入 callbacks 数组。
- 执行 timerFunc 函数，在浏览器的异步任务队列放入一个刷新 callbacks 数组的函数。

### 为什么 Vue 中不要用 index 作为 key？

- sameNode 判断是否复用节点：key、tag、是否有 data 存在、是否是注释节点、是否是相同的 input type；
- 通过头尾指针内部收缩算法来比较同级节点是否是 sameNode；
- 用 index 作为 key，当列表数据第一位删除后 ，在对应的新 VNode 中节点的 key 也更新，在 patchVNode 时，会复用原来的第一个节点，第二个节点...发现新节点里少了一个就会删除。这样将原本删除第一位节点变成了删除最后一位节点，其他节点复用也错了。

### vite 的认识

优点：

- 采用 ESBuild 使用 go 编写，预构建依赖，比 Javascript 编写的打包器预构建依赖快 10-100 倍；
- 预编译：npm 依赖基本不会变化的模块，在预构建阶段整理，减少 http 请求数；
- 按需编译：用户源码需频繁变动的模块，根据路由使用实时编译；
- 客户端强缓存：请求过的模块响应头 max-age=31536000，immutable 强缓存，如果版本模块发生变化则用附加版本 query 使其失效；
- 产物优化：没有 runtime 和模版代码；
- 分包处理：不需要用户干预，默认启动一系列只能分包规则，尽量减少模块的重复打包，tree-shaking，按需打包，公共依赖当作独立 chunk；
- 静态资源处理：提供了 URL，字符串，module，assembly，worker 等处理方式；

缺点：

- ES module 只兼容现代浏览器；
- Rollup 打包，而不是 ESBuild，原因在于构建应用重要功能还在持续开发中，特别是代码分割和 CSS 处理方面。

### Vue 组件通讯方式

- props 和 $emit 父组件向子组件传递数据是通过 prop 传递的，子组件传递数据给父组件是通过 $emit 触发事件来做到的；
- $parent，$children 获取当前组件的父组件和当前组件的子组件；
- $arrts 和 $listeners 解决了将父组件属性和监听器传递到内部组件；
- eventBus 事件总线方式；
- vuex 状态管理；

### Vuex 原理

Vuex 是基于 Vue 实现的全局状态管理器插件，利用 Vue 的响应式原理监听 state 对象的变化，再通过全局 Vue.mixin API 在每个组件的 beforeCreate 生命周期执行时将 store 对象注入到组件。

参考 [「Vue 源码学习」你想知道 Vuex 的实现原理吗？](https://juejin.cn/post/6952473110377414686)

### Vue3 VS Vue2 的改变

#### 从使用上来看

- composition API。由 options（选项式）API 变成 composition（组合式）API，这种改变带来的：
  - 防止代码逻辑分散在选项式 API 的不同位置 props、data、methods 等，组合式 API 会集中在一起；
  - 解决 Mixins、高阶组件（HOC）和 Renderless Components（作用于插槽封装逻辑的组件）带来的逻辑复用存在的问题。
- setup 生命周期钩子。Vue3 的组合式 API 代码逻辑在 setup 里执行，同时，`<script setup>` 作为 setup 在单文件组件使用组合式 API 编译时的语法糖，进一步简化了代码，更好的 IDE 类型推断性能，顶层的绑定（变量、函数声明和 import 引入内容）能在模版中直接使用；
- defineAsyncComponent 包装异步组件；片段，组件支持多个根节点；
- 废除了`.native`修饰符，用 emits 选项定义组件可触发的事件；
- 新增 `Suspense` 和 `Teleport` 内置组件；
- 废除了 `$listeners` 和 `$children` 属性；
- 通过 `defineExpose` 编译宏暴露出去属性给 ref 使用；
- 自定义 hooks。借助 React hooks 思想，可基于函数抽取和复用逻辑的能力；

#### 从内部改进来看

- 类型推导。 将 JavaScript 改成了 typescript，具有友好的类型推导和 IDE 语法补全；
- 打包尺寸。 基于函数的 API 每个函数都可以作为具名 ES module export 被单独引入，对 tree-shaking 非常友好。基于函数 API 所写的代码压缩率更好，因为函数名和 setup 函数体内部的变量都可以被压缩，但对象和 class 属性/方法不可以；
- 性能更优。重写了虚拟 DOM 的实现，编译模版的优化。

  - 编译模版的优化。编译模版分为 3 个阶段，分别是：parse、transform 和 codegen。其中 parse 阶段将模版字符串转化为抽象语法树 AST；transform 阶段则是对 AST 进行了一些转换处理；codegen 阶段根据 AST 生成对应的 render 函数字符串。
  - 静态节点提升。在 transform 阶段，会打上 PatchFlag 标记，有这个标志或者大于 0 表示要更新，否则跳过，应用在 diff 比较过程。-1 代表静态节点，无论层级嵌套多深，静态节点会被提升到 render()函数外面，它的动态节点都直接与 block 根节点绑定，无需再去遍历静态节点。参考[Vue3 模版编译原理](https://zhuanlan.zhihu.com/p/181505806)
  - 事件缓存：cacheHandle，比如绑定一个 onclick 事件，会被视为 PROPS 动态绑定，后序替换点击事件时需要进行更新，cache[1] 自动生成并缓存一个内联函数，“神奇”的变为了一个静态节点。Ps：相当于 React 中 useCallback 自动化。

- 自定义渲染器，用户可以尝试 WebGL 自定义渲染器。
