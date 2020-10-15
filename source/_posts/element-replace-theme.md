---
title: 彻底学会element-ui按需引入和纯净主题定制
date: 2020-10-12 19:40:30
tags: [vue, element-ui]
categories: vue
---

## 前言

手上有些项目用的`element-ui`，刚好有空琢磨一下怎么减小打包文件大小和打包速度方面，为了演示实验，用 `vue-cli` 生成初始项目，在这仅对 `element-ui` 主题和组件方面来优化。

```js
vue init webpack vuecli
```

## 完整引入

完整地将 `ui` 和样式引入。

```js
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
```

在页面简单使用 2 个组件，看看效果。

```html
<el-tabs v-model="activeName" @tab-click="handleClick">
  <el-tab-pane label="用户管理" name="first">用户管理</el-tab-pane>
  <el-tab-pane label="配置管理" name="second">配置管理</el-tab-pane>
  <el-tab-pane label="角色管理" name="third">角色管理</el-tab-pane>
  <el-tab-pane label="定时任务补偿" name="fourth">定时任务补偿</el-tab-pane>
</el-tabs>

<el-steps :active="2" align-center>
  <el-step title="步骤1" description="这是一段很长很长很长的描述性文字"></el-step>
  <el-step title="步骤2" description="这是一段很长很长很长的描述性文字"></el-step>
  <el-step title="步骤3" description="这是一段很长很长很长的描述性文字"></el-step>
  <el-step title="步骤4" description="这是一段很长很长很长的描述性文字"></el-step
></el-steps>
```

![组件效果](/gb/element-replace-theme/0.png)

再看一下打包后的资源大小情况`npm run build --report`。

```js
Hash: 40db03677fe41f7369f6
Version: webpack 3.12.0
Time: 20874ms
                                                  Asset       Size  Chunks                    Chunk Names
    static/css/app.cb8131545d15085cee647fe45f1d5561.css     234 kB       1  [emitted]         app
                 static/fonts/element-icons.732389d.ttf      56 kB          [emitted]
               static/js/vendor.a753ce0919c8d42e4488.js     824 kB       0  [emitted]  [big]  vendor
                  static/js/app.8c4c97edfce9c9069ea3.js    3.56 kB       1  [emitted]         app
             static/js/manifest.2ae2e69a05c33dfc65f8.js  857 bytes       2  [emitted]         manifest
                static/fonts/element-icons.535877f.woff    28.2 kB          [emitted]
static/css/app.cb8131545d15085cee647fe45f1d5561.css.map     332 kB          [emitted]
           static/js/vendor.a753ce0919c8d42e4488.js.map    3.26 MB       0  [emitted]         vendor
              static/js/app.8c4c97edfce9c9069ea3.js.map    16.6 kB       1  [emitted]         app
         static/js/manifest.2ae2e69a05c33dfc65f8.js.map    4.97 kB       2  [emitted]         manifest
                                             index.html  506 bytes          [emitted]
```

发现打包后提取公共模块 `static/js/vendor.js` 有 `824kb`

再看一下各个模块占用情况：

![各个模块占用情况](/gb/element-replace-theme/1.png)

发现 `elment-ui.common.js` 占用最大。所有模块资源总共有 `642kb`。怎么才能减小打包后的大小呢？很容易就会想到 `ui` 的引入和样式的引入中，实际我们只使用了三个组件，却整体都被打包了，在这里引入这三个组件即可。

## 按需引入组件样式

新建一个 `element-variables.scss` 文件（为什么是 `SCSS` 文件，后面自定义主题会用到）。

```js
/*icon字体路径变量*/
$--font-path: "~element-ui/lib/theme-chalk/fonts";

/*按需引入用到的组件的scss文件和基础scss文件*/
@import "~element-ui/packages/theme-chalk/src/base.scss";
@import "~element-ui/packages/theme-chalk/src/rate.scss";
@import "~element-ui/packages/theme-chalk/src/button.scss";
@import "~element-ui/packages/theme-chalk/src/row.scss";
```

## 按需引入组件

新建一个 `element-config.js` 文件，将项目用到的 `element` 组件引入。

```js
import { Tabs, TabPane, Steps, Step } from 'element-ui'

export default {
  install(V) {
    V.use(Tabs)
    V.use(TabPane)
    V.use(Steps)
    V.use(Step)
  }
}
```

## 第一次优化后打包分析

将以上 `element-variables.scss` 和 `element-config.js` 引入到 `main.js` 中。

```js
import ElementUI from '@/assets/js/element-config'
import '@/assets/css/element-variables.scss'

Vue.use(ElementUI)
```

貌似上面一切都很顺理成章，打包后大小会减小。

```js
Hash: 2ef987c23a5d612e00e1
Version: webpack 3.12.0
Time: 17430ms
                                                  Asset       Size  Chunks                    Chunk Names
    static/css/app.3c70d8d75c176393318b232a345e3f0f.css    38.8 kB       1  [emitted]         app
                 static/fonts/element-icons.732389d.ttf      56 kB          [emitted]
               static/js/vendor.caa5978bb1eb0a15b097.js     824 kB       0  [emitted]  [big]  vendor
                  static/js/app.5ebb19489355acc3167b.js    3.64 kB       1  [emitted]         app
             static/js/manifest.2ae2e69a05c33dfc65f8.js  857 bytes       2  [emitted]         manifest
                static/fonts/element-icons.535877f.woff    28.2 kB          [emitted]
static/css/app.3c70d8d75c176393318b232a345e3f0f.css.map    53.9 kB          [emitted]
           static/js/vendor.caa5978bb1eb0a15b097.js.map    3.26 MB       0  [emitted]         vendor
              static/js/app.5ebb19489355acc3167b.js.map      17 kB       1  [emitted]         app
         static/js/manifest.2ae2e69a05c33dfc65f8.js.map    4.97 kB       2  [emitted]         manifest
                                             index.html  506 bytes          [emitted]
```

结果可知，`static/js/vendor.js` 还是 `824kb`！

再看各个模块占用情况：

![第一次优化后各个模块占用情况](/gb/element-replace-theme/2.png)

WHAT? 竟然模块都没什么变化，岂不是竹篮打水，事与愿违。

## 再次打包优化尝试

后来查到有人同样遇到这个问题，提出一个[issues#6362](https://github.com/ElemeFE/element/issues/6362#issuecomment-323517538)，原来只引入需要的`element-ui`组件，`webpack`还是把整体的 `UI` 库和样式都打包了，需要一个 `webpack` 的 `babel` 插件 `babel-plugin-component`，这样才能真正按需引入打包。这块其实被写到官方文档更换 [自定义主题](http://element-cn.eleme.io/#/zh-CN/component/custom-theme) 的配置了。

于是 `npm i babel-pugin-componet -D` 安装后，在增加 `.babelrc` 文件插件配置

```js
{
  "presets": [
    ["env", {
      "modules": false,
      "targets": {
        "browsers": ["> 1%", "last 2 versions", "not ie <= 8"]
      }
    }],
    "stage-2"
  ],
  "plugins": [
    "transform-vue-jsx",
    "transform-runtime",
    [
      "component",
      {
        "libraryName": "element-ui",
        "styleLibraryName": "theme-chalk"
      }
    ]
  ]
}
```

页面运行正常，再次打包。

```js
Hash: f182f70cb4ceee63b5d5
Version: webpack 3.12.0
Time: 10912ms
                                                  Asset       Size  Chunks             Chunk Names
    static/css/app.95c94c90ab11fdd4dfb413718f444d0c.css    39.9 kB       1  [emitted]  app
                 static/fonts/element-icons.732389d.ttf      56 kB          [emitted]
               static/js/vendor.befb0a8962f74af4b7e2.js     157 kB       0  [emitted]  vendor
                  static/js/app.5343843cc20a78e80469.js    3.86 kB       1  [emitted]  app
             static/js/manifest.2ae2e69a05c33dfc65f8.js  857 bytes       2  [emitted]  manifest
                static/fonts/element-icons.535877f.woff    28.2 kB          [emitted]
static/css/app.95c94c90ab11fdd4dfb413718f444d0c.css.map    93.5 kB          [emitted]
           static/js/vendor.befb0a8962f74af4b7e2.js.map     776 kB       0  [emitted]  vendor
              static/js/app.5343843cc20a78e80469.js.map    17.1 kB       1  [emitted]  app
         static/js/manifest.2ae2e69a05c33dfc65f8.js.map    4.97 kB       2  [emitted]  manifest
                                             index.html  506 bytes          [emitted]
```

`static/js/vendor.js` 确实变小了，`157kB`。再来看各个模块分析图。

![再次优化后各个模块分析图](/gb/element-replace-theme/3.png)

模块总共 `157.93KB`，少了 5 倍！

## 更换主题-覆盖样式

`element-ui` 的 `theme-chalk` 使用 `SCSS` 编写，如果在自己的项目中也是用 `SCSS`，那么可以直接在项目中改变样式变量，因此可以在前面新建的 `element-variables.scss` 文件用新的主题颜色变量覆盖即可。

```scss
/**
* 覆盖主题色
*/
/*主题颜色变量*/
$--color-primary: #f0f;

/*icon字体路径变量*/
$--font-path: '~element-ui/lib/theme-chalk/fonts';

/* 引入全部默认样式 会引入没用到的组件样式 */
// @import '~element-ui/packages/theme-chalk/src/index';

/* 按需引入用到的组件的scss文件和基础scss文件 */
@import '~element-ui/packages/theme-chalk/src/base.scss';
@import '~element-ui/packages/theme-chalk/src/rate.scss';
@import '~element-ui/packages/theme-chalk/src/button.scss';
@import '~element-ui/packages/theme-chalk/src/row.scss';
```

现在我们的主题就变成了预期效果

![主题改变了](/gb/element-replace-theme/4.png)

可能你已经注意到了，这里推荐的是分别引入用到的组件样式，而不是引入全部默认样式，因为这样会导致引入没有使用到的组件样式。比如当前案例中我们没有使用到 `ColorPicker` 组件，在打包输出的 `css` 文件中确有该组件样式。

![打包样式文件出现没有使用的样式](/gb/element-replace-theme/5.png)

## 更换主题-纯净样式

通过以上优化可以按需的将所用到组件打包，排除没用到的组件，减少包的大小。但是，还是存在一个小瑕疵：一个用到的组件样式会被两次打包，一次是默认的样式，一次是覆盖的样式。

![还存在默认样式](/gb/element-replace-theme/6.png)

出现这个问题是由于我们在两个地方对样式进行引入了，一个是在 `.babelrc` 文件中通过 `babel-plugin-component` 插件按需引入 `element-ui` 组件及其默认样式，一个是在 `element-variables.scss` 文件中覆盖默认样式生成的自定义样式。

所以怎样将二者结合，即`babel-plugin-component` 插件按需引入的组件样式改成用户自定义样式，达成纯净样式目标呢？这里就要用到 `element-ui` 的主题工具进行深层次的主题定制。

### 主题和主题工具安装

首先安装主题工具 `element-theme`，可以全局安装也可安装在项目目录。这里推荐安装在项目录，方便别人 `clone` 项目时能直接安装依赖并启动。

```shell
npm i element-theme -D
```

然后安装白垩主题，可以从 `npm` 安装或者从 `GitHub` 拉取最新代码。

```shell
# 从 npm
npm i element-theme-chalk -D

# 从 GitHub
npm i https://github.com/ElementUI/theme-chalk -D
```

### 主题构建

`element-theme` 支持的构建有 `Node API` 和 `CLI` 方式。

#### 通过 CLI 构建方式

如果全局安装可以在命令行里通过 `et` 调用工具，如果安装在当前目录下，需要通过 `node_modules/.bin/et` 访问到命令。执行 `-i`（`--init`） 初始化变量文件。默认输出到 `element-variables.scss`，当然你可以传参数指定文件输出目录。如果你想启用 watch 模式，实时编译主题，增加 `-w`（`--watch`） 参数；如果你在初始化时指定了自定义变量文件，则需要增加 `-c`（`--config`） 参数，并带上你的变量文件名。默认情况下编译的主题目录是放在 `./theme` 下，你可以通过 `-o`（`--out`） 参数指定打包目录。

```shell
# 初始化变量文件
et --init [file path]

# 实时编译
et --watch [--config variable file path] [--out theme path]

# 编译
et [--config variable file path] [--out theme path] [--minimize]
```

#### 通过 Node API 构建方式

引入 `element-theme` 通过 `Node API` 形式构建

```js
var et = require('element-theme')

// 实时编译模式
et.watch({
  config: 'variables/path',
  out: 'output/path'
})

// 编译
et.run({
  config: 'variables/path', // 配置参数文件路径 默认`./element-variables.css`
  out: 'output/path', // 输出目录 默认`./theme`
  minimize: false, // 压缩文件
  browsers: ['ie > 9', 'last 2 versions'], // 浏览器支持
  components: ['button', 'input'] // 选定组件构建自定义主题
})
```

#### 应用 Node API 构建自定义主题

在这里，为了让主题的构建更加直观和被项目共享，采用 `Node API` 方式构建，在项目根目录下新建 `theme.js`文件。

```js
const et = require('element-theme')
// 第一步生成样式变量文件
// et.init('./src/theme.scss')
// 第二步根据实际需要修改该文件
// ...
// 第三步根据该变量文件编译出自定义的主题样式文件
et.run({
  config: './src/theme.scss',
  out: './src/theme'
})
```

在 `package.json` 中增加 `scripts` 指令

```json
{
  "scripts": {
    "theme": "node theme.js"
  }
}
```

这样就可以通过 `npm run theme` 指令来编译主题了。编译过程：

- 运行该指令初始化主题变量文件 `theme.scss`。
- 根据实际需要修改这个文件里主题样式。
- 再运行该指令编译输出自定义的主题样式文件放在 `theme` 目录下。

这样就完成了所有自定义主题样式的构建。要想将这些自定义样式随着组件按需引入，需要将 `.babelrc` 文件中按需引入插件 `babel-plugin-component` 参数 `styleLibraryName` 从原本的 `element-ui` 默认样式目录变成现在自定义目录 `~src/theme`。

```json
"plugins": [
    "transform-vue-jsx",
    "transform-runtime",
    [
      "component",
      {
        "libraryName": "element-ui",
        "styleLibraryName": "~src/theme"
      }
    ]
  ]
```

一切准备就绪，项目打包，打包后的 `css` 文件中只有唯一自定义样式，没有了默认样式，也不存在没被引入组件的样式，实现了我们预期的纯净的自定义样式！

![不存在默认样式](/gb/element-replace-theme/7.png)

```js
Hash: c442bcf9d471bddfdccf
Version: webpack 3.12.0
Time: 10174ms
                                                  Asset       Size  Chunks             Chunk Names
    static/css/app.52d411d0c1b344066ec1f456355aa7b9.css    38.8 kB       1  [emitted]  app
                static/fonts/element-icons.535877f.woff    28.2 kB          [emitted]
               static/js/vendor.befb0a8962f74af4b7e2.js     157 kB       0  [emitted]  vendor
                  static/js/app.43c09c1f16b24d371e07.js    3.82 kB       1  [emitted]  app
             static/js/manifest.2ae2e69a05c33dfc65f8.js  857 bytes       2  [emitted]  manifest
                 static/fonts/element-icons.732389d.ttf      56 kB          [emitted]
static/css/app.52d411d0c1b344066ec1f456355aa7b9.css.map    81.3 kB          [emitted]
           static/js/vendor.befb0a8962f74af4b7e2.js.map     776 kB       0  [emitted]  vendor
              static/js/app.43c09c1f16b24d371e07.js.map    17.1 kB       1  [emitted]  app
         static/js/manifest.2ae2e69a05c33dfc65f8.js.map    4.97 kB       2  [emitted]  manifest
                                             index.html  506 bytes          [emitted]
```

由于样式是纯净的，`css` 文件大小从原来完全引入的 `234KB` 变成 `38.8KB`，进一步减小了打包大小。

## 总结

通过以上实验分析我们可以得知，`element-ui` 要想实现按需引入和纯净的主题样式：

- 首先通过 `babel-plugin-component` 插件进行按需引入。
- 再用 `element-theme` 工具生成样变量文件。
- 然后根据项目需求修改自定义样式，依据该文件构建生成所有样式。
- 最后将按需引入样式 `styleLibraryName` 指向自定义样式目录。

如果对样式提取要求不高，可直接采取变量覆盖形式（同时存在默认样式）。
还有不清楚可以戳[这里](https://github.com/wuwhs/element-replace-theme)查看案例源码，赠人 star，手有余香。

完~ps：个人见解有限，欢迎指正。
