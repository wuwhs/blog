---
title: grid栅格布局
date: 2018-08-27 19:42:30
tags: css
---

### 1、历史四个布局阶段

网页布局经历了四个历史阶段：

1. table布局；
2. float和position布局；
3. flex布局，**解决了传统布局方案三大痛点：排列方向、对齐方式和自适应尺寸**；
4. grid布局，二维布局模块，具有强大的内容尺寸和定位能力。

> flex分为伸缩容器和伸缩项目，grid分为网格容器和网格项目。

### 2、grid布局-网格容器

#### 2.1 显示网格
使用grid-template-columns和grid-template-rows可以显式设置一个网格的列（宽）和行（高）。


```
<!--grid布局设置行高-->
.grid {
    display: grid;
    grid-template-rows: 60px 40px;
}
```

![image](https://note.youdao.com/yws/public/resource/b9cdada69234d36736d09235b516171c/xmlnote/3574D457316B42CFB97308621868E977/7467)

```
.grid {
    display: grid;
    grid-template-columns: 40px 50px 60px;
}

```
![image](https://note.youdao.com/yws/public/resource/b9cdada69234d36736d09235b516171c/xmlnote/66BA147AB9E2485E9D8651BABD44D629/7479)

fr单位表示网格容器中可用空间按比列分配。

```
.grid {
    display: grid;
    grid-template-rows: 1fr 2fr;
    grid-template-colums: 1fr 1fr 2fr;
}
```

![image](https://note.youdao.com/yws/public/resource/b9cdada69234d36736d09235b516171c/xmlnote/25C4A08625A84A3F8D7396D3A466EE53/7493)

minmax()函数来创建网格轨道的最小或最大尺寸。

```
.grid {
    display: grid;
    grid-template-rows: minmax(100px, auto);
    grid-template-columns: 1fr 1fr 2fr;
}
```

![image](https://note.youdao.com/yws/public/resource/b9cdada69234d36736d09235b516171c/xmlnote/91533C8847D247C593E96A01991749EC/7504)

使用repeat()可以创建重复的网络轨道，适用于创建相等尺寸的网格项目和多个网格项目。

```
.grid {
    display: grid;
    grid-template-columns: 30px repeat(3, 1fr) 30px;
    grid-template-rows: repeat(3, 1fr);
}
```

![image](https://note.youdao.com/yws/public/resource/b9cdada69234d36736d09235b516171c/xmlnote/C2FFDAE5EABC4B5C967A7BA343D1EE0C/7526)

#### 2.2 间距

> grid-columns-gap: 列与列之间的间距

> grid-rows-gap: 行与行之间的间距

> grid-gap: grid-columns-gap和grid-rows-gap的缩写


```
.grid {
    display: grid;
    grid-template-columns: 1fr 1fr 2fr;
    grid-template-rows: 1fr 2fr;
    grid-gap: 5px 10px;
}
```

![image](https://note.youdao.com/yws/public/resource/b9cdada69234d36736d09235b516171c/xmlnote/E17E474F26694A09A00848DBA563ED5E/7553)


### 3、grid布局-网格项目

通过网格线可以定位网格项目。网格线实际上是代表线的开始、结束，两者之间就是网格列表或行。每条线是从网格轨道开始，网格的网格线从1开始，每条网格线逐步增加1。


```
.grid {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-rows: 1fr 2fr;
}

.item1 {
    grid-rows-start: 2;
    grid-columns-start: 2;
    grid-columns-end: 4;
}
```

![image](https://note.youdao.com/yws/public/resource/b9cdada69234d36736d09235b516171c/xmlnote/240CC74E9E744F429189BC748FFE6711/7572)

> grid-row是grid-row-start和grid-row-end的简写。grid-columns是grid-columns-start和grid-columns-end的简写。

> 关键字span后面紧随数字，表示合并多少个列或行

```
.grid {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-rows: 1fr 1fr;
}

.item1 {
    grid-row: 2/span 2;
    grid-column: span 3;
}
```

![image](https://note.youdao.com/yws/public/resource/b9cdada69234d36736d09235b516171c/xmlnote/C4EE7125AC274347BEADEA5C8C3E1A07/7603)


> grid-area 指定四个值，1：grid-row-start 2: grid-column-start 3: grid-row-end 4: grid-column-end


```
.grid {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-rows: 1fr 1fr;
}

.item1 {
    gird-area: 1/2/2/4;
}
```


![image](https://note.youdao.com/yws/public/resource/b9cdada69234d36736d09235b516171c/xmlnote/F29F7AD9F84A4D7CAACEAE50F0DCA74C/7621)


grid目前的支持度还不是很多，IE完全不支持，支持的浏览器有Firefox 52, Safari 10.1, Chrome 57, Opera 44，了解上面这些就够了，[深入了解其他特性](http://www.cnblogs.com/xiaohuochai/p/7083153.html)
