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

console.log('count: ', numDecoding('1213'))
