<template>
  <div class="comment">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <el-input
            style="width: 300px; margin-right: 10px"
            placeholder="请输入关键字"
            v-model="state.keyword"
            @change="findComment"
            clearable
          >
            <template #append>
              <el-button :icon="Search" @click="findComment" />
            </template>
          </el-input>

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
        :data="state.commentList"
        style="width: 100%"
        border
        stripe
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" />

        <el-table-column prop="id" label="编号" width="60" />
        <el-table-column prop="username" label="评论者" />
        <el-table-column prop="articleTitle" label="帖子标题" />

        <el-table-column prop="content" label="内容" />

        <el-table-column
          prop="createTime"
          label="评论时间"
          width="200"
          sortable
        />
        <el-table-column label="操作" width="100">
          <template #default="scope">
            <el-button type="danger" @click="deleteComment(scope.row.id)">
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
  </div>
</template>

<script setup>
import { computed, reactive } from "vue";
import { getCommentList, delComment, findCommentByContent } from "@/http/forum";
import { Search, Delete } from "@element-plus/icons-vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { findArticleName } from "@/utils/find";

const state = reactive({
  commentList: [],
  total: 0, // 总条数
  currentPage: 1, // 当前页
  pageSize: 5, // 分页大小
  keyword: "",
  commentId: "",
});

const isSelect = computed(() => state.commentId); //是否批量选择了

//获取评论列表
const getAllComment = async () => {
  const res = await getCommentList(state.currentPage, state.pageSize);
  state.commentList = await findArticleName(res.data.items);
  state.total = res.data.total;
  state.currentPage = res.data.pageNo;
};
getAllComment();
// 获取当前页数的评论列表
const changePage = (val) => {
  state.currentPage = val;
  getAllComment();
};

//关键字查询
const findComment = async () => {
  if (state.keyword) {
    const res = await findCommentByContent(state.keyword);
    state.commentList = await findArticleName(res.data);
    state.total = res.data.length;
    state.currentPage = 1;
  } else {
    getAllComment();
  }
};

//监听选择项
const handleSelectionChange = (val) => {
  state.commentId = val.map((item) => item.id).join(",");
};
//删除评论
const deleteComment = (id) => {
  ElMessageBox.confirm("是否要删除此条评论？", "删除评论", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      delComment(id).then(() => {
        ElMessage({
          type: "success",
          message: "删除成功",
        });
        getAllComment();
      });
    })
    .catch(() => {});
};
//批量删除
const delCommentList = () => {
  ElMessageBox.confirm("是否要删除选中的评论？", "批量删除", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      delComment(state.commentId).then(() => {
        ElMessage({
          type: "success",
          message: "删除成功",
        });
        getAllComment();
      });
    })
    .catch(() => {});
};
</script>

<style lang="less" scoped>
.box-card {
  min-height: 100%;
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
