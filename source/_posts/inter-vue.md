---
title: inter-vue
date: 2020-11-16 17:39:47
tags: [vue, 面试]
---

### Vue 中 MVVM 原理

- 深度遍历 `data` 对象，利用 `defineProperty` API 对每个属性数据劫持（Observer）
- 对于每个属性的 getter 绑定一个依赖队列（Dep），setter 触发（Nofity）这个依赖队列遍历执行每一项
- 在模版编译构成中，编译到 `v-modal` 指令或者解析出具体的文本节点值时，创建一个观察者（Watcher），观察者创建后会调用 getter 方法，将观察对象插入依赖队列。
- 通过监听元素的 `input` 事件，当用户输入即可修改数据，这样实现了从视图到数据的更新
- 当数据变化，调用 setter，触发遍历执行依赖队列中的观察者，观察者回调更新（update）视图，这样就实现了从数据到视图的更新。

### Vue 中 nextTick 原理

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
