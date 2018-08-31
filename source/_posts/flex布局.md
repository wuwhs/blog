---
title: flex 布局
date: 2017-07-23 15:39:55
tags: css
categories: css
---
**flex弹性布局相关属性**

详细参考：[阮一峰博客](http://www.ruanyifeng.com/blog/2015/07/flex-grammar.html)

##### 1.flex-direction
> 定义沿水平或主轴方向
- row（默认值）：主轴为水平方向，起点在左端。

![image](http://note.youdao.com/yws/public/resource/b9cdada69234d36736d09235b516171c/xmlnote/A7EB10F6E1F3408CAA9C9C974C4CB428/4910)
- row-reverse：主轴为水平方向，起点在右端。

![image](http://note.youdao.com/yws/public/resource/b9cdada69234d36736d09235b516171c/xmlnote/8DEA13B4D378406683B6BFB80005CB2B/4912)
- column：主轴为垂直方向，起点在上沿。

![image](http://note.youdao.com/yws/public/resource/b9cdada69234d36736d09235b516171c/xmlnote/E1524C09229749E9BE85DFB4965150AE/4918)
- column-reverse：主轴为垂直方向，起点在下沿。

![image](http://note.youdao.com/yws/public/resource/b9cdada69234d36736d09235b516171c/xmlnote/4CD8B8C2211344B989766BE083EE63CD/4915)

##### 2.flex-wrap
> 定义换行方式
- nowrap（默认值）: 不换行

![image](http://note.youdao.com/yws/public/resource/b9cdada69234d36736d09235b516171c/xmlnote/B694617891A54CF9AF5B5D5CCF650908/4920)
- wrap: 换行，第一行在上面

![image](http://note.youdao.com/yws/public/resource/b9cdada69234d36736d09235b516171c/xmlnote/F3F2F267274340D8A86945DC48A85CE3/4922)
- wrap-reverse: 换行，第一行在上面

![image](http://note.youdao.com/yws/public/resource/b9cdada69234d36736d09235b516171c/xmlnote/0BF4BFE158E340428CB692A743396292/4924)

##### 3.flex-flow
> flex-flow 属性是flex-direction属性和flex-wrap的简写，默认flex-flow: row nowrap

##### 4.flex-content
> 定义了在主轴上对其方式
- flex-start
> 左对齐

![image](http://note.youdao.com/yws/public/resource/b9cdada69234d36736d09235b516171c/xmlnote/CD5D2ACC336C4BCBBB05E66B83577475/4988)

- flex-end
> 右对齐

![image](http://note.youdao.com/yws/public/resource/b9cdada69234d36736d09235b516171c/xmlnote/118AFF3B65B44D7494ACBA2D5483A8DB/4989)

- center
> 居中

![image](http://note.youdao.com/yws/public/resource/b9cdada69234d36736d09235b516171c/xmlnote/A7E34A90F73543A094E6B215D260F277/4993)

- space-between
> 两端对齐，项目之间得间隔相等

![image](http://note.youdao.com/yws/public/resource/b9cdada69234d36736d09235b516171c/xmlnote/3F3143709EE14299B37D69364FC4A824/4995)

- space-around
> 每个项目两侧得间隔相等，所以，项目之间得间隔比项目与边框的间隔大一倍

![image](http://note.youdao.com/yws/public/resource/b9cdada69234d36736d09235b516171c/xmlnote/A2CE2EABFC554D41BF45772A94EB9116/5024)

##### 5.align-item
> 定义项目在交叉轴上如何对齐

- flex-start
> 交叉轴起点对齐

![image](http://note.youdao.com/yws/public/resource/b9cdada69234d36736d09235b516171c/xmlnote/0D5633353F6F40858817015FA3BF79EE/5033)

- flex-end
> 交叉轴终点对齐

![image](http://note.youdao.com/yws/public/resource/b9cdada69234d36736d09235b516171c/xmlnote/849F1B061B4E47EA9A8E7D61BDAF9605/5035)

- flex-center
> 交叉轴中点对齐

![image](http://note.youdao.com/yws/public/resource/b9cdada69234d36736d09235b516171c/xmlnote/38CEC1160C784FE58225CA355CEDF2B7/5037)

- flex-baseline
> 项目中第一行文字基线对齐

![image](http://note.youdao.com/yws/public/resource/b9cdada69234d36736d09235b516171c/xmlnote/E979D09F57104C97B8AA606E7F3CD6AE/5039)

- stretch（默认值）
> 项目中未设置高度或设为auto，将占满容器高度

![image](http://note.youdao.com/yws/public/resource/b9cdada69234d36736d09235b516171c/xmlnote/991845E3FD7C4BE490E105FC27D0A704/5041)

##### 6. align-content
> align-content定义了多根轴线的对齐方式，如果项目只有一根轴线，该属性不起作用

- flex-start
> 与交叉轴的起点对齐

![image](http://note.youdao.com/yws/public/resource/b9cdada69234d36736d09235b516171c/xmlnote/7AC7BB6E492C41CDB693CF96F8F0C9BA/5099)

- flex-end
> 与交叉轴的终点对齐

![image](http://note.youdao.com/yws/public/resource/b9cdada69234d36736d09235b516171c/xmlnote/C61B8525A8C240ED974EA4CCDF57B481/5102)

- space-between
> 与交叉轴两端对齐，轴线之间的间隔平均分布

![image](http://note.youdao.com/yws/public/resource/b9cdada69234d36736d09235b516171c/xmlnote/00A279229EAE45E9BD88589996179F85/5104)

- space-around
> 每根轴线两侧的间隔都相等，所以，轴线之间与边框的间隔大一倍

![image](http://note.youdao.com/yws/public/resource/b9cdada69234d36736d09235b516171c/xmlnote/13F94C057023411CB9041AD1917F9F89/5108)

- space-stretch（默认值）
> 如果不设置高度，轴线占满整个交叉轴

![image](http://note.youdao.com/yws/public/resource/b9cdada69234d36736d09235b516171c/xmlnote/889AF905305D4110865CB35BD055AB0C/5096)

##### 7.项目的属性
> order属性定义项目的排列顺序。数值越小，排列越靠前，默认为0。

![image](http://note.youdao.com/yws/public/resource/b9cdada69234d36736d09235b516171c/xmlnote/A8616886B4B74F8098C08ED7B2A32E95/5126)

> flex-grow属性定义项目的放大比例，默认为0，即如果存在剩余空间，也不放大。如果所有项目的flex-grow属性都为1，则它们将等分剩余空间（如果有的话）。如果一个项目的flex-grow属性为2，其他项目都为1，则前者占据的剩余空间将比其他项多一倍。

![image](http://note.youdao.com/yws/public/resource/b9cdada69234d36736d09235b516171c/xmlnote/610B19BEA00A4E489858DB7AEF1CC703/5131)

> flex-shrink属性定义了项目的缩小比例，默认为1，即如果空间不足，该项目将缩小。如果所有项目的flex-shrink属性都为1，当空间不足时，都将等比例缩小。如果一个项目的flex-shrink属性为0，其他项目都为1，则空间不足时，前者不缩小。

![image](http://note.youdao.com/yws/public/resource/b9cdada69234d36736d09235b516171c/xmlnote/F71A2DD19C674A6FAFBF4CC697EECA6C/5136)

> flex-basis属性定义了在分配多余空间之前，项目占据的主轴空间（main size）。浏览器根据这个属性，计算主轴是否有多余空间。它的默认值为auto，即项目的本来大小。

> flex属性是flex-grow, flex-shrink 和 flex-basis的简写，默认值为0 1 auto。后两个属性可选。该属性有两个快捷值：auto (1 1 auto) 和 none (0 0 auto)。

##### 8.align-self
> align-self属性允许单个项目有与其他项目不一样的对齐方式，可覆盖align-items属性。默认值为auto，表示继承父元素的align-items属性，如果没有父元素，则等同于stretch。

![image](http://note.youdao.com/yws/public/resource/b9cdada69234d36736d09235b516171c/xmlnote/0BBC1AD3CC2E436B86C7B358BD127531/5147)