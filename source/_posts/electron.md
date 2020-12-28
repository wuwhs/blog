---
title: electron
date: 2020-12-25 13:48:32
tags: [electron]
---

### `electron-builder` 打包报错

在没有翻墙环境下，有些安装包无法通过 `npm` 直接下载，这样会造成打包中断，无法成功。一般的，会有如下情况。

#### 获取不到 electron-vxxx-xx-xx.zip

首次通过 `electron-builder` 打包，会报以下错误，由于网络原因获取不到 `electron` 安装包。

```shell
• packaging       platform=win32 arch=x64 electron=11.1.1 appOutDir=dist\win-unpacked
  ⨯ Get "https://github-production-release-asset-2e65be.s3.amazonaws.com/9384267/4bb69b00-4382-11eb-89a3-0478a8f71cb3?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAIWNJYAX4CSVEH53A%2F20201225%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20201225T033206Z&X-Amz-Expires=300&X-Amz-Signature=39ef3cf5665a8fd42f61b5e74aac8ab28d9be97aacb190ddbe10c56918b6caaf&X-Amz-SignedHeaders=host&actor_id=0&key_id=0&repo_id=9384267&response-content-disposition=attachment%3B%20filename%3Delectron-v11.1.1-win32-x64.zip&response-content-type=application%2Foctet-stream": read tcp 100.119.114.140:50153->52.217.64.100:443: wsarecv: An
existing connection was forcibly closed by the remote host.
```

**解决方案**
淘宝[electron镜像](https://npm.taobao.org/mirrors/electron)，选择报错提示需要安装的版本下载即可。

下载完成后，将该安装包（zip）放到一下目录下：

```shell
macOS: ~/Library/Caches/electron
Linux: ~/.cache/electron
windows: %LOCALAPPDATA%\electron\cache
```

### 获取不到 winCodeSign-x.x.x.7z

继续打包会报以下错误，由于网络原因获取不到 `winCodeSign` 安装包。

```shell
  ⨯ Get "https://github-production-release-asset-2e65be.s3.amazonaws.com/65527128/f73f2200-5d53-11ea-8264-ddd345f11ee4?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAIWNJYAX4CSVEH53A%2F20201226%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20201226T064126Z&X-Amz-Expires=300&X-Amz-Signature=5dae4023a11f1b575dd5df18ec8f4e2d5664f3214d41365665d6393f29d5716a&X-Amz-SignedHeaders=host&actor_id=0&key_id=0&repo_id=65527128&response-content-disposition=attachment%3B%20filename%3DwinCodeSign-2.6.0.7z&response-content-type=application%2Foctet-stream": read tcp 100.119.114.140:58909->52.217.18.220:443: wsarecv: An existing connection was forcibly closed by the remote host.
```

**解决方案**
`github` 上找到 `electron` 打包二进制文件 [releases](https://github.com/electron-userland/electron-builder-binaries/releases)，选择报错需要的版本的 `winCodeSign` 安装包下载，下载解压后，整个文件夹（带版本号相关信息）放到以下目录下

```js
macOS ~/Library/Caches/electron-builder/winCodeSign
linux ~/.cache/electron-builder/winCodeSign
windows %LOCALAPPDATA%\electron-builder\cache\winCodeSign
```

### 获取不到 nsis-x.x.x.7z

继续打包会报以下错误，由于网络原因获取不到 `nsis` 安装包。

```shell
  ⨯ Get "https://github-production-release-asset-2e65be.s3.amazonaws.com/65527128/10518a80-10f6-11ea-8d2f-403bab81b4cd?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAIWNJYAX4CSVEH53A%2F20201226%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20201226T080004Z&X-Amz-Expires=300&X-Amz-Signature=041ed954e78b77440ddb400f0ce9bca3e20cb45dc18c42f8e40029ae11f9c564&X-Amz-SignedHeaders=host&actor_id=0&key_id=0&repo_id=65527128&response-content-disposition=attachment%3B%20filename%3Dnsis-3.0.4.1.7z&response-content-type=application%2Foctet-stream": read tcp 100.119.114.140:56915->52.217.17.36:443: wsarecv: An existing connection was forcibly closed by the remote host.
```

**解决方案**
`github` 上找到 `electron` 打包二进制文件 [releases](https://github.com/electron-userland/electron-builder-binaries/releases)，选择报错需要的版本的 `nsis` 安装包下载，下载解压后，整个文件夹（带版本号相关信息）放到以下目录下

```js
macOS ~/Library/Caches/electron-builder/nsis
linux ~/.cache/electron-builder/nsis
windows %LOCALAPPDATA%\electron-builder\cache\nsis
```

### 获取不到 nsis-resources-x.x.x.7z

继续打包会报以下错误，由于网络原因获取不到 `nsis-resources` 安装包。

```shell
  ⨯ Get "https://github-production-release-asset-2e65be.s3.amazonaws.com/65527128/64ac4a00-a87a-11e9-901b-f221c4fd0776?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAIWNJYAX4CSVEH53A%2F20201226%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20201226T070558Z&X-Amz-Expires=300&X-Amz-Signature=c970d23f54d01a83f3bcfab03a56d7ed6b18e9cd8d5ecd46bd8dc66cd47ae077&X-Amz-SignedHeaders=host&actor_id=0&key_id=0&repo_id=65527128&response-content-disposition=attachment%3B%20filename%3Dnsis-resources-3.4.1.7z&response-content-type=application%2Foctet-stream": read tcp 100.119.114.140:63484->52.216.92.123:443: wsarecv: An existing connection was forcibly closed by the remote host.
```

**解决方案**
`github` 上找到 `electron` 打包二进制文件 [releases](https://github.com/electron-userland/electron-builder-binaries/releases)，选择报错需要的版本的 `nsis-resources` 安装包下载，下载解压后，整个文件夹（带版本号相关信息）放到以下目录下

```js
macOS ~/Library/Caches/electron-builder/nsis
linux ~/.cache/electron-builder/nsis
windows %LOCALAPPDATA%\electron-builder\cache\nsis
```
