---
title: 「超详笔记」算法——二分搜索与贪婪（JS版）
date: 2020-12-12 15:26:30
tags: [algorithm, javascript]
---

## 二分搜索（Binary Search）

二分搜索（折半搜索）的 `Wikipedia` 定义：是一种在有序数组中查找某一特定元素的搜索算法。从定义可知，运用二分搜索的前提是数组必须是排好序的。另外，输入并不一定是数组，也有可能是给定一个区间的起始和终止的位置。

**优点**：时间复杂度是 `O(lgn)`，非常高效。

因此也称为对数搜索。

**缺点**：要求待查找的数组或者区间是排好序的。

对数组进行动态的删除和插入操作并完成查找，平均复杂度会变为 `O(n)`。此时应当考虑采取自平衡的二叉查找树：

- 在 `O(nlogn)` 的时间内用给定的数据构建出一棵二叉查找树；
- 在 `O(logn)` 的时间里对目标数据进行搜索；
- 在 `O(logn)` 的时间里完成删除和插入的操作。

因此，当输入的数组或者区间是排好序的，同时又不会经常变动，而要求从里面找出一个满足条件的元素的时候，二分搜索就是最好的选择。

二分搜索一般化的解题思路如下。

![bs-1](/gb/algorithm-binary-search-greedy/bs-1.gif)

- 从已经排好序的数组或区间中取出中间位置的元素，判断该元素是否满足要搜索的条件，如果满足，停止搜索，程序结束。
- 如果正中间的元素不满足条件，则从它两边的区域进行搜索。由于数组是排好序的，可以利用排除法，确定接下来应该从这两个区间中的哪一个去搜索。
- 通过判断，如果发现真正要找的元素在左半区间的话，就继续在左半区间里进行二分搜索。反之，就在右半区间里进行二分搜索。

### 二分搜索递归解法

优点：简洁；缺点：执行消耗大

例题：假设我们要从一个排好序的数组里 `{1, 3, 4, 6, 7, 8, 10, 13, 14}` 查看一下数字 `7` 是否在里面，如果在，返回它的下标，否则返回 `-1`。

### 二分搜索递归解法代码实现

```js
// 递归解法，进行二分搜索
const binarySearch = function (nums, target, low, high) {
  low = low === undefined ? 0 : low
  high = high === undefined ? nums.length : high

  // 为了避免无线循环，先判断，如果七点位置大于终点位置，表明这是一个非法的区间
  // 已经尝试了所有的搜索区间还是没找到结果，返回-1
  if (low > high) {
    return -1
  }
  // 取正中间那个数的下标 middle
  let middle = low + Math.floor((high - low) / 2)

  // 判断一下正中间的那个数是不是要找的目标数 target
  if (nums[middle] === target) {
    return middle
  }

  // 如果发现目标数在左边，就递归地从左边进行二分搜索
  // 否则从右半边递归地二分搜索
  if (target < nums[middle]) {
    return binarySearch(nums, target, low, middle - 1)
  } else {
    return binarySearch(nums, target, middle + 1, high)
  }
}
const arr = [1, 3, 4, 6, 7, 8, 10, 13, 14]
console.log('index: ', binarySearch(arr, 7))
// index: 4
```

注意：

- 在计算 `middle` 下标的时候，不能简单地用 `(low + hight) / 2`，可能会导致溢出。
- 在取左半边以及右半边的区间时，左半边是 `[low, middle - 1]`，右半边是 `[middle + 1, high]`，这是两个闭区间。因为已经确定了 `middle` 那个点不是我们要找的，就没有必要再把它加入到左、右半边了。
- 对于一个长度为奇数的数组，例如：`{1, 2, 3, 4, 5}`，按照 `low + (high - low) / 2` 来计算，`middle` 就是正中间的那个位置，对于一个长度为偶数的数组，例如 `{1, 2, 3, 4}`，`middle` 就是正中间靠左边的一个位置。

### 二分搜索递归解法时间复杂度

假设我们要对长度为 `n` 的数组进行二分搜索，`T(n)` 是执行时间函数，我们可以得到

`T(n) = T(n/2) + 1`

代入公式法得：`a = 1`，`b = 2`，`f(n) = 1`，因此：`O(nlog(b)a) = O(n0) = 1` 等于 `O(f(n))`，时间复杂度就是 `O(nlog(b)alogn) = O(logn)`。

### 二分搜索非递归解法代码实现

二分搜索递归解法实际是将 `low` 和 `high` 不断向 `target` 靠拢的过程。其实，可以将这个过程通过 `middle` 交换赋值循环方式替代，从而变成非递归形式。

```js
// 非递归解法，进行二分搜索
const binarySearch = function (nums, target, low, high) {
  low = low === undefined ? 0 : low
  high = high === undefined ? nums.length : high

  // 在 while 循环里，判断搜索的区间范围是否有效
  while (low <= high) {
    let middle = low + Math.floor((high - low) / 2)

    // 判断一下正中间的那个数是不是要找的目标数 target
    if (nums[middle] === target) {
      return middle
    }

    // 如果发现目标数在左边，调整搜索区间的终点为 middle - 1
    // 否则，调整搜索区间的起点为 middle + 1
    if (target < nums[middle]) {
      high = middle - 1
    } else {
      low = middle + 1
    }
  }

  // 如果超出搜索区间，表明无法找到目标数，返回 -1
  return -1
}

const arr = [1, 3, 4, 6, 7, 8, 10, 13, 14]
console.log('index: ', binarySearch(arr, 7))
// index: 4
```

### 二分搜索：找确定的边界问题

边界分上边界和下边界，有时候也被成为右边界和左边界。确定的边界指边界的数值等于要找的目标数。

例题：`LeetCode` 第 `34` 题，在一个排好序的数组中找出某个数第一次出现和最后一次出现的下标位置。

示例：输入的数组是：`[5, 7, 7, 8, 8, 10]`，目标数是 `8`，那么返回 `[3, 4]`，其中 `3` 是 `8` 第一次出现的下标位置，`4` 是 `8` 最后一次出现的下标位置。

![bs-2](/gb/algorithm-binary-search-greedy/bs-2.gif)

### 二分搜索找确定的边界问题解题思路

在二分搜索里，比较难的是判断逻辑，对这道题来说，什么时候知道这个位置是不是 `8` 第一次以及最后出现的地方呢？

把第一次出现的地方叫下边界（`lower bound`），把最后一次出现的地方叫上边界（`upper bound`）。

那么成为 `8` 的下边界的条件应该有两个。

1. 该数必须是 `8`；
2. 该数的左边一个数必须不是 `8`：

`8` 的左边有数，那么该数必须小于 `8`；
`8` 的左边没有数，即 `8` 是数组的第一个数。

而成为 `8` 的上边界的条件也应该有两个。

1. 该数必须是 `8`；
2. 该数的右边一个数必须不是 `8`：

`8` 的右边有数，那么该数必须大于 `8`；
`8` 的右边没有数，即 `8` 是数组的最后一个数。

### 二分搜索找确定的边界问题代码实现

用递归的方法来寻找下边界，代码如下。

```js
// 二分法查找下边界
const searchLowerBound = function (nums, target, low, high) {
  low = low === undefined ? 0 : low
  high = high === undefined ? nums.length : high

  if (low > high) {
    return -1
  }

  let middle = low + Math.floor((high - low) / 2)

  // 判断是否是下边界时， 先看看 middle 的数是否为 target ，并判断该数字、是否已为数组第一个数
  // 或者，它左边的一个数是不是已经比它小，如果都满足，即为下边界
  if (nums[middle] === target && (middle === 0 || nums[middle - 1] < target)) {
    return middle
  }

  // 如果发现目标数在左边，就递归地从左边进行二分搜索
  // 否则从右半边递归地二分搜索
  if (target <= nums[middle]) {
    return searchLowerBound(nums, target, low, middle - 1)
  } else {
    return searchLowerBound(nums, target, middle + 1, high)
  }
}
```

查找上边界的代码如下。

```js
// 二分法查找上边界
const searchUpperBound = function (nums, target, low, high) {
  low = low === undefined ? 0 : low
  high = high === undefined ? nums.length : high

  if (low > high) {
    return -1
  }

  let middle = low + Math.floor((high - low) / 2)

  // 判断是否是上边界时，先看看 middle 的数是否为 target，并判断该数是否已为数组的最后一个数，
  // 或者，它右边的数是不是比它大，如果都满足，即为上边界
  if (nums[middle] === target && (middle === nums.length - 1 || nums[middle + 1] > target)) {
    return middle
  }

  // 如果发现目标数在左边，就递归地从左边进行二分搜索
  // 否则从右半边递归地二分搜索
  if (target < nums[middle]) {
    return searchUpperBound(nums, target, low, middle - 1)
  } else {
    return searchUpperBound(nums, target, middle + 1, high)
  }
}
```

### 二分搜索：找模糊边界问题

二分搜索可以用来查找一些模糊的边界。模糊的边界指，边界的值并不等于目标的值，而是大于或者小于目标的值。

例题：从数组 `[-2, 0, 1, 4, 7, 9, 10]` 中找到第一个大于 `6` 的数。

### 二分搜索找模糊边界问题解题思路

在一个排好序的数组里，判断一个数是不是第一个大于 `6` 的数，只要它满足如下的条件：

- 该数要大于 `6`；
- 该数有可能是数组里的第一个数，或者它之前的一个数比 `6` 小。
  只要满足了上面的条件就是第一个大于 `6` 的数。

### 二分搜索找模糊边界问题代码实现

```js
// 对于查找模糊边界，进行二分搜索
const firstGreaterThan = function (nums, target, low, high) {
  low = low === undefined ? 0 : low
  high = high === undefined ? nums.length : high

  if (low > high) {
    return null
  }

  let middle = low + Math.floor((high - low) / 2)

  // 判断 middle 指向的数是否为第一个比 target 大的数时，须同时满足两个条件：
  // middle 这个数必须大于 target
  // middle 要么是第一个数，要么它之前的数小于或等于 target
  if (nums[middle] > target && (middle === 0 || nums[middle - 1] <= target)) {
    return middle
  }

  if (target < nums[middle]) {
    return firstGreaterThan(nums, target, low, middle - 1)
  } else {
    return firstGreaterThan(nums, target, middle + 1, high)
  }
}

const arr = [-2, 0, 1, 4, 7, 9, 10]
console.log(firstGreaterThan(arr, 6))
// 4
```

### 二分搜索：旋转过的排序数组

二分搜索也能在经过旋转了的排序数组中进行。

例题：`LeetCode` 第 `33` 题，给定一个经过旋转了的排序数组，判断一下某个数是否在里面。

示例：给定数组为 `[4, 5, 6, 7, 0, 1, 2]`，`target` 等于 `0`，答案是 `4`，即 `0` 所在的位置下标是 `4`。

### 二分搜索找旋转过的排序数组问题解题思路

对于这道题，输入数组不是完整排好序，还能运用二分搜索吗？思路如下。

一开始，中位数是 `7`，并不是我们要找的 `0`，如何判断往左边还是右边搜索呢？这个数组是经过旋转的，即，从数组中的某个位置开始划分，左边和右边都是排好序的。

如何判断左边是不是排好序的那个部分呢？只要比较 `nums[low]` 和 `nums[middle]`。`nums[low] <= nums[middle]` 时，能判定左边这部分一定是排好序的，否则，右边部分一定是排好序的。

![bs-3](/gb/algorithm-binary-search-greedy/bs-3.gif)

为什么要判断 `nums[low] = nums[middle]` 的情况呢？因为计算 `middle` 的公式是 `int middle = low + (high - low) / 2`。

当只有一个数的时候，`low=high`，`middle=ow`，同样认为这一边是排好序的。

判定某一边是排好序的，有什么用处呢？能准确地判断目标值是否在这个区间里。如果 `nums[low] <= target && target < nums[middle]`，则应该在这个区间里搜索目标值。反之，目标值肯定在另外一边。

### 二分搜索找旋转过的排序数组问题代码实现

```js
// 对于旋转过的排序数组，进行二分搜索
const binarySearch = function (nums, target, low, high) {
  low = low === undefined ? 0 : low
  high = high === undefined ? nums.length : high

  let middle = low + Math.floor((high - low) / 2)

  // 判断中位数是否要找的数
  if (nums[middle] === target) {
    return middle
  }

  // 判断左半边是不是排好序
  if (nums[low] <= nums[middle]) {
    // 判断目标值是否在左半边
    // 是，则在左半边搜索
    // 否，则在右半边搜索
    if (nums[low] <= target && target < nums[middle]) {
      return binarySearch(nums, target, low, middle - 1)
    }
    return binarySearch(nums, target, middle + 1, high)
  } else {
    // 右半边是排好序的那一半，判断目标值是否在右边
    // 是，则在右半边继续进行二分搜索
    // 否，则在左半边进行二分搜索
    if (nums[middle] < target && target <= nums[high]) {
      return binarySearch(nums, target, middle + 1, high)
    }
    return binarySearch(nums, target, low, middle - 1)
  }
}

const arr = [4, 5, 6, 7, 0, 1, 2]
console.log(binarySearch(arr, 6))
// 2
```

在决定在哪一边进行二分搜索的时候，利用了旋转数组的性质，这就是这道题的巧妙之处。

### 二分搜索：不定长的边界

前面介绍的二分搜索的例题都给定了一个具体范围或者区间，那么对于没有给定明确区间的问题能不能运用二分搜索呢？

例题：有一段不知道具体长度的日志文件，里面记录了每次登录的时间戳，已知日志是按顺序从头到尾记录的，没有记录日志的地方为空，要求当前日志的长度。

### 二分搜索不定长的边界问题解题思路

可以把这个问题看成是不知道长度的数组，数组从头开始记录都是时间戳，到了某个位置就成为了空：`[2019-01-14, 2019-01-17, … , 2019-08-04, …. , null, null, null ...]`。

思路 1：顺序遍历该数组，一直遍历下去，当发现第一个 `null` 的时候，就知道了日志的总数量。很显然，这是很低效的办法。

思路 2：借用二分搜索的思想，反着进行搜索。

- 一开始设置 `low = 0`，`high = 1`
- 只要 `logs[high]` 不为 `null`，`high *= 2`
- 当 `logs[high]` 为 `null` 的时候，可以在区间 `[0, high]` 进行普通的二分搜索

### 二分搜索不定长的边界问题代码实现

```js
// 对于不定长边界问题，进行二分搜索
// 不断试探在什么位置出现空的日志
const getUpperBound = function (logs, high) {
  high = high === undefined ? 1 : high

  if (logs[high] === null) {
    return high
  }
  if (logs[high] === undefined) {
    return logs.length
  }
  return getUpperBound(logs, high * 2)
}

// 运用二分搜索寻找日志长度
const binarySearch = function (logs, low, high) {
  low = low === undefined ? 0 : low
  high = high === undefined ? logs.length : high

  if (low > high) {
    return -1
  }

  let middle = low + Math.floor((high - low) / 2)

  if (logs[middle] === null && logs[middle - 1] !== null) {
    return middle
  }

  if (logs[middle] === null) {
    return binarySearch(logs, low, middle - 1)
  } else {
    return binarySearch(logs, middle + 1, high)
  }
}

const arr = [1, 2, 3, 4, 5, null, null, null]
console.log(binarySearch(arr, 0, getUpperBound(arr)))
// 5
```

## 贪婪（Greedy）

贪婪算法的 `Wikipedia` 定义：是一种在每一步选中都采取在当前状态下最好或最优的选择，从而希望导致结果是最好或最优的算法。

优点：对于一些问题，非常直观有效。

缺点：

- 并不是所有问题都能用它去解决；
- 得到的结果并一定不是正确的，因为这种算法容易过早地做出决定，从而没有办法达到最优解。

下面通过例题来加深对贪婪算法的认识。例题：`0-1` 背包问题，能不能运用贪婪算法去解决。

有三种策略：

- 选取价值最大的物品
- 选择重量最轻的物品
- 选取价值/重量比最大的物品

策略 1：每次尽可能选择价值最大的，行不通。举例说明如下。

物品有：`A` `B` `C`
重量分别是：`25`, `10`, `10`
价值分别是：`100`，`80`，`80`

根据策略，首先选取物品 `A`，接下来就不能再去选其他物品，但是，如果选取 `B` 和 `C`，结果会更好。

策略 2：每次尽可能选择轻的物品，行不通。举例说明如下。

物品有：`A` `B` `C`
重量分别为：`25`, `10`, `10`
价值分别为：`100`, `5`, `5`

根据策略，首先选取物品 `B` 和 `C`，接下来就不能选 `A`，但是，如果选 `A`，价值更大。

策略 3：每次尽可能选价值/重量比最大的，行不通。举例说明如下。

物品有：`A` `B` `C`
重量是：`25`, `10`, `10`
价值是：`25`, `10`, `10`

根据策略，三种物品的价值/重量比都是一样，如果选 `A`，答案不对，应该选 `B` 和 `C`。

由上，贪婪算法总是做出在当前看来是最好的选择。即，它不从整体的角度去考虑，仅仅对局部的最优解感兴趣。因此，只有当那些局部最优策略能产生全局最优策略的时候，才能用贪婪算法。

### 定会议室问题

`LeetCode` 第 `253` 题，会议室 II，给定一系列会议的起始时间和结束时间，求最少需要多少个会议室就可以让这些会议顺利召开。

### 定会议室问题解题思路

思路 1：暴力法。

- 把所有的会议组合找出来；
- 从最长的组合开始检查，看看各个会议之间有没有冲突；
- 直到发现一组会议没有冲突，那么它就是答案。

很明显，这样的解法是非常没有效率的。

思路 2：贪婪算法

- 会议按照起始时间顺序进行；
- 要给新的即将开始的会议找会议室时，先看当前有无空会议室；
- 有则在空会议室开会，无则开设一间新会议室。

### 定会议室问题代码实现

```js
// 获取已安排会议室中最早结束的会议
const getEarlyEndMetting = function (meetingRooms) {
  meetingRooms.sort((a, b) => a.end - b.end)
  return meetingRooms.shift()
}

const minMeetingRooms = function (intervals) {
  // 将会议按开始时间排序
  intervals.sort((a, b) => a.start - b.start)

  const meetingRooms = []

  // 让第一个会议在第一个会议室举行
  meetingRooms.push(intervals[0])

  for (let i = 1; i < intervals.length; i++) {
    const meeting = getEarlyEndMetting(meetingRooms)

    // 从第二个会议开始，对于每个会议，都从安排会议室的会议中取出一个最早结束的
    // 若当前会议可以等会议室被腾出才开始，那么就可以重复利用这个会议室
    if (intervals[i].start >= meeting.end) {
      meeting.end = intervals[i].end
    } else {
      meetingRooms.push(intervals[i])
    }
    // 将取出的会议重新放回已分配的会议室里
    meetingRooms.push(meeting)
  }
  console.log('meetingRooms: ', meetingRooms)
  // meetingRooms:  [ { start: 1, end: 7 }, { start: 2, end: 8 } ]
  return meetingRooms.length
}

const arr = [
  { start: 1, end: 3 },
  { start: 4, end: 5 },
  { start: 5, end: 6 },
  { start: 2, end: 4 },
  { start: 4, end: 7 },
  { start: 6, end: 7 },
  { start: 7, end: 8 }
]

console.log(minMeetingRooms(arr))
// 2
```

为什么贪婪算法能在这里成立？
每当遇到一个新的会议时，总是贪婪地从所有会议室里找出最先结束会议的那个。

为什么这样可以产生最优的结果？
若选择的会议室中会议未结束，则意味着需要开辟一个新会议室，这已经不是当前的最优解了。
