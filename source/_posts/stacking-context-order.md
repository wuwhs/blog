---
title: 层叠上下文顺序
date: 2020-01-07 17:19:45
tags: [css]
---

## 层叠上下文与层叠顺序

层叠上下文（stacking content）是HTML中的三维概念，也就是元素z轴。层叠顺序（stacking order）表示层叠时有着特定的垂直显示顺序。

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