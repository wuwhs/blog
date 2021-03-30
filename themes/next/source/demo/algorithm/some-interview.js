// fibonacci 数列
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

// 和一定，找出所有连续正整数序列

const findSerice = function (sum) {
  const max = Math.ceil(num / 2)
  const result = []
  for (let i = 1; i < max; i++) {
    for (let j = i + 1; j <= max; j++) {
      const curr = ((i + j) * (j - i + 1)) / 2
      if (curr > sum) continue
      if (curr === sum) createArr(i, j)
    }
  }
}
