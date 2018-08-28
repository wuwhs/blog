---
title: 纯css三角形及其应用
date: 2018-08-27 19:42:30
tags: css
---

### 前言

对于气泡对话框或者Popover与内容连接部分会有小三角形效果，可能在以前直接用图片去实现，其实用纯css即可实现，下面要实现的效果分别是微信对话框和面包屑，以此回顾记录一下。

**效果如下**：

![微信对话框](https://note.youdao.com/yws/public/resource/bb7792e904a30442f11cb6c88c33cce8/xmlnote/BD6E839095B849EFBEA5AFE6A7E2247C/12809)

![面包屑导航](https://note.youdao.com/yws/public/resource/bb7792e904a30442f11cb6c88c33cce8/xmlnote/33924A875DE149758DA23FBB4BD91C38/12808)

### css写三角形原理

首先我们设置一个`div`元素的宽高和边框，观察效果

```css
.demo1 {
  width: 40px;
  height: 40px;
  border-width: 20px;
  border-style: solid;
  border-color: #ff0000 #00ff00 #0000ff #ff00ff;
}
```
效果
![](https://note.youdao.com/yws/public/resource/bb7792e904a30442f11cb6c88c33cce8/xmlnote/8F89F04D2280419B95C64241D69B7EDE/12821)

可以发现分别观察四边框是按类似等边梯形绘制的，如果进一步把宽高设小，甚至设为0，就会呈现为三角形，于是

```css
.demo2 {
  width: 0;
  height: 0;
  border-width: 20px;
  border-style: solid;
  border-color: #ff0000 #00ff00 #0000ff #ff00ff;
}
```

效果

![](https://note.youdao.com/yws/public/resource/bb7792e904a30442f11cb6c88c33cce8/xmlnote/8F89F04D2280419B95C64241D69B7EDE/12821)

果然是这样的，下面要做的是把其中某个三角形单独提取出来显示，其他都显示为`transparent`，于是就有了

```css
.demo3 {
  width: 0;
  height: 0;
  border-width: 20px;
  border-style: solid;
  border-color: transparent;
  border-left-color: #ff00ff;
}
```

效果

![](https://note.youdao.com/yws/public/resource/bb7792e904a30442f11cb6c88c33cce8/xmlnote/A130A3C87396415BB1FBC0AC3D397EE9/12820)

一个指向右边的三角形大功告成，要其他方向的三角形，只需改变透明的边框即可。

### 应用

有时我们不需要整个实心的三角形，而只需要类似与`>`不同方向箭头的效果，例如popover气泡框效果。这样就需要两个三角形通过重叠错位来实现这样的效果，重叠三角形B颜色和气泡框背景色一样，被重叠三角形A颜色和气泡框边框颜色一样。

![](https://note.youdao.com/yws/public/resource/bb7792e904a30442f11cb6c88c33cce8/xmlnote/FDBF1452678842C2B759F975D2E83170/12908)

#### 实现微信对话框效果
两个三角形重叠错位，意味着要两个元素，但是这样一来就增加了这个小功能的复杂度，其实可以利用标签的伪类元素`:before`和`:after`来充当元素画出两个三角形。

html部分
```html
<div class="chat-dialog">hi，在吗？</div>
```

css部分
```css
.chat-dialog {
  position: relative;
  width: 180px;
  height: 32px;
  line-height: 32px;
  border-radius: 5px;
  margin-left: 30px;
  border: 1px solid #009a61;
  padding: 4px;
}

.chat-dialog:before,
.chat-dialog:after {
  content: "";
  display: block;
  position: absolute;
  top: 13px;
  left: -13px;
  width: 0;
  height: 0;
  border-width: 6px;
  border-color: transparent;
  border-style: solid;
  border-right-color: #009a61;
}

.chat-dialog:after {
  left: -12px;
  border-right-color: #fff;
}
```

效果

![微信对话框](https://note.youdao.com/yws/public/resource/bb7792e904a30442f11cb6c88c33cce8/xmlnote/BD6E839095B849EFBEA5AFE6A7E2247C/12809)


#### 实现面包屑效果

同样的实现面包屑效果，只是在每块后面留出空位，再用伪类元素`:before`和`:after`定位出箭头效果

html部分

```html
<ul class="tag-tab">
    <li>第一级</li>
    <li>第二级</li>
    <li>第三级</li>
    <li>第四级</li>
</ul>
```

css部分

```css
.tag-tab {
  font-size: 16px;
  height: 24px;
  list-style: none;
}

.tag-tab li {
  float: left;
  position: relative;
  padding-right: 12px;

}

.tag-tab>li:before,
.tag-tab>li:after {
  position: absolute;
  top: 0;
  right: -12px;
  border-width: 12px;
  border-color: transparent;
  border-left-color: #333;
  border-style: solid;
  content: "";
  z-index: 1;
}

.tag-tab>li:after {
  right: -11px;
  border-left-color: #fff;
}

.tag-tab>li:hover {
  color: #009a61;
}

.tag-tab>li:hover:before {
  border-left-color: #009a61;
}
```

效果

![面包屑导航](https://note.youdao.com/yws/public/resource/bb7792e904a30442f11cb6c88c33cce8/xmlnote/33924A875DE149758DA23FBB4BD91C38/12808)

当然，还是css3通过旋转实现的方法，简单粗暴，到后面在补充了。还有什么好方法欢迎提出哈。
