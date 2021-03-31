/**fibonacci 数列**/
/*
// dp做法
const fibonacci = function (n) {
  if (n <= 1) return 1
  const arr = new Array(n)
  arr[0] = 1
  arr[1] = 1
  for (let i = 2; i < arr.length; i++) {
    arr[i] = arr[i - 1] + arr[i - 2]
  }
  return arr[n - 1]
}
console.log(fibonacci(100))
*/
/*
const fibonacci = function (n, curr = 1, next = 1) {
  if (n === 0) {
    return curr
  } else {
    return fibonacci(n - 1, next, curr + next)
  }
}
console.log(fibonacci(100))
*/

/**已知和一定，找出所有连续正整数序列**/
/*
const createArr = function (start, end) {
  const result = []
  for (let i = start; i <= end; i++) {
    result.push(i)
  }
  return result
}
const findSerice = function (sum) {
  const max = Math.ceil(sum / 2)
  const result = []
  for (let i = 1; i < max; i++) {
    for (let j = i + 1; j <= max; j++) {
      const curr = ((i + j) * (j - i + 1)) / 2
      if (curr > sum) break
      if (curr === sum) result.push(createArr(i, j))
    }
  }
  return result
}
console.log(findSerice(3))
*/

/**数组去重**/
/*
const arr = [1, 2, 3, 4, 3, 2, 5, 6, 5]
// ES6中 Set，再解构
console.log([...new Set(arr)])
*/
/*
// 数组的扁平化
const arr = [1, [2], [3, [4, 5]]]

// ES6 Array.flat
console.log(arr.flat(Infinity))
*/

/*
// toString
const flattedArr = arr
  .toString()
  .split(',')
  .map((value) => {
    return parseFloat(value)
  })
console.log(flattedArr)
*/

/*
const flattedArr = JSON.stringify(arr)
  .replace(/(\[|\])/g, '')
  .split(',')
  .map((value) => {
    return parseFloat(value)
  })
console.log(flattedArr)
*/

/*
// 逐层解构
let flattedArr = arr
while (flattedArr.some((value) => Array.isArray(value))) {
  flattedArr = [].concat(...flattedArr)
}
console.log(flattedArr)
*/

/*
// 深度递归
const flattedArr = []
const recursion = function (arr) {
  arr.forEach((value) => {
    if (!Array.isArray(value)) {
      flattedArr.push(value)
    } else {
      recursion(value)
    }
  })
}
recursion(arr)
console.log(flattedArr)
*/

/*
// 冒泡排序
// 思想：第一趟从第一个数开始，相邻两个数比较，前一个数大于后一个数，则交换位置，
// 直到倒数第一个数和倒数第二个数比较完成，则最大的放在来末尾
// 第二趟同理就能把第二大的数放在倒数第二位
// 经过n-1趟，数组的顺序就排好来
const bubbleSort = function (arr) {
  const len = arr.length
  for (let i = 0; i < len - 1; i++) {
    for (let j = 0; j < len - 1; j++) {
      let curr = arr[j]
      let next = arr[j + 1]
      if (curr > next) {
        ;[curr, next] = [next, curr]
        arr[j] = curr
        arr[j + 1] = next
      }
    }
  }
}
const arr = [1, 2, 5, 6, 0, 2, 4]
bubbleSort(arr)
console.log(arr)
*/

/*
// 插入排序
// 思想：从数组A中取出第一个数，取出来的数放入另一空数组B中
// 再按顺序取A第二个数，与另一个数组B中的数字逐个比较，直到发现比它小的数，插入到这个数的后面，
// 同理，依次往A后取数，直到A中数取完，B就是排好顺序的
const insertSort = function (arr) {
  const result = []
  if (arr.length <= 1) return arr
  result.push(arr[0])
  for (let i = 1; i < arr.length; i++) {
    for (let j = result.length - 1; j >= 0; j--) {
      if (result[j] <= arr[i]) {
        result.splice(j + 1, 0, arr[i])
        break
      }
    }
  }
  return result
}
const arr = [1, 2, 5, 6, 0, 2, 4]
console.log(insertSort(arr))
*/

// 快速排序
// 思想：取中间数，逐个与剩余数比较，比该数大的放在右边数组，否则放在左边数组
// 左右数组同理再分成左右数组，直到不能再分了，然后依次拼接起来得到最终排好顺序
const quickSort = function (arr) {
  if (arr.length <= 1) return arr
  const midIndex = Math.floor(arr.length / 2)
  const midValue = arr.splice(midIndex, 1)
  const leftArr = []
  const rightArr = []
  for (let i = 0; i < arr.length; i++) {
    const curr = arr[i]
    if (curr > midValue) {
      rightArr.push(curr)
    } else {
      leftArr.push(curr)
    }
  }
  const leftSortedArr = quickSort(leftArr)
  const rightSortedArr = quickSort(rightArr)
  return [...leftSortedArr, midValue, ...rightSortedArr]
}
const arr = [1, 2, 5, 6, 0, 2, 4]
console.log(quickSort(arr))
