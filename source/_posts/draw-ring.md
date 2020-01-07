---
title: draw-ring
date: 2019-11-06 17:26:19
tags: [css, javascript]
---

`clip-path` 创建一个只有元素的部分区域可以显示的裁剪区域。区域内的部分显示，区域外的隐藏。裁剪区域是被引用内嵌的 `URL` 定义的路径或者外部 `SVG` 的路径，或者作为一个形状，例如 `circle()`。 `clip-path` 属性代替了现在已经弃用的剪切 `clip` 属性。

剪切元素路径 `<clip-source>`

```css
clip-path: url(resources.svg#c1);
```

剪切形状 `<basic-shape>`

```css
/* 嵌入 */
clip-path: inset(100px 50px);
/* 圆形 半径 at 圆心位置 */
clip-path: circle(50px at 0 100px);
/* 椭圆 半径 at 圆心位置 */
clip-path: ellipse(130px 140px at 10% 20%);
/* 多边形 各个点的位置 */
clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
/* svg点位置 */
clip-path: path('M0.5,1 C0.5,1,0,0.7,0,0.3 A0.25,0.25,1,1,1,0.5,0.3 A0.25,0.25,1,1,1,1,0.3 C1,0.7,0.5,1,0.5,1 Z');
```

剪切盒模型 `<geometry-box>`

```css
clip-path: margin-box;
clip-path: border-box;
clip-path: padding-box;
clip-path: content-box;
clip-path: fill-box;
clip-path: stroke-box;
clip-path: view-box;
```
