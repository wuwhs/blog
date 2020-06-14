---
title: JS中图片压缩，这一篇就够了
date: 2020-06-07 23:24:10
tags: [javacript]
---

HTMLCanvasElement.toBlob() 方法创造Blob对象，用以展示canvas上的图片；这个图片文件可以被缓存或保存到本地，由用户代理端自行决定。如不特别指明，图片的类型默认为 image/png，分辨率为96dpi。第三个参数用于针对image/jpeg格式的图片进行输出图片的质量设置。
[toBlob]([HTMLCanvasElement.toBlob()](https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLCanvasElement/toBlob))

Blob 对象表示一个不可变、原始数据的类文件对象。
[blob](https://developer.mozilla.org/zh-CN/docs/Web/API/Blob)

HTMLCanvasElement.toBlob() 方法创造Blob对象，用以展示canvas上的图片
[toBlob](https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLCanvasElement/toBlob)

HTMLCanvasElement.toDataURL() 方法返回一个包含图片展示的 data URI
[toDataURL](https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLCanvasElement/toDataURL)

## 前言

公司的移动端业务需要在用户上传图片是由前端压缩图片大小，再上传到服务器，这样可以减少移动端上行流量，减少用户上传等待时长，优化用户体验。

本文将试图解决如下问题：

- 弄清 `Image` 对象、`data URL`、`Canvas` 和 `File（Blob）`之间的转化关系；
- 图片压缩关键技巧；
- 超大图片压缩黑屏问题。

## 转化关系

在实际应用中有可能使用的情境：大多时候我们直接读取用户上传的 `File` 对象，读写到画布（`canvas`）上，利用 `Canvas` 的 `API` 进行压缩，完成压缩之后再转成 `File（Blob）` 对象，上传到远程图片服务器；不妨有时候我们也需要将一个 `base64` 字符串压缩之后再变为 `base64` 字符串传入到远程数据库或者再转成  `File（Blob）` 对象。一般的，它们有如下转化关系：

![js-image-compress-flow-chat](/gb/js-image-compress/js-image-compress.jpg)

## 具体实现

下面将按照转化关系图中的转化方法一一实现。

### inputFile2DataUrl(file, fn)

将用户上传的本地图片直接转化 [`data URL`](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/data_URIs) 字符串形式。可以使用 `File` 系统中的 `FileReader` 构造函数实例化读取文件内容并转化成 `base64` 字符串。

```js
function inputFile2DataUrl(file, fn) {
  var reader = new FileReader();
  reader.onload = function () {
    fn(reader.result);
  };
  reader.eadAsDataURL(file);
}
```

`Data URL` 由四个部分组成：前缀（`data:`）、指示数据类型的 `MIME` 类型、如果非文本则为可选的 `base64` 标记、数据本身：

> data:[<mediatype>][;base64],<data>

比如一张 `png` 格式图片，转化为 `base64` 字符串形式：`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAYAAABccqhmAAAgAElEQVR4XuxdB5g`。

### inputFile2Image(file, fn)

若想将用户通过本地上传的图片放入缓存并 `img` 标签显示出来，除了可以利用上面转化成的

### url2Image(url, fn)

通过图片链接（`url`）获取图片 `Image` 对象，由于图片加载是异步的，因此放到回调函数 `fn` 回传获取到的 `Image` 对象。

```js
function urltoImage(url, fn) {
  var img = new Image();
  img.src = url;
  img.onload = function() {
    fn(img);
  }
}
```

### image2Canvas(image)

利用 [`drawImage()`](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/drawImage) 方法将 `Image` 对象转化成 `Canvas` 对象。

`drawImage` 有三种语法形式：

> void ctx.drawImage(image, dx, dy);
  void ctx.drawImage(image, dx, dy, dWidth, dHeight);
  void ctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);

参数：

- `image` 绘制到上下文的元素；
- `sx` 绘制选择框左上角以 `Image` 为基准 `X` 轴坐标；
- `sy` 绘制选择框左上角以 `Image` 为基准 `Y` 轴坐标；
- `sWidth` 绘制选择框宽度；
- `sHeight` 绘制选择框宽度；
- `dx` `Image` 的左上角在目标 `canvas` 上 `X` 轴坐标；
- `dy` `Image` 的左上角在目标 `canvas` 上 `Y` 轴坐标；
- `dWidth` `Image` 在目标 `canvas` 上绘制的宽度；
- `dHeight` `Image` 在目标 `canvas` 上绘制的高度；

![canvas-draw-image](/gb/js-image-compress/canvas-draw-image.jpg)

```js
function imagetoCanvas(image) {
  var canvas = document.createElement(‘canvas’);
  var ctx = canvas.getContext('2d');
  canvas.width = image.naturalWidth;
  canvas.height = image.naturalHeight;
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
  return canvas;
}
```

### canvas2DataUrl(canvas, quality)

`toDataURL(type, encoderOptions)` 方法返回一个包含图片展示的 [`data URL`](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/data_URIs) 。

参数：

- `type` 图片格式，默认为 `image/png`。
- `encoderOptions` **在指定图片格式为 `image/jpeg` 或 `image/webp` 的情况下**，可以从 `0` 到 `1` 的区间内选择图片的质量。如果超出取值范围，将会使用默认值 `0.92`，其他参数会被忽略。

```js
function canvas2DataUrl(canvas, quality) {
  return canvas.toDataURL('image/jpeg', quality);
}
```


### filetoDataURL(file, fn)

`FileReader` 对象允许 `Web` 应用程序异步读取存储在计算机上的文件（或原始数据缓冲区）的内容，使用 [`File`](https://developer.mozilla.org/zh-CN/docs/Web/API/File) 或 [`Blob`](https://developer.mozilla.org/zh-CN/docs/Web/API/Blob) 对象指定要读取的文件或数据。`FileReader` 有一个 `readAsText()` 方法读取文件内容，完成后，`result` 属性将包含一个 `data URL` 格式的 `base64` 字符串以表示读取文件内容。

```js
function file2DataURL(file, fn){
  var reader = new FileReader();
  reader.onloadend = function(e){
    fn(e.target.result);
  };
  reader.readAsDataURL(file);
}
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

### canvas2File(canvas, quality, fn)

[`toBlob(callback, [type], [encoderOptions])`](https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLCanvasElement/toBlob) 方法创造 `Blob` 对象，用以展示 `canvas` 上的图片；这个图片文件可以被缓存或保存到本地，由用户代理端自行决定。第二个参数指定图片格式，如不特别指明，图片的类型默认为 `image/png`，分辨率为 `96dpi`。第三个参数用于针对`image/jpeg` 格式的图片进行输出图片的质量设置。

```js
function canvas2File(canvas, quality, fn){
  canvas.toBlob(function(blob) {
    fn(blob);
  }, 'image/jpeg', quality);
}
```

为兼容低版本浏览器，作为 `toBlob` 的 `polyfill` 方案，可以先通过 [`toDataURL`](https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLCanvasElement/toDataURL) 将 `canvas` 转化成 `base64` 字符串，再将 `base64` 字符串解码出来，最后拼接生成 [`Blob`](https://developer.mozilla.org/zh-CN/docs/Web/API/Blob) 对象。

```js
if (!HTMLCanvasElement.prototype.toBlob) {
 Object.defineProperty(HTMLCanvasElement.prototype, 'toBlob', {
  value: function (callback, type, quality) {
    var binStr = atob( this.toDataURL(type, quality).split(',')[1] );
    var len = binStr.length;
    var arr = new Uint8Array(len);

    for (var i=0; i<len; i++ ) {
     arr[i] = binStr.charCodeAt(i);
    }

    callback( new Blob( [arr], {type: type || 'image/png'} ) );
  }
 });
}
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