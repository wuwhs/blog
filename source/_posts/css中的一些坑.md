---
title: css中的一些坑
date: 2018-08-27 18:42:30
tags: css
categories: css
---
#### 1、如果子元素全部设置为浮动，则父元素是塌陷的
1. 在元素末尾加块级空元素设置clear:both；

```css
.last {
    display: block;
    clear: both;
}
```
2. 在父级容器设置before/after模拟一个块级空元素

```css
.clearfix:after {
    content: "";
    display: block;
    clear: both;
}
```
3. 父级容器直接设置overflow: auto/hidden;

#### 2、普通文档流中块级垂直外边距合并

解决办法：用padding代替，或改成inline-block，或改成float，或绝对定位

#### 3、使用transition闪屏

```css
.demo {
    -webkit-transform-style: preserve-3d;
    -webkit-backface-visibility: hidden;
    -webkit-perspective: 1000
}
```
过渡动画在没有启动硬件加速的情况下，会出现抖动现象，解决方案：用translated3d、translateZ、transform自动启动硬件加速，即改为：

```css
.demo {
    -webkit-transform: translated3d(0,0,0);
    transform: translated3d(0,0,0);
}
```
ps:硬件加速导致cpu性能占用增加，电池电量消耗加大

#### 4、超出内容用"..."表示

```html
<div class="line-clamp">
来点展示内容，来点展示内容，来点展示内容，来点展示内容，来点展示内容，来点展示内容，来点展示内容，来点展示内容，来点展示内容，来点展示内容
</div>
```

```css
.line-clamp {
  width: 300px;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
}
```

说明：
1. -webkit-line-clamp用来限制在一个块元素显示的文本的行数
2. display: -webkit-box; 必须结合的属性 ，将对象作为弹性伸缩盒子模型显示
3. -webkit-box-orient 必须结合的属性 ，设置或检索伸缩盒对象的子元素的排列方式

缺点：
只有移动端和webkit浏览器支持

![](https://note.youdao.com/yws/public/resource/bb7792e904a30442f11cb6c88c33cce8/xmlnote/7959E51B5140437DA4C084E6B8E7472E/12000)

还不够，最后末尾最好有点渐变到"..."

![](https://note.youdao.com/yws/public/resource/bb7792e904a30442f11cb6c88c33cce8/xmlnote/D7C74A4FC9624AC7A638FC223AFF6926/12008)

```css
.line-clamp {
  width: 300px;
  line-height: 20px;
  height: 40px;
  overflow: hidden;
  position: relative;
}

.line-clamp:after {
  content: "...";
  position: absolute;
  bottom: 0;
  right: 0;
  padding-left: 40px;
  background: linear-gradient(to right, transparent, #fff 55%);
}
```
说明：
1. 将height设置为line-height整数倍，防止超出文字露出
2. ie10+才支持linear-gradient属性

缺点：

当文字少于区域大小时，也会出现省略号

#### 输入框placeholder文字带颜色

```css
input::-webkit-input-placeholder {
  /* WebKit browsers */
  font-size: 14px;
  color: #009a61;
}

input::-moz-placeholder {
  /* Mozilla Firefox 19+ */
  font-size: 14px;
  color: #009a61;
}

input:-ms-input-placeholder {
  /* Internet Explorer 10+ */
  font-size: 14px;
  color: #009a61;
}
```

![](https://note.youdao.com/yws/public/resource/bb7792e904a30442f11cb6c88c33cce8/xmlnote/C1D61F75FC6F48129794C55960D67471/12035)
