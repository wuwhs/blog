/*
// 冒泡排序
const bubbleSort = function (arr) {
  const len = arr.length
  let hasChange = true
  for (let i = 0; i < len - 1 && hasChange; i++) {
    hasChange = false
    for (let j = 0; j < len - 1 - i; j++) {
      let [curr, next] = [arr[j], arr[j + 1]]
      if (curr > next) {
        arr[j] = next
        arr[j + 1] = curr
        hasChange = true
      }
    }
  }
}
const arr = [1, 3, 2, 5, 6, 7, 8, 9]
bubbleSort(arr)
console.log(arr)
*/

/*
// 归并排序
const mergeSort = function (arr) {
  if (arr.length <= 1) return arr
  const len = arr.length
  const middle = Math.floor(len / 2)
  const leftArr = arr.slice(0, middle)
  const rightArr = arr.slice(middle)
  const leftSortedArr = mergeSort(leftArr)
  const rightSortedArr = mergeSort(rightArr)
  return merge(leftSortedArr, rightSortedArr)
}

const merge = function (leftSortedArr, rightSortedArr) {
  const result = []
  let i = 0
  let j = 0
  const leftLen = leftSortedArr.length
  const rightLen = rightSortedArr.length
  while (true) {
    if (i >= leftLen) {
      // 左边数组的数取完了
      result.push(...rightSortedArr.slice(j))
      break
    } else if (j >= rightLen) {
      // 右边数组的数取完了
      result.push(...leftSortedArr.slice(i))
      break
    } else if (leftSortedArr[i] > rightSortedArr[j]) {
      // 左边的数大于右边的数
      result.push(leftSortedArr[i++])
    } else {
      result.push(rightSortedArr[j++])
    }
  }
  return result
}

const arr = [0, 3, 2, 5, 16, 7, 8, 9]
console.log(mergeSort(arr))
*/

/*
// 快速排序
const quickSort = function (arr) {
  if (arr.length <= 1) {
    return arr
  }
  const len = arr.length
  const middle = Math.floor(len / 2)
  const middleValue = arr.splice(middle, 1)[0]
  const leftArr = []
  const rightArr = []

  for (let i = 0; i < arr.length; i++) {
    const curr = arr[i]
    if (curr > middleValue) {
      rightArr.push(curr)
    } else {
      leftArr.push(curr)
    }
  }
  const leftSortedArr = quickSort(leftArr)
  const rightSortedArr = quickSort(rightArr)
  return [...leftSortedArr, middleValue, ...rightSortedArr]
}
const arr = [0, 3, 2, 5, 16, 7, 8, 9]
console.log(quickSort(arr))
*/

/*
// 插入排序
const insertSort = function (arr) {
  let curr = arr[0]
  const result = [curr]
  for (let i = 1; i < arr.length; i++) {
    curr = arr[i]
    for (let j = result.length - 1; j >= 0; j--) {
      if (result[j] <= curr) {
        result.splice(j + 1, 0, curr)
        break
      }
      if (j === 0) {
        result.unshift(curr)
      }
    }
  }
  return result
}

const arr = [10, 3, 2, 5, 16, 7, 8, 9]
console.log(insertSort(arr))
*/

/*
// 和一定，遍历所有组合
const combinationSum = function (arr, target) {
  if (target <= 0) return []
  const result = []
  combine(arr, target, result, [], 0)
  return result
}

const combine = function (arr, target, result, solution, start) {
  if (target === 0) {
    return result.push([...solution])
  }
  if (target < 0) {
    return
  }
  for (let i = start; i < arr.length; i++) {
    const curr = arr[i]
    solution.push(curr)
    combine(arr, target - curr, result, solution, i)
    solution.pop(curr)
  }
}

const arr = [10, 3, 2, 5, 16, 7, 8, 9]
console.log(combinationSum(arr, 15))
*/

/*
// 和一定，取所有连续正整数
const findSerice = function (target) {
  const result = []
  const upper = Math.ceil(target / 2)
  for (let i = 1; i < upper; i++) {
    for (let j = i + 1; j <= upper; j++) {
      const sum = ((i + j) * (j - i + 1)) / 2

      if (sum > target) break
      if (sum === target) {
        result.push(createArr(i, j))
        break
      }
    }
  }
  return result
}

const createArr = function (lo, hi) {
  const arr = []
  let i = 0
  while (i <= hi - lo) {
    arr.push(lo + i)
    i++
  }
  return arr
}
console.log(findSerice(15))
*/
