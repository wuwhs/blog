---
title: 对MVC、MVP和MVVM的简单认识
date: 2018-08-27 19:42:30
tags: 设计模式
---

### 1. 先聊一下MVC

MVC：Model（模型） View（视图） Controller（控制器），主要是基于分层的目的，让彼此的职责分开。

View通过Controller和Model联系，Controller是View和Model的协调者，view和Model不直接联系，基本联系都是单向的。

### 2. 顺带提下MVP

MVP：是从MVC模式演变而来的，都是通过Controller/Presenter负责逻辑的处理+Model提供数据+View负责显示。

在MVP中，Presenter完全把View和Model进行分离，主要的程序逻辑在Presenter里实现。并且，Presenter和View是没有直接关联的，是通过定义好的接口进行交互，从而使得在变更View的时候可以保持Presenter不变。

### 3. 再聊聊MVVN

MVVM：Model + View + ViewModel，把MVC中的Controller和MVP中的Presenter改成ViewModel

view的变化会自动更新到ViewModel，ViewModel的变化也会自动同步到View上显示。这种自动同步是因为ViewModel中的属性实现了Observer，当属性变更时都能触发对应操作。

- View 是HTML文本的js模板；
- ViewModel是业务逻辑层（一切js可视业务逻辑，比如表单按钮提交，自定义事件的注册和处理逻辑都在viewmodel里面负责监控俩边的数据）；
- Model数据层，对数据的处理（与后台数据交互的增删改查）

提一下我熟悉的MVVM框架：vue.js，Vue.js是一个构建数据驱动的 web 界面的渐进式框架。Vue.js 的目标是通过尽可能简单的 API 实现响应的数据绑定和组合的视图组件。核心是一个响应的数据绑定系统。

### 4. 一句话总结下不同之处

MVC中联系是单向的，MVP中P和V通过接口交互，MVVP的联系是双向的