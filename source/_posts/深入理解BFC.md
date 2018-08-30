---
title: 深入理解BFC
date: 2018-08-27 19:42:30
tags: css BFC
categories: css
---

## 1、相关定义

### 1.1 Formatting context

Formatting context是W3C CSS2.1规定中的一个概念。它是页面中的一块渲染区域，并且有一套渲染规则，它决定了其子元素如何定位，以及和其他元素的关系和相互作用。最常见的Formatting context有Block formatting context（简称BFC）和Inline formatting context（简称IFC）。
css2.1中只有BFC和IFC，css3中还增加了GFC和FFC。

### 1.2 BFC定义

BFC(Block formatting context)直译为“块级格式化上下文”。它是独立的渲染区域，只有Block-level box参与，它规定了内部的Block-level Box如何布局，并且与这个区域外部毫不相干。

### 1.3 BFC布局规则：
- 内部的Box会在垂直方向，一个接一个地放置；
- Box垂直方向地距离由margin决定。属于同一个BFC的两个相邻Box的margin会发生重叠
- 每个元素的margin box的左边，与包含块border box的左边相接触（对于从左往右的格式化，否则相反）。即便存在浮动也是如此。
- BFC的区域不会与float box重叠。
- BFC就是页面的一个隔离的独立容器，容器里面的子元素不会影响到外面的元素。反之也如此。
- 计算BFC的高度时，浮动元素页参与计算。
-
## 2、作用

### 2.1 可生成BFC的元素

- 根元素html；
- float属性不为none；
- position为absolute或fixed；
- display为inline-block， table-cell，table-caption，flex， inline-flex；
- overflow不为visible；

### 2.2 场景一：对于两栏或三栏浮动自适应布局，包含块边接触问题。


```
<style>
    .left-center-right.float .left {
        float: left;
        width: 200px;
        height: 100px;
        background-color: rgba(0, 0, 0, 0.7);
    }

    .left-center-right.float .center {
        background-color: rgb(13, 218, 233);
        height: 200px;
    }

    .left-center-right.float .right {
        float: right;
        width: 200px;
        height: 150px;
        background-color: rgb(189, 109, 109);
    }
</style>
<section class="left-center-right float">
    <article class="left">我是左边区域块</article>
    <article class="right">我是右边区域块</article>
    <article class="center">我是中间区域块</article>
</section>
```

中间自适应栏边界会延展左右浮动区域
![image](https://note.youdao.com/yws/public/resource/b9cdada69234d36736d09235b516171c/xmlnote/67CD3941EFC8420AAB3D54CB766DE219/7159)

此时需要把中间栏变成BFC

```
.left-center-right.float .center {
    background-color: rgb(13, 218, 233);
    height: 200px;
    overflow: hidden;
}
```
![image](https://note.youdao.com/yws/public/resource/b9cdada69234d36736d09235b516171c/xmlnote/97EE88BCB7AC428E95F9F9A5580639A7/7175)

### 2.3 场景二：子级元素有浮动，父级元素塌陷问题


```
<style>
    .all-children-float .left {
        float: left;
        width: 200px;
        height: 100px;
        background-color: rgba(0, 0, 0, 0.7);
    }

    .all-children-float .right {
        float: right;
        width: 200px;
        height: 150px;
        background-color: rgb(189, 109, 109);
    }
</style>
<section class="all-children-float">
    <article class="left">我是左边区域块</article>
    <article class="right">我是右边区域块</article>
</section>
```

![image](https://note.youdao.com/yws/public/resource/b9cdada69234d36736d09235b516171c/xmlnote/1B737A83C8D04BF9B0ABDE2EF28DF0E6/7190)

此时需要将父级元素变成BFC

```
.all-children-float {
    position: absolute;
}
```

![image](https://note.youdao.com/yws/public/resource/b9cdada69234d36736d09235b516171c/xmlnote/D00321F3DC9C4D578E6C89DD23DB0AB2/7200)

### 2.3 场景三：垂直方向margin出现重合

```
<style>
    .verticle-block .block1 {
        width: 200px;
        height: 150px;
        background-color: rgb(13, 218, 233);
        margin: 20px;
    }

    .verticle-block .block2 {
        width: 150px;
        height: 150px;
        background-color: rgb(189, 109, 109);
        margin: 30px;
    }
</style>
<section class="verticle-block">
    <article class="block1">我是区域块1</article>
    <article class="block2">我是区域块2</article>
</section>
```
> Box垂直方向的距离margin决定，属于同一个BFC的两个相邻Box的margin会发生重叠。

![image](https://note.youdao.com/yws/public/resource/b9cdada69234d36736d09235b516171c/xmlnote/4C9FBEC4951F4006939CD8AAEC698B21/7214)

我们的做法是包一层标签，并转化成BFC。

```
.wrapper1 {
    overflow: hidden;
}

<section class="verticle-block">
    <div class="wrapper1">
        <article class="block1">我是区域块1</article>
    </div>
    <article class="block2">我是区域块2</article>
</section>
```

![image](https://note.youdao.com/yws/public/resource/b9cdada69234d36736d09235b516171c/xmlnote/56A0200CB1424C20AB9930AA4CAC44E2/7217)
