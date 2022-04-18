var calc = function (s1, s2, char) {
  switch (char) {
    case '与门':
      return s1 && s2
    case '或门':
      return s1 || s2
    case '大于等于1':
      return s1 + s2 >= 1 ? 1 : 0
    case '与非门':
      return !(s1 && s2)
    case '或非门':
      return !(s1 || s2)
    case '异或':
      return s1 ^ s2
  }
}
export const evalRPN = function (tokens) {
  let stack = [],
    len = tokens.length
  let res = null
  for (let i = 0; i < len; i++) {
    if (
      tokens[i] === '与门' ||
      tokens[i] === '或门' ||
      tokens[i] === '大于等于1' ||
      tokens[i] === '或非门' ||
      tokens[i] === '异或' ||
      tokens[i] === '与非门' 
    ) {
      let s2 = stack.pop(),
        s1 = stack.pop()
      res = calc(s1[0]*1, s2[0]*1, tokens[i])
      stack.push(res)
      console.log(stack)
    } else {
      stack.push(tokens[i])
    }
  }
  return stack.pop()
}

let res = evalRPN(['1桩', '0桩', '与门'])
