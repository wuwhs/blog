---
title: 基于http前端性能优化
date: 2021-04-05 18:32:32
tags: [优化]
---

## 前言

前端性能的优化的前提是要了解对页面加载全流程，正如老生常谈的 “浏览器从输入 URL 到页面加载出来发生了什么”，主要分为以下几个过程：

- DNS 解析:将域名解析成 IP 地址
- TCP 连接：TCP 三次握手
- 发送 HTTP 请求
- 服务器处理请求并返回 HTTP 报文
- 浏览器解析渲染页面
- 断开连接：TCP 四次挥手

总结来看，可优化点有：

- 域名解析（DNS）
- 使用 HTTP2
- 减少 http 请求次数
- 减小请求大小
- 浏览器缓存

针对每个流程进行应对优化方案。

## 域名解析（DNS）

DNS 协议提供通过域名查找 IP 地址，或逆向从 IP 地址反查域名的服务。DNS 是一个网络服务器，我们的域名解析简单来说就是在 DNS 上记录一条信息记录。

### DNS 查找流程

浏览器缓存：浏览器会按照一定的频率缓存 DNS 记录。
操作系统缓存：如果浏览器缓存中找不到需要的 DNS 记录，那就去操作系统中找。
路由缓存：路由器也有 DNS 缓存。
ISP 的 DNS 服务器：ISP 是互联网服务提供商(Internet Service Provider)的简称，ISP 有专门的 DNS 服务器应对 DNS 查询请求。
根服务器：ISP 的 DNS 服务器还找不到的话，它就会向根服务器发出请求，进行递归查询（DNS 服务器先问根域名服务器.com 域名服务器的 IP 地址，然后再问.baidu 域名服务器，依次类推）