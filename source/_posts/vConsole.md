---
title: vConsole
date: 2018-09-26 11:02:13
tags: 其它
categories: mobile
---

## 前言

你是否遇到这样的情况？你的移动端项目上线，突然用户发现某个页面或功能不能用了，按照所见即所得原理，产品第一时间肯定揪出你这个前端er起来改bug，而此时你正在下班的地铁上或远方找个清静的地方佛（hai）系（pi），反正就是没有电脑或网络环境提供条件区调试你的前端页面。

在开发移动端页面难处除了兼容纷杂机型屏幕，还有在实际终端上调试，原生app、微信小程序开发可以抓日志打印，而页面h5开发打印是不会显示的。

怎样能从前端开始快速定位问题呢？作为前端er的工作就是要把浏览器反馈的信息都能放到页面让用户看到，错误信息也不例外，只不过要在不影响用户使用的前提下，选择一个合适的时机。

而`vConsole`就是为移动端调试利器之一，能够在移动端设备上查看log、浏览器信息、网络信息、页面元素和本地存储（`Cookie`和`LocalStorage`），由腾讯团队开源，下载[最新版本](https://github.com/WechatFE/vConsole/releases/latest)或`npm install vconsole`安装，页面引入即可。

扫描这个二维码立马在线查看效果

![vconsole_qr](/gb/vConsole/vconsole_qr.png)

详细参考[vConsole使用教程](https://github.com/Tencent/vConsole/blob/dev/doc/tutorial_CN.md)，在这里不累述。以下记录几点在使用过程中注意点。

## 初始化

在引入`vConsole`后，需要手动初始化

```js
var vConsole = new VConsole(option);
```

`option`是一个选填的`Object`对象，具体配置定义可以参考[公共属性及方法](https://github.com/Tencent/vConsole/blob/dev/doc/public_properties_methods_CN.md)

一般将`vConsole`的初始化实例单独拿出来，除了让插件独立，还有可以让插件能按需引入，这个后面说。

```js
// vconsole.js文件
import VConsole from 'vconsole'

let vConsole = new VConsole()
vConsole.setOption('maxLogNumber', 5000)
```

> 未加载 `vConsole` 模块时，`console.log()` 会直接打印到原生控制台中；加载 `vConsole` 后，日志会打印到页面前端+原生控制台。

加载后，在我们的移动端页面就会漂浮一个`vConsole`绿色按钮，点击展开一个弹窗面板。

![vconsole](/gb/vConsole/vconsole.png)

![vconsole_pannel](/gb/vConsole/vconsole_pannel.png)

## 异步加载

对于移动端页面，听说一个优秀的前端er往往看重页面性能，能少加载尽量少，特别是对于首屏加载，吓得我赶快去看看`vConsole`的文件`vconsole.min.js`大小，有77KB，作为一个辅助插件还算是挺大的，因此

1. 不建议混杂打包在其它业务代码里，即用ES6的`import`函数动态加载单独的js文件；
2. 最好也不影响页面加载，插入到`html`代码`<script>`标签加`async`属性让js异步加载完成执行。

综上在项目中处理如下：

```js
// 把独立出的vconsole.js按需引入
import('~/plugins/vconsole')
```

## 开关控制加载

我们可以通过配置来决定是否启用加载`vConsole`，这样，在开发环境就可以在移动端查看打印日志和其它信息。当然，不能把这项功能直接开放到生成环境，影响用户使用（用户才不关心你的打印帮你排查问题）。

那么，问题来了，生产环境怎样做能和谐两者关系呢？这样要从链接到当前页面的`url`参数入手了，可以自己定义一个只有你自己知道的参数键值（在这里我直接用`vconsole`举例了），获取到这个参数就按需动态加载`vConsole`插件js文件，否则不加载，也不影响整个业务代码打包大小，两全齐美。

```js
// util.js
const queryParams = (url = window.location.href) => {
  let surl = []
  let patt = /\?([^#/?]+)/g
  url = decodeURIComponent(url)
  let result = []

  while ((result = patt.exec(url))) {
    surl.push(result[1])
  }

  if (!surl.length) {
    return null
  }

  let o = {}
  surl.forEach((item, index) => {
    let s = surl[index]
    let kvs = s.split('&')
    kvs.forEach((item) => {
      let arr = item.split('=')
      o[arr[0]] = arr[1]
    })
  })
  return o
}

// ...
// 启用vconsole移动端打印工具
if (Util.queryParams().hasOwnProperty('vconsole')) {
  import('~/plugins/vconsole')
}
```

下面看一下这样处理后的效果：

![import_js_before](/gb/vConsole/import_js_before.png)

![import_js_after](/gb/vConsole/import_js_after.png)

![import_vconsole](/gb/vConsole/import_vconsole.png)

用户看不到`vConsole`绿色按钮，而在你把页面url插入你神秘的参数就能看到调试界面啦！