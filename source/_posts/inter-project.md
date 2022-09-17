---
title: inter-project
date: 2021-09-07 15:43:44
tags: [interview]
---

### 顺丰在线客服访客端项目

- 顺丰在线客服访客端是用于智能机器人与访客自助交互服务，还能与客服人员在线沟通。项目包括 PC 端和 H5 端，接入顺丰体系应用 100 多个渠道，比如速运、冷运、丰巢和航空等与之相关微信、App 和小程序渠道客服入口。
- 前端项目使用 vue、es6、vant、element、better-scroll、webpack 等技术栈构建。
- 基于 websocket 实现 IM 通讯，http 轮询做兜底，实现消息确认机制，防止消息丢失和消息去重。
- 实现了输入框吸附 H5 软键盘兼容方案。
- 实现了前端 js 图片压缩方案。
- 等等相关难题。

#### 追问：短轮询和长轮询区别？

短轮询：浏览器隔段时间向服务器发送 http 请求，服务器收到请求后，不论数据是否有更新，都直接响应。优点是实现简单，缺点是存在大量无效请求，浪费资源。
长轮询：浏览器发送请求后，服务器不立刻返回，知道有数据更新或者连接超时才返回。返回后重新发送请求。优点是具有较好的时效性，缺点是连接挂起消耗资源。

#### 追问：消息确认机制你是怎样做的？

由于服务器是分布式的，各种机型的终端和网络环境，消息从访客发送给客服，或者从客服发送给访客不能保证 100%送达或收到。这个时候就需要一个类似 TCP 建立连接的消息确认机制，比如访客发送消息给客服，消息先抵达服务器再到客服端，客服有没有收到对于访客是未知的，需要在一段时间内收到客服端的反馈 ack，就确认了收到了，否则在访客端重发该消息。同理消息从客服端到访客端同样需要消息反馈。这样就是消息确认机制的原理了。

具体的实现是创建一个消息队列，队列里面存的是消息实例对象，实例方法定义一个定时器用于消息确认计时，同时上层维护一个观察者对象，当有在一定时间内收到相同消息 id 的 ack 消息，就会触发观察者更新消息队列中对应的消息的状态为成功，并且关闭定时器，否则更新状态为失败。

#### 追问：观察者模式和发布订阅模式的区别？

观察者模式，只有观察者和被观察者两个角色，而发布订阅模式，除了有发布者和订阅者，还有中间层（broker）。

发布订阅模式，发布者和订阅者是解耦的，而观察者模式观察者和被观察者是松解耦；

观察者模式多用于单个应用内部，而发布订阅模式跨应用，比如中间件；

#### 追问：观察者模式和发布订阅模式实现细节？

观察者模式指的是一个对象（Subject）维持一系列依赖于它的对象（Observer），当有关状态发生变更时，Subject 对象通知一系列 Observer 对象进行更新。

```js
// 目标对象
class Subject {
  constructor() {
    // 维护观察者列表
    this.observers = []
  }
  // 添加一个观察者
  add(observer) {
    this.observers.push(observer)
  }
  // 删除一个观察者
  remove(observer) {
    const { observers } = this
    for (let i = 0; i < observers.length; i++) {
      if (observers[i] === observer) {
        observers.splice(i, 1)
      }
    }
  }
  // 通知所有观察者
  notify() {
    const { observers } = this
    for (let i = 0; i < observers.length; i++) {
      observers[i].update()
    }
  }
}

// 观察者
class Observer {
  constructor(name) {
    this.name = name
  }
  // 更新
  update() {
    console.log('name: ', this.name)
  }
}

const sub = new Subject()
const obs1 = new Observer('wuwhs')
const obs2 = new Observer('winfar')
sub.add(obs1)
sub.add(obs2)
sub.notify()
```

发布订阅模式指的是希望接受通知的对象（Subscriber）基于一个主题通过自定义事件订阅主题，发布事件的对象（Publisher）通过发布主题事件的方式通知各个订阅该主题的 Subscriber 对象。

```js
// 发布订阅模式的实现
class PubSub {
  constructor() {
    // 维护事件及订阅行为
    this.events = {}
  }

  // 注册事件订阅行为
  subscribe(type, event) {
    if (!this.events[type]) {
      this.events[type] = []
    }
    this.events[type].push(event)
  }

  // 发布事件
  publish(type, ...args) {
    if (this.events[type]) {
      this.events[type].forEach((event) => {
        event(...args)
      })
    }
  }

  // 移除某个事件的订阅行为
  unsubscribe(type, event) {
    const evts = this.events[type]
    if (evts) {
      for (let i = 0; i < evts.length; i++) {
        if (evts[i] === event) {
          evts.splice(i, 1)
        }
      }
    }
  }
}

const pub = new PubSub()
const fn = (...args) => {
  console.log('subscribe：', ...args)
}
pub.subscribe('customer-event', fn)
pub.publish('customer-event', 1, 2, 3)
```

#### 追问：websocket 协议你了解多少？

当客户端和服务端建立 websocket 连接时，在握手的过程中，客户端项服务端发送一个 http 请求，包含 Upgrade 请求头来告知服务端客户端需要建立一个 websocket 连接，同时请求头 Sec-Websocket-Key 传给服务端一个随机字符串，服务端有部署 websocket 服务，则返回状态码 101，并将 websocket-key 加上一串特殊字符，再经过 hash 加密，转化为 base64，通过响应头 Sec-Websocket-Accept 返回给客户端。客户端通过同样的算法比对，如果相同则握手成功。

参考：
[WebSocket 原理浅析与实现简单聊天](https://mp.weixin.qq.com/s/hfGRs4jk9ansZzPNeQL2KQ)
[你不知道的 WebSocket](https://mp.weixin.qq.com/s/U5q2d-wWK_SRpPOds6P1kg)

#### js 图片压缩你是怎样实现的？

公司运维监控平台反馈在线客服上行宽带使用有些偏高，后端同学查到是访客在聊天发送图片上传接口占比较大。80%的访客沟通都会发图片给客服。
站在前端的角度，可不可以试图将图片压缩后再通过接口上传呢？带着这个疑问我查阅了相关资料，刚开始简单地用了一款开源的库，在本地测试没有太大的问题，上到生产，经过大量用户和机型的检验，才发现有很多的局限性，很多边界问题没有覆盖到。比如 png 图片的压缩不是很理想，会出现“不减反增”现象，长或宽大于 1 万 6 像素的 png 图片在有些机型上压缩后可能是黑的。

为了解决这些问题，我梳理了图片压缩大致流程：获取到用户上传的文件 File，将 File 转化（FileReader.reandAsDataUrl 或 URL.createObjectURL）为图片 Image 对象，然后读取到 Canvas（ctx.drawImage），再利用 Canvas 原生方法 canvas.toDataURL 或者 canvas.toBlob 实现压缩输出 base64 或者 blob，最后转化为 blob 上传到服务器。

大致流程清楚了，接下来解决边界问题。

png 图片压缩输出相同格式图片“不减反增”现象。使用 Canvas 上的方法压缩，是由浏览器内核底层 api 算法决定的，在应用层面暂时无法解决，但是 canvas.toDataURL 和 canvas.toBlob 可以将图片转换为 jpg 或者 webp 格式，控制其输出质量。所以我做了一个折衷方案，对于 png 图片设置一个阈值，如果小于这个阈值压缩输出 png 格式，输出的 png 图片质量比源图片大，则自己返回源图片；如果大于这个阈值则压缩输出 jpg 格式。

长宽像素比较大的图片压缩出现黑屏的问题。根据图片大小创建相同尺寸的 Canvas，查询了不同浏览器内核对 Canvas 大小的限制发现，最大宽或者高在 2 万像素左右，对总像素也有限制，再大可能就会出现意外情况。因此限定输出图片宽高是有必要的。我的方案是对源图片宽高和输出图片宽高做等比转换，防止拉缩图片，输出图片宽高做限制兜底。

综合上述的处理我封装了一个 npm 插件 js-image-compressor。

参考[了解 JS 压缩图片，这一篇就够了](https://segmentfault.com/a/1190000023486410)

#### 聊天输入框吸附 H5 软件键盘兼容是怎么做的？

在项目之初，在不同的测试机的不同浏览器环境中预览交互 H5 页面效果时，发现软键盘弹起后，聊天输入框被软键盘（特别是第三方输入法的软键盘）遮挡了一半或完全遮挡，并不是刚好吸附在软键盘上的效果。键盘收起后，在 IOS12+上的微信 6.7.4+或者唯品会 app、抖音 app 上，出现视图“下不来”，软键盘弹起区域空白现象。

为了解决这些问题，我首先了解输入框（input、textarea 或富文本）在获取焦点键盘弹起，失去焦点键盘收起页面得表现。

在 IOS 上，输入框获取焦点，键盘弹起，页面（webview）不会被压缩高度，只是页面整体往上滚了，且滚动高度为软键盘得高度，这个是 IOS 自己计算得到的。点击软键盘上的“收起”按钮或者输入框以外其他区域，输入框失去焦点，键盘收起。

在 Android 上，输入框获取焦点，键盘弹起，但是页面（webview）高度会发生改变，一般来说，高度为可视区高度，也就是原高度减去软键盘高度，页面本身不发生滚动。点击软键盘上的“收起”按钮，输入框不会失去焦点，软键盘收起，同样触发输入框以外的区域，输入框会失去焦点，软键盘收起。

这样，我总结出了：在 IOS 上，监听输入框的 focus 事件就可以获知软键盘弹起了，监听输入框的 blur 事件获知软键盘收起了；在 Android 上，监听页面（webview）的高度变化，高度变小获知软键盘弹起，否则软键盘收起了。

因为我们已经能够监听到 IOS 和 Android 软键盘弹起和收起了的状态，当键盘弹起时，针对输入框被遮挡的问题，我猜测是由于第三方输入法软键盘计算有误造成，可以通过 DOM 元素的 scrollIntoView 方法将输入框滚动到可视区。当键盘收起时，针对输入框收起后，视图下不来问题，将 document/body 通过 scrollTo 方法重置视图位置。

### 聊天输入框的 @ 功能是怎样实现的

- 首先，监听富文本输入框的 input 事件，有输入 @ 字符，就会触发显示列表提示框；
- 其次，定位列表提示框显示的位置，利用 document.getSelection().getRangeAt(0) 获取光标，再通过 range.getBoundingRect() 获取光标在视口的位置，对列表提示框进行定位；
- 暂存光标，当选中列表项时，输入框会失去焦点，选中获取数据后，再恢复光标，在光标后通过 range.inertNode 插入数据，并将光标 range.setEndAfter 移动到最后；

参考
[手把手实现输入框@功能（完结）](https://juejin.cn/post/7093142333201317901)
[Selection](https://developer.mozilla.org/zh-CN/docs/Web/API/Selection)
[Web 中的“选区”和“光标”需求实现](https://mp.weixin.qq.com/s/iWKVhPNj8QjOqEYrR7PcmA)
[基于 contenteditable 技术实现@选人功能](https://segmentfault.com/a/1190000037660531)
[在输入框实现@ At 功能的一些思考](https://juejin.cn/post/6982251438332182542)

### 视屏“秒发”实现思路

[富媒体在客服 IM 消息通信中的秒发实践](https://juejin.cn/post/7129705874154586125)
[\<video\>: 视频嵌入元素](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/video)
[JavaScript 获取视频的尺寸信息和第一帧图片](https://juejin.cn/post/6844904115445694477)

```html
<video preload="metadata" poster=""></video>
```

### 顺丰在线客服客服端项目

- 顺丰在线客服客服端是用于集团客服与访客在线沟通的 IM 桌面软件，集成了快递相关业务。
- 前端项目使用 electron、es6、vue、electron-builder、auto-updater 等相关技术栈构建。
- 实现 1 VS n 的 IM 核心流程，以及消息确认机制。
- 实现本地日志采集，以及消费日志存储 indexDB，分片上传。

#### electron 通信方式

electron 的进程分为主进程和渲染进程，主进程和渲染进程通过 IPC 通信。
<https://www.w3cschool.cn/electronmanual/electronmanual-ipc-main.html>

主进程 ipcMain.on 监听事件 channel，异步消息使用 event.reply(...)，同步消息通过 event.returnValue 发送回发送者。渲染进程 ipcRender.on 监听事件 channel，ipcRender.send/ipcRender.sendSync 发送异步/同步消息。

```js
// 在主进程中.
const { ipcMain } = require('electron')
ipcMain.on('asynchronous-message', (event, arg) => {
  console.log(arg) // prints "ping"
  event.reply('asynchronous-reply', 'pong')
})

ipcMain.on('synchronous-message', (event, arg) => {
  console.log(arg) // prints "ping"
  event.returnValue = 'pong'
})

//在渲染器进程 (网页) 中。
const { ipcRenderer } = require('electron')
console.log(ipcRenderer.sendSync('synchronous-message', 'ping')) // prints "pong"

ipcRenderer.on('asynchronous-reply', (event, arg) => {
  console.log(arg) // prints "pong"
})
ipcRenderer.send('asynchronous-message', 'ping')
```

主进程 ipcMain.handle 监听事件 channel，返回结果是 Promise，渲染进程 ipcRender.invoke 触发事件，可以得到触发事件结果。

```js
// Renderer process
ipcRenderer.invoke('some-name', someArgument).then((result) => {
  // ...
})

// Main process
ipcMain.handle('some-name', async (event, someArgument) => {
  const result = await doSomeWork(someArgument)
  return result
})
```

#### electron-log 是怎么做的？

网络性能检测 API PerformanceObserver(callback) 构造函数，观察的性能事件被记录时调用回调 callback 函数，第一个参数是性能观察条目列表，第二个参数是观察者对象。
实例 observer.observe 观察性能事件类型。

#### 基于 Electron 做的优化

- 基于 Web 优化，代码分割、按需加载，延后加载 Node 模块（模块查找、读取），electron 预装了对应最新的 chromium，使用现代的 JS 和 CSS，babel 配置放宽，无须 postcss，打包优化，代码压缩，tree-shaking；
- 优化进程通信优化：1、避免使用 remote，remote 底层是同步操作，虽然在渲染进程中通过 remote 可以直接使用主进程；2、封装 IPC 库，消息合并，批量传递，序列化，传递 JSON 字符串，避免 Electron 干涉序列化；
- 减少主进程负荷：密集计算和 IO 操作避免放到主进程，比如将主窗口和消息窗口直接通信，日志收集放在消息窗口完成；

#### 项目优化

对在线客服访客端做过的优化实践：

在 1-2 年的业务迭代开发，发现本地构建变慢，生产访问也慢，用 Lighthouse 对站点进行检测，performance 指标只有 55 分，给出的改进建议前几条是：1、代码覆盖率 50%左右，2、图片加载拥堵，3、建议使用 HTTP2 等。

措施：

- webpack 构建打包方面：1、js 压缩混淆由 uglifyJS 替换成多线程压缩，压缩率更好的 terser；2、使用 cache-loader 做二次构建缓存；3、在 optization 优化选项分别对 node_modules 和代码目录做 splitChunk，代码输出块控制在 200k 左右；4、生产构建使用 compression-plugin 打 gzip 压缩副本；5、生产构建 publicPath 配置 CDN 域名；6、image-compress-plugin 做图片压缩；component-webpack-plugin 对 UI 框架组建按需引入；
- HTTP 请求方面：1、升级 Nginx-openresty 的 ssl 模块，要求高于 1.0.2，然后配置 listen 443 端口加上 ssl http2 即可；2、开启 Nginx 的 gzip 开关，gzip_type 设定匹配 HTML、CSS 和 JavaScript 文件，再调整 gzip_buffers 的分片数量和大小；3、调整 Nginx 对 JavaScript、CSS 和图片的强缓存和协商缓存时间；4、开启 CDN 加速；
- 代码方面：1、将所有弹窗和卡片组建改成异步组件；2、图标集成 icon-font；
- 正在解决的问题：将所有图片替换成 webp 格式，高保真，体积小，但是我们的 h5 有部分渠道是嵌入到小程序里，小程序不支持该格式，Nodejs 做中间转换层；

成果：

通过神策埋点数据统计，首屏打开 P90 从 6s 到秒开；Lighthouse 站点 Performance 性能指标从 55-80；

### introduction

xxx，cong shi qian duan kai fa gong zuo kuai 7 nian le，dang qian jiu zhi yu shunfeng ke ji de ke hu ti yan yan fa bu，开发客服和客户体验相关产品。
从 0-1 实现了顺丰在线客服访客前端，包括 PC 和 H5 端，现已经接入了 100 多个渠道，比如顺丰官网、小程序、冷运，还有第三方 app，蜂巢、聚美优品、拼多多和抖音等。

- 实现核心 IM 流程，防止消息丢失，采用发布-订阅者模式，建立了一套类似 TCP 消息丢失，重发 ack 确认机制，确保复杂的移动端环境消息 0 丢失；
- 由于项目需要接入多端环境，需要做一些兼容，比如：聊天输入框吸附软键盘兼容，websocket 回退轮询兼容，h5 与 app 还有与小程序通讯兼容等；
- 解决 C 端图片流量偏高问题，尝试使用 JS 对图片压缩后上传，封装成了一个 npm 插件；

在近一年的紧张地开发中，基于 Electron 从 0-1 开发了客服 IM 桌面客户端，实现了 1 对 N 的 IM 核心能力，同时集成了运单查询、用户轨迹和机器人自动辅助能力。

- 简化了主进程和渲染进程 ipc 通讯，清洗数据保存快照，优化本地数据库 indexDB 存取频次和大小，控制 keep-alive 组件二级缓存数量等措施，解决白屏和闪退问题；

以上是我的基本情况。

### 客户端三层架构设计

基础框架物料构建。Electron 桌面跨端能力，webpack 现代打包工具构建页面应用，nodejs 和 chromium 本地化能力。
应用能力健壮和增强。渲染进程和主进程层日志收集与上报，自动或强制更新，本地异步消息队列存储，IPC 通讯消息合并和序列化，web worker 线程做高开销运算。
应用拓展能力和平台化。路由权限分割，第三方应用以微应用形式接入，解决在线和离线应用跨域请求，sdk 提供交互和底层能力。
