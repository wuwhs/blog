---
title: JS中图片压缩的一般方法
date: 2020-06-07 23:24:10
tags: [javacript]
---

Blob 对象表示一个不可变、原始数据的类文件对象。
[blob](https://developer.mozilla.org/zh-CN/docs/Web/API/Blob)

HTMLCanvasElement.toBlob() 方法创造Blob对象，用以展示canvas上的图片
[toBlob](https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLCanvasElement/toBlob)

HTMLCanvasElement.toDataURL() 方法返回一个包含图片展示的 data URI
[toDataURL](https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLCanvasElement/toDataURL)

## 前言

公司的移动端业务需要在用户上传图片是由前端压缩图片大小，再上传到服务器，这样可以减少移动端上行流量，优化用户体验。

大多时候我们需要将一个 `File` 对象压缩之后再变为 `File` 对象传入到远程图片服务器；有时候我们也需要将一个 `base64` 字符串压缩之后再变为 `base64` 字符串传入到远程数据库；有时候后它还有可能是一块`canvas` 画布，或者是一个 `Image` 对象，或者直接就是一个图片的`url` 地址，我们需要将它们压缩上传到远程。一般的，它们有如下转化关系：

![js-image-compress-flow-chat](/gb/js-image-compress/js-image-compress-flow-chat.png)

## 实现方案

### urltoImage(url,fn)

`urltoImage(url,fn)` 会通过一个 `url` 加载所需要的图片对象，其中 `url` 参数传入图片的 `url` , `fn` 为回调方法,包含一个 `Image` 对象的参数，代码如下：

```js
function urltoImage(url,fn){
  var img = new Image();
  img.src = url;
  img.onload = function(){
    fn(img);
  }
};
```

### imagetoCanvas(image)

`imagetoCanvas(image)` 会将一个 `Image` 对象转变为一个 `Canvas` 类型对象，其中 `image` 参数传入一个 `Image` 对象，代码如下：

```js
function imagetoCanvas(image){
  var cvs = document.createElement("canvas");
  var ctx = cvs.getContext('2d');
  cvs.width = image.width;
  cvs.height = image.height;
  ctx.drawImage(image, 0, 0, cvs.width, cvs.height);
  return cvs;
};
```

### canvasResizetoFile(canvas,quality,fn)

`canvasResizetoFile(canvas,quality,fn)` 会将一个 `Canvas` 对象压缩转变为一个 `Blob` 类型对象；其中 `canvas` 参数传入一个 `Canvas` 对象; `quality` 参数传入一个 `0-1` 的 `number` 类型，表示图片压缩质量; `fn` 为回调方法，包含一个 `Blob` 对象的参数;代码如下：

```js
function canvasResizetoFile(canvas,quality,fn){
  canvas.toBlob(function(blob) {
    fn(blob);
  },'image/jpeg',quality);
};
```

### canvasResizetoDataURL(canvas,quality)

`canvasResizetoDataURL(canvas,quality)` 会将一个 `Canvas` 对象压缩转变为一个 `dataURL` 字符串,其中 `canvas` 参数传入一个 `Canvas` 对象; `quality` 参数传入一个 `0-1` 的`number` 类型，表示图片压缩质量;代码如下：

```js
methods.canvasResizetoDataURL = function(canvas,quality){
  return canvas.toDataURL('image/jpeg',quality);
};
```

### filetoDataURL(file,fn)

`filetoDataURL(file,fn)` 会将 `File（Blob` 类型文件转变为 `dataURL` 字符串,其中 `file` 参数传入一个 `File（Blob）`类型文件; `fn` 为回调方法，包含一个 `dataURL` 字符串的参数;代码如下：

```js
function filetoDataURL(file,fn){
    var reader = new FileReader();
    reader.onloadend = function(e){
        fn(e.target.result);
    };
    reader.readAsDataURL(file);
};
```

### dataURLtoImage(dataurl,fn)

`dataURLtoImage(dataurl,fn)` 会将一串 `dataURL` 字符串转变为 `Image` 类型文件,其中 dataurl 参数传入一个 dataURL 字符串, fn 为回调方法，包含一个 Image 类型文件的参数，代码如下：

```js
function dataURLtoImage(dataurl,fn){
    var img = new Image();
    img.onload = function() {
        fn(img);
    };
    img.src = dataurl;
};
```

### dataURLtoFile(dataurl)

dataURLtoFile(dataurl) 会将一串 dataURL 字符串转变为 Blob 类型对象，其中 dataurl 参数传入一个 dataURL 字符串,代码如下：

```js
function dataURLtoFile(dataurl) {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], {type:mime});
};
```

## 封装图片压缩

对于常用的将一个 File 对象压缩之后再变为 File 对象,我们可以将上面的方法再封装一下，参考如下代码：

```js
function fileResizetoFile(file,quality,fn){
    filetoDataURL (file,function(dataurl){
        dataURLtoImage(dataurl,function(image){
            canvasResizetoFile(imagetoCanvas(image),quality,fn);
        })
    })
}
```

其中， file 参数传入一个 File （Blob）类型文件； quality 参数传入一个 0-1 的 number 类型，表示图片压缩质量； fn 为回调方法，包含一个 Blob 类型文件的参数。

它使用起来就像下面这样：

```js
var file = document.getElementById('demo').files[0];
fileResizetoFile(file,0.6,function(res){
    console.log(res);
    //拿到res，做出你要上传的操作；
})
```

这样的话，图片压缩上传就能轻松地搞定了。

## 对象 URL

对象 URL 也被成为 blob URL，指的是引用保存在 File 和 Blob 中数据的 URL。使用对象 URL 的好处是可以不必把文件内容读取到 JavaScript 中 而直接使用文件内容。为此，只要在需要文件内容的地方提供对象 URL 即可。要创建对象 URL，可以使用 window.URL.createObjectURL() 方法，并传入 File 或 Blob 对象。

```js
function createObjectURL (blob) {
  if (window.URL) {
    return window.URL.createObjectURL(blob);
  } else if (window.webkitURL) {
    return window.webkitURL.createObjectURL(blob);
  } else {
    return null;
  }
}
```

这个函数的返回值是一个字符串，指向一块内存的地址。因为这个字符串是 URL，所以在 DOM 中也能使用。

```js
function onChange (ev) {
  const { target } = ev;
  const file = target.files[0];
  const url = createObjectURL(file);
  document.body.innerHTML = `<img src="${url} />"`;
}
```

如果不再需要相应数据，最好释放它占用的内容。但只要有代码在引用对象 URL，内存就不会释放。要手工释放内存，可以把对象 URL 传给 window.revokeObjectURL()。