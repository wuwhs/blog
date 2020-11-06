// 数字编码 0 -> 'A' 1 -> 'B' ... 26 -> 'Z'
// const numDecoding = function (str) {
//   if (str.charAt(0) === '0') return 0
//   const chars = [...str]
//   return decode(chars, chars.length - 1)
// }

// // 字符串转化成字符组，利用递归函数 decode，从最后一个字符串向前递归
// const decode = function (chars, index) {
//   if (index <= 0) return 1
//   let count = 0
//   let curr = chars[index]
//   let prev = chars[index - 1]

//   // 当前字符比 `0` 大，则直接利用它之前的字符串所求得结果
//   if (curr > '0') {
//     count = decode(chars, index - 1)
//   }

//   // 由前一个字符和当前字符构成的数字，值必须要在1和26之间，否则无法编码
//   if (prev === '1' || (prev == '2' && curr <= '6')) {
//     count += decode(chars, index - 2)
//   }

//   return count
// }

// console.log('count: ', numDecoding('1213'))

// 找到所有长度为 n 的中心对称数
// const helper = function (n) {
//   debugger
//   // 第一步：判断输入或状态是否非法
//   if (n < 0) {
//     throw new Error('illegal argument')
//   }

//   // 第二步：判读递归是否应当结束
//   if (n === 0) {
//     return ['']
//   }
//   if (n === 1) {
//     return ['0', '1', '8']
//   }

//   // 第三步：缩小问题规模
//   const list = helper(n - 2)

//   // 第四步：整合结果
//   const res = []

//   for (let i = 0; i < list.length; i++) {
//     let s = list[i]
//     res.push('1' + s + '1')
//     res.push('6' + s + '9')
//     res.push('8' + s + '8')
//     res.push('9' + s + '6')
//   }
//   return res
// }
// console.log(helper(2))

// const combinationSum = function (candidates, target) {
//   const results = []
//   backtracking(candidates, target, 0, [], results)
//   return results
// }

// const backtracking = function (candidates, target, start, solution, results) {
//   if (target < 0) {
//     return false
//   }

//   if (target === 0) {
//     results.push([...solution])
//     return true
//   }

//   for (let i = start; i < candidates.length; i++) {
//     solution.push(candidates[i])
//     backtracking(candidates, target - candidates[i], i, solution, results)
//     solution.pop()
//   }
// }

// console.log(combinationSum([1, 2, 3], 5))

// 汉诺塔问题
// const hano = function (A, B, C, n) {
//   if (n > 0) {
//     hano(A, C, B, n - 1)
//     move(A, C)
//     hano(B, A, C, n - 1)
//   }
// }

// const move = function (p, c) {
//   const temp = p.pop()
//   console.log('move p: ', String(p))
//   console.log('move c: ', String(c))
//   console.log('move item: ', temp)
//   console.log('--------')
//   c.push(temp)
// }
// const a = [1, 2, 3, 4, 5]
// const b = []
// const c = []
// hano(a, b, c, a.length)

// console.log('----after----')
// console.log('a: ', String(a))
// console.log('b: ', String(b))
// console.log('c: ', String(c))

const check = function (row, col, columns) {
  for (let r = 0; r < row; r++) {
    // 其他皇后是否在当前放置皇后的列和对角线上
    if ((columns[r] = col || row - r == Math.abs(columns[r] - col))) {
      return false
    }
  }
  return true
}

const totalNQueens = function (n) {
  const results = []
  backtracking(n, 0, [], [], results)
  console.log('results: ', results)
  console.log('count: ', results.length)
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
