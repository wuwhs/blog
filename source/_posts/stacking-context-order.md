---
title: 层叠上下文顺序
date: 2020-01-07 17:19:45
tags: [css]
---

## 前言

在有些 CSS 相互影响作用下，对元素设置的 `z-index` 并不会按实际大小叠加，一直不明白其中的原理，最近特意查了一下相关资料，做一个小总结。那么，现在就开始。

## 层叠上下文与层叠顺序

层叠上下文（stacking content）是 HTML 中的三维概念，也就是元素z轴。层叠顺序（stacking order）表示层叠时有着特定的垂直显示顺序。

## 层叠准则

- 谁大谁上
    当具有明显的层叠水平标示的时候，如识别的z-indx值，在同一个层叠上下文领域，层叠水平值大的那一个覆盖小的那一个。

- 后来居上
    当元素的层叠水平一致、层叠顺序相同的时候，在DOM流中处于后面的元素会覆盖前面的元素。

## 层叠上下文的特性

层叠上下文有以下特性：

- 层叠上下文的层叠水平要比普通元素高；
- 层叠上下文可以阻断元素的混合模式；
- 层叠上下文可以嵌套，内部层叠上下文及其所有子元素均受制于外部的层叠上下文；
- 每个层叠上下文和兄弟元素独立，也就是当进行层叠变化或渲染的时候，只需考虑后代元素；
- 每个层叠上下文是自成体系的，当元素发生层叠的时候，整个元素被认为是在父层叠上下文的叠层顺序中；

## z-index 值不是 auto 的时候，会创建层叠上下文

对于包含 `position: relative;` `position: absolute;` 的定位元素，以及 FireFox/IE浏览器下包含 `position`声明定位的元素，当其 `z-index` 值不是 `auto` 的时候，会创建层叠上下文。

HTML 代码

```html
<div class="red-wrapper">
    <div class="red">小红</div>
</div>

<div class="gray-wrapper">
    <div class="gray">小灰</div>
</div>
```

CSS代码

```css
.red-wrapper {
    position: relative;
    z-index: auto;
}

.red {
    position: absolute;
    z-index: 2;
    width: 300px;
    height: 200px;
    text-align: center;
    background-color: brown;
}

.gray-wrapper {
    position: relative;
    z-index: auto;
}

.gray {
    position: relative;
    z-index: 1;
    width: 200px;
    height: 300px;
    text-align: center;
    background-color: gray;
}
```

![z-index-auto](/gb/stacking-context-order/z-index-auto.png)

当两个兄弟元素 `z-index` 都为 `auto` 时，它们为普通元素，子元素遵循”谁大谁上“的原则，所以小灰 `z-index: 1;` 输给了小红的 `z-index: 2;`，被压在了下面

然而当 `z-index` 变成数值时，就会创建一个层叠上下文，各个层叠元素相互独立，子元素受制于父元素的层叠顺序。将兄弟元素的 `z-index` 从 `auto` 变成了数值 `0`，他们的子元素的之间的层叠关系就不不受本身 `z-index` 的影响，而是由父级元素的 `z-index` 决定。

下面小红和小灰的父级的 `z-index` 都调整成 `0`

```css
.red-wrapper {
    /* 其他样式 */
    z-index: 0;
}

.gray-wrapper {
    /* 其他样式 */
    z-index: 0;
}
```

![z-index-0](/gb/stacking-context-order/z-index-0.png)

就会发现小灰在小红的上面了，因为小灰的父级和小红的父级都变成了层叠上下文元素，层叠级别一样，根据文档流中元素位置”后来居上“原则。

## CSS3对层叠上下文的影响

### display: flex|inline-flex 与层叠上下文

> 父级是 `display: flex` 或者 `display: inline-flex;`，子元素的 `z-index` 不是 `auto`，此时，这个子元素（注意这里是子元素）为层叠上下文元素。

HTML 代码

```html
<div class="wrapper">
    <div class="gray">
        小灰
        <div class="red">小红</div>
    </div>
</div>
```

CSS代码

```css
.wrapper {
    display: flex;
}

.gray {
    z-index: 1;
    width: 200px;
    height: 300px;
    text-align: center;
    background-color: gray;
}

.red {
    z-index: -1;
    width: 300px;
    height: 200px;
    text-align: center;
    background-color: brown;
    position: relative;
}
```

这样，由于小灰的父级的 `display: flex;`，自身的 `z-index` 不为 `auto`，因此变成了层叠上下文元素，原本小红垫底变成了小灰垫底了。

### mix-blend-mode 与层叠上下文

> 具有 `mix-blend-mode` 属性的元素是层叠上下文元素

CSS 属性[`mix-blend-mode`](https://developer.mozilla.org/en-US/docs/Web/CSS/mix-blend-mode)（混合模式），可以将叠加的元素的内容和背景混合在一起。

代码同上，只需在小灰上添加 `mix-blend-mode` 属性，为了能查看到混合效果，将外面容器增加一个背景图。

```css
.wrapper {
    background-image: url("./jz.png");
}

.gray {
    /* 其他样式 */
    mix-blend-mode: darken;
}
```

![mix-blend-mode](/gb/stacking-context-order/mix-blend-mode.png)

同理，小灰有 `mix-blend-mode` 属性，变成了层叠上下文元素，让小灰垫底。

### opacity 与层叠上下文

> 如果元素的 `opacity` 不为1，这个元素为层叠上下文元素

HTML 代码

```html
<div class="gray">
    小灰
    <div class="red">小红</div>
</div>
```

CSS代码

```css
.gray {
    z-index: 1;
    width: 200px;
    height: 300px;
    text-align: center;
    background-color: gray;
    opacity: 0.5;
}

.red {
    z-index: -1;
    width: 300px;
    height: 200px;
    text-align: center;
    background-color: brown;
    position: relative;
}
```

![opacity](/gb/stacking-context-order/opacity.png)

由于小灰自身有 `opacity` 半透明属性，变成了层叠上下文元素，使得小红 `z-index: -1;`也无法穿透。

### transform 与层叠上下文

> 应用了 `transform` 的元素为层叠上下文元素

代码同上，只不过把小灰应用 `transform` 变换。

```css
.gray {
    /* 其他相关样式 */
    transform: rotate(30deg);
}
```

![transform](/gb/stacking-context-order/transform.png)

同理，小灰应用 `transform` 变换，变成了层叠上下文元素，使得小红 `z-index: -1;`也无法穿透。

### filter 与层叠上下文

> 具有 `filter` 属性的元素是层叠上下文元素

代码同上，只不过把小灰加上 `filter` 属性。

```css
.gray {
    /* 其他相关样式 */
    filter: blur(5px);;
}
```

![filter](/gb/stacking-context-order/filter.png)

同理，小灰有 `filter` 属性，变成了层叠上下文元素，使得小红 `z-index: -1;` 还是在小灰上层。

### will-change 与层叠上下文

> 具有 `will-change` 属性的元素是层叠上下文元素

代码同上，只不过把小灰加上 `will-change` 属性。

```css
.gray {
    /* 其他相关样式 */
    filter: will-change;;
}
```

结果，同理如上。

## 总结

综合来看元素层叠规则，首先要理解在什么情况下元素是层叠上下文元素

-
