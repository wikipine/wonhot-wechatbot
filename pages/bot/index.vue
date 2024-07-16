<template>
    <div>
        <n-alert type="info">
            当前仅支持个人微信, 机器人别名仅系统做标记，扫码时请注意关联对应微信号
        </n-alert>
        <n-flex justify="space-between" style="margin: 12px 0;">
            <div style="width: 300px">
                <n-input v-model:value="searchParam.keyword" placeholder="按关键词搜索" @change="changePage(1)">
                    <template #prefix>
                        <Icon name="solar:magnifer-linear" />
                    </template>
                </n-input>
            </div>
            <n-button type="primary" :focusable="false" @click="editRule(null)">添加机器人</n-button>
        </n-flex>
        <n-data-table :loading="searchLoading" :columns="tableColumns" :data="dataList" :remote="true"
            :pagination="pagination" @update:page="changePage" />
        <!-- 添加 or 编辑规则 -->
        <bot-add :key="showAdd.key" :visible="showAdd.visible" :formParam="formParam" @close="setShowAdd(false)"
            @success="searchList()" />
        <!-- 删除 -->
        <bot-delete :key="showDelete.key" :visible="showDelete.visible" :info="recordInfo" @close="setShowDelete(false)"
            @success="searchList()" />
        <!-- 登录 -->
        <bot-login :key="showLogin.key" :visible="showLogin.visible" :info="recordInfo" @close="setShowLogin(false)"
            @success="searchList()" />
        <!-- 退出登录 -->
        <bot-login-out :key="showLoginOut.key" :visible="showLoginOut.visible" :info="recordInfo"
            @close="setShowLoginOut(false)" @success="searchList()" />
    </div>
</template>
<script setup>
import { NFlex, NTag, NButton, NDropdown } from "naive-ui";
import useState from "@/hooks/useState";
import to from "await-to-js";
import { getBotPageListApi } from "~/api/bot";

const botTypeTag = [
    { label: '微信', type: 'success' }
]

// 登录按钮操作
const loginBtn = (rowData, rowIndex) => {
    let type = 'success', msg = '立即登录';
    if (rowData.status === 1) {
        type = 'error';
        msg = '退出登录';
    }
    return h(NButton,
        {
            tertiary: true, type, focusable: false, onClick: () => {
                if (rowData.status === 1) {
                    openLoginOutModal(rowData)
                } else {
                    openLoginModal(rowData)
                }
            }
        },
        { default: () => msg }
    );
}

// 更多操作按钮处理
const moreBtns = (rowData, rowIndex) => {
    return h(NDropdown,
        {
            options: [
                { label: '编辑', key: 'edit' },
                { label: '删除', key: 'delete' }
            ],
            onSelect: (key) => {
                if (key === 'edit') {
                    editRule(rowData);
                }
                if (key === 'delete') {
                    openDeleteModal(rowData);
                }
            }
        },
        {
            default: () => h(NButton,
                { tertiary: true, focusable: false },
                { default: () => "更多操作" }
            )
        }
    )
}
const tableColumns = [
    { title: 'ID', key: 'id' },
    {
        title: '机器人', render(rowData, rowIndex) {
            const { type } = rowData;
            const tag = h(NTag,
                {
                    bordered: false,
                    type: botTypeTag[type] ? botTypeTag[type].type : 'default',
                },
                { default: () => botTypeTag[type] ? botTypeTag[type].label : '未定义' }
            )
            return h(NFlex, { align: 'center' }, { default: () => [tag, rowData.alias] });
        }
    },
    {
        title: '登录状态', render(rowData, rowIndex) {
            if (rowData.status === 1) {
                return h('div', { style: 'color: green' }, '已登录');
            } else {
                return h('div', { style: 'color: gray' }, '未登录');
            }
        }
    },
    { title: '最近存活', key: 'heartbeat_at' },
    { title: '上次登录时间', key: 'last_at' },
    { title: '上次登出时间', key: 'last_out_at' },
    {
        title: '操作', width: 210,
        render(rowData, rowIndex) {
            let btns = [
                loginBtn(rowData, rowIndex),
                moreBtns(rowData, rowIndex)
            ];
            return h(NFlex, { align: 'center' }, { default: () => btns });
        }
    },
]
const dataList = ref([]);
const searchParam = reactive({ keyword: '' })
const [searchLoading, setSearchLoading] = useState(false);
const pagination = reactive({ page: 1, pageSize: 10, itemCount: 0 });
const showAdd = reactive({ key: 0, visible: false });
const setShowAdd = (bool) => {
    if (bool) {
        showAdd.key = new Date().getTime();
    }
    showAdd.visible = bool;
}
const formParam = reactive({
    id: 0,
    alias: '',
    type: 0,
})
const recordInfo = ref({});
const showDelete = reactive({ key: 0, visible: false });
const setShowDelete = (bool) => {
    if (bool) {
        showDelete.key = new Date().getTime();
    }
    showDelete.visible = bool;
}
const showLogin = reactive({ key: 0, visible: false });
const setShowLogin = (bool) => {
    if (bool) {
        showLogin.key = new Date().getTime();
    }
    showLogin.visible = bool;
}
const showLoginOut = reactive({ key: 0, visible: false });
const setShowLoginOut = (bool) => {
    if (bool) {
        showLoginOut.key = new Date().getTime();
    }
    showLoginOut.visible = bool;
}

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
    if (searchParam.keyword) {
        params.keyword = searchParam.keyword;
    }
    const [err, res] = await to(getBotPageListApi(params));
    setSearchLoading(false);
    if (err || !res.success) {
        return;
    }
    dataList.value = res.data.list;
    pagination.itemCount = res.data.total;
}
const changePage = (event) => {
    pagination.page = event;
    searchList();
}
// 编辑规则
const editRule = (event) => {
    if (event && event.id > 0) {
        for (const i in formParam) {
            formParam[i] = event[i];
        }
    } else {
        formParam.id = 0;
    }
    setShowAdd(true);
}
// 打开删除弹框
const openDeleteModal = (event) => {
    recordInfo.value = event;
    setShowDelete(true);
}
// 打开登录弹框
const openLoginModal = (event) => {
    recordInfo.value = event;
    setShowLogin(true);
}
// 打开退出登录弹框
const openLoginOutModal = (event) => {
    recordInfo.value = event;
    setShowLoginOut(true);
}
</script>