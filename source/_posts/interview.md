---
title: 前端面试
date: 2018-03-03 19:42:30
tags: 面试
categories: 面试
---

task1：上下高度固定，中间自适应

#### css盒模型
标准模型、IE模型 box-sizing:content-box/border-box
js如何获取盒模型的宽（或高）
dom.style.width
dom.currentStyle.width --IE
window.getComputedStyle(dom).width
dom.getBoundingClientRect().width

#### 上下边界重叠，取最大值
父子元素
兄弟元素
空元素（margin-top margin-bottom）

#### BFC
块级格式化上下文

**原理就是渲染规则**
1. 垂直方向边距会发生重叠
2. 不会浮动元素重叠
3. 独立容器，外面的元素不会影响里面的元素
4. 计算高度，浮动元素参与计算

#### 可用来生成BFC的css属性
1. float不为none
2. overflow不为visiable
3. position为fixed和absolute
4. display为inline-block table-cell table-caption flex inline-flex


#### DOM事件
DOM事件捕获流程
自定义事件

// 当一个元素注册几个事件时，只执行第一个
event.stopImmediatePropagation()

#### 数据类型转化规则
已具体延伸


[文章参考一](https://github.com/markyun/My-blog/tree/master/Front-end-Developer-Questions)

[文章参考二](https://github.com/h5bp/Front-end-Developer-Interview-Questions/tree/master/Translations/Chinese)

[前端工程分析](https://github.com/fouber/blog/issues/10)

[FE-interview](https://github.com/qiu-deqing/FE-interview)

[interview book](https://github.com/yangshun/front-end-interview-handbook/tree/master/Translations/Chinese)

#### http协议类

主要特点：简单快速、灵活、无连接和无状态

#### http报文
组成部分：请求报文、响应报文
请求报文：请求行（方法、协议和版本）、请求头（key和value值）、空行、请求体
响应报文：响应行（协议、版本和状态码）、响应头（key和value值）、空行、响应体

#### http方法
POST GET PUT（更新资源） DELETE（删除资源） HEAD(获取报文首部)

GET和POST的优缺点：
1. GET在浏览器回退时是无害的，而POST会再次提交请求
2. GET产生URL地址可以收藏，而POST不可以
3. GET请求会被浏览器主动缓存，而POST不会，除非收的那个设置
4. GET请求值能进行url编码，而POST支持多种编码方式
5. GET请求参数会被完整保留在浏览器历史记录里，而POST中的参数不会被保留
6. GET请求在URL中传送的参数是有长度限制的，而POST没有限制
7. 对参数的数据类型，GET只接受ASCII字符，而POST没有限制
8. GET比POST更不安全，因为参数直接暴露在URL上，所以不能用来传递敏感信息
9. GET参数通过URL传递，POST放在Request body中

- 1xx 指示信息-请求已接收，继续处理
- 2xx 成功
- 3xx 重定向
- 4xx 客户端错误
- 5xx 服务器错误

- 200 OK
- 206 客户端发送了一个带有Range头的GET请求，服务器完成了它

- 301 请求页面已经转移至新的url
- 302 页面已经临时转移至新的url
- 304 原来缓存的文档还可以继续使用

- 400 客户端请求有语法错误，不能被服务器理解
- 401 请求未授权
- 403 访问被禁止
- 404 资源不存在

- 500 服务发生不可预期的错误
- 503 请求完成，服务器临时过载或宕机

#### 持久连接
HTTP协议采用“请求-应答”模式，当使用普通模式，即非keep-alive模式时，每个请求和服务器都要新建一个链接，完成后立即断开连接（HTTP协议为无连接的协议）

当使用keep-alive模式（又称持久连接、连接重用）时，keep-alive功能是客户端到服务器端的连接持续有效，当出校对服务器的后继请求时，keep-alive功能避免了建立或者重新建立连接

#### 管线化
在使用持久连接的情况下，某个链接上消息的传递类似于请求1 -> x响应1 -> 请求2 -> 响应2

管线化，在持久连接的基础上，类似于请求1 -> 请求2 -> 响应1 -> 响应2

管线化特点：
1. 管线化机制通过持久化完成，仅HTTP/1.1支持
2. 只有GET和HEAD请求可以进行管线化，而POST有所限制
3. 管线化不会影响响应到来的顺序
4. 服务器端支持管线化，并不要求服务器端也对响应进行管线化处理，只是要求对于管线化的请求不失败


遇到的问题：递归应用内存泄漏，原生对象和DOM对象相互引用导致内存泄漏

#### MVVM

##### 了解MVVM框架吗？

用过vue.js

聊vue.js有哪些优点，缺点？

React和Vue相似之处：
- 使用Virtual DOM
- 提供了响应式（Reactive）和组件化（Composable）的视图组件
- 将注意力集中保持在和核心库，而将其他功能如路由和全局状态交给相关的库

不同之处：
- React有更丰富的生态系统
- React在某个组件状态发生变化时，它会以该组件为根，重新渲染整个组件子树，而Vue自动追踪，精确知晓哪个组件需要被重渲染
- React渲染功能依靠JSX，支持类型检查、编译器自动完成，linting，Vue默认推荐的还是模板
- CSS作用域在React中是通过CSS-in-JS方案实现，Vue设置样式的默认方法时单文件组件里类似style的标签
- 编写有本地渲染能力的APP，React有React Native，比较成熟。Vue有Weex，还在快速发展中

收住优点，攒着下面说


##### 对MVVM的认识

##### 1. 先聊一下MVC

MVC：Model（模型） View（视图） Controller（控制器），主要是基于分层的目的，让彼此的职责分开。

View通过Controller和Model联系，Controller是View和Model的协调者，view和Model不直接联系，基本联系都是单向的。

##### 2. 顺带提下MVP

MVP：是从MVC模式演变而来的，都是通过Controller/Presenter负责逻辑的处理+Model提供数据+View负责显示。

在MVP中，Presenter完全把View和Model进行分离，主要的程序逻辑在Presenter里实现。并且，Presenter和View是没有直接关联的，是通过定义好的接口进行交互，从而使得在变更View的时候可以保持Presenter不变。

##### 3. 再聊聊MVVN

MVVM：Model + View + ViewModel，把MVC中的Controller和MVP中的Presenter改成ViewModel

view的变化会自动更新到ViewModel，ViewModel的变化也会自动同步到View上显示。这种自动同步是因为ViewModel中的属性实现了Observer，当属性变更时都能触发对应操作。

- View 是HTML文本的js模板；
- ViewModel是业务逻辑层（一切js可视业务逻辑，比如表单按钮提交，自定义事件的注册和处理逻辑都在viewmodel里面负责监控俩边的数据）；
- Model数据层，对数据的处理（与后台数据交互的增删改查）

提一下我熟悉的MVVM框架：vue.js，Vue.js是一个构建数据驱动的 web 界面的渐进式框架。Vue.js 的目标是通过尽可能简单的 API 实现响应的数据绑定和组合的视图组件。核心是一个响应的数据绑定系统。

##### 4. 一句话总结下不同之处

MVC中联系是单向的，MVP中P和V通过接口交互，MVVM的联系是双向的


#### 双向数据绑定原理

1. Object.defineProperty用法熟记于心
2. Object.defineProperty与Reflect.defineProperty区别
Reflect.defineProperty返回的是boolean值

#### MVVM设计模式
这个回顾一下自己写的文章
