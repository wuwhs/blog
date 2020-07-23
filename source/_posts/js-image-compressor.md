---
title: 了解JS压缩图片，这一篇就够了
date: 2020-06-07 23:24:10
tags: [javacript]
---

## 前言

公司的移动端业务需要在用户上传图片是由前端压缩图片大小，再上传到服务器，这样可以减少移动端上行流量，减少用户上传等待时长，优化用户体验。

`JavaScript` 操作压缩图片原理不难，已有成熟 `API`，然而在实际输出压缩后结果却总有意外，有些图片竟会越压缩越大，加之终端（手机）类型众多，有些手机压缩图片甚至变黑。

![压缩小龙女，哈哈哈😂](/gb/js-image-compressor/compress-xiaolongnv.png)

所以本文将试图解决如下问题：

- 弄清 `Image` 对象、`data URL`、`Canvas` 和 `File（Blob）`之间的转化关系；
- 图片压缩关键技巧；
- 超大图片压缩黑屏问题。

## 转化关系

在实际应用中有可能使用的情境：大多时候我们直接读取用户上传的 `File` 对象，读写到画布（`canvas`）上，利用 `Canvas` 的 `API` 进行压缩，完成压缩之后再转成 `File（Blob）` 对象，上传到远程图片服务器；不妨有时候我们也需要将一个 `base64` 字符串压缩之后再变为 `base64` 字符串传入到远程数据库或者再转成  `File（Blob）` 对象。一般的，它们有如下转化关系：

![js-image-compressor-flow-chat](/gb/js-image-compressor/js-image-compressor.jpg)

## 具体实现

下面将按照转化关系图中的转化方法一一实现。

### file2DataUrl(file, callback)

用户通过页面标签 `<input type="file" />` 上传的本地图片直接转化 [`data URL`](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/data_URIs) 字符串形式。可以使用 [`FileReader`](https://developer.mozilla.org/zh-CN/docs/Web/API/FileReader) 文件读取构造函数。`FileReader` 对象允许 `Web` 应用程序异步读取存储在计算机上的文件（或原始数据缓冲区）的内容，使用 [`File`](https://developer.mozilla.org/zh-CN/docs/Web/API/File) 或 [`Blob`](https://developer.mozilla.org/zh-CN/docs/Web/API/Blob) 对象指定要读取的文件或数据。该实例方法 `readAsDataURL` 读取文件内容并转化成 `base64` 字符串。在读取完后，在实例属性 `result` 上可获取文件内容。

```js
function file2DataUrl(file, callback) {
  var reader = new FileReader();
  reader.onload = function () {
    callback(reader.result);
  };
  reader.readAsDataURL(file);
}
```

`Data URL` 由四个部分组成：前缀（`data:`）、指示数据类型的 `MIME` 类型、如果非文本则为可选的 `base64` 标记、数据本身：

> data:[<mediatype>][;base64],<data>

比如一张 `png` 格式图片，转化为 `base64` 字符串形式：`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAYAAABccqhmAAAgAElEQVR4XuxdB5g`。

### file2Image(file, callback)

若想将用户通过本地上传的图片放入缓存并 `img` 标签显示出来，除了可以利用以上方法转化成的 `base64` 字符串作为图片 `src`，还可以直接用 `URL` 对象，引用保存在 `File` 和 `Blob` 中数据的 `URL`。使用对象 `URL` 的好处是可以不必把文件内容读取到 `JavaScript` 中 而直接使用文件内容。为此，只要在需要文件内容的地方提供对象 `URL` 即可。

```js
function file2Image(file, callback) {
  var image = new Image();
  var URL = window.webkitURL || window.URL;
  if (URL) {
    var url = URL.createObjectURL(file);
    image.onload = function() {
      callback(image);
      window.revokeObjectURL(url);
    };
    image.src = url;
  } else {
    inputFile2DataUrl(file, function(dataUrl) {
      image.onload = function() {
        callback(image);
      }
      image.src = dataUrl;
    });
  }
}
```

注意：要创建对象 `URL`，可以使用 `window.URL.createObjectURL()` 方法，并传入 `File` 或 `Blob` 对象。如果不再需要相应数据，最好释放它占用的内容。但只要有代码在引用对象 `URL`，内存就不会释放。要手工释放内存，可以把对象 `URL` 传给 `window.revokeObjectURL()`。

### url2Image(url, callback)

通过图片链接（`url`）获取图片 `Image` 对象，由于图片加载是异步的，因此放到回调函数 `callback` 回传获取到的 `Image` 对象。

```js
function url2Image(url, callback) {
  var image = new Image();
  image.src = url;
  image.onload = function() {
    callback(image);
  }
}
```

### image2Canvas(image)

利用 [`drawImage()`](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/drawImage) 方法将 `Image` 对象绘画在 `Canvas` 对象上。

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

![canvas-draw-image](/gb/js-image-compressor/canvas-draw-image.jpg)

```js
function image2Canvas(image) {
  var canvas = document.createElement('canvas');
  var ctx = canvas.getContext('2d');
  canvas.width = image.naturalWidth;
  canvas.height = image.naturalHeight;
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
  return canvas;
}
```

### canvas2DataUrl(canvas, quality, type)

`HTMLCanvasElement` 对象有 `toDataURL(type, encoderOptions)` 方法，返回一个包含图片展示的 [`data URL`](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/data_URIs) 。同时可以指定输出格式和质量。

参数分别为：

- `type` 图片格式，默认为 `image/png`。
- `encoderOptions` **在指定图片格式为 `image/jpeg` 或 `image/webp` 的情况下**，可以从 `0` 到 `1` 的区间内选择图片的质量。如果超出取值范围，将会使用默认值 `0.92`，其他参数会被忽略。

```js
function canvas2DataUrl(canvas, quality, type) {
  return canvas.toDataURL(type || 'image/jpeg', quality || 0.8);
}
```

### dataUrl2Image(dataUrl, callback)

图片链接也可以是 `base64` 字符串，直接赋值给 `Image` 对象 `src` 即可。

```js
function dataUrl2Image(dataUrl, callback) {
  var image = new Image();
  image.onload = function() {
    callback(image);
  };
  image.src = dataUrl;
}
```

### dataUrl2Blob(dataUrl, type)

将 `data URL` 字符串转化为 [`Blob`](https://developer.mozilla.org/zh-CN/docs/Web/API/Blob) 对象。主要思路是：先将 `data URL` 数据（`data`） 部分提取出来，用 `atob` 对经过 `base64` 编码的字符串进行解码，再转化成 `Unicode` 编码，存储在`Uint8Array`（8位无符号整型数组，每个元素是一个字节） 类型数组，最终转化成 `Blob` 对象。

```js
function dataUrl2Blob(dataUrl, type) {
  var data = dataUrl.split(',')[1];
  var mimePattern = /^data:(.*?)(;base64)?,/;
  var mime = dataUrl.match(mimePattern)[1];
  var binStr = atob(data);
  var arr = new Uint8Array(len);

  for (var i = 0; i < len; i++) {
    arr[i] = binStr.charCodeAt(i);
  }
  return new Blob([arr], {type: type || mime});
}
```

### canvas2Blob(canvas, callback, quality, type)

`HTMLCanvasElement` 有 [`toBlob(callback, [type], [encoderOptions])`](https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLCanvasElement/toBlob) 方法创造 `Blob` 对象，用以展示 `canvas` 上的图片；这个图片文件可以被缓存或保存到本地，由用户代理端自行决定。第二个参数指定图片格式，如不特别指明，图片的类型默认为 `image/png`，分辨率为 `96dpi`。第三个参数用于针对`image/jpeg` 格式的图片进行输出图片的质量设置。

```js
function canvas2Blob(canvas, callback, quality, type){
  canvas.toBlob(function(blob) {
    callback(blob);
  }, type || 'image/jpeg', quality || 0.8);
}
```

为兼容低版本浏览器，作为 `toBlob` 的 `polyfill` 方案，可以用上面 `data URL` 生成 `Blob` 方法 `dataUrl2Blob` 作为`HTMLCanvasElement` 原型方法。

```js
if (!HTMLCanvasElement.prototype.toBlob) {
 Object.defineProperty(HTMLCanvasElement.prototype, 'toBlob', {
  value: function (callback, type, quality) {
    let dataUrl = this.toDataURL(type, quality);
    callback(dataUrl2Blob(dataUrl));
  }
 });
}
```

### blob2DataUrl(blob, callback)

将 `Blob` 对象转化成 `data URL` 数据，由于 `FileReader` 的实例 `readAsDataURL` 方法不仅支持读取文件，还支持读取 `Blob` 对象数据，这里复用上面 `file2DataUrl` 方法即可：

```js
function blob2DataUrl(blob, callback) {
  file2DataUrl(blob, callback);
}
```

### blob2Image(blob, callback)

将 `Blob` 对象转化成 `Image` 对象，可通过 `URL` 对象引用文件，也支持引用 `Blob` 这样的类文件对象，同样，这里复用上面 `file2Image` 方法即可：

```js
function blob2Image(blob, callback) {
  file2Image(blob, callback);
}
```

### upload(url, file, callback)

上传图片（已压缩），可以使用 `FormData` 传入文件对象，通过 `XHR` 直接把文件上传到服务器。

```js
function upload(url, file, callback) {
  var xhr = new XMLHttpRequest();
  var fd = new FormData();
  fd.append('file', file);
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      // 上传成功
      callback && callback(xhr.responseText);
    } else {
      throw new Error(xhr);
    }
  }
  xhr.open('POST', url, true);
  xhr.send(fd);
}
```

也可以使用 `FileReader` 读取文件内容，转化成二进制上传

```js
function upload(url, file) {
  var reader = new FileReader();
  var xhr = new XMLHttpRequest();

  xhr.open('POST', url, true);
  xhr.overrideMimeType('text/plain; charset=x-user-defined-binary');

  reader.onload = function() {
    xhr.send(reader.result);
  };
  reader.readAsBinaryString(file);
}
```

## 实现简易图片压缩

在熟悉以上各种图片转化方法的具体实现，将它们封装在一个公用对象 `util` 里，再结合压缩转化流程图，这里我们可以简单实现图片压缩了：
首先将上传图片转化成 `Image` 对象，再将写入到 `Canvas` 画布，最后由 `Canvas` 对象 `API` 对图片的大小和尺寸输出调整，实现压缩目的。

```js
/**
 * 简易图片压缩方法
 * @param {Object} options 相关参数
 */
(function (win) {
  var REGEXP_IMAGE_TYPE = /^image\//;
  var util = {};
  var defaultOptions = {
    file: null,
    quality: 0.8
  };
  var isFunc = function (fn) { return typeof fn === 'function'; };
  var isImageType = function (value) { return REGEXP_IMAGE_TYPE.test(value); };

  /**
   * 简易图片压缩构造函数
   * @param {Object} options 相关参数
   */
  function SimpleImageCompressor(options) {
    options = Object.assign({}, defaultOptions, options);
    this.options = options;
    this.file = options.file;
    this.init();
  }

  var _proto = SimpleImageCompressor.prototype;
  win.SimpleImageCompressor = SimpleImageCompressor;

  /**
   * 初始化
   */
  _proto.init = function init() {
    var _this = this;
    var file = this.file;
    var options = this.options;

    if (!file || !isImageType(file.type)) {
      console.error('请上传图片文件!');
      return;
    }

    if (!isImageType(options.mimeType)) {
      options.mimeType = file.type;
    }

    util.file2Image(file, function (img) {
      var canvas = util.image2Canvas(img);
      file.width = img.naturalWidth;
      file.height = img.naturalHeight;
      _this.beforeCompress(file, canvas);

      util.canvas2Blob(canvas, function (blob) {
        blob.width = canvas.width;
        blob.height = canvas.height;
        options.success && options.success(blob);
      }, options.quality, options.mimeType)
    })
  }

  /**
   * 压缩之前，读取图片之后钩子函数
   */
  _proto.beforeCompress = function beforeCompress() {
    if (isFunc(this.options.beforeCompress)) {
      this.options.beforeCompress(this.file);
    }
  }

  // 省略 `util` 公用方法定义
  // ...

  // 将 `util` 公用方法添加到实例的静态属性上
  for (key in util) {
    if (util.hasOwnProperty(key)) {
      SimpleImageCompressor[key] = util[key];
    }
  }
})(window)
```

这个简易图片压缩方法调用和入参：

```js
var fileEle = document.getElementById('file');

fileEle.addEventListener('change', function () {
  file = this.files[0];

  var options = {
    file: file,
    quality: 0.6,
    mimeType: 'image/jpeg',
    // 压缩前回调
    beforeCompress: function (result) {
      console.log('压缩之前图片尺寸大小: ', result.size);
      console.log('mime 类型: ', result.type);
      // 将上传图片在页面预览
      // SimpleImageCompressor.file2DataUrl(result, function (url) {
      //   document.getElementById('origin').src = url;
      // })
    },
    // 压缩成功回调
    success: function (result) {
      console.log('压缩之后图片尺寸大小: ', result.size);
      console.log('mime 类型: ', result.type);
      console.log('压缩率： ', (result.size / file.size * 100).toFixed(2) + '%');

      // 生成压缩后图片在页面展示
      // SimpleImageCompressor.file2DataUrl(result, function (url) {
      //   document.getElementById('output').src = url;
      // })

      // 上传到远程服务器
      // SimpleImageCompressor.upload('/upload.png', result);
    }
  };

  new SimpleImageCompressor(options);
}, false);
```

如果看到这里的客官不嫌弃这个 `demo` 太简单可以戳[这里](/demo/js-image-compressor/simple)试试水。如果你有足够的耐心多传几种类型图片就会发现还存在如下问题：

- 压缩输出图片寸尺固定为原始图片尺寸大小，而实际可能需要控制输出图片尺寸，同时达到尺寸也被压缩目的；
- `png` 格式图片同格式压缩，压缩率不高，还有可能出现“不减反增”现象；
- 有些情况，其他格式转化成 `png` 格式也会出现“不减反增”现象；
- 大尺寸 `png` 格式图片在一些手机上，压缩后出现“黑屏”现象；

![越压缩越膨胀😂](/gb/js-image-compressor/compress-larger.png)

## 改进版图片压缩

俗话说“罗马不是一天建成的”，通过上述实验，我们发现了很多不足，下面将逐条问题分析，寻求解决方案。

> 压缩输出图片寸尺固定为原始图片尺寸大小，而实际可能需要控制输出图片尺寸，同时达到尺寸也被压缩目的；

为了避免压缩图片变形，一般采用等比缩放，首先要计算出原始图片宽高比 `aspectRatio`，用户设置的高乘以 `aspectRatio`，得出等比缩放后的宽，若比用户设置宽的小，则用户设置的高为为基准缩放，否则以宽为基准缩放。

```js
var aspectRatio = naturalWidth / naturalHeight;
var width = Math.max(options.width, 0) || naturalWidth;
var height = Math.max(options.height, 0) || naturalHeight;
if (height * aspectRatio > width) {
  height = width / aspectRatio;
} else {
  width = height * aspectRatio;
}
```

输出图片的尺寸确定了，接下来就是按这个尺寸创建一个 `Canvas` 画布，将图片画上去。这里可以将上面提到的 `image2Canvas` 方法稍微做一下改造：

```js
function image2Canvas(image, destWidth, destHeight) {
  var canvas = document.createElement('canvas');
  var ctx = canvas.getContext('2d');
  canvas.width = destWidth || image.naturalWidth;
  canvas.height = destHeight || image.naturalHeight;
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
  return canvas;
}
```

> `png` 格式图片同格式压缩，压缩率不高，还有可能出现“不减反增”现象

一般的，不建议将 `png` 格式图片压缩成自身格式，这样压缩率不理想，有时反而会造成自身质量变得更大。

因为我们在“具体实现”中两个有关压缩关键 `API`：

- `toBlob(callback, [type], [encoderOptions])` 参数 `encoderOptions` 用于针对`image/jpeg` 格式的图片进行输出图片的质量设置；
- `toDataURL(type, encoderOptions` 参数`encoderOptions` 在指定图片格式为 `image/jpeg` 或 `image/webp` 的情况下，可以从 `0` 到 `1` 的区间内选择图片的质量。

均未对 `png` 格式图片有压缩效果。

有个折衷的方案，我们可以设置一个阈值，如果 `png` 图片的质量小于这个值，就还是压缩输出 `png` 格式，这样最差的输出结果不至于质量太大，在此基础上，如果压缩后图片大小 “不减反增”，我们就兜底处理输出源图片给用户。当图片质量大于某个值时，我们压缩成 `jpeg` 格式。

```js
// `png`格式图片质量大于某个阈值 `convertSize`
if (file.size > options.convertSize && options.mimeType === 'image/png') {
  options.mimeType = 'image/jpeg';
}
// 省略一些代码
// ...
// 输出尺寸小于源尺寸情况下，如果压缩质量大于源图片，则回退输出源图片
if (result.size > file.size && options.mimeType === file.type && !(options.width > naturalWidth || options.height > naturalHeight)) {
  result = file;
}
```

> 大尺寸 `png` 格式图片在一些手机上，压缩后出现“黑屏”现象；

由于各大浏览器对 [`Canvas` 最大尺寸支持](https://stackoverflow.com/questions/6081483/maximum-size-of-a-canvas-element)不同

浏览器|最大宽高|最大面积
--|:--:|:--:|--
Chrome|32,767 pixels|268,435,456 pixels(e.g.16,384 x 16,384)
Firefox|32,767 pixels|472,907,776 pixels(e.g.22,528 x 20,992)
IE|8,192 pixels|N/A
IE Mobile|4,096 pixels|N/A

如果图片尺寸过大，在创建同尺寸画布，再画上图片，就会出现异常情况，即生成的画布没有图片像素，而画布本身默认给的背景色为黑色，这样就导致图片“黑屏”情况。

这里可以通过控制输出图片最大宽高防止生成画布越界，并且用透明色覆盖默认黑色背景解决解决“黑屏”问题：

```js
// ...
// 限制最小和最大宽高
var maxWidth = Math.max(options.maxWidth, 0) || Infinity;
var maxHeight = Math.max(options.maxHeight, 0) || Infinity;
var minWidth = Math.max(options.minWidth, 0) || 0;
var minHeight = Math.max(options.minHeight, 0) || 0;

if (maxWidth < Infinity && maxHeight < Infinity) {
  if (maxHeight * aspectRatio > maxWidth) {
    maxHeight = maxWidth / aspectRatio;
  } else {
    maxWidth = maxHeight * aspectRatio;
  }
} else if (maxWidth < Infinity) {
  maxHeight = maxWidth / aspectRatio;
} else if (maxHeight < Infinity) {
  maxWidth = maxHeight * aspectRatio;
}

if (minWidth > 0 && minHeight > 0) {
  if (minHeight * aspectRatio > minWidth) {
    minHeight = minWidth / aspectRatio;
  } else {
    minWidth = minHeight * aspectRatio;
  }
} else if (minWidth > 0) {
  minHeight = minWidth / aspectRatio;
} else if (minHeight > 0) {
  minWidth = minHeight * aspectRatio;
}

width = Math.floor(Math.min(Math.max(width, minWidth), maxWidth));
height = Math.floor(Math.min(Math.max(height, minHeight), maxHeight));

// ...
// 覆盖默认填充颜色 (#000)
var fillStyle = 'transparent';
context.fillStyle = fillStyle;
```
