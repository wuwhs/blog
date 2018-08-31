---
title: HTML5离线存储之Application Cache
date: 2018-05-23 19:40:30
tags: [html5, 缓存]
categories: html
---

关于html5的离线存储，大致可分为：

- localStorage, sessionStorage
- indexedDB
- web sql
- application cache

可以在chrome的debug工具/Resources下产看，下面来着重说明一下Application Cache。

#### 访问流程

![image](https://note.youdao.com/yws/public/resource/bb7792e904a30442f11cb6c88c33cce8/xmlnote/7AB47833D09B4737834BBDB43A3DEF36/11091)

当我们第一次正确配置app cache后，当我们再次访问该应用时，浏览器会首先检查manifest文件是否有变动，如果有变动就会把相应的变得跟新下来，同时改变浏览器里面的app cache，如果没有变动，就会直接把app cache的资源返回，基本流程是这样的。

#### 特点

- 离线浏览: 用户可以在离线状态下浏览网站内容
- 更快的速度: 因为数据被存储在本地，所以速度会更快
- 减轻服务器的负载: 浏览器只会下载在服务器上发生改变的资源

#### 如何使用

首先，我们建立一个html文件，类似这样：

```
<html lang="en" mainfest="index.manifest">
 <head></head>
 <body></body>
</html>
```

可能有些代码看不懂，我们先看最简单的，第一行配置了一个manifest=”manifest.appcache”（注意是mani不是main），这是使用app cache首先要配置的，然后我们在这个html文件里引入了两个img做为测试用，然后监听了load时间来查看看application的status，关于applicationCache的api，可以查看。

然后在相同目录下新建一个manifest.appcache文件，注意关于路径要和html页面配置时一致即可。

```
CACHE MANIFEST
#version 1.3

CACHE:
img/1.jpg
img/2.jpg
test.css
NETWORK:
*
```

关于manifest.appcache文件，基本格式为三段： CACHE，NETWORK，与 FALLBACK，其中NETWORK和FALLBACK为可选项，而第一行CACHE MANIFEST为固定格式，必须写在前面。

**CACHE:（必须）**

标识出哪些文件需要缓存，可以是相对路径也可以是绝对路径。
例如：aa.css，http://www.baidu.com/aa.js.

NETWORK:（可选）

这一部分是要绕过缓存直接读取的文件，可以使用通配符＊，,也就是说除了上面的cache文件，剩下的文件每次都要重新拉取。例如＊，login.php。

FALLBACK:（可选）

指定了一个后备页面，当资源无法访问时，浏览器会使用该页面。该段落的每条记录都列出两个 URI—第一个表示资源，第二个表示后备页面。两个 URI 都必须使用相对路径并且与清单文件同源。可以使用通配符。例如*.html /offline.html。

有了上面两个文件之后还要配置服务器的mime.types类型，找大盘apache的mime.types文件，添加

```
text/cache-manifest .appcache
```
OK，上面文件配置完成之后，application cache就可以运行了。
查看console：

![image](https://note.youdao.com/yws/public/resource/bb7792e904a30442f11cb6c88c33cce8/xmlnote/5DF2CA55432348339CA767C4B0DAAA70/11130)

可以看到，一下子这么多log，但是除了4是我们console的log之外，其他的都是appcache自己打的，因为我们配置了manifest，系统会默认打出appcache的log。关于status的值：

然后，通过log，我们看到一些文件已经被缓存，我们可以查看chrome Resources来查看：

![image](https://note.youdao.com/yws/public/resource/bb7792e904a30442f11cb6c88c33cce8/xmlnote/FD192A001F3642B380838F8D5430CD98/11135)

证明直接从缓存拿去文件：

![image](https://note.youdao.com/yws/public/resource/bb7792e904a30442f11cb6c88c33cce8/xmlnote/4E1E0959E5C044DD9F4AC2DFBDDF2AEB/11139)

**更新缓存的方式**

更新manifest文件

浏览器发现manifest文件本身发生变化，便会根据新的manifest文件去获取新的资源进行缓存。

当manifest文件列表并没有变化的时候，我们通常通过修改manifest注释的方式来改变文件，从而实现更新。

通过javascript操作

浏览器提供了applicationCache供js访问，通过对于applicationCache对象的操作也能达到更新缓存的目的。

清除浏览器缓存

对于第一种，我们修改一下manifest文件，把version改为1.4，然后刷新页面。

![image](https://note.youdao.com/yws/public/resource/bb7792e904a30442f11cb6c88c33cce8/xmlnote/186721D50C1C4F95A11A7BC16B4B56DA/11144)

我们可以发现，appcache更新了缓存重新从网络上拉去的cache的文件，但是，我们如果想要看到改变，必须再次刷新页面。

对于第二种方法，我们首先修改一下我们的js，添加一个监听事件：


```
window.applicationCache.addEventListener('updateready', function(){
    console.log('updateready!');
    window.applicationCache.swapCache();
});
```

清除浏览器缓存再试一次，这次我们在console里调用window.applicationCache.update();，看看发生了什么：

![image](https://note.youdao.com/yws/public/resource/bb7792e904a30442f11cb6c88c33cce8/xmlnote/53DA4D618AC24349AF6E7C1C1D3A44A3/11151)

updateready事件触发了，同样，appcache也更新了缓存，其中swapCache方法的意思是重新应用跟新后的缓存来替换原来的缓存！，到这里后基本的appcache也差不多了。

**注意事项：**

- 站点离线存储的容量限制是5M

- 如果manifest文件，或者内部列举的某一个文件不能正常下载，整个更新过程将视为失败，浏览器继续全部使用老的缓存

- 引用manifest的html必须与manifest文件同源，在同一个域下

- FALLBACK中的资源必须和manifest文件同源

- 当一个资源被缓存后，该浏览器直接请求这个绝对路径也会访问缓存中的资源。

- 站点中的其他页面即使没有设置manifest属性，请求的资源如果在缓存中也从缓存中访问

- 当manifest文件发生改变时，资源请求本身也会触发更新
