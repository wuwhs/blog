// 实现 reduce
Array.prototype.ireduce = function reduce(cb, initValue) {
  const arr = this
  const len = arr.length
  let result = initValue || arr[0]
  for (let i = initValue ? 0 : 1; i < len; i++) {
    result = cb(result, arr[i], i, arr)
  }
  return result
}

const r = [1, 2, 3].ireduce(function (prev, curr) {
  return prev + curr
}, 100)
console.log('r: ', r)
