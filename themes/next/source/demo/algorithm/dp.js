// 寻找最长子序列
// 递归，自顶而下的方式
// class LongestSubsequence {
//   constructor(nums) {
//     this.max = 1
//     this.smap = new Map()
//     this.recursion(nums, nums.length)
//   }
//   recursion(nums, n) {
//     if (this.smap.has(n)) {
//       return this.smap.get(n)
//     }
//     if (n <= 1) {
//       return n
//     }

//     let result = 0
//     let maxEndingHere = 1
//     let

//     // 从头遍历数组，递归求出以每个点为结尾的子数组中最长上升序列的长度
//     for (let i = 1; i < n; i++) {
//       result = this.recursion(nums, i)

//       if (nums[i - 1] < nums[n - 1] && result + 1 > maxEndingHere) {
//         maxEndingHere = result + 1
//       }
//     }

//     // 判断一下，如果那个数比目前最后一个数小，那么就能构成一个新的上升子序列
//     if (this.max < maxEndingHere) {
//       this.max = maxEndingHere
//     }

//     this.smap.set(n, maxEndingHere)
//     // 返回以当前数结尾的上升子序列的最长长度
//     return maxEndingHere
//   }
// }

// const arr = [10, 9, 2, 5, 3, 7, 101, 18]
// const ls = new LongestSubsequence(arr)
// console.log('ls: ', ls.max)

// class LongestSubsequence {
//   constructor(nums) {
//     this.max = 1
//     // 初始化 dp 数组里的每个元素的值为 1，即以每个元素作为结尾的最长子序列的长度初始化为 1
//     this.dp = new Array(nums.length).fill(1)
//     this.init(nums)
//   }

//   init(nums) {
//     let n = nums.length
//     const { dp } = this
//     // 自底而上求解每个子问题的最优解
//     for (let i = 0; i < n; i++) {
//       for (let j = 0; j < i; j++) {
//         if (nums[j] < nums[i] && dp[i] < dp[j] + 1) {
//           dp[i] = dp[j] + 1
//         }
//       }
//       // 当前计算好的长度与全局的最大值进行比较
//       this.max = Math.max(this.max, dp[i].length)
//     }
//   }
// }

// const arr = [10, 9, 2, 5, 3, 7, 101, 18]
// const ls = new LongestSubsequence(arr)
// console.log('ls: ', ls.max)
