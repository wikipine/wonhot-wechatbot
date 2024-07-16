<template>
    <div>
        <n-alert type="info">
            统计当日收单中被选号码数量
        </n-alert>

        <n-tabs type="line" animated style="padding: 20px 0">
            <n-tab name="single" tab="单选" @click="searchList(1)"></n-tab>
            <n-tab name="group3" tab="组选三" @click="searchList(2)"></n-tab>
            <n-tab name="group6" tab="组选六" @click="searchList(3)"></n-tab>
        </n-tabs>

        <n-flex style="padding: 12px 0;" justify="space-between">
            <n-flex>
                <n-date-picker v-model:value="searchParam.dateTime" type="date" @update:value="searchList()" />
                <n-button type="primary" @click="searchList()">刷新</n-button>
            </n-flex>
        </n-flex>
        <n-data-table :loading="searchLoading" :columns="tableColumns" :data="dataList" :remote="true" :pagination="false"
            @update:page="changePage" />

        
    </div>
</template>
<script setup>
import { NFlex, NTag, NButton, useDialog, useMessage } from "naive-ui";
import useState from "@/hooks/useState";
import to from "await-to-js";
import { getOrderPageListApi } from "~/api/order";
import { handleChoiceMessage, getFinalChoiceStr, getBingoChoiceStr, stat } from "@/tools/handler";
const dialog = useDialog();
const message = useMessage();

const tableColumns = [
    { title: '号码', key: 'c' },
    { title: '注数', key: 'n' }
]
const dataList = ref([]);
const searchParam = reactive({ dateTime: new Date().getTime() })
const [searchLoading, setSearchLoading] = useState(false);
const pagination = reactive({ page: 1, pageSize: 100, itemCount: 0 });

onMounted(() => {
    searchList(1);
})

// 查询列表
const searchList = async (type) => {

    // type - 1:单选 2:组三 3:组6

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


    const list = [];

    data.forEach(val => {
        const rltList = handleChoiceMessage(val['content']);
        list.push(...rltList);
    })

    // 统计
    const rltMap = stat(list);
    dataList.value = []

    switch(type) {
        case 1: {
            dataList.value = rltMap.s
        };break;
        case 3: {
            dataList.value = rltMap.z6
        }
    }
}
const changePage = (event) => {
    pagination.page = event;
    searchList();
}

</script>