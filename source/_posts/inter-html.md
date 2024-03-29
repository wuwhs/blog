---
title: 前端面试之html
date: 2018-03-05 19:42:30
tags: [面试, html]
categories: 面试
---

### `Doctype`作用？标准模式与兼容模式各有什么区别？

1. `<!DOCTYPE>`声明位于位于 HTML 文档中的第一行，处于 `<html>` 标签之前。告知浏览器的解析器用什么文档标准解析这个文档。`DOCTYPE`不存在或格式不正确会导致文档以兼容模式呈现。
2. 标准模式的排版 和 JS 运作模式都是以该浏览器支持的最高标准运行。在兼容模式中，页面以宽松的向后兼容的方式显示,模拟老式浏览器的行为以防止站点无法工作。

ps:常见 dotype：

- HTML4.01 strict：不允许使用表现性、废弃元素（如 font）以及 frameset。声明：<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">

- HTML4.01 Transitional:允许使用表现性、废弃元素（如 font），不允许使用 frameset。声明：<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">

- HTML4.01 Frameset:允许表现性元素，废气元素以及 frameset。声明：<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Frameset//EN" "http://www.w3.org/TR/html4/frameset.dtd">

- XHTML1.0 Strict:不使用允许表现性、废弃元素以及 frameset。文档必须是结构良好的 XML 文档。声明：<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">

- XHTML1.0 Transitional:允许使用表现性、废弃元素，不允许 frameset，文档必须是结构良好的 XMl 文档。声明： <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

- XHTML 1.0 Frameset:允许使用表现性、废弃元素以及 frameset，文档必须是结构良好的 XML 文档。声明：<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Frameset//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-frameset.dtd">
  HTML 5: <!doctype html>

### HTML5 为什么只需要写 `<!DOCTYPE HTML>`？

- HTML5 不基于 SGML（标准统用标记语言），因此不需要对 DTD 进行引用，但是需要 doctype 来规范浏览器的行为（让浏览器按照它们应该的方式来运行）；
- 而 HTML4.01 基于 SGML,所以需要对 DTD 进行引用，才能告知浏览器文档所使用的文档类型。

### 行内元素有哪些？块级元素有哪些？ 空(void)元素有那些？

- 行内元素有：`a` `b` `span` `img` `input` `select` `strong`...
- 块级元素有：`div` `ul` `ol` `li` `dl` `dt` `dd` `h1` `h2` `h3` `p`...
- 常用的空元素有：`<br>` `<hr>` `<img>` `<link>` `<meta>`...

### 介绍一下你对浏览器内核的理解？

主要分成两部分：渲染引擎(layout engineer 或 Rendering Engine)和 JS 引擎。

渲染引擎：负责取得网页的内容（HTML、XML、图像等等）、整理讯息（例如加入 CSS 等），以及计算网页的显示方式，然后会输出至显示器或打印机。浏览器的内核的不同对于网页的语法解释会有不同，所以渲染的效果也不相同。所有网页浏览器、电子邮件客户端以及其它需要编辑、显示网络内容的应用程序都需要内核。

JS 引擎则：解析和执行 javascript 来实现网页的动态效果。

最开始渲染引擎和 JS 引擎并没有区分的很明确，后来 JS 引擎越来越独立，内核就倾向于只指渲染引擎。

### 常见的浏览器内核有哪些？

- Trident 内核：IE,MaxThon,TT,The World,360,搜狗浏览器等。[又称 MSHTML]
- Gecko 内核：Netscape6 及以上版本，FF,MozillaSuite/SeaMonkey 等
- Presto 内核：Opera7 及以上。 [Opera 内核原为：Presto，现为：Blink;]
- Webkit 内核：Safari,Chrome 等。 [ Chrome 的：Blink（WebKit 的分支）]

### html5 有哪些新特性、移除了那些元素？如何处理 HTML5 新标签的浏览器兼容问题？如何区分 HTML 和 HTML5？

1. HTML5 现在已经不是 SGML 的子集，主要是关于图像，位置，存储，多任务等功能的增加。

   - 绘画 canvas;
   - 用于媒介回放的 video 和 audio 元素;
   - 本地离线存储 localStorage 长期存储数据，浏览器关闭后数据不丢失;
   - sessionStorage 的数据在浏览器关闭后自动删除;
   - 语意化更好的内容元素，比如 article、footer、header、nav、section;
   - 表单控件，calendar、date、time、email、url、search;
   - 新的技术 webworker, websocket, Geolocation;

2. 移除的元素：

   - 纯表现的元素：basefont，big，center，font, s，strike，tt，u;
   - 对可用性产生负面影响的元素：frame，frameset，noframes；

3. 支持 HTML5 新标签：
   IE8/IE7/IE6 支持通过 document.createElement 方法产生的标签，
   可以利用这一特性让这些浏览器支持 HTML5 新标签，
   浏览器支持新标签后，还需要添加标签默认的样式。

   当然也可以直接使用成熟的框架、比如 html5shim;

   ```html
   <!--[if lt IE 9]>
     <script>
       src = 'http://html5shim.googlecode.com/svn/trunk/html5.js'
     </script>
   <![endif]-->
   ```

4. 如何区分 HTML5： DOCTYPE 声明\新增的结构元素\功能元素

### 简述一下你对 HTML 语义化的理解？

- 用正确的标签做正确的事情。
- html 语义化让页面的内容结构化，结构更清晰，便于对浏览器、搜索引擎解析;
- 即使在没有样式 CSS 情况下也以一种文档格式显示，并且是容易阅读的;
- 搜索引擎的爬虫也依赖于 HTML 标记来确定上下文和各个关键字的权重，利于 SEO;
- 使阅读源代码的人对网站更容易将网站分块，便于阅读维护理解。

5. HTML5 的离线储存怎么使用，工作原理能不能解释一下？

- 在用户没有与因特网连接时，可以正常访问站点或应用，在用户与因特网连接时，更新用户机器上的缓存文件。

- 原理：HTML5 的离线存储是基于一个新建的.appcache 文件的缓存机制(不是存储技术)，通过这个文件上的解析清单离线存储资源，这些资源就会像 cookie 一样被存储了下来。之后当网络在处于离线状态下时，浏览器会通过被离线存储的数据进行页面展示。

- 如何使用：
  1. 页面头部像下面一样加入一个 manifest 的属性；
  2. 在 cache.manifest 文件的编写离线存储的资源；
     ```
     CACHE MANIFEST
     #v0.11
     CACHE:
     js/app.js
     css/style.css
     NETWORK:
     resourse/logo.png
     FALLBACK:
     / /offline.html
     ```
  3. 在离线状态时，操作 window.applicationCache 进行需求实现。

### 浏览器是怎么对 HTML5 的离线储存资源进行管理和加载的呢？

- 在线的情况下，浏览器发现 html 头部有 manifest 属性，它会请求 manifest 文件，如果是第一次访问 app，那么浏览器就会根据 manifest 文件的内容下载相应的资源并且进行离线存储。如果已经访问过 app 并且资源已经离线存储了，那么浏览器就会使用离线的资源加载页面，然后浏览器会对比新的 manifest 文件与旧的 manifest 文件，如果文件没有发生改变，就不做任何操作，如果文件改变了，那么就会重新下载文件中的资源并进行离线存储。

- 离线的情况下，浏览器就直接使用离线存储的资源。

### 请描述一下 cookies，sessionStorage 和 localStorage 的区别？

1. 传递性

   - cookie 是网站为了标示用户身份而储存在用户本地终端（Client Side）上的数据（通常经过加密）。
     cookie 数据始终在同源的 http 请求中携带（即使不需要），也会在浏览器和服务器间来回传递。

   - sessionStorage 和 localStorage 不会自动把数据发给服务器，仅在本地保存。

2. 存储大小：

   - cookie 数据大小不能超过 4k。
   - sessionStorage 和 localStorage 虽然也有存储大小的限制，但比 cookie 大得多，可以达到 5M 或更大。

3. 有期时间：
   - localStorage 存储持久数据，浏览器关闭后数据不丢失除非主动删除数据；
   - sessionStorage 数据在当前浏览器窗口关闭后自动删除。
   - cookie 设置的 cookie 过期时间之前一直有效，即使窗口或浏览器关闭

### iframe 有那些缺点？

- iframe 会阻塞主页面的 Onload 事件；

- 搜索引擎的检索程序无法解读这种页面，不利于 SEO;

- iframe 和主页面共享连接池，而浏览器对相同域的连接有限制，所以会影响页面的并行加载。

- 使用 iframe 之前需要考虑这两个缺点。如果需要使用 iframe，最好是通过 javascript
  动态给 iframe 添加 src 属性值，这样可以绕开以上两个问题。

### Label 的作用是什么？是怎么用的？

label 标签来定义表单控制间的关系,当用户选择该标签时，浏览器会自动将焦点转到和标签相关的表单控件上。

```html
<label for="Name">Number:</label>
<input type="text" name="Name" id="Name" />

<label>Date:<input type="text" name="B" /></label>
```

### HTML5 的 form 如何关闭自动完成功能？

给不想要提示的 form 或某个 input 设置为 `autocomplete="off"`。

### 如何实现浏览器内多个标签页之间的通信?

- WebSocket、SharedWorker；

- 也可以调用 localstorge、cookies 等本地存储方式；

localstorge 另一个浏览上下文里被添加、修改或删除时，它都会触发一个 storagechange 事件，
我们通过监听事件，控制它的值来进行页面信息通信；
注意 quirks：Safari 在无痕模式下设置 localstorge 值时会抛出 QuotaExceededError 的异常；

### webSocket 如何兼容低浏览器？

- Adobe Flash Socket
- ActiveX HTMLFile (IE)
- 基于 multipart 编码发送 XHR
- 基于长轮询的 XHR

### 页面可见性（Page Visibility API） 可以有哪些用途？

- 通过监听页面`visibilitychange`事件，用`document.hidden` 的值检测页面当前是否可见，以及打开网页的时间等;

- 在页面被切换到其他后台进程的时候，自动暂停音乐或视频的播放；

### 如何在页面上实现一个圆形的可点击区域？

- map+area 或者 svg
- border-radius
- 纯 js 实现 需要求一个点在不在圆上简单算法、获取鼠标坐标等等

### 实现不使用 border 画出 1px 高的线，在不同浏览器的标准模式与怪异模式下都能保持一致的效果

`<div style="height:1px;overflow:hidden;background:red"></div>`

### 网页验证码是干嘛的，是为了解决什么安全问题？

- 区分用户是计算机还是人的公共全自动程序。可以防止恶意破解密码、刷票、论坛灌水；
- 有效防止黑客对某一个特定注册用户用特定程序暴力破解方式进行不断的登陆尝试。

### title 与 h1 的区别、b 与 strong 的区别、i 与 em 的区别？

1. title 属性没有明确意义只表示是个标题，H1 则表示层次明确的标题，对页面信息的抓取也有很大的影响；

2. strong 是标明重点内容，有语气加强的含义，使用阅读设备阅读网络时：`<strong>`会重读，而`<B>`是展示强调内容。

3. i 内容展示为斜体，em 表示强调的文本；

4. Physical Style Elements -- 自然样式标签
   b, i, u, s, pre
5. Semantic Style Elements -- 语义样式标签
   strong, em, ins, del, code

应该准确使用语义样式标签, 但不能滥用, 如果不能确定时首选使用自然样式标签。
