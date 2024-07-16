<template>
    <div>
        <n-alert type="info">
            可配置&nbsp;<b>全局会话</b>&nbsp;或&nbsp;<b>指定会话</b>&nbsp;的回复规则，建议开始先配置指定会话进行试验，当前规则适应所有机器人
        </n-alert>
        <n-flex justify="space-between" style="margin: 12px 0;">
            <div style="width: 300px">
                <n-input v-model:value="searchParam.keyword" placeholder="按关键词搜索" @change="changePage(1)">
                    <template #prefix>
                        <Icon name="solar:magnifer-linear"/>
                    </template>
                </n-input>
            </div>
            <n-button type="primary" :focusable="false" @click="editRule(null)">添加规则</n-button>
        </n-flex>
        <n-data-table 
            :loading="searchLoading" 
            :columns="tableColumns" 
            :data="dataList" 
            :remote="true"
            :pagination="pagination"
            @update:page="changePage"
        />
        <!-- 添加 or 编辑规则 -->
        <rule-reply-add 
            :key="showAdd.key" 
            :visible="showAdd.visible" 
            :formParam="formParam"
            @close="setShowAdd(false)" 
            @success="searchList()" />
    </div>
</template>
<script setup>
import { NFlex, NTag, NButton, useDialog, useMessage } from "naive-ui";
import useState from "@/hooks/useState";
import to from "await-to-js";
import { getRuleReplyPageListApi, deleteRuleReplyApi } from "~/api/rule";
import { ChatTypeEnum } from "@/config/enum/RuleReplyEnum"
const dialog = useDialog();
const message = useMessage();

const chatTypeTag = [
    { title: '群聊', type: 'info' },
    { title: '私聊', type: 'success' },
    { title: '任意', type: 'warning' }
]

const editBtn = (rowData, rowIndex) => {
    return h(
        NButton, 
        { 
            type: 'primary', 
            focusable: false,
            onClick: () => editRule(rowData) 
        }, 
        { 
            default: () => "编辑" 
        }
    );
}
const deleteBtn = (rowData, rowIndex) => {
    return h(
        NButton, 
        { 
            ghost: true, 
            focusable: false,
            loading: rowData.deleteLoading, 
            onClick: () => deleteRule(rowIndex) 
        }, 
        { 
            default: () => "删除" 
        }
    );
}
const tableColumns = [
    { title: 'ID', key: 'id' },
    { title: '会话',
        render(rowData, rowIndex) {
            const { chat_type, chat_name } = rowData;
            let values = [];
            // 处理类型tag
            if(chatTypeTag[chat_type]) {
                values.push(h(NTag, { bordered: false, type: chatTypeTag[chat_type].type }, { default:() => chatTypeTag[chat_type].title }));
            } else {
                values.push(h(NTag, { bordered: false }, { default:() => '未定义' }));
            }
            // 处理会话名称
            values.push(h('div', null, { default:() => chat_type === ChatTypeEnum.ALL ? '所有会话' : chat_name }));
            return h(NFlex, { align: 'center' }, { default:() => values });
        }
    },
    { title: '关键词', key: 'keyword' },
    { title: '回复', render(rowData, rowIndex) {
            return h('div', { style: 'white-space: pre-wrap;' }, rowData['reply_content']);
        }
    },
    { title: '触发次数', key: 'used_num' },
    { title: '更新时间', key: 'updated_at' },
    { title: '操作', width: 180,
        render(rowData, rowIndex) {
            let btns = [
                editBtn(rowData, rowIndex),
                deleteBtn(rowData, rowIndex)
            ];
            return h(NFlex, { align: 'center' }, { default:() => btns });
        }
    },
]
const dataList = ref([]);
const searchParam = reactive({ keyword: '' })
const [searchLoading, setSearchLoading] = useState(false);
const pagination = reactive({page: 1, pageSize: 10, itemCount: 0});
const showAdd = reactive({ key: 0, visible: false });
const setShowAdd = (bool) => {
    if(bool) {
        showAdd.key = new Date().getTime();
    }
    showAdd.visible = bool;
}
const formParam = reactive({
    id: 0,
    chat_name: '',
    chat_type: 0,
    keyword: '',
    reply_type: 0,
    reply_content: '',
})

onMounted(() => {
    searchList();
})

// 查询列表
const searchList = async () => {
    setSearchLoading(true);
    let params = {
        page: pagination.page,
        pageSize: pagination.pageSize
    }
    if(searchParam.keyword) {
        params.keyword = searchParam.keyword;
    }
    const [err, res] = await to(getRuleReplyPageListApi(params));
    setSearchLoading(false);
    if (err || !res.success) {
        return;
    }
    let data = res.data.list;
    pagination.itemCount = res.data.total;
    data.forEach(val => {
        val['deleteLoading'] = false;
    })
    dataList.value = data;
}
const changePage = (event) => {
    pagination.page = event;
    searchList();
}
// 编辑规则
const editRule = (event) => {
    if(event && event.id > 0) {
        for(const i in formParam) {
            formParam[i] = event[i];
        }
    } else {
        formParam.id = 0;
    }
    setShowAdd(true);
}
// 删除规则
const deleteRule = (index) => {
    dialog.warning({
        title: '提示',
        content: '确认删除此规则',
        positiveText: '确定',
        negativeText: '取消',
        onPositiveClick: () => {
            dataList.value[index].deleteLoading = true;
            const { id } = dataList.value[index];
            deleteRuleReplyApi(id).then(res=>{
                if(true === res.success) {
                    message.success('操作成功');
                    searchList();
                }
            })   
        }
    })
}

</script>