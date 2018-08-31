---
title: js数据类型转化
date: 2017-06-18 21:42:30
tags: javascript
categories: javascript
---

#### 数据类型转化表
首先上数据类型转化表，便于遇到问题直接查看

值 | 字符串 | 数字 | 布尔值 | 对象
---|---|---|---|---|---|---
undefined <br> null | "undefined" <br> "null" | NaN | false <br> false | throws TypeError <br> throws TypeError
true <br> false | "true" <br> "false" | 1 <br> 0 |  | new Boolean(true) <br> new Boolean(false)
""(空字符串) <br> "1.2"(非空，数字) <br> "one"（非空，非数字） |  | 0 <br> 1.2 <br> NaN | false <br> true <br> true | new String("") <br> new String("1.2") <br> new String("one")
0 <br> -0 <br> NaN <br> Infinity <br> -Infinity <br> 1（非零） | "0" <br> "0" <br> "NaN" <br> "Infinity" <br> "-Infinity" <br> "1" |  | new Number(0) <br> new Number(-0) <br> new Number(NaN) <br> new Number(Infinity) <br> new Number(-Infinity) <br> new Number(1)
{}（任意对象） <br> [] <br> [9] <br> ["a"] | {}.toString() -> {}.valueOf() <br> "" <br> "9" <br> 使用join() | {}.valueOf() -> {}.toString() <br> 0 <br> 9 <br> NaN <br> NaN | true <br> true <br> true <br> true <br> |

#### 显式转换

显示转换最简单的是使用Boolean()、Number()、String()或Object()构造函数

```
Number("3"); // 3
String(false); // "false"
Boolean([]); // true
Object(3); // new Number(3)
```
ps:值得注意的是，试图把undefined或null转换为对象，会抛出一个类型错误，而Object()显示转换不会，而是返回一个新创建的空对象

显示转换还有`toString()`、`toFixed()`、`toExponential()`、`toPrecision()`、`parseInt()`、`parseFloat()`方法，不细说

#### 隐式转换

隐式转换分为三种：
1. 将值转换为原始值，ToPrimitive(input, PreferredType)
2. 将值转化为数字，ToNumber()
3. 将值转化为字符串，ToString()

原始类型数据转化相对比较简单，下面值看对象到原始类型的转换方式

**对象的toString()和valueOf()方法**

1. 所有对象继承了两个转换方法：`toString()`
    - 一般对象转化成[object object] `{x: 1, y: 2}.toString(); // "[object object]"`
    - 数组转化成元素间加逗号 `[1, 2, 3].toString(); // "1,2,3"`
    - 函数转化成定义`(function(x){}).toString(); // "function(x) {}"`
    - 正则转化为直接量字符串 `/\d+/g.toString(); // "/\d+/g"`
    - 日期转化为日期字符串 `new Date(2000, 1, 1).toString();` // "Tue Feb 01 2000 00:00:00 GMT+0800 (中国标准时间)"


2. `valueOf()`方法

    - 大多数对象无法真正表示为一个原始值，`valueOf()`简单返回对象本身
    - 日期对象是一个特例，返回毫秒数 `new Date(2010, 0, 1).valueOf(); // 12623328000`

**对象到字符串的转换**

- 如果对象具有toString()方法，则调用这个方法，如果它返回一个原始值，将这个值转化为字符串，并返回这个字符串结果
- 如果对象没有toString()方法，或者个这个方法不返回一个原始值，那么就会调用valueOf()方法。如果存在这个方法，则调用它，如果返回值是一个原始值，将这个值转化为只服从，并返回这个字符串结果
- 否则，就会抛出一个类型错误异常

**对象到数字的转换**

- 如果对象具有valueOf()方法，后者返回个亿原始值，则将这个原始值转化为数字，并返回这个数字
- 否则，如果对象有toString()方法，后者返回一个原始值，并转化成数字返回
- 否则，抛出一个类型错误异常

> 举个栗子： `({} + {}) = ?`

    两个对象的值进行+运算符，要先进行隐式转换成原始类型才能计算
    1. ToPrimitive转换，因为没有指定PreferredType类型，默认为Number
    2. 执行`valueOf()`方法，`{}.valueOf()`返回的还是{}对象
    3. 继续执行`toString()`方法，`({}).toString()`返回`[Object Object]`，是原始值

所以最后结果：`[Object Object][Object Object]`
ps:在Firefox中返回结果为`NaN`，因为第一个{}被当作一个代码块，没有解析转换，变成了`+{}`，也就是`+[Object Object]`，最终变成`NaN`

#### ==元算符隐式转换
==运算符应用和考察点很多，直接上ES5规范文档

```
比较运算 x==y, 其中 x 和 y 是值，返回 true 或者 false。这样的比较按如下方式进行：
1、若 Type(x) 与 Type(y) 相同， 则

    1* 若 Type(x) 为 Undefined， 返回 true。
    2* 若 Type(x) 为 Null， 返回 true。
    3* 若 Type(x) 为 Number， 则

        (1)、若 x 为 NaN， 返回 false。
        (2)、若 y 为 NaN， 返回 false。
        (3)、若 x 与 y 为相等数值， 返回 true。
        (4)、若 x 为 +0 且 y 为 −0， 返回 true。
        (5)、若 x 为 −0 且 y 为 +0， 返回 true。
        (6)、返回 false。

    4* 若 Type(x) 为 String, 则当 x 和 y 为完全相同的字符序列（长度相等且相同字符在相同位置）时返回 true。 否则， 返回 false。
    5* 若 Type(x) 为 Boolean, 当 x 和 y 为同为 true 或者同为 false 时返回 true。 否则， 返回 false。
    6*  当 x 和 y 为引用同一对象时返回 true。否则，返回 false。
2、若 x 为 null 且 y 为 undefined， 返回 true。
3、若 x 为 undefined 且 y 为 null， 返回 true。
4、若 Type(x) 为 Number 且 Type(y) 为 String，返回比较 x == ToNumber(y) 的结果。
5、若 Type(x) 为 String 且 Type(y) 为 Number，返回比较 ToNumber(x) == y 的结果。
6、若 Type(x) 为 Boolean， 返回比较 ToNumber(x) == y 的结果。
7、若 Type(y) 为 Boolean， 返回比较 x == ToNumber(y) 的结果。
8、若 Type(x) 为 String 或 Number，且 Type(y) 为 Object，返回比较 x == ToPrimitive(y) 的结果。
9、若 Type(x) 为 Object 且 Type(y) 为 String 或 Number， 返回比较 ToPrimitive(x) == y 的结果。
10、返回 false。
```

**总结起来有如下几点值得注意**
1. `NaN !== NaN`
2. x,y 为null、undefined两者中一个 // 返回true
3. x、y为Number和String类型时，则转换为Number类型比较
4. 有Boolean类型时，Boolean转化为Number类型比较
5. 一个Object类型，一个String或Number类型，将Object类型进行原始转换后，按上面流程进行原始值比较

> 举一个栗子：
```
var a = {
  valueOf: function () {
     return1;
  },
  toString: function () {
     return'123'
  }
}
console.log(rue == a) // true;

```
    1. 首先，x与y类型不同，x为boolean类型，则进行ToNumber转换为1,为number类型
    2. x为number，y为object类型，对y进行原始转换，ToPrimitive(a, ?),没有指定转换类型，默认number类型
    3. ToPrimitive(a, Number)首先调用valueOf方法，返回1，得到原始类型1。
    4. 1 == 1， 返回true
```

同理适用于`>`、`<`、`!=`、`+`运算符的隐式转换（但要除去日期对象）
