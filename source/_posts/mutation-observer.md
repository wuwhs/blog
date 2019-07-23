---
title: 如何优雅监听容器高度变化
date: 2019-07-11 18:22:34
tags: [javascript, html]
---

# 如何优雅监听容器高度变化

啦啦啦

## 前言

老鸟：怎样去监听 `DOM` 元素的高度变化呢？
菜鸟：哈哈哈哈哈，这都不知道哦，用 `onresize` 事件鸭！
老鸟扶了扶眼睛，空气安静几秒钟，菜鸟才晃过神来。对鸭，普通 `DOM` 元素没有 `onresize` 事件，只有在 `window` 对象下有此事件，该死，又双叒叕糗大了。

哈哈哈哈，以上纯属虚构，不过在最近项目中还真遇到过对容器监听高（宽）变化：在使用 `iscroll` 或 `better-scroll` 滚动插件，如果容器内部元素有高度变化要去及时更新外部包裹容器，即调用 `refresh()` 方法。不然就会造成滚动误差（滚动不到底部或滚动脱离底部）。

可能我们一般处理思路：

- 在每次 `DOM` 节点有更新（删除或插入）后就去调用 `refresh()`，更新外部容器。
- 对异步资源（如图片）加载，使用`onload` 监听每次加载完成，再去调用 `refresh()`，更新外部容器。

这样我们会发现，如果容器内部元素比较复杂，调用会越来越繁琐，甚至还要考虑到用户使用的每一个操作都可能导致内部元素宽高变化，进而要去调整外部容器，调用 `refresh()`。

实际上，不管是对元素的哪种操作，都会造成它的属性、子孙节点、文本节点发生了变化，如果能能监听得到这种变化，这时只需比较容器宽高变化，即可实现对容器宽高的监听，而无需关系它外部行为。`DOM3 Events` 规范为我们提供了 [`MutationObserver`](https://developer.mozilla.org/zh-CN/docs/Web/API/MutationObserver) 接口监视对 `DOM` 树所做更改的能力。

## MutationObserver

`Mutation Observer API` 用来监视 `DOM` 变动。`DOM` 的任何变动，比如节点的增减、属性的变动、文本内容的变动，这个 `API` 都可以得到通知。

### MutationObserver 特点

`DOM` 发生变动都会触发 `Mutation Observer` 事件。但是，它跟事件还是有不用点：事件是同步触发，`DOM` 变化立即触发相应事件；`Mutation Observer` 是异步触发，`DOM` 变化不会马上触发，而是等当前所有 `DOM` 操作都结束后才触发。总的来说，特点如下：

- 它等待所有脚本任务完成后，才会运行（即异步触发方式）。
- 它把 `DOM` 变动记录封装成一个数组进行处理，而不是一条条个别处理 `DOM` 变动。
- 它既可以观察 `DOM` 的所有类型变动，也可以指定只观察某一类变动。

### MutationObserver 构造函数

`MutationObserver` 构造函数的实例传的是一个回调函数，该函数接受两个参数，第一个是变动的数组，第二个是观察器是实例。

```js
var observer = new MutationObserver(function (mutations, observer){
  mutations.forEach(function (mutaion) {
    console.log(mutation);
  })
})
```

### MutationObserver 实例的 observe() 方法

`observe` 方法用来执行监听，接受两个参数：

1. 第一个参数，被观察的 `DOM` 节点；
2. 第二个参数，一个配置对象，指定所要观察特征。

```js
var $tar = document.getElementById('tar');
var option = {
  childList: true, // 子节点的变动（新增、删除或者更改）
  attributes: true, // 属性的变动
  characterData: true, // 节点内容或节点文本的变动

  subtree: true, // 是否将观察器应用于该节点的所有后代节点
  attributeFilter: ['class', 'style'], // 观察特定属性
  attributeOldValue: true, // 观察 attributes 变动时，是否需要记录变动前的属性值
  characterDataOldValue: true // 观察 characterData 变动，是否需要记录变动前的值
}
mutationObserver.observe($tar, option);
```

`option` 中，必须有 `childList`、`attributes`和`characterData`中一种或多种，否则会报错。其中各个属性意思如下：

- `childList` 布尔值，表示是否应用到子节点的变动（新增、删除或者更改）；
- `attributes` 布尔值，表示是否应用到属性的变动；
- `characterData` 布尔值，表示是否应用到节点内容或节点文本的变动；
- `subtree` 布尔值，表示是否应用到是否将观察器应用于该节点的所有后代节点；
- `attributeFilter` 数组，表示观察特定属性；
- `attributeOldValue` 布尔值，表示观察 `attributes` 变动时，是否需要记录变动前的属性值；
- `characterDataOldValue` 布尔值，表示观察 `characterData` 变动，是否需要记录变动前的值；

#### childList 和 subtree 属性

`childList` 属性表示是否应用到子节点的变动（新增、删除或者更改），监听不到子节点后代节点变动。

```js
var mutationObserver = new MutationObserver(function (mutations) {
  console.log(mutations);
})

mutationObserver.observe($tar, {
  childList: true, // 子节点的变动（新增、删除或者更改）
})

var $div1 = document.createElement('div');
$div1.innerText = 'div1';

// 新增子节点
$tar.appendChild($div1); // 能监听到

// 删除子节点
$tar.childNodes[0].remove(); // 能监听到

var $div2 = document.createElement('div');
$div2.innerText = 'div2';

var $div3 = document.createElement('div');
$div3.innerText = 'div3';

// 新增子节点
$tar.appendChild($div2); // 能监听到

// 替换子节点
$tar.replaceChild($div3, $div2); // 能监听到

// 新增孙节点
$tar.childNodes[0].appendChild(document.createTextNode('新增孙文本节点')); // 监听不到
```

#### attributes 和 attributeFilter 属性

`attributes` 属性表示是否应用到 `DOM` 节点属性的值变动的监听。而 `attributeFilter` 属性是用来过滤要监听的属性 `key`。

```js
// ...
mutationObserver.observe($tar, {
  attributes: true, // 属性的变动
  attributeFilter: ['class', 'style'], // 观察特定属性
})
// ...
// 改变 style 属性
$tar.style.height = '100px'; // 能监听到
// 改变 className
$tar.className = 'tar'; // 能监听到
// 改变 dataset
$tar.dataset = 'abc'; // 监听不到
```

#### characterData 和 `subtree` 属性

`characterData` 属性表示是否应用到节点内容或节点文本的变动。`subtree` 是否将观察器应用于该节点的所有后代节点。为了更好观察节点文本变化，将两者结合应用到富文本监听上是不错的选择。

简单的富文本，比如

```html
<div id="tar" contentEditable>A simple editor</div>
```

```js
var $tar = document.getElementById('tar');
var MutationObserver = window.MutationObserver || window.webkitMutationObserver || window.MozMutationObserver;
var mutationObserver = new MutationObserver(function (mutations) {
  console.log(mutations);
})
mutationObserver.observe($tar, {
  characterData: true, // 节点内容或节点文本的变动
  subtree: true, // 是否将观察器应用于该节点的所有后代节点
})
```

### takeRecords()、disconnect() 方法

`MutationObserver` 实例上还有两个方法，`takeRecords()` 用来清空记录队列并返回变动记录的数组。`disconnect()` 用来停止观察。调用该方法后，`DOM` 再发生变动，也不会触发观察器。

```js
var $text5 = document.createTextNode('新增文本节点5');
var $text6 = document.createTextNode('新增文本节点6');

// 新增文本节点
$tar.appendChild($text5);
var record = mutationObserver.takeRecords();

console.log('record: ', record); // 返回 记录新增文本节点操作，并清空监听队列

// 替换文本节点
$tar.replaceChild($text6, $text5);

mutationObserver.disconnect(); // 此处以后的不再监听

// 删除文本节点
$tar.removeChild($text6); // 监听不到
```

前面还有两个属性 `attributeOldValue` 和 `characterDataOldValue` 没有说，其实是影响 `takeRecords()` 方法返回结果。如果设置了这两个属性，就会对应返回对象中 `oldValue` 为记录之前旧的 `attribute` 和 `data`值。

比如将原来的 `className` 的值 `aaa` 替换成 `tar`，`oldValue` 记录为 `aaa`。

```js
record: [{
  addedNodes: NodeList []
  attributeName: "class"
  attributeNamespace: null
  nextSibling: null
  oldValue: "aaa"
  previousSibling: null
  removedNodes: NodeList []
  target: div#tar.tar
  type: "attributes"
}]
```

### MutationObserver 的应用







```js
/**
 * 监听元素高度变化，更新滚动容器
 */
Vue.directive('observe-element-height', {
    bind (el, binding) {
        const MutationObserver = window.MutationObserver || window.webkitMutationObserver || window.MozMutationObserver;
        let recordHeight = 0;

        el.__observer__ = new MutationObserver((mutations) => {
            console.log('lalalala...')
            mutations.forEach((mutation) => {
                console.log('mutation: ', mutation)
            })
            let height = window.getComputedStyle(el).getPropertyValue('height');
            if (height === recordHeight) {
                return;
            }
            recordHeight = height;
            EventBus.$emit('handleRefreshScroll');
            EventBus.$emit('handleSetScrollPosition', {
                isToBottom: binding.modifiers.isToBottom
            })
        });

        el.__observer__.observe(el, {
            // childList: true,
            subtree: true,
            attributes: true,
            // attributeFilter: ['style']
        })
    },
    unbind (el) {
        if (el.__observer__) {
            el.__observer__.disconnect();
            el.__observer__.takeRecords();
            el.__observer__ = null;
        }
    }
})


```
