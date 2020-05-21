---
title: vue3.0 修炼手册
date: 2020-05-12 17:19:31
tags: [vue, javascript]
---

## 前言

随着2020年4月份 `Vue3.0 beta` 发布，惊喜于其性能的提升，友好的 `TS` 支持（语法补全），改写`ES export`写法，利用`Tree shaking` 减少打包大小,`Composition API`，`Custom Renderer API` 新功能拓展及其`RECs` 文档的完善。当然，还有一些后续工作（`vuex`, `vue-router`, `cli`, `vue-test-utils`, `DevTools`, `Vetur`, `Nuxt`）待完成，当前还不稳定，正式在项目中使用（目前可以在小型新项目中），还需在[2020 Q2](https://github.com/vuejs/vue/projects/6#column-8291547)稳定版本之后。

`Vue3.0` 的到来已只是时间问题，未雨绸缪，何不先来尝鲜一波新特性～

## 设计动机

### 逻辑组合与复用

组件 `API` 设计所面对的核心问题之一就是如何组织逻辑，以及如何在多个组件之间抽取和复用逻辑。基于 `Vue 2.x` 目前的 `API` 我们有一些常见的逻辑复用模式，但都或多或少存在一些问题。这些模式包括：

- Mixins
- 高阶组件 (Higher-order Components, aka HOCs)
- Renderless Components (基于 scoped slots / 作用域插槽封装逻辑的组件）

以上这些模式存在以下问题：

- 模版中的数据来源不清晰。举例来说，当一个组件中使用了多个 mixin 的时候，光看模版会很难分清一个属性到底是来自哪一个 mixin。HOC 也有类似的问题。
- 命名空间冲突。由不同开发者开发的 mixin 无法保证不会正好用到一样的属性或是方法名。HOC 在注入的 props 中也存在类似问题。
- 性能。HOC 和 Renderless Components 都需要额外的组件实例嵌套来封装逻辑，导致无谓的性能开销。

`Composition API` 受 `React Hooks` 的启发，提供了一个全新的逻辑复用方案，且不存在上述问题。使用基于函数的 `API`，我们可以将相关联的代码抽取到一个 `"composition function"（组合函数）`中 —— 该函数封装了相关联的逻辑，并将需要暴露给组件的状态以响应式的数据源的方式返回出来。这里是一个用组合函数来封装鼠标位置侦听逻辑的例子：

```js
function useMouse() {
  const x = ref(0)
  const y = ref(0)
  const update = e => {
    x.value = e.pageX
    y.value = e.pageY
  }
  onMounted(() => {
    window.addEventListener('mousemove', update)
  })
  onUnmounted(() => {
    window.removeEventListener('mousemove', update)
  })
  return { x, y }
}

// 在组件中使用该函数
const Component = {
  setup() {
    const { x, y } = useMouse()
    // 与其它函数配合使用
    const { z } = useOtherLogic()
    return { x, y, z }
  },
  template: `<div>{{ x }} {{ y }} {{ z }}</div>`
}
```

从以上例子中可以看到：

- 暴露给模版的属性来源清晰（从函数返回）；
- 返回值可以被任意重命名，所以不存在命名空间冲突；
- 没有创建额外的组件实例所带来的性能损耗。

## `Composition API`

> 除了渲染函数 API 和作用域插槽语法之外的所有内容都将保持不变，或者通过兼容性构建让其与 `2.x` 保持兼容

`Vue 3.0`并不像 `Angular` 那样超强跨度版本，导致不兼容，而是在兼容 `2.x` 基础上做改进。

在这里可以在 `2.x` 中通过引入 `@vue/composition-api`，使用 `Vue 3.0` 新特性。

### 初始化项目

1、安装 `vue-cli3`

```js
npm install -g @vue/cli
```

2、创建项目

```js
vue create vue3
```

3、项目中安装 `composition-api`

```js
npm install @vue/composition-api --save
```

4、在使用任何 `@vue/composition-api` 提供的能力前，必须先通过 `Vue.use()` 进行安装

```js
import Vue from 'vue'
import VueCompositionApi from '@vue/composition-api'

Vue.use(VueCompositionApi)
```

### setup()

`Vue3` 引入一个新的组件选项，`setup()`，它会在一个组件实例被创建时，初始化了 `props` 之后调用。 会接收到初始的 `props` 作为参数：

```js
export default {
  props: {
    name: String
  },
  setup(props) {
    console.log(props.name)
  }
}
```

传进来的 `props` 是响应式的，当后续 `props` 发生变动时它也会被框架内部同步更新。但对于用户代码来说，它是不可修改的（会导致警告）。

同时，`setup()` 执行时机相当于 `2.x` 生命周期 `beforeCreate` 之后，且在 `created` 之前：

```js
export default {
  beforeCreate() {
    console.log('beforeCreate')
  },
  setup() {
    console.log('setup')
  },
  created() {
    console.log('created')
  }
}
// 打印结果
// beforeCreate
// setup
// created
```

在 `setup()` 中 `this` 不再是 `vue` 实例对象了，而是 `undefined`，可以理解为此时机实例还没有创建。在 `setup()` 第二个参数是上下文参数，提供了一些 `2.x` `this` 上有用属性。

```js
export default {
  setup(props, context) {
    console.log('this: ', this)
    console.log('context: ', context)
  }
}
// 打印结果
// this: undefined
// context: {
//   attrs: Object
//   emit: f()
//   isServer: false
//   listeners: Object
//   parent: VueComponent
//   refs: Object
//   root: Vue
//   slots: {}
//   ssrContext: undefined
// }
```

类似 `data()`，`setup()` 可以返回一个对象，这个对象上的属性将会暴露给模版的渲染上下文：

```js
export default {
  setup() {
    return {
      name: 'zs'
    }
  },
  template: `
    <div>{{ name }}</div>
  `
}
```

### reactive()

等价于 `vue 2.x` 中的 `Vue.observable()` 函数，`vue 3.x` 中提供了 `reactive()` 函数，用来创建响应式的数据对象。

当（引用）数据直接改变不会让模版响应更新渲染：

```js
export default {
  setup() {
    const state = { count: 0 }
    setTimeout(() => {
      state.count++
    })
    return { state }
  },
  template: `
  <div>count: {{state.count}}</div>
  `
}
// 一秒后页面没有变化
```

`reactive` 创建的响应式数据对象，在对象属性发生变化时，模版是可以响应更新渲染的：

```js
import { reactive } from '@vue/composition-api'

export default {
  setup() {
    const state = reactive({ count: 0 })

    setTimeout(() => {
      state.count++
    }, 1000)

    return { state }
  },
  template: `
  <div>count: {{state.count}}</div>
  `
}
// 一秒后页面数字从0变成1
```

### ref()

在 `Javascript` 中，原始类型（如 `String`，`Number`）只有值，没有引用。如果在一个函数中返回一个字符串变量，接收到这个字符串的代码只会获得一个值，是无法追踪原始变量后续的变化的。

```js
import { ref } from '@vue/composition-api'

export default {
  setup() {
    const count = 0

    setTimeout(() => {
      count++
    }, 1000)

    return { count }
  },
  template: `
  <div>count: {{count}}</div>
  `
}
// 页面没有变化
```

因此，包装对象 `ref()` 的意义就在于提供一个让我们能够在函数之间以引用的方式传递任意类型值的容器。这有点像 `React Hooks` 中的 `useRef` —— 但不同的是 `Vue` 的包装对象同时还是响应式的数据源。有了这样的容器，我们就可以在封装了逻辑的组合函数中将状态以引用的方式传回给组件。组件负责展示（追踪依赖），组合函数负责管理状态（触发更新）。

`ref()` 返回的是一个 `value reference` （包装对象）。一个包装对象只有一个属性：.value ，该属性指向内部被包装的值。包装对象的值可以被直接修改。

```js
import { ref } from '@vue/composition-api'

export default {
  setup() {
    const count = ref(0)
    console.log('count.value: ', count.value)
    count.value++ // 直接修改包装对象的值
    console.log('count.value: ', count.value)
  }
}
// 打印结果：
// count.value: 0
// count.value: 1
```

当包装对象被暴露给模版渲染上下文，或是被嵌套在另一个响应式对象中的时候，它会被自动展开 (unwrap) 为内部的值：

```js
import { ref } from '@vue/composition-api'

export default {
  setup() {
    const count = ref(0)
    console.log('count.value: ', count.value)
    return {
      count // 包装对象 value 属性自动展开
    }
  },
  template: `
    <div>ref count: {{count}}</div>
  `
}
```

也可以用 `ref()` 包装对象作为 `reactive()` 创建的对象的属性值，同样属性值 `ref()` 包装对象也会模版上下文被展开：

```js
import { reactive, ref } from '@vue/composition-api'

export default {
  setup() {
    const count = ref(0)
    const state = reactive({count})
    return {
      state // 包装对象 value 属性自动展开
    }
  },
  template: `
    <div>reactive ref count: {{state.count}}</div>
  `
}
```

在 `Vue 2.x` 中用实例上的 `$refs` 属性获取模版元素中 `ref` 属性标记 `DOM` 或组件信息，在这里用 `ref()` 包装对象也可以用来引用页面元素和组件；

```js
import { ref } from '@vue/composition-api'

export default {
  setup() {
    const text = ref(null)
    setTimeout(() => {
      console.log('text: ', text.value.innerHTML)
    }, 1000)
    return {
      text
    }
  },
  template: `
    <div><p ref="text">Hello</p></div>
  `
  // 打印结果：
  // text: Hello
```

### unref()

如果参数是一个 `ref` 则返回它的 `value`，否则返回参数本身。它是 `val = isRef(val) ? val.value : val` 的语法糖。

### isref()

检查一个值是否为一个 `ref` 对象。
