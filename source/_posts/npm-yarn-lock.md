---
title: npm/yarn lock真香
date: 2021-03-11 23:02:02
tags: [javascript, webpack, npm, yarn]
---

![npm-yarn-lock](/gb/npm-yarn-lock/npm-yarn-lock.png)

## 前言

看完本文，你将从整体了解依赖版本锁定原理，`package-lock.json` 或 `yarn.lock` 的重要性。首先要从最近接连出现两起有关 `npm` 安装 `package.json` 中依赖包，由于依赖包版本更新 `bug` 造成项目出错问题说起。

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
既然“问题”已经定位到了 `2.0.7` 版本，进一步通过对比此次版本提交文件内容差异，发现 `.babelrc` 文件用到的 `preset` 是 `env`。

![clipboard2.0.6](/gb/npm-yarn-lock/clipboard2.0.6.png)

`2.0.7` 版本用的是 `@bable/env`，将 `babel` 更新到了 7！具体原因点[这里](https://tech.ipalfish.com/blog/2020/03/30/babel6-7/)

![clipboard2.0.7](/gb/npm-yarn-lock/clipboard2.0.7.png)

问题基本定位到了，这里就顺便给作者提了一个 [`issues`](https://github.com/zenorocha/clipboard.js/issues/745)。

### 事件二：依赖包的新版插件 bug

一直正常使用的 `braft-editor` 优秀的富文本编辑器插件，最近在其他小伙伴电脑或者在我本地电脑重新部署项目，启动后发现 `toHtml()` 方法获取富文本 `html` 内容总是空！

历史版本是正常的，猜测可能又是版本更新造成。同样的，去官方库 [braft-editor](https://github.com/margox/braft-editor)看看 `issues` 别人有没有遇到同样的问题。果然这次有，原因是它的依赖包 [`draft-js`](https://github.com/facebook/draft-js) 更新后的问题，具体的看这个 [`issues`](https://github.com/margox/braft-editor/issues/847)。

这个是由于插件的依赖包更新出现的问题，直接去锁定当前插件没有作用，不会对它的依赖包产生约束（依赖包还是会去下载最新版本的包）。我的临时解决办法是尝试将版本回退到后一个版本并锁定。这样做的原因是回退版本的依赖包版本肯定会低于现在的，之前的版本是正常的。

### 经验教训

其实这两起事件是同一个诱因导致的：没有锁定当前项目依赖树模块的版本。下面就来探究一下依赖包的版本管理。

## 语义化版本（semver）

`package.json` 在前端工程化中主要用来记录依赖包名称、版本、运行指令等信息字段。其中，`dependencies` 字段指定了项目运行所依赖的模块，`devDependencies` 指定项目开发所需要的模块。
它们都指向一个对象。该对象的各个成员，分别由模块名和对应的版本要求组成，表示依赖的模块及其版本范围。对应的版本可以加上各种限定，主要有以下几种：

- 指定版本：比如 `1.2.2` ，遵循“大版本.次要版本.小版本”的格式规定，安装时只安装指定版本。
- 波浪号（`tilde`）+指定版本：比如 `~1.2.2` ，表示安装 `1.2.x` 的最新版本（不低于`1.2.2`），但是不安装 `1.3.x`，也就是说安装时不改变大版本号和次要版本号。
- 插入号（`caret`）+指定版本：比如 `ˆ1.2.2`，表示安装 `1.x.x` 的最新版本（不低于 `1.2.2`），但是不安装 `2.x.x`，也就是说安装时不改变大版本号。需要注意的是，如果大版本号为 0，则插入号的行为与波浪号相同，这是因为此时处于开发阶段，即使是次要版本号变动，也可能带来程序的不兼容。
- latest：安装最新版本。

当我们使用比如 `npm install package -save` 安装一个依赖包时，版本是插入号形式。这样每次重新安装依赖包 `npm install` 时”次要版本“和“小版本”是会拉取最新的。一般的，主版本不变的情况下，不会带来核心功能变动，`API` 应该兼容旧版，但是这在开源的世界里很难控制，尤其在复杂项目的众多依赖包中难免会引入一些意想不到的 `bug`。

## npm-shrinkwrap && package-lock

### npm-shrinkwrap

正是存在这每次重新安装，依赖树模块版本存在的不确定性，才有了相应的锁定版本机制。

`npm5` 之前可以通过 `npmshrinkwrap` 实现。通过运行 `npm shrinkwrap`，会在当前目录下生成一个 `npm-shrinkwrap.json` 文件，它是 `package.json` 中列出的每个依赖项的大型列表，应安装的特定版本，模块的位置（`URI`），验证模块完整性的哈希，它需要的包列表，以及依赖项列表。运行 `npm install` 的时候会优先使用 `npm-shrinkwrap.json` 进行安装，没有则使用 `package.json` 进行安装。

### package-lock

在 `npm5` 版本后，当我们运行 `npm intall` 发现会生成一个新文件 `package-lock.json`，内容跟上面提到的 `npm-shrinkwrap.json` 基本一样。

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

### `npm5` 版本下 `install` 规则

`npm` 并不是一开始就是按照现有这种规则制定的。

**`5.0.x` 版本**：

不管 `package.json` 中依赖是否有更新，`npm install` 都会根据 `package-lock.json` 下载。针对这种安装策略，有人提出了这个 [issue](https://github.com/npm/npm/issues/16866) ，然后就演变成了 `5.1.0` 版本后的规则。

**`5.1.0` 版本后**：

当 `package.json` 中的依赖项有新版本时，`npm install` 会无视 `package-lock.json` 去下载新版本的依赖项并且更新 p`ackage-lock.json`。针对这种安装策略，又有人提出了一个 [issue](https://github.com/npm/npm/issues/17979) 参考 `npm` 贡献者 `iarna` 的评论，得出 `5.4.2` 版本后的规则。

**`5.4.2` 版本后**：

如果只有一个 `package.json` 文件，运行 `npm install` 会根据它生成一个 `package-lock.json` 文件，这个文件相当于本次 `install` 的一个快照，它不仅记录了 `package.json` 指明的直接依赖的版本，也记录了间接依赖的版本。

如果 `package.json` 的 `semver-range version` 和 `package-lock.json` 中版本兼容(`package-lock.json` 版本在 `package.json` 指定的版本范围内)，即使此时 `package.json` 中有新的版本，执行 `npm install` 也还是会根据 `package-lock.json` 下载。

如果手动修改了 `package.json` 的 `version ranges`，且和 `package-lock.json` 中版本不兼容，那么执行 `npm install` 时 `package-lock.json` 将会更新到兼容 `package.json` 的版本。

## yarn

`yarn` 的出现主要目标是解决上面描述的由于语义版本控制而导致的 `npm` 安装的不确定性问题。虽然可以使用 `npm shrinkwrap` 来实现可预测的依赖关系树，但它并不是默认选项，而是取决于所有的开发人员知道并且启用这个选项。
`yarn` 采取了不同的做法。每个 `yarn` 安装都会生成一个类似于`npm-shrinkwrap.json` 的 `yarn.lock` 文件，而且它是默认创建的。除了常规信息之外，`yarn.lock` 文件还包含要安装的内容的校验和，以确保使用的库的版本相同。

### yarn 的主要优化

`yarn` 的出现主要做了如下优化：

- **并行安装**：无论 `npm` 还是 `yarn` 在执行包的安装时，都会执行一系列任务。`npm` 是按照队列执行每个 `package`，也就是说必须要等到当前 `package` 安装完成之后，才能继续后面的安装。而 `yarn` 是同步执行所有任务，提高了性能。
- **离线模式**：如果之前已经安装过一个软件包，用 `yarn` 再次安装时之间从缓存中获取，就不用像 `npm` 那样再从网络下载了。
- **安装版本统一**：为了防止拉取到不同的版本，`yarn` 有一个锁定文件 (`lock file`) 记录了被确切安装上的模块的版本号。每次只要新增了一个模块，`yarn` 就会创建（或更新）`yarn.lock` 这个文件。这么做就保证了，每一次拉取同一个项目依赖时，使用的都是一样的模块版本。
- **更好的语义化**： `yarn` 改变了一些 `npm` 命令的名称，比如 `yarn add/remove`，比 `npm` 原本的 `install/uninstall` 要更清晰。

## 安装依赖树流程

1. 执行工程自身 `preinstall`。
   当前 `npm` 工程如果定义了 `preinstall` 钩子此时会被执行。

2. 确定首层依赖。
   模块首先需要做的是确定工程中的首层依赖，也就是 `dependencies` 和 `devDependencies` 属性中直接指定的模块（假设此时没有添加 `npm install` 参数）。工程本身是整棵依赖树的根节点，每个首层依赖模块都是根节点下面的一棵子树，`npm` 会开启多进程从每个首层依赖模块开始逐步寻找更深层级的节点。

3. 获取模块。
   获取模块是一个递归的过程，分为以下几步：

   - 获取模块信息。在下载一个模块之前，首先要确定其版本，这是因为 `package.json` 中往往是 `semantic version`（`semver`，语义化版本）。此时如果版本描述文件（`npm-shrinkwrap.json` 或 `package-lock.json`）中有该模块信息直接拿即可，如果没有则从仓库获取。如 `package.json` 中某个包的版本是 `^1.1.0`，`npm` 就会去仓库中获取符合 `1.x.x` 形式的最新版本。
   - 获取模块实体。上一步会获取到模块的压缩包地址（`resolved` 字段），`npm` 会用此地址检查本地缓存，缓存中有就直接拿，如果没有则从仓库下载。
   - 查找该模块依赖，如果有依赖则回到第 `1` 步，如果没有则停止。

4. 模块扁平化（`dedupe`）。
   上一步获取到的是一棵完整的依赖树，其中可能包含大量重复模块。比如 `A` 模块依赖于 `loadsh`，`B` 模块同样依赖于 `lodash`。在 `npm3` 以前会严格按照依赖树的结构进行安装，因此会造成模块冗余。`yarn` 和从 `npm5` 开始默认加入了一个 `dedupe` 的过程。它会遍历所有节点，逐个将模块放在根节点下面，也就是 `node-modules` 的第一层。当发现有重复模块时，则将其丢弃。这里需要对重复模块进行一个定义，它指的是模块名相同且 `semver` 兼容。每个 `semver` 都对应一段版本允许范围，如果两个模块的版本允许范围存在交集，那么就可以得到一个兼容版本，而不必版本号完全一致，这可以使更多冗余模块在 `dedupe` 过程中被去掉。

5. 安装模块。
   这一步将会更新工程中的 `node_modules`，并执行模块中的生命周期函数（按照 `preinstall`、`install`、`postinstall` 的顺序）。

6. 执行工程自身生命周期。
   当前 `npm` 工程如果定义了钩子此时会被执行（按照 `install`、`postinstall`、`prepublish`、`prepare` 的顺序）。

## 举例说明

插件 `htmlparser2@^3.10.1` 和 `dom-serializer@^0.2.2` 都有使用了 `entities` 依赖包，不过使用的版本不同，同时我们自己安装一个版本的 `entities` 包。具体如下：

```js
--htmlparser2@^3.10.1
  |--entities@^1.1.1

--dom-serializer@^0.2.2
  |--entities@^2.0.0

--entities@^2.1.0
```

通过 `npm install` 安装后，生成的 `package-lock.json` 文件内容和它的 `node_modules` 目录结构：

![npm-version](/gb/npm-yarn-lock/npm-version.png)

可以发现：

1. `dom-serializer@^0.2.2` 的依赖包 `entities@^2.0.0` 和我们自己安装的 `entities@^2.1.0` 被实际安装成 `entities@^2.2.0`，并放在 `node_modules` 的第一层。因为这两个版本的`semver` 范围相同，又先被遍历，所有会被合并安装在第一层；
2. `htmlparser2@^3.10.1` 的依赖包 `entities@^1.1.1` 被实际安放在 `dom-serializer` 包的 `node_modules` 中，并且和 `package-lock.json` 描述结构保持一致。

通过 `yarn` 安装后，生成的 `yarn.lock` 文件内容和它的 `node_modules` 目录结构：

![npm-version](/gb/npm-yarn-lock/yarn-version.png)

可以发现与 `npm install` 不同的是：

1. `yarn.lock` 中所有依赖描述都是扁平化的，即没有依赖描述的嵌套关系；
2. 在 `yarn.lock` 中， 相同名称版本号不同的依赖包，如果 `semver` 范围相同会被合并，否则，会存在多个版本描述。

### 注意 cnpm 不支持 package-lock

使用 `cnpm install` 时候，并不会生成 `package-lock.json` 文件。`cnpm install` 的时候，就算你项目中有 `package-lock.json` 文件，`cnpm` 也不会识别，仍会根据 `package.json` 来安装。所以这就是为什么之前你用 `npm` 安装产生了 `package-lock.json`，后面的人用 `cnpm` 来安装，可能会跟你安装的依赖包不一致。

因此，尽量不要直接使用 `cnpm install` 安装项目依赖包。但是为了解决直接使用 `npm install` 速度慢的问题，可以设置 `npm` 代理解决。

```js
// 设置淘宝镜像代理
npm config set registry https://registry.npm.taobao.org

// 查看已设置代理
npm config get registry
```

当然，也可以通过 [`nrm`](https://www.npmjs.com/package/nrm) 工具，快捷操作设置代理。

全局安装

```js
$ npm install -g nrm
```

查看已安装代理列表

```js
$ nrm ls

* npm -----  https://registry.npmjs.org/
  yarn ----- https://registry.yarnpkg.com
  cnpm ----  http://r.cnpmjs.org/
  taobao --  https://registry.npm.taobao.org/
  nj ------  https://registry.nodejitsu.com/
  skimdb -- https://skimdb.npmjs.com/registry
```

切换代理

```js
$ nrm use cnpm  //switch registry to cnpm

* Registry has been set to: http://r.cnpmjs.org/
```

测速

```js
$ nrm test cnpm

* cnpm --- 618ms
```

然而，设置这些全局代理可能还是不能满足下载一些特定依赖包（在没有 `VPN` 情况下），比如：`node-sass`、`puppeteer`、`chromedriver`、`electron` 等。可以通过 `.npmrc` 文件设置具体依赖包的国内镜像。该文件在项目 `npm install` 时会被加载读取，优先级高于 `npm` 全局设置。

```js
registry=https://registry.npm.taobao.org/
sass_binary_site=http://npm.taobao.org/mirrors/node-sass
chromedriver_cdnurl=http://npm.taobao.org/mirrors/chromedriver
electron_mirror=http://npm.taobao.org/mirrors/electron/ npm install -g electron
puppeteer_download_host=http://npm.taobao.org/mirrors/chromium-browser-snapshots/
```

## 总结

项目在以后重新构建，由于依赖树中有版本更新，造成意外事故是不可避免的，究其原因是整个依赖树版本没有锁死。解决方案分为如下四种：

- `package.json` 中固定版本。注意：仅能锁定当前依赖包版本，不能控制整棵依赖树版本。
- `npm+npm-shrinkwrap.json`。
- `npm+package-lock.json`。
- `yarn+yarn-lock.json`。

根据自身情况选择。
见识有限，欢迎指正，谢谢点赞，完～
