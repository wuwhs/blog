---
title: 前端面试之css
date: 2018-08-27 19:42:30
tags: css
---

[Front-end-Developer-Questions](https://github.com/markyun/My-blog/tree/master/Front-end-Developer-Questions/Questions-and-Answers)

[FE-interview](https://github.com/qiu-deqing/FE-interview)


### 介绍一下标准的CSS的盒子模型？低版本IE的盒子模型有什么不同的？

1. 有两种：IE盒模型、W3C盒模型
2. 盒模型：内容（content）、填充（padding）、边框（border）、边界（margin）
3. 区别：IE盒模型`box-sizing`为`border-box`，把border和padding计算在内

### CSS选择符有哪些？哪些属性可以继承？

选择符有：
1. id选择器（#myid）
2. 类选择器（.myclass）
3. 标签选择器（div, h1, p）
4. 相邻选择器（h1 + p）
5. 子选择器（ul > li）
6. 后代选择器（li a）
7. 通配符选择器（*）
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

### CSS优先级算法如何计算？

1. 优先级就近原则，同权重情况下样式定义最近者为准
2. 载入样式以最后载入的定位为准

**优先级**

同权重: 内联样式表（标签内部）> 嵌入样式表（当前文件中）> 外部样式表（外部文件中）。

!important >  id > class > tag
important 比 内联优先级高

### css sprite是什么，有什么优缺点？

将多个小图片拼接到一张图片种。通过`background-position`和元素尺寸调节显示的背景图片。

优点：
- 减少HTTP请求次数和图片总体大小，提高页面加载速度
- 更换风格方便，只需再一张或几张图片上修改颜色

缺点：
- 图片合并麻烦

### IE6浏览器有哪些常见的bug,缺陷或者与标准不一致的地方,如何解决？

- IE6不支持min-height，解决办法使用css hack：

    ```css
    .target {
        min-height: 100px;
        height: auto !important;
        height: 100px;   // IE6下内容高度超过会自动扩展高度
    }
    ```
- ol内li的序号全为1，不递增。解决方法：为li设置样式`display: list-item;`

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
            position: relative;  /* 修复bug */
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

- IE6只支持a标签的:hover伪类，解决方法：使用js为元素监听mouseenter，mouseleave事件，添加类实现效果：

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
            elem.className += ' ' + cls;
        } else {
            elem.className = cls;
        }
    }
    function removeClass(elem, cls) {
        var className = ' ' + elem.className + ' ';
        var reg = new RegExp(' +' + cls + ' +', 'g');
        elem.className = className.replace(reg, ' ').replace(/^ +| +$/, '');
    }

    var target = document.getElementById('target');
    if (target.attachEvent) {
        target.attachEvent('onmouseenter', function () {
            addClass(target, 'hover');
        });
        target.attachEvent('onmouseleave', function () {
            removeClass(target, 'hover');
        })
    }
    </script>
    ```

- IE5-8不支持opacity，解决办法：
    ```css
    .opacity {
        opacity: 0.4
        filter: alpha(opacity=60); /* for IE5-7 */
        -ms-filter: "progid:DXImageTransform.Microsoft.Alpha(Opacity=60)"; /* for IE 8*/
    }
    ```

- IE6在设置height小于font-size时高度值为font-size，解决办法：`font-size: 0;`

- IE6不支持PNG透明背景，解决办法: IE6下使用gif图片

- IE6-7不支持display: inline-block解决办法：设置inline并触发hasLayout
    ```css
    display: inline-block;
    *display: inline;
    *zoom: 1;
    ```
- IE6下浮动元素在浮动方向上与父元素边界接触元素的外边距会加倍。解决办法：     1. 使用padding控制间距。
    2. 浮动元素`display: inline;`这样解决问题且无任何副作用：css标准规定浮动元素`display:inline`会自动调整为block

- 通过为块级元素设置宽度和左右margin为auto时，IE6不能实现水平居中，解决方法：为父元素设置`text-align: center;`

### CSS3新增伪类有那些？

- p:first-of-type	选择属于其父元素的首个`<p>`元素的每个`<p>`元素。
- p:last-of-type	选择属于其父元素的最后`<p>`元素的每个`<p>`元素。
- p:only-of-type	选择属于其父元素唯一的`<p>` 元素的每个`<p>`元素。
- p:only-child      选择属于其父元素的唯一子元素的每个`<p>`元素。
- p:nth-child(2)	选择属于其父元素的第二个子元素的每个`<p>`元素。

- ::after			在元素之前添加内容,也可以用来做清除浮动。
- ::before		    在元素之后添加内容
- :enabled  		表单控件启用或激活状态
- :disabled 		控制表单控件的禁用状态。
- :checked          单选框或复选框被选中。

### 实现水平、垂直居中？

[水平且垂直居中方法（9种）](https://segmentfault.com/a/1190000013391021)

### `position`取值有哪几种？

1. static（默认）：元素框正常生成。块级元素生成一个矩形框，作为文档流的一部分；行内元素则会创建一个或多个行框，置于父级元素中。
2. relative：元素框相对于之前正常文档流中的位置发生偏移，并且原先的位置仍然被占据。发生偏移的时候，可能会覆盖其他元素。
3. absolute：元素框不再占有文档位置，并且相对于包含块进行偏移（所谓包含块就是最近一级外层元素position不为static的元素）。
4. fixed：元素框不再占有文档流位置，并且相对于视窗进行定位。
5. sticky：css3新增属性值，粘性定位，相当于relative和fixed的混合。最初会被当作是relative，相对原来位置进行偏移；一旦超过一定的阈值，会被当成fixed定位，相对于视口定位。


### 描述`display: block;`和`display: inline;`的具体区别？

`block`元素特点

1. 处于常规流中时，如果width没有设置，会自动填充满父容器
2. 可以应用margin/padding
3. 在没有设置高度的情况下会扩展高度以包含常规流中的子元素
4. 处于常规流中时布局时在前后元素位置之间（独占一个水平空间）
5. 忽略`vertical-align`

`inline`元素特点

1. 水平方向上根据direction依次布局
2. 不会在元素前后进行换行
3. 受white-space控制
4. margin/padding在竖直方向上无效，水平方向上有效
5. width/height属性对非替换行内元素无效，宽度由元素内容决定
6. 非替换行内元素的行框高由line-height确定，替换行内元素的行框高由height,margin,padding,border决定
7. 浮动或绝对定位时会转换为block
8. `vertical-align`属性生效

### 用纯CSS创建一个三角形的原理是什么？

一边设置颜色，另三边透明（颜色设为`transparent`）

[纯css三角形及其应用](https://segmentfault.com/a/1190000013484609)

###  Chrome 中文界面下默认会将小于 12px 的文本强制按照 12px 显示？

css属性：`-webkit-text-size-adjust: none;`

### 为什么要初始化CSS样式？

因为浏览器的兼容问题，不同浏览器对有些标签的默认值是不同的，如果没对CSS初始化往往会出现浏览器之间的页面显示差异。当然，初始化样式会对SEO有一定的影响，但鱼和熊掌不可兼得，但力求影响最小的情况下初始化。

淘宝初始样式

```css
body, h1, h2, h3, h4, h5, h6, hr, p, blockquote, dl, dt, dd, ul, ol, li, pre, form, fieldset, legend, button, input, textarea, th, td { margin:0; padding:0; }
body, button, input, select, textarea { font:12px/1.5tahoma, arial, \5b8b\4f53; }
h1, h2, h3, h4, h5, h6{ font-size:100%; }
address, cite, dfn, em, var { font-style:normal; }
code, kbd, pre, samp { font-family:couriernew, courier, monospace; }
small{ font-size:12px; }
ul, ol { list-style:none; }
a { text-decoration:none; }
a:hover { text-decoration:underline; }
sup { vertical-align:text-top; }
sub{ vertical-align:text-bottom; }
legend { color:#000; }
fieldset, img { border:0; }
button, input, select, textarea { font-size:100%; }
table { border-collapse:collapse; border-spacing:0; }
```

### position跟display、margin collapse、overflow、float这些特性相互叠加后会怎么样？

- 如果元素的display为none，那么元素不被渲染，position和float不起作用
- 如果元素拥有`position:absolute;`或者`position:fixed;`属性那么元素将为绝对定位，float不起作用
- 如果元素float属性不是none,元素会脱离文档流，根据float属性值来显示
- 有浮动、绝对定位、inline-block属性的元素，margin不会和垂直方向上的其他元素margin折叠

### 对BFC规范(块级格式化上下文：block formatting context)的理解？

[加深理解BFC](https://segmentfault.com/a/1190000013259184)

### css定义权重

以下是权重的规则：标签的权重为1，class的权重为10，id的权重为100

### zoom:1的清除浮动原理？

- 清除浮动，触发hasLayout；
- Zoom属性是IE浏览器的专有属性，它可以设置或检索对象的缩放比例。解决ie下比较奇葩的bug。

### 移动端布局有哪几种方法？
待写...

### CSS优化、提高性能的方法有哪些？

- 关键选择器（key selector）。选择器的最后面的部分为关键选择器（即用来匹配目标元素的部分）；
- 如果规则拥有 ID 选择器作为其关键选择器，则不要为规则增加标签。过滤掉无关的规则（这样样式系统就不会浪费时间去匹配它们了）；
- 提取项目的通用公有样式，增强可复用性，按模块编写组件；增强项目的协同开发性、可维护性和可扩展性;
- 使用预处理工具或构建工具（gulp对css进行语法检查、自动补前缀、打包压缩、自动优雅降级）；

### margin和padding分别适合什么场景使用？

margin是用来隔开元素与元素的间距；padding是用来隔开元素与内容的间隔。

### `::before` 和 `:before`中双冒号和单冒号 有什么区别？解释一下这2个伪元素的作用。

`:`表示伪类，`::`表示伪元素

w3c定义：
- CSS伪类用于向某些选择器添加特殊的效果
- css伪元素用于将特殊的效果添加到某些选择器

伪类偏选择，伪元素偏元素

伪类有：`:active`, `:focus`, `:hover`, `:link`, `:visited`, `:first-child`, `:lang`

伪元素有：`::first-letter`, `::first-line`, `::before`, `::after`

### font-style属性可以让它赋值为“oblique” oblique是什么意思？

让没有倾斜的字体倾斜

### 让页面里的字体变清晰，变细用CSS怎么做？

`-webkit-font-smoothing: antialiased;`

### 如果需要手动写动画，你认为最小时间间隔是多久，为什么？（阿里）

多数显示器默认频率是60Hz，即1秒刷新60次，所以理论上最小间隔为`1/60*1000ms =16.7ms`

### `display:inline-block` 什么时候会显示间隙？(携程)

移除空格、使用`margin`负值、使用`font-size:0`、`letter-spacing`、`word-spacing`

### 什么是Cookie 隔离？（或者说：请求资源的时候不要让它带cookie怎么做）

如果静态文件都放在主域名下，那静态文件请求的时候都带有的cookie的数据提交给server的，非常浪费流量，
所以不如隔离开。

因为cookie有域的限制，因此不能跨域提交请求，故使用非主要域名的时候，请求头中就不会带有cookie数据，
这样可以降低请求头的大小，降低请求时间，从而达到降低整体请求延时的目的。

### style标签写在body后与body前有什么区别？

标准一直是规定style元素不应出现在body元素中，不过网页浏览器一直有容错设计。如果style元素出现在body元素，最终效果和style元素出现在head里是一样的。但是可能引起FOUC、重绘或重新布局。

### 什么是CSS 预处理器 / 后处理器？

- 预处理器例如：LESS、Sass、Stylus，用来预编译Sass或less，增强了css代码的复用性，还有层级、mixin、变量、循环、函数等，具有很方便的UI组件模块化开发能力，极大的提高工作效率。
- 后处理器例如：PostCSS，通常被视为在完成的样式表中根据CSS规范处理CSS，让其更有效；目前最常做的是给CSS属性添加浏览器私有前缀，实现跨浏览器兼容性的问题。

### `display: none;`和`visibility: hidden;`的区别？

共同点：
- 都让元素不可见

区别：
- `display: none;`会让元素完全从渲染树中消失，渲染的时候不占据任何空间；`visibility: hidden;`不会让元素从渲染树消失，元素仍占据空间，只是内容不可见。
- `display: none;`是继承属性，子孙节点消失由于元素从渲染树消失造成，通过修改子孙节点属性无法显示；`visibility: hidden;`是继承属性，子孙节点消失由于继承了该属性，通过设置`visibility: visible;`可以让其显示。
- 修改常规流中元素的`display`通常会造成文档重排。修改`visibility`只会造成元素的重绘。
- 读屏器不会读取`display: none;`元素内容，但会读取`visibility: hidden;`元素内容。

### `link`和`@import`的区别？

- `link`是HTML方式，`@import`是css方式。
- `link`最大限度支持并行下载，`@import`过多嵌套导致串行下载，出现FOUC。
- `link`可以通过`rel="alternate stylesheet"`指定候选样式。
- 浏览器对`link`支持早于`@import`，可以使用`@import`对老浏览器隐藏样式。
- `@import`必须再样式规则之前，可以再css文件中引用其他文件。
- 总体来说：`link`优于`@import`。

### 什么是FOUC？如何避免？

- `Flash Of Unstyled Content`，用户定义样式表加载之前浏览器使用默认样式显示文档，用户样式加载渲染之后再重新显示文档，造成页面闪烁。
- 解决方法：把样式表放到文档的`<head>`。

### 清除浮动有哪几种方式？

- 父级元素设置属性`height`
- 结尾处加一个块级空元素并`clear: both;`
- 父级定义伪元素`::after`并且属性为`zoom: 1; clear: both;`
- 父级元素设置属性`overflow`不为`visible`
- 父级也浮动，同时设置宽度

### PNG，GIF，JPG的区别及如何选择？

- PNG
    - 有PNG8和truecolor PNG
    - PNG8是256色
    - 文件小，支持`alpha`透明度，无动画
    - 适合背景图，图标，按钮

- GIF
    - 8位像素，256色
    - 无损压缩
    - 支持动画
    - 支持`boolean`透明
    - 适合简单动画

- JPG
    - 256色
    - 有损压缩
    - 不支持透明
    - 适合照片

### 浏览器渲染机制是什么

![浏览器渲染机制](https://note.youdao.com/yws/public/resource/bb7792e904a30442f11cb6c88c33cce8/xmlnote/3B3F205479D64FC89D30ECFC15B8AE35/14124)

浏览器渲染页面整个过程：
1. 首先，解析HTML Source，构建DOM Tree；
2. 同时，解析CSS Style，构建CSSOM Tree；
3. 然后，组合DOM Tree与CSSOM Tree，去除不可见元素，构建Render Tree；
4. 再执行Reflow，根据Render Tree计算每个可见元素的布局；
5. 最后，执行Repaint，通过绘制流程，将每个像素渲染到屏幕上；

注意：
- Render Tree只包含渲染网页所需要的节点；
- Reflow过程是布局计算每个对象的精确位置和大小；
- Repaint过程则是将Render Tree的每个像素渲染到屏幕上；

### 重排（reflow）和重绘（repaint）

- 重排（又称回流），发生在Render Tree阶段，它主要用来确定元素的几何属性和位置
- 重绘，发生在重排（reflow）过程之后，将元素的颜色、背景属性绘制出来

### 怎样触发reflow和repaint

触发Reflow
- 增加、删除和修改DOM节点时，会导致Reflow或Repaint
- 移动DOM位置，或者动画
- 修改位置样式
- Resize窗口，或者是滚动
- 修改网页默认字体

触发Repaint
- 增加、删除和修改DOM节点
- css改动

### 如何减少reflow和Repaint过程

- 减少js逐个修改样式，而是用添加、修改css类
- 通过`documentFragment`集中处理临时操作
- 克隆节点进行操作，然后进行原节点替换
- 使用`display: none;`进行批量操作
- 减少样式重新计算，即减少`offset`、`scroll`、`clientX/Y`、`getComputedStyle`、`currentStyle`的使用，因为每次使用都会刷新操作缓冲区，执行reflow和repaint
