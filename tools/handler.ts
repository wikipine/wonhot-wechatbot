// 定义类型
interface ChoiceItem {
  c: string; // 号码
  n: number; // 注数
}
interface ChoiceResult {
  s: ChoiceItem[]; // 单选
  z3: ChoiceItem[]; // 组三
  z6: ChoiceItem[]; // 组六
  t: number; // 总注数
}

// 处理选择消息
export const handleChoiceMessage = (content: string) => {
  if (!content) {
    return null;
  }
  let str = content.trim();
  if (!str.startsWith("3D:")) {
    return null;
  }
  // 标准化指令
  str = str
    .replaceAll("3D:", "")
    .replaceAll(" ", "")
    .replaceAll("，", ",")
    .replaceAll("；", ";")
    .replaceAll("、", "/");
  // 拆分指令
  const cmdlist = str.split(";");
  const rltList: ChoiceResult[] = [];

  // 计算阶乘的辅助函数
  const factorial = (n: number): number => {
    if (n === 0 || n === 1) {
      return 1;
    }
    return n * factorial(n - 1);
  };
  // 主函数，计算字符串中任意取3个字符的组合数
  const countCombinations = (str: string, k: number): number => {
    const n = str.length;
    if (n < k) {
      return 0;
    }
    return factorial(n) / (factorial(k) * factorial(n - k));
  };

  const getAllPairCombinations = (str:string) => {
    const result = [];
    for (let i = 0; i < str.length; i++) {
        for (let j = i + 1; j < str.length; j++) {
            result.push(str[i] + str[j]);
        }
    }
    return result;
  }

  cmdlist.forEach((ele) => {
    const rlt: ChoiceResult = {
      s: [], // 单选
      z3: [], // 组三
      z6: [], // 组六
      t: 0, // 总注数
    };
    let total = 0;

    let arr = ele.split(",");
    if (arr.length === 2) {
      // 号码list - 玩法list
      let codeList = arr[0].split("/");
      let mode = arr[1];

      // 判断【单选】
      if (mode.includes("单")) {
        const regex = /单\d+/g;
        const matches = mode.match(regex);
        if (matches?.length === 1) {
          const num = parseInt(matches[0].replace("单", ""));
          // 组装【单选】
          codeList.forEach((code) => {
            if (code.length === 3) {
              rlt.s.push({
                c: code, // 号码
                n: num, // 注数
              });
              total = total + num;
            }
          });
        }
      }

      if(mode.includes('组三')) {
        const regex = /组三\d+/g;
        const matches = mode.match(regex);
        if (null !== matches && matches.length === 1) {
            const num =parseInt(matches[0].replace('组三', ''));
            // 组装【组选】
            codeList.forEach((code) => {
                if (code.length >= 2) {
                    let i = 0
                    let pairList = getAllPairCombinations(code);
                    i = pairList.length * num + i;
                    rlt.z3.push({
                        c: code,
                        n: i
                    })
                    total = total + i;
                } else {
                    console.log('号码位必须两位数及两位数以上')
                }
            })
        } else {
            console.log('结构异常')
        }
      }

      // 判断【组选】
      if (mode.includes("组六")) {
        const regex = /组六\d+/g;
        const matches = mode.match(regex);
        if (matches?.length === 1) {
          const num = parseInt(matches[0].replace("组六", ""));
          // 组装【组选】
          codeList.forEach(function (code) {
            if (code.length >= 3) {
              let i = 0;
              let count = countCombinations(code, 3);
              i = count * num + i;
              rlt.z6.push({
                c: code,
                n: i,
              });
              total = total + i;
            }
          });
        }
      }
      // 累计总注数
      rlt.t = total;

      rltList.push(rlt);
    }
  });

  // 下注拆解
  return rltList;
};

// 最终选择结果
export const getFinalChoiceStr = (rltList: ChoiceResult[]) => {
    let finalStr = ''
    let total = 0
    rltList.forEach(ele => {
        let rltStr = '';
        ele.s.forEach(v => {
          rltStr = rltStr + '[' + v.c + '] 单选，总' + v.n + '注\n';
        });
        ele.z3.forEach(v => {
          rltStr = rltStr + '[' + v.c + '] 组三，总' + v.n + '注\n';
        });
        ele.z6.forEach(v => {
          rltStr = rltStr + '[' + v.c + '] 组六，总' + v.n + '注\n';
        });
        finalStr = finalStr + rltStr;
        total = total + ele.t
    })

    finalStr = finalStr + "合计：" + total + '注，' + (total * 2) + '米'
    return finalStr;
}

export const isUnique = (str: string) => {
  const charSet = new Set();
  for (let char of str) {
      if (charSet.has(char)) {
          return false;
      }
      charSet.add(char);
  }
  return true;
}

// 开奖筛选
export const getBingoChoiceStr = (rltList: ChoiceResult[], code: any) => {

  let finalStr = ''
  let tmpCode = code.value

  rltList.forEach(v => {
    let rltStr = '';
    if (v.s.length > 0) {
      v.s.forEach(o => {
        if (o.c === tmpCode) {
          rltStr = rltStr + '[' + o.c + '] 单选，总' + o.n + '注\n';
        }
      })
    }
    if (v.z3.length > 0 && !isUnique(tmpCode)) {
      v.z3.forEach(o => {
        var match = true;
        for(let char of tmpCode) {
          match = match && o.c.includes(char)
        }
        if (match) {
          rltStr = rltStr + '[' + o.c + '] 组三，总' + o.n + '注\n';
        }
      })
    }
    if (v.z6.length > 0 && isUnique(tmpCode)) {
      v.z6.forEach(o => {
          var match = true;
          for(let char of tmpCode) {
            match = match && o.c.includes(char)
          }
          if (match) {
            rltStr = rltStr + '[' + o.c + '] 组六，总' + o.n + '注\n';
          }
        })
    }
    finalStr = finalStr + rltStr;
  })

  if ('' === finalStr) {
    finalStr = '无'
  }

  return finalStr;
  

}


// 统计

export const stat = (rltList: ChoiceResult[]) => {


  const getAllCombinations = (str: string, length: number) => {
    const result: any = [];
    
    function combine(prefix:any, start:any) {
        if (prefix.length === length) {
            result.push(prefix);
            return;
        }

        for (let i = start; i < str.length; i++) {
            combine(prefix + str[i], i + 1);
        }
    }

    combine('', 0);

    const rltList: any = [];
    result.forEach((v:any) => {
        rltList.push(v.split('').sort().join(''));
    });
    return rltList;
 }

  const statList: ChoiceResult = {
    s: [], // 单选
    z3: [], // 组三
    z6: [], // 组六
    t: 0, // 总注数
  };

  const sMap = new Map();
  const sList = []
  const z6Map = new Map();
  const z6List = []

  rltList.forEach(v => {
    // 单选统计
    if (v.s.length > 0) {
        v.s.forEach(o => {
            if (sMap.has(o.c)) {
                sMap.set(o.c, sMap.get(o.c) + o.n)
            } else {
                sMap.set(o.c, o.n)
            }
        })
    }

    // 组选6统计
    if (v.z6.length > 0) {
        v.z6.forEach(o => {
            const combinations = getAllCombinations(o.c, 3);
            combinations.forEach((n:any) => {
                if (z6Map.has(n)) {
                    z6Map.set(n, z6Map.get(n) + o.n)
                } else {
                    z6Map.set(n, o.n)
                }
            })
        })
    }
  })

  // 单选结构化 & 排序
  for (let [key, value] of sMap) {
    sList.push({ c: key, n: value })
  }
  statList.s.push(...sList.sort((o1, o2) => o2.n - o1.n))

  // 组选6结构化 & 排序
  for (let [key, value] of z6Map) {
      z6List.push({ c: key, n: value })
  }
  statList.z6.push(...z6List.sort((o1, o2) => o2.n - o1.n))

  return statList;

}
