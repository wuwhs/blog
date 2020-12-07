/** 二分搜素 */

// const binarySearch = function (nums, target, low, high) {
//   if (low === undefined) {
//     low = 0
//   }
//   if (high === undefined) {
//     high = nums.length
//   }

//   // 为了避免无线循环，先判断，如果七点位置大于终点位置，表明这是一个非法的区间
//   // 已经尝试了所有的搜索区间还是没找到结果，返回-1
//   if (low > high) {
//     return -1
//   }
//   // 取正中间那个数的下标 middle
//   let middle = low + Math.floor((high - low) / 2)

//   // 判断一下正中间的那个数是不是要找的目标数 target
//   if (nums[middle] === target) {
//     return middle
//   }

//   // 如果发现目标数在左边，就递归地从左边进行二分搜索
//   // 否则从右半边递归地二分搜索
//   if (target < nums[middle]) {
//     return binarySearch(nums, target, low, middle - 1)
//   } else {
//     return binarySearch(nums, target, middle + 1, high)
//   }
// }
// const arr = [1, 3, 4, 6, 7, 8, 10, 13, 14]
// console.log('index: ', binarySearch(arr, 7))

// 非递归解法
// const binarySearch = function (nums, target, low, high) {
//   if (low === undefined) {
//     low = 0
//   }
//   if (high === undefined) {
//     high = nums.length
//   }

//   // 在 while 循环里，判断搜索的区间范围是否有效
//   while (low <= high) {
//     let middle = low + Math.floor((high - low) / 2)

//     // 判断一下正中间的那个数是不是要找的目标数 target
//     if (nums[middle] === target) {
//       return middle
//     }

//     // 如果发现目标数在左边，调整搜索区间的终点为 middle - 1
//     // 否则，调整搜索区间的起点为 middle + 1
//     if (target < nums[middle]) {
//       high = middle - 1
//     } else {
//       low = middle + 1
//     }
//   }

//   // 如果超出搜索区间，表明无法找到目标数，返回 -1
//   return -1
// }

// const arr = [1, 3, 4, 6, 7, 8, 10, 13, 14]
// console.log('index: ', binarySearch(arr, 7))

// 边界问题
// 二分法查找下边界
// const searchLowerBound = function (nums, target, low, high) {
//   if (low === undefined) {
//     low = 0
//   }
//   if (high === undefined) {
//     high = nums.length
//   }

//   if (low > high) {
//     return -1
//   }

//   let middle = low + Math.floor((high - low) / 2)

//   // 判断是否是下边界时， 先看看 middle 的数是否为 target ，并判断该数字、是否已为数组第一个数
//   // 或者，它左边的一个数是不是已经比它小，如果都满足，即为下边界
//   if (nums[middle] === target && (middle === 0 || nums[middle - 1] < target)) {
//     return middle
//   }

//   // 如果发现目标数在左边，就递归地从左边进行二分搜索
//   // 否则从右半边递归地二分搜索
//   if (target <= nums[middle]) {
//     return searchLowerBound(nums, target, low, middle - 1)
//   } else {
//     return searchLowerBound(nums, target, middle + 1, high)
//   }
// }

// // 二分法查找上边界
// const searchUpperBound = function (nums, target, low, high) {
//   if (low === undefined) {
//     low = 0
//   }
//   if (high === undefined) {
//     high = nums.length
//   }

//   if (low > high) {
//     return -1
//   }

//   let middle = low + Math.floor((high - low) / 2)

//   // 判断是否是上边界时，先看看 middle 的数是否为 target，并判断该数是否已为数组的最后一个数，
//   // 或者，它右边的数是不是比它大，如果都满足，即为上边界
//   if (nums[middle] === target && (middle === nums.length - 1 || nums[middle + 1] > target)) {
//     return middle
//   }

//   // 如果发现目标数在左边，就递归地从左边进行二分搜索
//   // 否则从右半边递归地二分搜索
//   if (target < nums[middle]) {
//     return searchUpperBound(nums, target, low, middle - 1)
//   } else {
//     return searchUpperBound(nums, target, middle + 1, high)
//   }
// }

// const arr = [5, 7, 7, 8, 8, 10]
// console.log('lower bound: ', searchLowerBound(arr, 8))
// console.log('upper bound: ', searchUpperBound(arr, 8))

// 查找模糊边界
