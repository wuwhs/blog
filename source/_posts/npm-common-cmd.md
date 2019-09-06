---
title: npm-common-cmd
date: 2019-08-26 11:09:56
tags: [npm]
---

## npm 常用命令

### 安装命令

```js
// 全局安装
npm install 模块名 -g

// 本地安装
npm install 模块名

// 一次安装多个模块
npm install 模块1 模块2 模块3

// 安装开发时依赖包
npm install 模块名 --save-dev

// 安装运行时依赖包
npm install 模块名 --save
```

### 查看安装目录

```js
// 查看项目中模块所在目录
npm root

// 查看全局安装模块所在目录
npm root -g
```

### 查看 npm 所有命令

```js
npm help
```

### 查看某个包的依赖包

```js
npm view 模块名 dependencies
```

### 查看包的源文件地址

```js
npm view 模块名 repository.url
```

### 查看当前模块依赖的node最低版本号

```js
npm view 模块名 engines
```

### 查看模块当前版本号

```js
// 该模块在远程库的版本号，并不是当前项目中所依赖的版本号
npm view 模块名 version

// 查看当前项目中应用的某个模块版本号
npm list 模块名 version
```

### 查看模块的历史版本和当前版本

```js
npm view 模块名 versions
```

### 查看一个模块的所有信息

```js
npm view 模块名
```

### 查看 npm 使用的所有文件夹

```js
npm help folders
```

### 更改包内容后进行重建

```js
npm rebuild 模块名
```

### 检查包是否已经过时

```js
npm outdated
```

### 更新 node 模块

```js
npm update 模块名

// 更新到指定版本
npm update 模块名 @版本号

// 更新到最新版本
npm install 模块名@latest

// 如果当前的版本号为2.5.1，是没办法进行npm update 模块名 @2.3.1 将模块版本号变为2.3.1的
// 当然，你可以先uninstall，然后进行install @2.3.1

```

### 卸载 node 模块

```js
npm uninstall 模块名
```

### 访问 package.json 说明文档

```js
npm help json
```

### 发布一个 npm 包之前，检查某个包是否已经存在

```js
npm search 模块名
```

### 引导创建一个 package.json 文件

```js
npm init

// 不用一步步输入信息
npm init --yes

// 或
npm init -y
```

### 清除 npm 缓存

```js
npm cache clean
```

### 查看 npm 的版本

```js
npm -v
```

###
