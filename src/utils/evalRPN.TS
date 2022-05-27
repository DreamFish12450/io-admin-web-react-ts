var calc = function (s1, s2, char) {
  switch (char) {
    case '与门':
      return s1 && s2
    case '或门':
      return s1 || s2
    case '大于等于1':
      return s1 + s2 >= 1 ? 1 : 0
    case '与非门':
      return (s1 && s2) ? 0: 1
    case '或非门':
      return (s1 || s2)? 0: 1
    case '异或':
      return s1 ^ s2
  }
}
export const evalRPN = function (tokens) {
  let stack = [],
    len = tokens.length
  let res = null
  for (let i = 0; i < len; i++) {
    if(tokens[i] === '非门'){
      let s2 = stack.pop(),
      res = calc(1, s2[0] * 1, '与非门')
      console.log("stack",res)
      stack.push(res+'桩')
    }
    else if (
      tokens[i] === '与门' ||
      tokens[i] === '或门' ||
      tokens[i] === '大于等于1' ||
      tokens[i] === '或非门' ||
      tokens[i] === '异或' ||
      tokens[i] === '与非门'
    ) {
      let s2 = stack.pop(),
        s1 = stack.pop()
      res = calc(s1[0] * 1, s2[0] * 1, tokens[i])
      console.log("stack",res)
      stack.push(res+'桩')
      console.log(stack)
    } else {
      stack.push(tokens[i])
    }
  }
  return stack.pop()[0]
}
export const inOrder = async function (node) {
  const stack: any[] = []
  let result: any[] = []
  let flag = 0
  const res: string[] = []
  stack.push(node)
  // 通过async/await去操作得到的Promise对象
  let usePromise = async () => {
    while (stack.length) {
      let node = stack.pop()
      if (node.label == '非门') {
        flag = 1
      } else {
        if (judge(node.label)) result.push(node.label)
        else result.push(node.id)
      }
      if (node.inputArr.length > 0) {
        console.log('node.label',node.inputArr.length)
        let arr = node.inputArr
        let temp
        arr.forEach((e: { val: any }) => {
          temp = window.app.getNodeById(e.val).then((data: any) => {
            stack.push(data.store.data.data)
            return data.store.data.data
          })
        })
        await temp
        
      }
    }
    result = result.reverse()
    console.log('reverse', result)


  }
  await usePromise()
  return new Promise<string[]>((resolve, reject) => {
    console.log("想下班2",result);
    resolve(result)
  })
}
export const judge = function (tokens: string) {
  if (
    tokens === '与门' ||
    tokens === '或门' ||
    tokens === '大于等于1' ||
    tokens === '或非门' ||
    tokens === '异或' ||
    tokens === '与非门'
  )
    return true
}
let res = evalRPN(['1桩', '0桩', '与门'])
