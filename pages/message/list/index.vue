<template>
  <div>
    <n-alert type="info">
      填写机器人ID进行消息搜索, ID 可从机器人列表中获得
    </n-alert>
    <n-flex style="margin: 12px 0;">
      <div style="width: 300px">
        <n-input v-model:value="searchParam.botId" placeholder="机器人ID">
          <template #prefix>
            <Icon name="solar:magnifer-linear"/>
          </template>
        </n-input>
      </div>
      <div style="width: 300px">
        <n-input v-model:value="searchParam.keyword" placeholder="消息内容" />
      </div>
      <n-button type="primary" :focusable="false" @click="changePage(1)">搜索</n-button>
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
import { getMessagePageListApi } from "~/api/message";
import { getRuleReplyPageListApi, deleteRuleReplyApi } from "~/api/rule";
import { ChatTypeEnum } from "@/config/enum/RuleReplyEnum"
const dialog = useDialog();
const message = useMessage();

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
  { title: 'ID', key: 'id', width: 80 },
  { title: '来源',
    width: 200,
    render(rowData, rowIndex) {
      const { room_id, room_name } = rowData;
      let values = [];
      if(room_id) {
        values.push(h(NTag, { bordered: false, type: 'info' }, { default:() => '群聊' }));
        values.push(h('div', null, { default:() => room_name }));
      } else {
        values.push(h(NTag, { bordered: false }, { default:() => '私聊' }));
      }
      return h(NFlex, { align: 'center' }, { default:() => values });
    }
  },
  { title: '用户',
    width: 200,
    render(rowData, rowIndex) {
      const { talker_name, listener_id, listener_name } = rowData;
      let values = [];
      values.push(h('div', null, { default:() => '发送者：' + talker_name }));
      if(listener_id) {
        values.push(h('div', null, { default:() => '接收者：' + listener_name }));
      }
      return values;
    }
  },
  { title: '消息内容',
    render(rowData, rowIndex) {
      const { message_type, message_content, message_at } = rowData;
      let values = [];
      values.push(h('div', null, { default: () => '消息类型：' + message_type + ' 消息时间：' + message_at}))
      values.push(h('div', null, { default: () => message_content}))
      return values;
    }
  },
]
const dataList = ref([]);
const searchParam = reactive({ botId: 1002, keyword: '' })
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
onMounted(()=>{
  searchList();
})

// 查询列表
const searchList = async () => {
  let params = {
    botId: searchParam.botId,
    page: pagination.page,
    pageSize: pagination.pageSize
  }
  if(searchParam.keyword) {
    params.keyword = searchParam.keyword;
  }
  if(params.botId <= 0) {
    message.error('请先输入机器人ID');
    return;
  }
  setSearchLoading(true);
  const [err, res] = await to(getMessagePageListApi(params));
  setSearchLoading(false);
  if (err || !res.success) {
    return;
  }
  let data = res.data.list;
  pagination.itemCount = res.data.total;
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