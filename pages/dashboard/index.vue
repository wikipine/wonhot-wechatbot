<template>
    <div>
        <n-input type="text" v-model:value="words" />

        <div style="padding: 5px 10px; color: #fff; background: #777777; cursor: pointer;" @click="cal()">
            解析收单指令
        </div>

        <div style="padding: 20px 0; white-space: pre-line;">
            <div style="padding: 10px 0;">解析结果：</div>
            <div>{{ content }}</div>
        </div>


        <div v-if="finaList && finaList.length > 0">
            <div>
                <n-input type="text" v-model:value="bingo" />
                <div style="padding: 5px 10px; color: #fff; background: #777777; cursor: pointer;" @click="getResult()">
                    检查中奖情况
                </div>
            </div>
        </div>

    </div>
</template>
<script setup>


const words = ref('')
const content = ref('')
const finaList = ref([])
const bingo = ref('')


const cal = () => {
    let cmd = words.value
    content.value = '';

    // 识别3D:
    if (cmd.startsWith('3D:')) {
        // 指令 - 标准化
        let tmpStr = cmd.replaceAll('3D:', '').replaceAll(' ', '').replaceAll('，',',').replaceAll('；',';').replaceAll('、', '/');
        // 拆分多指令
        let list = tmpStr.split(';');

        const rltList = []

        list.forEach(ele => {

            const rlt = {
                's': [], // 单选
                'z3': [], // 组三
                'z6': [],  // 组六
                't': 0 // 总注数
            }
            let total = 0;

            let arr = ele.split(',');
            if (arr.length === 2) {
                // 号码list - 玩法list
                let codeList = arr[0].split('/')
                let mode = arr[1]

                // 判断【单选】
                if(mode.includes('单')) {
                    const regex = /单\d+/g;
                    const matches = mode.match(regex);
                    if (matches.length === 1) {
                        const num =parseInt(matches[0].replace('单', ''));
                        // 组装【单选】
                        codeList.forEach(code => {
                            if (code.length === 3) {
                                rlt.s.push({
                                    c: code, // 号码
                                    n: num // 注数
                                })
                                total = total + num;
                            } else {
                                console.log('单选号码必须为三位数[000~999]')
                            }
                        })
                    } else {
                        console.log('结构异常')
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


                // 判断【组选6】
                if(mode.includes('组六')) {
                    const regex = /组六\d+/g;
                    const matches = mode.match(regex);
                    if (null !== matches && matches.length === 1) {
                        const num =parseInt(matches[0].replace('组六', ''));
                        // 组装【组选】
                        codeList.forEach((code) => {
                            if (code.length >= 3) {
                                let i = 0
                                let count = countCombinations(code, 3);
                                i = count * num + i;
                                rlt.z6.push({
                                    c: code,
                                    n: i
                                })
                                total = total + i;
                            } else {
                                console.log('号码位必须三位数及三位数以上')
                            }
                        })
                    } else {
                        console.log('结构异常')
                    }
                }
                // 累计总注数
                rlt.t = total
                rltList.push(rlt)
            } else {
                console.log('结构异常')
            }
        });

        console.log(rltList)
        finaList.value.push(rltList)

        let finalStr = ''
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
        })
        content.value = finalStr;


    } else {
        console.log('未匹配')
    }

}


const getAllPairCombinations = (str) => {
    const result = [];
    for (let i = 0; i < str.length; i++) {
        for (let j = i + 1; j < str.length; j++) {
            result.push(str[i] + str[j]);
        }
    }
    return result;
}


// 主函数，计算字符串中任意取3个字符的组合数
const countCombinations = (str, k) => {
    const n = str.length
    if (n < k) {
        return 0;
    } 
    return factorial(n) / (factorial(k) * factorial(n - k));
}

// 计算阶乘的辅助函数
function factorial(n) {
  if (n === 0 || n === 1) {
    return 1;
  }
  return n * factorial(n - 1);
}




const getResult = () => {
    // 判断中奖
    let code = bingo.value;

    let tmpList = finaList.value[0];

    console.log('1111')
    console.log(tmpList)
    console.log('2222')

    if (tmpList.length > 0) {

        // 中奖详情
        let bingoList = {
            's': [], // 单选
            'z3': [], // 组三
            'z6': [],  // 组六
            't': 0 // 总注数            
        }


        // 开始计算中奖情况
        tmpList.forEach(v => {
            if (v.s.length > 0) {
                v.s.forEach(o => {
                    if (o.c === code) {
                        bingoList.s.push(o)
                    }
                })
            }
            if (v.z6.length > 0) {
                v.z6.forEach(o => {
                    var match = true;
                    for(let char of code) {
                        match = match & o.c.includes(char)
                    }
                    if (match) {
                        bingoList.z6.push(o)
                    }
                })
            }
        })

        // 当前订单的中奖结果
        console.log(bingoList)
    } else {
        console.log('无数据')
    }

    // 调用统计
    stat()

}



const stat = () => {

    let statList = {
        's': [], // 单选
        'z3': [], // 组三
        'z6': [],  // 组六
    }

    let tmpList = finaList.value[0];
    if (tmpList.length > 0) {

        // 开始统计选号情况
        const sMap = new Map();
        const sList = []
        const z6Map = new Map();
        const z6List = []
        tmpList.forEach(v => {
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
                    combinations.forEach(n => {
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
            sList.push({ code: key, num: value })
        }
        statList.s.push(...sList.sort((o1, o2) => o2.num - o1.num))

        // 组选6结构化 & 排序
        for (let [key, value] of z6Map) {
            z6List.push({ code: key, num: value })
        }
        statList.z6.push(...z6List.sort((o1, o2) => o2.num - o1.num))
        
        
        console.log('统计结果：')
        console.log(statList)

    }

    
}

const getAllCombinations = (str, length) => {
    const result = [];
    
    function combine(prefix, start) {
        if (prefix.length === length) {
            result.push(prefix);
            return;
        }

        for (let i = start; i < str.length; i++) {
            combine(prefix + str[i], i + 1);
        }
    }

    combine('', 0);

    const rltList = [];
    result.forEach(v => {
        rltList.push(v.split('').sort().join(''));
    });

    return rltList;
}



</script>