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

- 模版中的数据来源不清晰。举例来说，当一个组件中使用了多个 `mixin` 的时候，光看模版会很难分清一个属性到底是来自哪一个 `mixin`。`HOC` 也有类似的问题。
- 命名空间冲突。由不同开发者开发的 `mixin` 无法保证不会正好用到一样的属性或是方法名。`HOC` 在注入的 `props` 中也存在类似问题。
- 性能。`HOC` 和 `Renderless Components` 都需要额外的组件实例嵌套来封装逻辑，导致无谓的性能开销。

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

### toRefs()

把一个响应式对象转换成普通对象，该普通对象的每个 `property` 都是一个 `ref` ，和响应式对象 `property` 一一对应。并且，当想要从一个组合逻辑函数中返回响应式对象时，用 `toRefs` 是很有效的，该 `API` 让消费组件可以 解构 / 扩展（使用 `...` 操作符）返回的对象，并不会丢失响应性：

```js
import { reactive, toRefs } from '@vue/composition-api'

export default {
  setup() {
    const state = reactive({
      count: 0
    })

    const increment = () => {
      state.count++
    }

    return {
      ...toRefs(state), // 结构出来不丢失响应性
      increment
    }
  },
  template: `
  <div>
    <p>count: {{count}}</p>
    <button @click="increment">+1</button>
  </div>
  `
}
```

### computed()

`computed()` 用来创建计算属性，`computed()` 函数的返回值是一个 `ref` 的实例。这个值模式是只读的：

```js
import { ref, computed } from '@vue/composition-api'

export default {
  setup() {
    const count = ref(0)
    const plusOne = computed(() => count.value + 1)
    plusOne.value = 10
    console.log('plusOne.value: ', plusOne.value)
    console.log('count.value: ', count.value)
  }
}
// 打印结果：
// [Vue warn]: Computed property was assigned to but it has no setter.
// plusOne.value: 1
// count.value: 0
```

或者传入一个拥有 `get` 和 `set` 函数的对象，创建一个可手动修改的计算状态：

```js
import { ref, computed } from '@vue/composition-api'

export default {
  setup() {
    const count = ref(0)
    const plusOne = computed({
      get: () => count.value + 1,
      set: val => {
        count.value = val - 1
      }
    })
    plusOne.value = 10
    console.log('plusOne.value: ', plusOne.value)
    console.log('count.value: ', count.value)
  }
}
// 打印结果：
// plusOne.value: 10
// count.value: 9
```

### watchEffect()

`watchEffect()` 监测副作用函数。立即执行传入的一个函数，并响应式追踪其依赖，并在其依赖变更时重新运行该函数：

```js
import { ref, watchEffect } from '@vue/composition-api'

export default {
  setup() {
    // 监视 ref 数据源
    const count = ref(0)
    // 监视依赖有变化，立刻执行
    watchEffect(() => {
      console.log('count.value: ', count.value)
    })
    const increment = () => {
      count.value++
    }
    return {
      count,
      increment
    }
  },
  template: `
  <div>
    <p>count: {{count}}</p>
    <button @click="increment">+1</button>
  </div>
  `
}
```

**停止侦听**。当 `watchEffect` 在组件的 `setup()` 函数或生命周期钩子被调用时， 侦听器会被链接到该组件的生命周期，并在组件卸载时自动停止。

在一些情况下（比如超时就无需继续监听变化），也可以显式调用返回值以停止侦听：

```js
import { reactive, watchEffect } from '@vue/composition-api'

export default {
  setup() {
    // 监视 reactive 数据源
    const state = reactive({
      count: 0
    })
    const stop = watchEffect(() => {
      console.log('state.count: ', state.count)
    })
    setTimeout(() => {
      stop()
    }, 3000)
    const increment = () => {
      state.count++
    }
    return {
      state,
      increment
    }
  },
  template: `
  <div>
    <p>count: {{state.count}}</p>
    <button @click="increment">+1</button>
  </div>
  `
}
// 3秒后，不再打印
```

**清除副作用**。有时候当观察的数据源变化后，我们可能需要对之前所执行的副作用进行清理。举例来说，一个异步操作在完成之前数据就产生了变化，我们可能要撤销还在等待的前一个操作。为了处理这种情况，`watchEffect` 的回调会接收到一个参数是用来注册清理操作的函数。调用这个函数可以注册一个清理函数。清理函数会在下属情况下被调用：

- 副作用即将重新执行时
- 侦听器被停止 (如果在 `setup()` 或 生命周期钩子函数中使用了 `watchEffect`, 则在卸载组件时)

我们之所以是通过传入一个函数去注册失效回调，而不是从回调返回它（如 `React useEffect` 中的方式），是因为返回值对于异步错误处理很重要。

```js
const data = ref(null)
watchEffect(async (id) => {
  data.value = await fetchData(id)
})
```

`async function` 隐性地返回一个 `Promise` - 这样的情况下，我们是无法返回一个需要被立刻注册的清理函数的。除此之外，回调返回的 `Promise` 还会被 `Vue   用于内部的异步错误处理。

在实际应用中，在大于某个频率（请求padding状态）操作时，可以先取消之前操作，节约资源：

```js
import { ref, watchEffect } from '@vue/composition-api'
export default {
  setup() {
    const keyword = ref('')
    const asyncPrint = val => {
      return setTimeout(() => {
        console.log('user input: ', val)
      }, 1000)
    }

    watchEffect(
      onInvalidate => {
        const timer = asyncPrint(keyword.value)
        onInvalidate(() => clearTimeout(timer))
        console.log('keyword change: ', keyword.value)
      },
      {
        flush: 'post' // 默认'post'，同步'sync'，'pre'组件更新之前
      }
    )

    return {
      keyword
    }
  },
  template: `
  <div>
    <input type="text"
      v-model="keyword">
  </div>
  `
}
// 实现对用户输入“防抖”效果
```

### watch()

`watch API` 完全等效于 `2.x` `this.$watch` （以及 `watch` 中相应的选项）。`watch` 需要侦听特定的数据源，并在回调函数中执行副作用。默认情况是懒执行的，也就是说仅在侦听的源变更时才执行回调。

`watch()` 接收的第一个参数被称作 “数据源”，它可以是：

- 一个返回任意值的函数
- 一个包装对象
- 一个包含上述两种数据源的数组

第二个参数是回调函数。回调函数只有当数据源发生变动时才会被触发：

```js
watch(
  // getter
  () => count.value + 1,
  // callback
  (value, oldValue) => {
    console.log('count + 1 is: ', value)
  }
)
// -> count + 1 is: 1

count.value++
// -> count + 1 is: 2
```

上面提到第一个参数的“数据源”可以是一个包含函数和包装对象的数组，也就是可以同时监听多个数据源。同时，`watch` 和 `watchEffect` 在停止侦听, 清除副作用 (相应地 `onInvalidate` 会作为回调的第三个参数传入)，等方面行为一致。下面用上面“防抖”例子用 `watch` 改写：

```js
import { ref, watch } from '@vue/composition-api'
export default {
  setup() {
    const keyword = ref('')
    const asyncPrint = val => {
      return setTimeout(() => {
        console.log('user input: ', val)
      })
    }

    watch(
      keyword,
      (newVal, oldVal, onCleanUp) => {
        const timer = asyncPrint(keyword)
        onCleanUp(() => clearTimeout(timer))
      },
      {
        lazy: true // 默认未false，即初始监听回调函数执行了
      }
    )
    return {
      keyword
    }
  }，
  template: `
  <div>
    <input type="text"
      v-model="keyword">
  </div>
  `
}
```

和 `2.x` 的 `$watch` 有所不同的是，`watch()` 的回调会在创建时就执行一次。这有点类似 `2.x watcher` 的 `immediate: true` 选项，但有一个重要的不同：默认情况下 `watch()` 的回调总是会在当前的 `renderer flush` 之后才被调用 —— 换句话说，`watch()`的回调在触发时，`DOM` 总是会在一个已经被更新过的状态下。 这个行为是可以通过选项来定制的。

在 `2.x` 的代码中，我们经常会遇到同一份逻辑需要在 `mounted` 和一个 `watcher` 的回调中执行（比如根据当前的 `id` 抓取数据），`3.0` 的 `watch()` 默认行为可以直接表达这样的需求。

### 生命周期钩子函数

可以直接导入 `onXXX` 一族的函数来注册生命周期钩子。

```js
import { onMounted, onUpdated, onUnmounted } from '@vue/composition-api'

const MyComponent = {
  setup() {
    onMounted(() => {
      console.log('mounted!')
    })
    onUpdated(() => {
      console.log('updated!')
    })
    onUnmounted(() => {
      console.log('unmounted!')
    })
  },
}
```

这些生命周期钩子注册函数只能在 `setup()` 期间同步使用， 因为它们依赖于内部的全局状态来定位当前组件实例（正在调用 `setup()` 的组件实例）, 不在当前组件下调用这些函数会抛出一个错误。

组件实例上下文也是在生命周期钩子同步执行期间设置的，因此，在卸载组件时，在生命周期钩子内部同步创建的侦听器和计算状态也将自动删除。

`2.x` 的生命周期函数与新版 `Composition API` 之间的映射关系：

- ~~beforeCreate~~ -> 使用 setup()
- ~~created~~ -> 使用 setup()
- beforeMount -> onBeforeMount
- mounted -> onMounted
- beforeUpdate -> onBeforeUpdate
- updated -> onUpdated
- beforeDestroy -> onBeforeUnmount
- destroyed -> onUnmounted
- errorCaptured -> onErrorCaptured

注意：`beforeCreate` 和 `created` 在 `Vue3` 中已经由 `setup` 替代。

### 依赖注入

`provide` 和 `inject` 提供依赖注入，功能类似 `2.x` 的 `provide/inject`。两者都只能在当前活动组件实例的 `setup()` 中调用。

可以使用 `ref` 来保证 `provided` 和 `injected` 之间值的响应。

父依赖注入，作为提供者，传给子组件：

```js
import { ref, provide } from '@vue/composition-api'
import ComParent from './ComParent.vue'

export default {
  components: {
    ComParent
  },
  setup() {
    let treasure = ref('传国玉玺')
    provide('treasure', treasure)
    setTimeout(() => {
      treasure.value = '尚方宝剑'
    }, 1000)
    return {
      treasure
    }
  }
}
```

子依赖注入，可作为使用者：

```js
import { inject } from '@vue/composition-api'
import ComChild from './ComChild.vue'

export default {
  components: {
    ComChild
  },
  setup() {
    const treasure = inject('treasure')
    return {
      treasure
    }
  }
}
```

孙组件依赖注入，作为使用者使用，当祖级依赖传入的值改变时，也能响应：

```js
import { inject } from '@vue/composition-api'

export default {
  setup() {
    const treasure = inject('treasure')
    return {
      treasure
    }
  }
}
```
