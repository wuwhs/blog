---
title: package-lock翻车记
date: 2021-03-11 23:02:02
tags: [javascript, webpack, npm]
---

## 背景

本文要从最近接连出现两起有关 `npm` 安装 `package.json` 中依赖包，由于依赖包版本更新 `bug` 造成项目出错问题说起。

### 事件一：新版本依赖包本身 bug

项目本地打包正常，但是线上使用 `Jenkins` 完成 `DevOps` 交付流水线打包出错问题。报出如下错误：

```js
**17:15:32**  ERROR in ./node_modules/clipboard/dist/clipboard.js
**17:15:32**  Module build failed (from ./node_modules/babel-loader/lib/index.js):
**17:15:32**  Error: Couldn't find preset "@babel/env" relative to directory "/app/workspace/SIT/node_modules/clipboard"
```

显示错误原因是 `clipboard` 插件没有安装 `@babel/env` 预设（`preset`）。明显这个是插件问题了，去官方库 [`clipboard`](https://github.com/zenorocha/clipboard.js) 查看源码发现该库依赖包很少，大部分是原生实现。再看 `issue` 别人有没有出现同样的问题，目前来看还没有人提出。以此推断可能是插件本身的 "问题" 了。

但是我本地项目打包正常，线上的出错，可能由于本地版本和线上版本不一致导致（某个小版本出现的 `bug`）的。通过查看`package.json` 配置的 `clipboard: "^2.0.4"`，线上实际安装版本是 `2.0.7`，而我本地实际安装版本是 `2.0.6`
因此定位到 `2.0.7` 出现的 “问题”。

由于是插件本身“问题”，我的临时解决办法是锁定到 `2.0.4` 版本，也就是 `clipboard: "2.0.4"`，后面加上 `package-lock.json`。

**打破沙锅问到底**
既然“问题”已经定位到了 `2.0.7` 版本，进一步通过对比此次版本提交文件内容差异，发现`.babelrc` 文件用到的 `preset` 是 `env`。

![clipboard2.0.6](/gb/package-lock/clipboard2.0.6.png)

`2.0.7` 版本用的是 `@bable/env`，将 `babel` 更新到了 7！

![clipboard2.0.7](/gb/package-lock/clipboard2.0.7.png)

问题基本定位到了，这里就顺便给作者提了一个 [`issues`](https://github.com/zenorocha/clipboard.js/issues/745)。

### 事件二：依赖包的新版插件 bug

一直正常使用的 `braft-editor` 优秀的富文本编辑器插件，最近在其他小伙伴电脑或者在我本地电脑重新部署项目，启动后发现 `toHtml()` 方法获取富文本 `html` 内容总是空！

历史版本是正常的，猜测可能又是版本更新造成。同样的，去官方库 [braft-editor](https://github.com/margox/braft-editor)看看 `issues` 别人有没有遇到同样的问题。果然这次有，原因是它的依赖包 [`draft-js`](https://github.com/facebook/draft-js) 更新后的问题，具体的看这个 [`issues`](https://github.com/margox/braft-editor/issues/847)。

这个是由于插件的依赖包更新出现的问题，直接去锁定当前插件没有作用，不会对它的依赖包产生约束（依赖包还是会去下载最新版本的包）。我的解决办法是尝试将版本回退到后一个版本并锁定。这样做的原因是回退版本的依赖包版本肯定会低于现在的，之前的版本是正常的。

### 经验教训

其实这两起事件是同一个诱因导致的：没有锁定当前项目依赖包树的版本。下面就来探究一下依赖包的版本管理。

## dependencies 和 devDependencies

`package.json` 在前端工程化中主要用来记录依赖包名称、版本、运行指令等信息字段。其中，`dependencies` 字段指定了项目运行所依赖的模块，`devDependencies` 指定项目开发所需要的模块。
它们都指向一个对象。该对象的各个成员，分别由模块名和对应的版本要求组成，表示依赖的模块及其版本范围。对应的版本可以加上各种限定，主要有以下几种：

- 指定版本：比如 `1.2.2` ，遵循“大版本.次要版本.小版本”的格式规定，安装时只安装指定版本。
- 波浪号（tilde）+指定版本：比如 `~1.2.2` ，表示安装 `1.2.x` 的最新版本（不低于`1.2.2`），但是不安装 `1.3.x`，也就是说安装时不改变大版本号和次要版本号。
- 插入号（`caret`）+指定版本：比如 `ˆ1.2.2`，表示安装 `1.x.x` 的最新版本（不低于 `1.2.2`），但是不安装 `2.x.x`，也就是说安装时不改变大版本号。需要注意的是，如果大版本号为 0，则插入号的行为与波浪号相同，这是因为此时处于开发阶段，即使是次要版本号变动，也可能带来程序的不兼容。
- latest：安装最新版本。

当我们使用比如 `npm install package -save` 安装一个依赖包时，版本是插入号形式。这样每次重新安装依赖包 `npm install` 时”次要版本“和“小版本”是会拉取最新的。一般的，主版本不变，不会带来核心功能变动，但是在复杂的项目中难免会引入一些意想不到的 `bug`。

## npm 根据 `package.json` 安装依赖包流程

1. 执行工程自身 `preinstall`。当前 `npm` 工程如果定义了 `preinstall` 钩子此时会被执行。

2. 确定首层依赖。
   模块首先需要做的是确定工程中的首层依赖，也就是 `dependencies` 和 `devDependencies` 属性中直接指定的模块（假设此时没有添加 `npm install` 参数）。工程本身是整棵依赖树的根节点，每个首层依赖模块都是根节点下面的一棵子树，`npm` 会开启多进程从每个首层依赖模块开始逐步寻找更深层级的节点。

3. 获取模块。

   获取模块是一个递归的过程，分为以下几步：

   - 获取模块信息。在下载一个模块之前，首先要确定其版本，这是因为 `package.json` 中往往是 `semantic version`（`semver`，语义化版本）。此时如果版本描述文件（`npm-shrinkwrap.json` 或 `package-lock.json`）中有该模块信息直接拿即可，如果没有则从仓库获取。如 `package.json` 中某个包的版本是 `^1.1.0`，`npm` 就会去仓库中获取符合 `1.x.x` 形式的最新版本。
   - 获取模块实体。上一步会获取到模块的压缩包地址（`resolved` 字段），`npm` 会用此地址检查本地缓存，缓存中有就直接拿，如果没有则从仓库下载。
   - 查找该模块依赖，如果有依赖则回到第 1 步，如果没有则停止。

4. 模块扁平化（dedupe）

上一步获取到的是一棵完整的依赖树，其中可能包含大量重复模块。比如 A 模块依赖于 loadsh，B 模块同样依赖于 lodash。在 npm3 以前会严格按照依赖树的结构进行安装，因此会造成模块冗余。yarn 和从 npm5 开始默认加入了一个 dedupe 的过程。它会遍历所有节点，逐个将模块放在根节点下面，也就是 node-modules 的第一层。当发现有重复模块时，则将其丢弃。这里需要对重复模块进行一个定义，它指的是模块名相同且 semver 兼容。每个 semver 都对应一段版本允许范围，如果两个模块的版本允许范围存在交集，那么就可以得到一个兼容版本，而不必版本号完全一致，这可以使更多冗余模块在 dedupe 过程中被去掉。

- 安装模块

  这一步将会更新工程中的 node_modules，并执行模块中的生命周期函数（按照 preinstall、install、postinstall 的顺序）。
  执行工程自身生命周期

当前 npm 工程如果定义了钩子此时会被执行（按照 install、postinstall、prepublish、prepare 的顺序）。

## package-lock

正是存在这每次重新安装依赖包版本存在的不确定性，才有了 `package-lock`。
在 `npm5` 版本后，当我们运行 `npm intall` 发现会生成一个新文件 `package-lock.json`，它是 `package.json` 中列出的每个依赖项的大型列表，应安装的特定版本，模块的位置（`URI`），验证模块完整性的哈希，它需要的包列表，以及依赖项列表。

```js
"vue-loader": {
  "version": "14.2.4",
  "resolved": "https://registry.npmjs.org/vue-loader/-/vue-loader-14.2.4.tgz",
  "integrity": "sha512-bub2/rcTMJ3etEbbeehdH2Em3G2F5vZIjMK7ZUePj5UtgmZSTtOX1xVVawDpDsy021s3vQpO6VpWJ3z3nO8dDw==",
  "dev": true,
  "requires": {
    "consolidate": "^0.14.0",
    "hash-sum": "^1.0.2",
    "loader-utils": "^1.1.0",
    "lru-cache": "^4.1.1",
    "postcss": "^6.0.8",
    "postcss-load-config": "^1.1.0",
    "postcss-selector-parser": "^2.0.0",
    "prettier": "^1.16.0",
    "resolve": "^1.4.0",
    "source-map": "^0.6.1",
    "vue-hot-reload-api": "^2.2.0",
    "vue-style-loader": "^4.0.1",
    "vue-template-es2015-compiler": "^1.6.0"
  },
  "dependencies": {
    "postcss-load-config": {
      "version": "1.2.0",
      "resolved": "https://registry.npmjs.org/postcss-load-config/-/postcss-load-config-1.2.0.tgz",
      "integrity": "sha1-U56a/J3chiASHr+djDZz4M5Q0oo=",
      "dev": true,
      "requires": {
        "cosmiconfig": "^2.1.0",
        "object-assign": "^4.1.0",
        "postcss-load-options": "^1.2.0",
        "postcss-load-plugins": "^2.3.0"
      }
    },
  }
},
```

当项目中已有 `package-lock.json` 文件，在安装项目依赖时，将以该文件为主进行解析安装指定版本依赖包，而不是使用 `package.json` 来解析和安装模块。因为 `package-lock` 为每个模块及其每个依赖项指定了版本，位置和完整性哈希，所以它每次创建的安装都是相同的。 无论你使用什么设备，或者将来安装它都无关紧要，每次都应该给你相同的结果。

### cnpm 不支持 package-lock

使用 `cnpm install` 时候，并不会生成 `package-lock.json` 文件。`cnpm install` 的时候，就算你项目中有 `package-lock.json` 文件，`cnpm` 也不会识别，仍会根据 `package.json` 来安装。所以这就是为什么之前你用 `npm` 安装产生了 `package-lock.json`，后面的人用 `cnpm` 来安装，可能会跟你安装的依赖包不一致，这是因为 `cnpm` 不受 `package-lock.json` 影响，只会根据 package.json 进行下载。

## 总结

项目在以后重新构建，由于依赖树中有版本更新，造成意外事故是不可避免的，究其原因是整个依赖树版本没有锁死。临时解决方案是写死某个出问题的依赖包版本。终极解决方案还得需要 `package-lock` 锁死整棵依赖树版本。当然用 `yarn` 也可以，由于缓存机制、依赖扁平化、并行下载等特点使得下载安装速度更高效。
