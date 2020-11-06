---
title: 「超详笔记」算法——递归与回溯（JS版）
date: 2020-11-06 23:11:35
tags: [javascript, algorithm]
---

> 递归和回溯的关系密不可分：
> 递归的基本性质就是函数调用，在处理问题的时候，递归往往是把一个大规模的问题不断地变小然后进行推导的过程。
> 回溯则是利用递归的性质，从问题的起始点出发，不断地进行尝试，回头一步甚至多步再做选择，直到最终抵达终点的过程。

## 递归（Recursion）

### 递归算法思想

递归算法是一种调用自身函数的算法（二叉树的许多性质在定义上就满足递归）。

### 汉诺塔问题

有三个塔 `A`、`B`、`C`，一开始的时候，在塔 `A` 上放着 `n` 个盘子，它们自底向上按照从大到小的顺序叠放。现在要求将塔 `A` 中所有的盘子搬到塔 `C` 上，让你打印出搬运的步骤。在搬运的过程中，每次只能搬运一个盘子，另外，任何时候，无论在哪个塔上，大盘子不能放在小盘子的上面。

![hano](/gb/algorithm-recursion-backtracking/hano.gif)

### 汉诺塔问题解法

- 从最终的结果出发，要把 `n` 个盘子按照大小顺序叠放在塔 `C` 上，就需要将塔 `A` 的底部最大的盘子搬到塔 `C`；

- 为了实现步骤 `1`，需要将除了这个最大盘子之外的其余盘子都放到塔 `B` 上。

由上可知，将原来的问题规模从 `n` 个盘子变成了 `n-1` 个盘子，即将 `n-1` 个盘子转移到塔 `B` 上。

如果一个函数，能将 `n` 个盘子从塔 `A`，借助塔 `B`，搬到塔 `C`。那么，也可以利用该函数将 `n-1` 个盘子从塔 `A`，借助塔 `C`，搬到塔 `B`。同理，不断地把问题规模变小，当 `n` 为 `1`，也就是只有 `1` 个盘子的时候，直接打印出步骤。

### 汉诺塔问题代码示例

```js
// 汉诺塔问题
const hano = function (A, B, C, n) {
  if (n > 0) {
    hano(A, C, B, n - 1)
    move(A, C)
    hano(B, A, C, n - 1)
  }
}

const move = function (p, c) {
  const temp = p.pop()
  c.push(temp)
}
const a = [1, 2, 3, 4, 5]
const b = []
const c = []
hano(a, b, c, a.length)

console.log('----after----')
console.log('a: ', String(a)) //
console.log('b: ', String(b)) //
console.log('c: ', String(c)) // 1, 2, 3, 4, 5
```

由上述总结出递归的算法思想，将一个问题的规模变小，然后再利用从小规模问题中得出的结果，结合当前的值或者情况，得出最终的结果。

通俗来说，把要实现的递归函数看成是已经实现好的， 直接利用解决一些子问题，然后需要考虑的就是如何根据子问题的解以及当前面对的情况得出答案。这种算法也被称为自顶向下（`Top-Down`）的算法。

### 数字解码问题

LeetCode 第 91 题，解码的方法。
一条包含字母  A-Z  的消息通过以下方式进行了编码：
'A' -> 1
'B' -> 2
…
'Z' -> 26
给定一个只包含数字的非空字符串，请计算解码方法的总数。

### 数字解码解题思路

- 就例题中的第二个例子，给定编码后的消息是字符串“226”，如果对其中“22”的解码有 `m` 种可能，那么，加多一个“6”在最后，相当于在最终解密出来的字符串里多了一个“F”字符而已，总体的解码还是只有 m 种。

- 对于“6”而言，如果它的前面是”1”或者“2”，那么它就有可能是“16”，“26”，所以还可以再往前看一个字符，发现它是“26”。而前面的解码组合是 `k` 个，那么在这 `k` 个解出的编码里，添加一个“Z”，所以总的解码个数就是 `m+k`。

### 数字解码代码实现

```js
const numDecoding = function (str) {
  if (str.charAt(0) === '0') return 0
  const chars = [...str]
  return decode(chars, chars.length - 1)
}

// 字符串转化成字符组，利用递归函数 decode，从最后一个字符串向前递归
const decode = function (chars, index) {
  if (index <= 0) return 1
  let count = 0
  let curr = chars[index]
  let prev = chars[index - 1]

  // 当前字符比 `0` 大，则直接利用它之前的字符串所求得结果
  if (curr > '0') {
    count = decode(chars, index - 1)
  }

  // 由前一个字符和当前字符构成的数字，值必须要在1和26之间，否则无法编码
  if (prev === '1' || (prev == '2' && curr <= '6')) {
    count += decode(chars, index - 2)
  }

  return count
}

console.log('count: ', numDecoding('1213')) // count: 5
```

### 递归问题解题模板

通过上述例题，来归纳总结一下递归函数的解题模版。

解题步骤

- 判断当前情况是否非法，如果非法就立即返回，这一步也被称为完整性检查（`Sanity Check`）。例如，看看当前处理的情况是否越界，是否出现了不满足条件的情况。通常，这一部分代码都是写在最前面的。

- 判断是否满足结束递归的条件。在这一步当中，处理的基本上都是一些推导过程当中所定义的初始情况。

- 将问题的规模缩小，递归调用。在归并排序和快速排序中，我们将问题的规模缩小了一半，而在汉诺塔和解码的例子中，我们将问题的规模缩小了一个。

- 利用在小规模问题中的答案，结合当前的数据进行整合，得出最终的答案。

### 递归问题解题模板代码实现

```js
function fn(n) {
    // 第一步：判断输入或者状态是否非法？
    if (input/state is invalid) {
        return;
    }

    // 第二步：判读递归是否应当结束?
    if (match condition) {
        return some value;
    }

    // 第三步：缩小问题规模
    result1 = fn(n1)
    result2 = fn(n2)
    ...

    // 第四步: 整合结果
    return combine(result1, result2)
}
```

### 中心对称数问题

LeetCode 第 247 题：找到所有长度为 `n` 的中心对称数。

示例
输入:  n = 2
输出: ["11","69","88","96"]

### 中心对称数问题解题思路

![symmetric-number](/gb/algorithm-recursion-backtracking/symmetric-number.gif)

- 当 `n=0` 的时候，应该输出空字符串：`“ ”`。

- 当 `n=1` 的时候，也就是长度为 `1` 的中心对称数有：`0，1，8`。

- 当 `n=2` 的时候，长度为 `2` 的中心对称数有：`11， 69，88，96`。注意：`00` 并不是一个合法的结果。

- 当 `n=3` 的时候，只需要在长度为 `1` 的合法中心对称数的基础上，不断地在两边添加 `11，69，88，96` 就可以了。

[101, 609, 808, 906, 111, 619, 818, 916, 181, 689, 888, 986]

随着 `n` 不断地增长，我们只需要在长度为 `n-2` 的中心对称数两边添加 `11，69，88，96` 即可。

### 中心对称数问题代码实现

```js
const helper = function (n) {
  debugger
  // 第一步：判断输入或状态是否非法
  if (n < 0) {
    throw new Error('illegal argument')
  }

  // 第二步：判读递归是否应当结束
  if (n === 0) {
    return ['']
  }
  if (n === 1) {
    return ['0', '1', '8']
  }

  // 第三步：缩小问题规模
  const list = helper(n - 2)

  // 第四步：整合结果
  const res = []

  for (let i = 0; i < list.length; i++) {
    let s = list[i]
    res.push('1' + s + '1')
    res.push('6' + s + '9')
    res.push('8' + s + '8')
    res.push('9' + s + '6')
  }
  return res
}
console.log(helper(2)) // [ '11', '69', '88', '96' ]
```

## 回溯（Backtracking）

### 回溯算法思想

回溯实际上是一种试探算法，这种算法跟暴力搜索最大的不同在于，在回溯算法里，是一步一步地小心翼翼地进行向前试探，会对每一步探测到的情况进行评估，如果当前的情况已经无法满足要求，那么就没有必要继续进行下去，也就是说，它可以帮助我们避免走很多的弯路。

回溯算法的特点在于，当出现非法的情况时，算法可以回退到之前的情景，可以是返回一步，有时候甚至可以返回多步，然后再去尝试别的路径和办法。这也就意味着，想要采用回溯算法，就必须保证，每次都有多种尝试的可能。

### 回溯算法解题模板

解题步骤：

- 判断当前情况是否非法，如果非法就立即返回；

- 当前情况是否已经满足递归结束条件，如果是就将当前结果保存起来并返回；

- 当前情况下，遍历所有可能出现的情况并进行下一步的尝试；

- 递归完毕后，立即回溯，回溯的方法就是取消前一步进行的尝试。

### 回溯算法解题代码

```js
function fn(n) {
  // 第一步：判断输入或者状态是否非法？
  if (input/state is invalid) {
    return;
  }
  
  // 第二步：判读递归是否应当结束?
  if (match condition) {
    return some value;
  }

  // 遍历所有可能出现的情况
  for (all possible cases) {  
    // 第三步: 尝试下一步的可能性
    solution.push(case)
    // 递归
    result = fn(m)

    // 第四步：回溯到上一步
    solution.pop(case)
  }
}
```

### 凑整数问题

LeetCode 第 39 题：给定一个无重复元素的数组 `candidates` 和一个目标数  `target` ，找出 `candidates` 中所有可以使数字和为 `target` 的组合。candidates  中的数字可以无限制重复被选取。

说明：
所有数字（包括 `target`）都是正整数。
解集不能包含重复的组合。

### 凑整数问题解题思路

题目要求的是所有不重复的子集，而且子集里的元素的值的总和等于一个给定的目标。

**思路 1**：暴力法。

罗列出所有的子集组合，然后逐个判断它们的总和是否为给定的目标值。解法非常慢。

**思路 2**：回溯法。

从一个空的集合开始，小心翼翼地往里面添加元素。

每次添加，检查一下当前的总和是否等于给定的目标。

如果总和已经超出了目标，说明没有必要再尝试其他的元素了，返回并尝试其他的元素；

如果总和等于目标，就把当前的组合添加到结果当中，表明我们找到了一种满足要求的组合，同时返回，并试图寻找其他的集合。

### 凑整数问题代码实现

```js
const combinationSum = function (candidates, target) {
  const results = []
  backtracking(candidates, target, 0, [], results)
  return results
}

const backtracking = function (candidates, target, start, solution, results) {
  if (target < 0) {
    return false
  }

  if (target === 0) {
    results.push([...solution])
    return true
  }

  for (let i = start; i < candidates.length; i++) {
    solution.push(candidates[i])
    backtracking(candidates, target - candidates[i], i, solution, results)
    solution.pop()
  }
}

console.log(combinationSum([1, 2, 3], 5))
// [ [ 1, 1, 1, 1, 1 ],
//   [ 1, 1, 1, 2 ],
//   [ 1, 1, 3 ],
//   [ 1, 2, 2 ],
//   [ 2, 3 ] ]
```

在主函数里：

- 定义一个 `results` 数组用来保存最终的结果；

- 调用函数 `backtracking`，并将初始的情况以及 `results` 传递进去，这里的初始情况就是从第一个元素开始尝试，而且初始的子集为空。

在 `backtracking` 函数里：

- 检查当前的元素总和是否已经超出了目标给定的值，每添加进一个新的元素时，就将它从目标总和中减去；

- 如果总和已经超出了目标给定值，就立即返回，去尝试其他的数值；

- 如果总和刚好等于目标值，就把当前的子集添加到结果中。

在循环体内：

- 每次添加了一个新的元素，立即递归调用 `backtracking`，看是否找到了合适的子集

- 递归完毕后，要把上次尝试的元素从子集里删除，这是最重要的。

以上，就完成了回溯。

提示：这是一个最经典的回溯的题目，麻雀虽小，但五脏俱全。它完整地体现了回溯算法的各个阶段。

### N 皇后问题

LeetCode 第 51 题， 在一个 `N×N` 的国际象棋棋盘上放置 `N` 个皇后，每行一个并使她们不能互相攻击。给定一个整数 `N`，返回 `N` 皇后不同的的解决方案的数量。

### N 皇后问题解题思路

解决 `N` 皇后问题的关键就是如何判断当前各个皇后的摆放是否合法。

![nqueen](/gb/algorithm-recursion-backtracking/nqueen.gif)

利用一个数组 `columns[]` 来记录每一行里皇后所在的列。例如，第一行的皇后如果放置在第 `5` 列的位置上，那么 `columns[0] = 6`。从第一行开始放置皇后，每行只放置一个，假设之前的摆放都不会产生冲突，现在将皇后放在第 `row` 行第 `col` 列上，检查一下这样的摆放是否合理。

方法就是沿着两个方向检查是否存在冲突就可以了。

### N 皇后问题代码实现

首先，从第一行开始直到第 `row` 行的前一行为止，看那一行所放置的皇后是否在 `col` 列上，或者是不是在它的对角线上，代码如下。

```js
const check = function (row, col, columns) {
  for (let r = 0; r < row; r++) {
    // 其他皇后是否在当前放置皇后的列和对角线上
    if ((columns[r] = col || row - r == Math.abs(columns[r] - col))) {
      return false
    }
  }
  return true
}
```

然后进行回溯的操作，代码如下。

```js
const totalNQueens = function (n) {
  const results = []
  backtracking(n, 0, [], [], results)
  console.log('results: ', results) // results: [ [ [ 0, 0 ], [ 1, 0 ], [ 2, 0 ] ],[ [ 0, 2 ], [ 1, 0 ], [ 2, 0 ] ] ]
  console.log('count: ', results.length) // count: 2
}

const backtracking = function (n, row, columns, solution, results) {
  // 是否在所有 n 行里都摆好了皇后
  if (row === n) {
    results.push([...solution])
    return
  }

  // 尝试将皇后放置到当前行中的每一列
  for (let col = 0; col < n; col++) {
    columns[row] = col
    solution.push([row, col])

    // 检查是否合法，如果合法就继续到下一行
    if (check(row, col, columns)) {
      backtracking(n, row + 1, columns, solution, results)
    }
    solution.pop()
    // 如果不合法，就不要把皇后放在这列中
    columns[row] = -1
  }
}

totalNQueens(3)
```
