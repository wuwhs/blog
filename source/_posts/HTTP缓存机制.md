---
title: HTTP缓存机制
date: 2018-08-27 19:42:30
tags: http
---

只关注前端方面缓存机制的，可能只清楚在HTML页meta标签处理

```
<meta http-equiv="Pragma" content="no-store">
```
目的是为了不让浏览器缓存当前页面。但是代理服务器不解析HTML内容。这样一般在服务器端对HTTP请求头进行处理控制缓存。

#### HTTP头控制缓存

> 大致分为两种：**强缓存和协商缓存**。强缓存如果命中缓存不需要和服务器发生交互，而协商缓存不管是否命中都要和服务器端进行交互，强制缓存的优先级高于协商缓存。

匹配流程示意图：
![image](http://note.youdao.com/yws/public/resource/b9cdada69234d36736d09235b516171c/xmlnote/BB0A4933DEEC4471AE7D263C9D146313/5678)

==敲黑板：强缓存根据Expire或Cache-Control判断，协商缓存根据Last-Modified或ETag判断，强缓存优先级大于协商缓存==

##### 强缓存
> 可以理解为无需验证缓存策略。

###### Expires
Expires指缓存过期时间，超过时间点就代表资源过期。

###### Cache-Control
Cache-Control可以由多个字段组成，有一下取值：

1. **max-age**

指定一个时间长度，单位s。在没有禁用缓存并且没有超过有效时间，再次访问这个资源会命中缓存，不会向服务器请求资源而是直接从浏览器中取。

2. **s-maxage**

同max-age，覆盖max-age、Expires，仅适用共享缓存，在私有缓存中被忽略。

3. **public**

表明响应可以被任何对象（发送请求和客户端、代理服务器）缓存。

4. **private**

表明响应只能被单个用户（可能是操作系统用户、浏览器用户）缓存，是非共享的，不能被代理服务器缓存。

5. **no-chache**

强制所有缓存了该响应的用户，在使用已缓存的数据前，发送待验证器请求到服务器。==不是字面意思上的不缓存==。

6. **no-store**

禁止缓存，每次请求都要向服务器重新获取数据。

#### 协商缓存

> 缓存的资源到期了，并不意味着资源内容发生了改变，如果和服务器上的资源没有差别，实际上没有必要再次请求。客户端和服务器通过某种验证机制验证当前请求资源是否可以使用缓存。

###### Last-modified/If-Modified-Since

Last-modified表示服务器端资源的最后修改时间，响应头部会带上这个标识。第一次请求之后，浏览器记录这个时间，再次请求时，请求头带上If-Modified-Since即为之前记录下的时间。服务器端收到带If-Modified-Since的请求后会去和资源最后修改时间对比。若修改过就返回最新资源，状态码200，否则没有修改过返回304。

![image](http://note.youdao.com/yws/public/resource/b9cdada69234d36736d09235b516171c/xmlnote/49E01731D2EC4CF6976B958E0768105B/5779)

==注意：如果响应头中有Last-modified而没有Expire或Chache-Control，浏览器会有自己的算法算出，不同浏览器算出时间不一样，所有Last-modified要配合Expires/Cache-Control使用==

##### Etag/If-None-Match
由服务器端上生成一段hash字符串，第一次请求时响应头带上ETag:abcd，之后的请求中带上If-None-Match: abcd，服务器检查ETag，返回304或200

**选择Chech-Control策略**

![image](http://note.youdao.com/yws/public/resource/b9cdada69234d36736d09235b516171c/xmlnote/00C0F264F82D430390426C5EF597F2DD/5801)
