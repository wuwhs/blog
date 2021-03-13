---
title: package-lock翻车记
date: 2021-03-11 23:02:02
tags: [javascript, webpack, npm]
---

## 背景

本文要从最近接连出现两起有关 `npm` 安装 `package.json` 中依赖包，由于依赖包版本更新 `bug` 造成的问题说起。

### 事件一：新版本依赖包本身 bug

项目本地打包正常，但是线上使用 `Jenkins` 完成 `DevOps` 交付流水线打包出错问题。报出如下错误：

```js
**17:15:32**  ERROR in ./node_modules/clipboard/dist/clipboard.js
**17:15:32**  Module build failed (from ./node_modules/babel-loader/lib/index.js):
**17:15:32**  Error: Couldn't find preset "@babel/env" relative to directory "/app/workspace/SIT/node_modules/clipboard"
```

显示错误原因是 `clipboard` 插件没有安装 `@babel/env` 预设（`preset`）。明显这个是插件问题了，去官方库 [`clipboard`](https://github.com/zenorocha/clipboard.js) 查看源码发现该库依赖包很少，大部分是原生实现。再看 `issue` 别人有没有出现同样的问题，目前来看还没有人提出。以此推断可能是插件本身的 "问题" 了。

但是我本地项目打包正常，线上的出错，可能由于本地版本和线上版本不一致导致（某个小版本出现的 `bug`）的。`package.json` 配置的 `clipboard: "^2.0.4"`，线上实际安装版本是 `2.0.7`，而我本地实际安装版本是 `2.0.6`
因此定位到 `2.0.7` 出现的 “问题”。

由于是插件本身“问题”，我的解决办法是锁定到 `2.0.4` 版本，也就是 `clipboard: "2.0.4"`。

**打破沙锅问到底**
既然“问题”已经定位到了 `2.0.7` 版本，进一步通过对比此次版本提交文件内容差异，发现`.babelrc` 文件用到的 `preset` 是 `env`。

![clipboard2.0.6](/gb/package-lock/clipboard2.0.6.png)

`2.0.7` 版本用的是 `@bable/env`，将 `babel` 更新到了 7！

![clipboard2.0.7](/gb/package-lock/clipboard2.0.7.png)

问题基本定位到了，这里就顺便给作者提了一个 [`issues`](https://github.com/zenorocha/clipboard.js/issues/745)。

### 事件二：依赖包的新版插件 bug

一直正常使用的 `braft-editor` 优秀的富文本编辑器插件，最近在其他小伙伴电脑或者在我本地电脑重新部署项目，启动后发现 `toHtml()` 方法获取富文本 `html` 内容总是空！

历史版本是正常的，猜测可能又是版本更新造成。同样的，去官方库 [braft-editor](https://github.com/margox/braft-editor)看看 `issues` 别人有没有遇到同样的问题。果然这次有，原因是它的依赖包 [`draft-js`](https://github.com/facebook/draft-js) 更新后的问题，具体的看这个 [`issues`](https://github.com/margox/braft-editor/issues/847)。

这个是由于插件的依赖包更新出现的问题，直接去锁定当前插件没有作用，不会对它的依赖包产生约束。

`package.json` 在前端工程化中主要用来记录依赖包名称、版本、运行指令等信息。在 `npm5` 版本后，当我们运行 `npm intall` 发现会生成一个新文件 `package-lock.json`， d
dffdddsdfs
