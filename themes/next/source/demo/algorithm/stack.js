// 括号匹配
// 匹配的：(){()[{}]} ()({})
// 不匹配的：({)} {()]{}
// 思想：利用栈结构，取出栈顶符号与当前配对，能配对，则弹出栈顶符号，否则，入栈
function bracketsMatch(key1, key2) {
  const bracketMap = {
    '{': '}',
    '[': ']',
    '(': ')'
  }
  return bracketMap[key1] === key2
}

function isMatch(str) {
  const arr = [...str]
  const len = arr.length
  const stack = []
  arr.forEach((value) => {
    // 栈非空，取出顶层数据和现有配对
    if (stack.length) {
      if (!bracketsMatch(stack[stack.length - 1], value)) {
        stack.push(value)
      } else {
        stack.pop()
      }
    } else {
      stack.push(value)
    }
  })
  return !stack.length
}
console.log(isMatch('(){()[{}]}'))
console.log(isMatch('()({})'))
console.log(isMatch('{()]{}'))
