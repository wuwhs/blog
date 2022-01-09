---
title: 前端面试之css
date: 2018-03-04 22:42:30
tags: [面试, css]
categories: 面试
---

[Front-end-Developer-Questions](https://github.com/markyun/My-blog/tree/master/Front-end-Developer-Questions/Questions-and-Answers)

[FE-interview](https://github.com/qiu-deqing/FE-interview)

### 介绍一下标准的 CSS 的盒子模型？低版本 IE 的盒子模型有什么不同的？

1. 有两种：IE 盒模型、W3C 盒模型
2. 盒模型：内容（content）、填充（padding）、边框（border）、边界（margin）
3. 区别：IE 盒模型`box-sizing`为`border-box`，把 border 和 padding 计算在内

### CSS 选择符有哪些？哪些属性可以继承？

选择符有：

1. id 选择器（#myid）
2. 类选择器（.myclass）
3. 标签选择器（div, h1, p）
4. 相邻选择器（h1 + p）
5. 子选择器（ul > li）
6. 后代选择器（li a）
7. 通配符选择器（\*）
8. 属性选择器（input[type="radio"]）
9. 伪类选择器（a:hover, li:nth-child）

可继承的样式：

- 文字排版相关属性
  - font
  - word-break
  - letter-spacing
  - text-align
  - text-rendering
  - word-space
  - text-indent
  - text-transform
  - text-shadow
- color
- line-height
- cursor
- visibility

不可继承样式：
border、padding、margin、width、height

### CSS 优先级算法如何计算？

1. 优先级就近原则，同权重情况下样式定义最近者为准
2. 载入样式以最后载入的定位为准

**优先级**

同权重: 内联样式表（标签内部）> 嵌入样式表（当前文件中）> 外部样式表（外部文件中）。

!important > id > class > tag
important 比 内联优先级高

### css sprite 是什么，有什么优缺点？

将多个小图片拼接到一张图片种。通过`background-position`和元素尺寸调节显示的背景图片。

优点：

- 减少 HTTP 请求次数和图片总体大小，提高页面加载速度
- 更换风格方便，只需再一张或几张图片上修改颜色

缺点：

- 图片合并麻烦

### IE6 浏览器有哪些常见的 bug,缺陷或者与标准不一致的地方,如何解决？

- IE6 不支持 min-height，解决办法使用 css hack：

  ```css
  .target {
    min-height: 100px;
    height: auto !important;
    height: 100px; // IE6下内容高度超过会自动扩展高度
  }
  ```

- ol 内 li 的序号全为 1，不递增。解决方法：为 li 设置样式`display: list-item;`

- 未定位父元素`overflow: auto;`，包含`position: relative;`子元素，子元素高于父元素时会溢出。解决办法：

  1. 子元素去掉`position: relative；`；
  2. 不能为子元素去掉定位时，父元素`position: relative；`;

  ```html
  <style type="text/css">
    .outer {
      width: 215px;
      height: 100px;
      border: 1px solid red;
      overflow: auto;
      position: relative; /* 修复bug */
    }
    .inner {
      width: 100px;
      height: 200px;
      background-color: purple;
      position: relative;
    }
  </style>

  <div class="outer">
    <div class="inner"></div>
  </div>
  ```

- IE6 只支持 a 标签的:hover 伪类，解决方法：使用 js 为元素监听 mouseenter，mouseleave 事件，添加类实现效果：

  ```html
  <style type="text/css">
    .p:hover,
    .hover {
      background: purple;
    }
  </style>

  <p class="p" id="target">aaaa bbbbb<span>DDDDDDDDDDDd</span> aaaa lkjlkjdf j</p>

  <script type="text/javascript">
    function addClass(elem, cls) {
      if (elem.className) {
        elem.className += ' ' + cls
      } else {
        elem.className = cls
      }
    }
    function removeClass(elem, cls) {
      var className = ' ' + elem.className + ' '
      var reg = new RegExp(' +' + cls + ' +', 'g')
      elem.className = className.replace(reg, ' ').replace(/^ +| +$/, '')
    }

    var target = document.getElementById('target')
    if (target.attachEvent) {
      target.attachEvent('onmouseenter', function () {
        addClass(target, 'hover')
      })
      target.attachEvent('onmouseleave', function () {
        removeClass(target, 'hover')
      })
    }
  </script>
  ```

- IE5-8 不支持 opacity，解决办法：

  ```css
  .opacity {
      opacity: 0.4
      filter: alpha(opacity=60); /* for IE5-7 */
      -ms-filter: "progid:DXImageTransform.Microsoft.Alpha(Opacity=60)"; /* for IE 8*/
  }
  ```

- IE6 在设置 height 小于 font-size 时高度值为 font-size，解决办法：`font-size: 0;`

- IE6 不支持 PNG 透明背景，解决办法: IE6 下使用 gif 图片

- IE6-7 不支持 display: inline-block 解决办法：设置 inline 并触发 hasLayout
  ```css
  display: inline-block;
  *display: inline;
  *zoom: 1;
  ```
- IE6 下浮动元素在浮动方向上与父元素边界接触元素的外边距会加倍。解决办法： 1. 使用 padding 控制间距。 2. 浮动元素`display: inline;`这样解决问题且无任何副作用：css 标准规定浮动元素`display:inline`会自动调整为 block

- 通过为块级元素设置宽度和左右 margin 为 auto 时，IE6 不能实现水平居中，解决方法：为父元素设置`text-align: center;`

### CSS3 新增伪类有那些？

- p:first-of-type 选择属于其父元素的首个`<p>`元素的每个`<p>`元素。
- p:last-of-type 选择属于其父元素的最后`<p>`元素的每个`<p>`元素。
- p:only-of-type 选择属于其父元素唯一的`<p>` 元素的每个`<p>`元素。
- p:only-child 选择属于其父元素的唯一子元素的每个`<p>`元素。
- p:nth-child(2) 选择属于其父元素的第二个子元素的每个`<p>`元素。

- ::after 在元素之前添加内容,也可以用来做清除浮动。
- ::before 在元素之后添加内容
- :enabled 表单控件启用或激活状态
- :disabled 控制表单控件的禁用状态。
- :checked 单选框或复选框被选中。

### 实现水平、垂直居中？

[水平且垂直居中方法（9 种）](https://segmentfault.com/a/1190000013391021)

### `position`取值有哪几种？

1. static（默认）：元素框正常生成。块级元素生成一个矩形框，作为文档流的一部分；行内元素则会创建一个或多个行框，置于父级元素中。
2. relative：元素框相对于之前正常文档流中的位置发生偏移，并且原先的位置仍然被占据。发生偏移的时候，可能会覆盖其他元素。
3. absolute：元素框不再占有文档位置，并且相对于包含块进行偏移（所谓包含块就是最近一级外层元素 position 不为 static 的元素）。
4. fixed：元素框不再占有文档流位置，并且相对于视窗进行定位。
5. sticky：css3 新增属性值，粘性定位，相当于 relative 和 fixed 的混合。最初会被当作是 relative，相对原来位置进行偏移；一旦超过一定的阈值，会被当成 fixed 定位，相对于视口定位。

### 描述`display: block;`和`display: inline;`的具体区别？

`block`元素特点

1. 处于常规流中时，如果 width 没有设置，会自动填充满父容器
2. 可以应用 margin/padding
3. 在没有设置高度的情况下会扩展高度以包含常规流中的子元素
4. 处于常规流中时布局时在前后元素位置之间（独占一个水平空间）
5. 忽略`vertical-align`

`inline`元素特点

1. 水平方向上根据 direction 依次布局
2. 不会在元素前后进行换行
3. 受 white-space 控制
4. margin/padding 在竖直方向上无效，水平方向上有效
5. width/height 属性对非替换行内元素无效，宽度由元素内容决定
6. 非替换行内元素的行框高由 line-height 确定，替换行内元素的行框高由 height,margin,padding,border 决定
7. 浮动或绝对定位时会转换为 block
8. `vertical-align`属性生效

### 用纯 CSS 创建一个三角形的原理是什么？

一边设置颜色，另三边透明（颜色设为`transparent`）

[纯 css 三角形及其应用](https://segmentfault.com/a/1190000013484609)

### Chrome 中文界面下默认会将小于 12px 的文本强制按照 12px 显示？

css 属性：`-webkit-text-size-adjust: none;`

### 为什么要初始化 CSS 样式？

因为浏览器的兼容问题，不同浏览器对有些标签的默认值是不同的，如果没对 CSS 初始化往往会出现浏览器之间的页面显示差异。当然，初始化样式会对 SEO 有一定的影响，但鱼和熊掌不可兼得，但力求影响最小的情况下初始化。

淘宝初始样式

```css
body,
h1,
h2,
h3,
h4,
h5,
h6,
hr,
p,
blockquote,
dl,
dt,
dd,
ul,
ol,
li,
pre,
form,
fieldset,
legend,
button,
input,
textarea,
th,
td {
  margin: 0;
  padding: 0;
}
body,
button,
input,
select,
textarea {
  font: 12px/1.5tahoma, arial, \5b8b\4f53;
}
h1,
h2,
h3,
h4,
h5,
h6 {
  font-size: 100%;
}
address,
cite,
dfn,
em,
var {
  font-style: normal;
}
code,
kbd,
pre,
samp {
  font-family: couriernew, courier, monospace;
}
small {
  font-size: 12px;
}
ul,
ol {
  list-style: none;
}
a {
  text-decoration: none;
}
a:hover {
  text-decoration: underline;
}
sup {
  vertical-align: text-top;
}
sub {
  vertical-align: text-bottom;
}
legend {
  color: #000;
}
fieldset,
img {
  border: 0;
}
button,
input,
select,
textarea {
  font-size: 100%;
}
table {
  border-collapse: collapse;
  border-spacing: 0;
}
```

### position 跟 display、margin collapse、overflow、float 这些特性相互叠加后会怎么样？

- 如果元素的 display 为 none，那么元素不被渲染，position 和 float 不起作用
- 如果元素拥有`position:absolute;`或者`position:fixed;`属性那么元素将为绝对定位，float 不起作用
- 如果元素 float 属性不是 none,元素会脱离文档流，根据 float 属性值来显示
- 有浮动、绝对定位、inline-block 属性的元素，margin 不会和垂直方向上的其他元素 margin 折叠

### 对 BFC 规范(块级格式化上下文：block formatting context)的理解？

[加深理解 BFC](https://segmentfault.com/a/1190000013259184)
[学习 BFC (Block Formatting Context)](https://juejin.cn/post/6844903495108132877)

### css 定义权重

以下是权重的规则：标签的权重为 1，class 的权重为 10，id 的权重为 100

### zoom:1 的清除浮动原理？

- 清除浮动，触发 hasLayout；
- Zoom 属性是 IE 浏览器的专有属性，它可以设置或检索对象的缩放比例。解决 ie 下比较奇葩的 bug。

### 移动端布局有哪几种方法？

待写...

### CSS 优化、提高性能的方法有哪些？

- 关键选择器（key selector）。选择器的最后面的部分为关键选择器（即用来匹配目标元素的部分）；
- 如果规则拥有 ID 选择器作为其关键选择器，则不要为规则增加标签。过滤掉无关的规则（这样样式系统就不会浪费时间去匹配它们了）；
- 提取项目的通用公有样式，增强可复用性，按模块编写组件；增强项目的协同开发性、可维护性和可扩展性;
- 使用预处理工具或构建工具（gulp 对 css 进行语法检查、自动补前缀、打包压缩、自动优雅降级）；

### margin 和 padding 分别适合什么场景使用？

margin 是用来隔开元素与元素的间距；padding 是用来隔开元素与内容的间隔。

### `::before` 和 `:before`中双冒号和单冒号 有什么区别？解释一下这 2 个伪元素的作用。

`:`表示伪类，`::`表示伪元素

w3c 定义：

- CSS 伪类用于向某些选择器添加特殊的效果
- css 伪元素用于将特殊的效果添加到某些选择器

伪类偏选择，伪元素偏元素

伪类有：`:active`, `:focus`, `:hover`, `:link`, `:visited`, `:first-child`, `:lang`

伪元素有：`::first-letter`, `::first-line`, `::before`, `::after`

### font-style 属性可以让它赋值为“oblique” oblique 是什么意思？

让没有倾斜的字体倾斜

### 让页面里的字体变清晰，变细用 CSS 怎么做？

`-webkit-font-smoothing: antialiased;`

### 如果需要手动写动画，你认为最小时间间隔是多久，为什么？（阿里）

多数显示器默认频率是 60Hz，即 1 秒刷新 60 次，所以理论上最小间隔为`1/60*1000ms =16.7ms`

### `display:inline-block` 什么时候会显示间隙？(携程)

移除空格、使用`margin`负值、使用`font-size:0`、`letter-spacing`、`word-spacing`

### 什么是 Cookie 隔离？（或者说：请求资源的时候不要让它带 cookie 怎么做）

如果静态文件都放在主域名下，那静态文件请求的时候都带有的 cookie 的数据提交给 server 的，非常浪费流量，
所以不如隔离开。

因为 cookie 有域的限制，因此不能跨域提交请求，故使用非主要域名的时候，请求头中就不会带有 cookie 数据，
这样可以降低请求头的大小，降低请求时间，从而达到降低整体请求延时的目的。

### style 标签写在 body 后与 body 前有什么区别？

标准一直是规定 style 元素不应出现在 body 元素中，不过网页浏览器一直有容错设计。如果 style 元素出现在 body 元素，最终效果和 style 元素出现在 head 里是一样的。但是可能引起 FOUC、重绘或重新布局。

### 什么是 CSS 预处理器 / 后处理器？

- 预处理器例如：LESS、Sass、Stylus，用来预编译 Sass 或 less，增强了 css 代码的复用性，还有层级、mixin、变量、循环、函数等，具有很方便的 UI 组件模块化开发能力，极大的提高工作效率。
- 后处理器例如：PostCSS，通常被视为在完成的样式表中根据 CSS 规范处理 CSS，让其更有效；目前最常做的是给 CSS 属性添加浏览器私有前缀，实现跨浏览器兼容性的问题。

### `display: none;`和`visibility: hidden;`的区别？

共同点：

- 都让元素不可见

区别：

- `display: none;`会让元素完全从渲染树中消失，渲染的时候不占据任何空间；`visibility: hidden;`不会让元素从渲染树消失，元素仍占据空间，只是内容不可见。
- `display: none;`是继承属性，子孙节点消失由于元素从渲染树消失造成，通过修改子孙节点属性无法显示；`visibility: hidden;`是继承属性，子孙节点消失由于继承了该属性，通过设置`visibility: visible;`可以让其显示。
- 修改常规流中元素的`display`通常会造成文档重排。修改`visibility`只会造成元素的重绘。
- 读屏器不会读取`display: none;`元素内容，但会读取`visibility: hidden;`元素内容。

### `link`和`@import`的区别？

- `link`是 HTML 方式，`@import`是 css 方式。
- `link`最大限度支持并行下载，`@import`过多嵌套导致串行下载，出现 FOUC。
- `link`可以通过`rel="alternate stylesheet"`指定候选样式。
- 浏览器对`link`支持早于`@import`，可以使用`@import`对老浏览器隐藏样式。
- `@import`必须再样式规则之前，可以再 css 文件中引用其他文件。
- 总体来说：`link`优于`@import`。

### 什么是 FOUC？如何避免？

- `Flash Of Unstyled Content`，用户定义样式表加载之前浏览器使用默认样式显示文档，用户样式加载渲染之后再重新显示文档，造成页面闪烁。
- 解决方法：把样式表放到文档的`<head>`。

### 清除浮动有哪几种方式？

- 父级元素设置属性`height`
- 结尾处加一个块级空元素并`clear: both;`
- 父级定义伪元素`::after`并且属性为`zoom: 1; clear: both;`
- 父级元素设置属性`overflow`不为`visible`
- 父级也浮动，同时设置宽度

### PNG，GIF，JPG 的区别及如何选择？

- PNG

  - 有 PNG8 和 truecolor PNG
  - PNG8 是 256 色
  - 文件小，支持`alpha`透明度，无动画
  - 适合背景图，图标，按钮

- GIF

  - 8 位像素，256 色
  - 无损压缩
  - 支持动画
  - 支持`boolean`透明
  - 适合简单动画

- JPG
  - 256 色
  - 有损压缩
  - 不支持透明
  - 适合照片

### 浏览器渲染机制是什么

![浏览器渲染机制](https://note.youdao.com/yws/public/resource/bb7792e904a30442f11cb6c88c33cce8/xmlnote/3B3F205479D64FC89D30ECFC15B8AE35/14124)

浏览器渲染页面整个过程：

1. 首先，解析 HTML Source，构建 DOM Tree；
2. 同时，解析 CSS Style，构建 CSSOM Tree；
3. 然后，组合 DOM Tree 与 CSSOM Tree，去除不可见元素，构建 Render Tree；
4. 再执行 Reflow，根据 Render Tree 计算每个可见元素的布局；
5. 最后，执行 Repaint，通过绘制流程，将每个像素渲染到屏幕上；

注意：

- Render Tree 只包含渲染网页所需要的节点；
- Reflow 过程是布局计算每个对象的精确位置和大小；
- Repaint 过程则是将 Render Tree 的每个像素渲染到屏幕上；

### 重排（reflow）和重绘（repaint）

- 重排（又称回流），发生在 Render Tree 阶段，它主要用来确定元素的几何属性和位置
- 重绘，发生在重排（reflow）过程之后，将元素的颜色、背景属性绘制出来

### 怎样触发 reflow 和 repaint

触发 Reflow

- 增加、删除和修改 DOM 节点时，会导致 Reflow 或 Repaint
- 移动 DOM 位置，或者动画
- 修改位置样式
- Resize 窗口，或者是滚动
- 修改网页默认字体

触发 Repaint

- 增加、删除和修改 DOM 节点
- css 改动

### 如何减少 reflow 和 Repaint 过程

- 减少 js 逐个修改样式，而是用添加、修改 css 类
- 通过`documentFragment`集中处理临时操作
- 克隆节点进行操作，然后进行原节点替换
- 使用`display: none;`进行批量操作
- 减少样式重新计算，即减少`offset`、`scroll`、`clientX/Y`、`getComputedStyle`、`currentStyle`的使用，因为每次使用都会刷新操作缓冲区，执行 reflow 和 repaint
