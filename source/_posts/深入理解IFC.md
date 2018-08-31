---
title: 深入理解IFC
date: 2018-05-20 10:00:30
tags: css IFC
categories: css
---

## 概念规则

1. FC(Inline formatting context)，即行内格式化上下文，它和BFC一样，既不是属性也不是元素，而是一种，一种上下文。

2. 在IFC中，框（boxs）一个接一个水平排列，起点是包含块的顶部。水平方向上的margin，border和padding在框之间得到保留。框在垂直方向上可以以不同的方式对齐：它们的顶部或底部对齐，或根据其中文字的基线对齐。包括那些框的长方形区域，会形成一行，叫做行框（line box）。

3. 一个line box的宽度由包含它的元素的宽度和包含它的元素里面有没有float元素来决定，而高度由内部元素中实际高度最高的元素计算出来。

4. line box的高度是足够高来包含他内部容器们的，也可能不比它包含的容器们都高（比如在基线对齐的时候），当它包含的内部容器的高度小于line box的高度时，内部容器的垂直位置由自己的vertical这个属性来确定。当内部的容器盒子太多，一个line box装不下，它们折行之后会变成两个或多个line box，line box们相互之间垂直方向不能分离，不能重叠。
5. 一般来说，line box的左边缘挨着包含它的元素的左边缘，并且右边缘挨着包含它的元素的右边缘，浮动元素会在包含他们元素的边缘和line box的边缘之间，所以，虽然在同一个IFC下的line box们通常拥有相同的宽度（就是包含它们容器的宽度），但是也会因为浮动元素捣乱，导致line box们的可用宽度产生变化不一样了。在同一个IFC下的line box们的高度也会不一样（比如说，一个line box里有个比较打的image）

![image](https://note.youdao.com/yws/public/resource/b9cdada69234d36736d09235b516171c/xmlnote/120ADFFD113A46C2B9578E8F73121C0C/7322)

![image](https://note.youdao.com/yws/public/resource/b9cdada69234d36736d09235b516171c/xmlnote/C0D416285D5A4A258F8614C992BF958F/7325)

6. 当内联元素的宽度超过line box宽度，那么它会折行分裂成几个line box，如果这个元素里面的内容不可以折行，那么内联元素会溢出line box。

7. 当一个内联元素分裂时，分裂处的margin，border和padding不会有视觉效果。

8. line box的生存条件时IFC中包含inine-level元素，如果line box没有文本，空白，换行符，内联元素，也灭有其他的存在IFC环境中的元素（如inline-block，inline-table，image等），将被视为零高度，也将被视为没意义。


```
<style>
    .verticle-middle {
        width: 150px;
        height: 200px;
        background-color: #ccc;
    }

    .verticle-middle span {
        padding: 20px;
    }

</style>
<section class="verticle-middle ifc">
    <span>垂直居中</span><span>垂直居中</span><span>垂直居中</span>
    <span>垂直居中</span><span>垂直居中</span><span>垂直居中</span>
    <span>垂直居中</span><span>垂直居中</span><span>垂直居中</span>
    <span>垂直居中</span><span>垂直居中</span><span>垂直居中</span>
</section>
```

![image](https://note.youdao.com/yws/public/resource/b9cdada69234d36736d09235b516171c/xmlnote/68A94D377F0641F2AA8B9F8FB4C916F6/7354)

## 实例应用

在一个line box中，当他包含的内部容器的高度小于line box的高度的时候，内部容器的垂直位置由自己的vertical属性来确定。那么，我们设想一下，如果手动创建一个IFC环境，让line box的高度时包含块的高度的100%，让line box内部的元素使用vertical-align:middle，就可以实现垂直居中了。

![image](https://note.youdao.com/yws/public/resource/b9cdada69234d36736d09235b516171c/xmlnote/A823E0E469A040708A73C7B1599E77A2/7372)


```
<style>
    .verticle-middle {
        width: 300px;
        height: 200px;
        background-color: #ccc;
    }

    .verticle-middle > div {
        display: inline-block;
        vertical-align: middle;
    }

    .verticle-middle img {
        vertical-align: middle;
    }

    .verticle-middle span {
        padding: 20px;
    }

    .ifc:after {
        display: inline-block;
        content: "";
        width: 0;
        height: 100%;
        vertical-align: middle;
    }
</style>
<section class="verticle-middle ifc">
    <div>
        <img src="image/demo.jpg" alt="">
        <span>垂直居中</span>
    </div>
</section>

```

![image](https://note.youdao.com/yws/public/resource/b9cdada69234d36736d09235b516171c/xmlnote/E9673B1DA3694756BF4F62B85F45C207/7378)
