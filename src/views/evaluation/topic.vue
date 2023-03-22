<template>
  <div class="topic">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <el-input
            style="width: 300px; margin-right: 10px"
            placeholder="请输入关键字"
            v-model="state.keyword"
            @change="findTopic"
            clearable
          >
            <template #append>
              <el-button :icon="Search" @click="findTopic" />
            </template>
          </el-input>
          <el-button type="success" plain @click="showDialog()" :icon="Plus">
            创建题目
          </el-button>
          <el-button
            type="danger"
            :icon="Delete"
            @click="delCommentList"
            :disabled="!isSelect"
          >
            批量删除
          </el-button>
        </div>
      </template>
      <el-table
        :data="state.topicList"
        style="width: 100%"
        border
        stripe
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" />

        <el-table-column prop="topicName" label="题目" />

        <el-table-column prop="options" label="选项" />
        <el-table-column prop="scores" label="得分" align="center" />
        <el-table-column label="操作" width="160" align="center">
          <template #default="scope">
            <el-button type="primary" @click="showDialog(scope.row, 'update')">
              修改
            </el-button>

            <el-button type="danger" @click="deleteTopic(scope.row.id)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页器 -->
      <el-pagination
        background
        layout=" prev, pager, next"
        :total="state.total"
        :page-size="state.pageSize"
        :current-page="state.currentPage"
        @current-change="changePage"
      />
    </el-card>

    <!-- 对话框 -->
    <el-dialog
      :title="state.type == 'add' ? '添加题目' : '修改题目'"
      v-model="state.dialogVisible"
      width="600"
      @closed="closeDialog"
      append-to-body
    >
      <!-- 对话框主体区域 -->
      <el-form :model="state.form" ref="topicFormRef" label-width="70px">
        <el-form-item label="题目" prop="topicName">
          <el-input v-model="state.form.topicName" />
        </el-form-item>
        <el-form-item label="选项" prop="options">
          <el-input v-model="state.form.options" />
        </el-form-item>
        <el-form-item label="得分" prop="scores">
          <el-input v-model="state.form.scores" />
        </el-form-item>
        <el-form-item label="所属问卷" prop="questionnaireId">
          <el-select v-model="state.form.questionnaireId" style="width: 300px">
            <el-option
              v-for="(item, index) in questionnaireList"
              :key="index"
              :label="item.name"
              :value="item.questionnaireId"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <!-- 对话框底部区域 -->
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="state.dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="submit">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from "vue";
import {
  getTopicList,
  getTopic,
  updateTopic,
  addTopic,
  delTopic,
} from "@/http/evaluation";
import { Search, Plus, Delete } from "@element-plus/icons-vue";
import { findUQuestionnaire } from "@/utils/find";
import { ElMessage, ElMessageBox } from "element-plus";

const props = defineProps({
  questionnaireId: Number,
});
const state = reactive({
  topicList: [],
  total: 0, // 总条数
  currentPage: 1, // 当前页
  pageSize: 5, // 分页大小
  keyword: "",
  type: "add",
  dialogVisible: false,
  topicId: "",
  form: {},
});
const isSelect = computed(() => state.topicId);
const topicFormRef = ref(null);
let questionnaireList = null;
onMounted(async () => {
  questionnaireList = await findUQuestionnaire();
  getAllTopic();
});
const getAllTopic = async () => {
  const res = await getTopicList(
    state.currentPage,
    state.pageSize,
    props.questionnaireId
  );
  state.topicList = res.data.items;
  state.total = res.data.total;
  state.currentPage = res.data.pageNo;
};
// 获取当前页数的题目列表
const changePage = (val) => {
  state.currentPage = val;
  getAllTopic();
};
//关键字查询
const findTopic = async () => {
  if (state.keyword) {
    const res = await getTopic(state.keyword);
    state.topicList = res.data;
    state.total = res.data.length;
    state.currentPage = 1;
  } else {
    getAllTopic();
  }
};
//对话框显示
const showDialog = (topic, type = "add") => {
  state.dialogVisible = true;

  state.type = type;
  if (type !== "add") {
    state.form = { ...topic };
  } else {
    Object.keys(state.form).forEach((key) => {
      state.form[key] = "";
    });
  }
};
//删除题目
const deleteTopic = (id) => {
  ElMessageBox.confirm("是否要删除此篇资讯？", "删除资讯", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      delTopic(id).then(() => {
        ElMessage({
          type: "success",
          message: "删除成功",
        });
        getAllTopic();
      });
    })
    .catch(() => {});
};
//批量删除
const delCommentList = () => {
  ElMessageBox.confirm("是否要删除选中的资讯？", "批量删除", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      delTopic(state.topicId).then(() => {
        ElMessage({
          type: "success",
          message: "删除成功",
        });
        getAllTopic();
      });
    })
    .catch(() => {});
};
//监听选择项
const handleSelectionChange = (val) => {
  state.topicId = val.map((item) => item.id).join(",");
};
// 表单提交
const submit = () => {
  if (state.type == "update") {
    updateTopic(state.form).then(() => {
      state.dialogVisible = false;
      getAllTopic();
      ElMessage({
        message: "修改成功",
        type: "success",
      });
    });
  } else {
    addTopic(state.form).then(() => {
      state.dialogVisible = false;
      getAllTopic();
      ElMessage({
        message: "添加成功",
        type: "success",
      });
    });
  }
};
//重置表单
const closeDialog = () => {
  topicFormRef.value.resetFields();
};
</script>

<style lang="less" scoped>
.box-card {
  min-height: 100%;
  margin-left: 15px;
  .el-card .is-always-shadow {
    min-height: 100% !important;
  }

  .el-pagination {
    display: flex;
    justify-content: center;
    margin-top: 20px;
  }
}
</style>
