<template>
    <div>
        <n-alert type="info">
            符合规则的消息会被自动收录到订单中
        </n-alert>

        <n-flex style="padding: 20px 0;" justify="space-between">
            <n-flex>
                <n-date-picker v-model:value="searchParam.dateTime" type="date" @update:value="searchList()" />
                <n-button type="primary" @click="searchList()">刷新</n-button>
                <!-- <n-button type="info" @click="activeModal()">手工补单</n-button> -->
            </n-flex>
            <div style="display: flex; gap:10px">
                <n-input v-model:value="code" type="text" placeholder="输入开奖号码" />
                <n-button type="info" @click="searchList(1)">开奖筛选</n-button>
            </div>
        </n-flex>
        <n-data-table :loading="searchLoading" :columns="tableColumns" :data="dataList" :remote="true" :pagination="false"
            @update:page="changePage" />

        <n-modal v-model:show="modalActive">
            <n-card style="width: 700px" title="手工补单"
                :bordered="false" role="dialog" aria-modal="true">
                <n-input style="min-height: 200px;"
                v-model:value="modalOrderCmd"
                type="textarea"
                placeholder="根据规则填入指令，例如：3D:987/123,单2组六1;67812/37814,组六2，批量输入时用';'隔开" />
                <template #footer>
                    <n-flex justify="flex-end">
                        <n-button type="info">提交</n-button>
                    </n-flex>
                </template>
            </n-card>
        </n-modal>

    </div>
</template>
<script setup>
import { NFlex, NTag, NButton, useDialog, useMessage } from "naive-ui";
import useState from "@/hooks/useState";
import to from "await-to-js";
import { getOrderPageListApi } from "~/api/order";
import { handleChoiceMessage, getFinalChoiceStr, getBingoChoiceStr } from "@/tools/handler";
const dialog = useDialog();
const message = useMessage();

const tableColumns = [
    { title: '单号', key: 'id' },
    {
        title: '收单来源', render(rowData, rowIndex) {
            let userName = rowData['user_name'];
            let origin = '非自动获得';
            if (rowData['message_body']) {
                if (rowData['message_body']['talker_alias']) {
                    userName = rowData['message_body']['talker_name'] + '(' + rowData['message_body']['talker_alias'] + ')'
                }
                if (rowData['message_body']['room_name']) {
                    origin = '群聊 - ' + rowData['message_body']['room_name']
                } else {
                    origin = '私聊 - ' + rowData['message_body']['listener_name']
                }
            }
            return h('div', null, {
                default: () => [
                    h('div', null, { default: () => userName }),
                    h('div', null, { default: () => '来源:' + origin })
                ]
            })
        }
    },
    { title: '原始信息', key: 'content' },
    {
        title: '解构参考', render(rowData, rowIndex) {
            return h('div', { style: 'white-space: pre-wrap;' }, rowData['final_content']);
        }
    },
    {
        title: '中奖情况', render(rowData, rowIndex) {
            return h('div', { style: 'white-space: pre-wrap;'  +  (rowData['bingo_content'] === '无'? '': 'color: #dc2626; font-weight: 500') }, rowData['bingo_content']);
        }
    },
    { title: '下单时间', key: 'time' },
]
const dataList = ref([]);
const code = ref('')
const searchParam = reactive({ dateTime: new Date().getTime() })
const [searchLoading, setSearchLoading] = useState(false);
const pagination = reactive({ page: 1, pageSize: 100, itemCount: 0 });

const modalActive = ref(false)
const modalOrderCmd = ref('')

onMounted(() => {
    searchList();
})

// 查询列表
const searchList = async (type) => {

    // type - 1:携带开奖筛选

    setSearchLoading(true);
    let params = {
        dateTime: searchParam.dateTime,
    }
    const [err, res] = await to(getOrderPageListApi(params));
    setSearchLoading(false);
    if (err || !res.success) {
        return;
    }
    const data = res.data ?? [];
    data.forEach(val => {
        const rltList = handleChoiceMessage(val['content']);
        val['final_content'] = getFinalChoiceStr(rltList);
        // 开奖情况
        if (type === 1 && null !== code && '' !== code && code.value.length === 3) {
            val['bingo_content'] = getBingoChoiceStr(rltList, code);
        }
    })
    dataList.value = data;
}

const changePage = (event) => {
    pagination.page = event;
    searchList();
}

const activeModal = () => {
    modalActive.value = true;
}


</script>