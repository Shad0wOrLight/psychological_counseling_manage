<template>
  <div class="forum">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <el-input
            style="width: 300px; margin-right: 10px"
            placeholder="请输入关键字"
            v-model="state.keyword"
            @change="findArticle"
            clearable
          >
            <template #append>
              <el-button :icon="Search" @click="findArticle" />
            </template>
          </el-input>
          <el-button type="success" plain @click="showDialog()" :icon="Plus">
            发布帖子
          </el-button>
          <el-button
            type="danger"
            :icon="Delete"
            @click="delArticleList"
            :disabled="!isSelect"
          >
            批量删除
          </el-button>
        </div>
      </template>
      <el-table
        :data="state.articleList"
        style="width: 100%"
        border
        stripe
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" />

        <el-table-column prop="id" label="编号" width="60" />
        <el-table-column prop="title" label="标题" width="300" />

        <el-table-column prop="content" label="内容">
          <template #default="scope">
            <div class="content">
              {{ scope.row.content }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="author" label="作者" width="80" />

        <el-table-column prop="type" label="类型" width="80" />

        <el-table-column prop="createTime" label="发布时间" width="200" sortable/>
        <el-table-column label="操作" width="160">
          <template #default="scope">
            <el-button type="primary" @click="showDialog(scope.row, 'update')">
              修改
            </el-button>

            <el-button type="danger" @click="deleteArticle(scope.row.id)">
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
      :title="state.type == 'add' ? '添加帖子' : '修改帖子'"
      v-model="state.dialogVisible"
      width="400"
      @closed="closeDialog"
    >
      <!-- 对话框主体区域 -->
      <el-form :model="state.form" ref="articleFormRef" label-width="70px">
        <el-form-item label="标题" prop="title">
          <el-input v-model="state.form.title" />
        </el-form-item>

        <el-form-item label="作者" prop="author">
          <el-select v-model="state.form.authorId">
            <el-option
              v-for="(item, index) in usernameList"
              :key="index"
              :label="item.username"
              :value="item.userId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-select v-model="state.form.type">
            <el-option
              v-for="(item, index) in types"
              :key="index"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="内容" prop="content">
          <el-input type="textarea" autosize v-model="state.form.content" />
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
import { Search, Plus, Delete } from "@element-plus/icons-vue";
import {
  addArticle,
  getArticleByCondition,
  getArticleList,
  updateArticle,
  delArticle,
} from "@/http/forum";
import { computed, onMounted, reactive, ref } from "vue";
import { findUserById, findUsername } from "@/utils/find";
import { ElMessage, ElMessageBox } from "element-plus";

const state = reactive({
  articleList: [],
  total: 0, // 总条数
  currentPage: 1, // 当前页
  pageSize: 5, // 分页大小
  keyword: "",
  type: "add",
  dialogVisible: false,
  articleId: "",
  form: {},
});
const isSelect = computed(() => state.articleId); //是否批量选择了
const types = ["婚恋", "职场", "家庭", "其他"]; //帖子分类
let usernameList = null; // 用户名列表
const articleFormRef = ref(null); //表单dom
//获取帖子列表
const getAllArticle = async () => {
  const res = await getArticleList(state.currentPage, state.pageSize);
  state.articleList = await findUserById(res.data.items);
  state.total = res.data.total;
  state.currentPage = res.data.pageNo;
};

onMounted(async () => {
  usernameList = await findUsername();
  getAllArticle();
});

//关键字查询
const findArticle = async () => {
  if (state.keyword) {
    const res = await getArticleByCondition({ title: state.keyword });
    state.articleList = res.data;
    state.total = res.data.length;
    state.currentPage = 1;
  } else {
    getAllArticle();
  }
};

// 获取当前页数的帖子列表
const changePage = (val) => {
  state.currentPage = val;
  getAllArticle();
};

//对话框显示
const showDialog = (article, type = "add") => {
  state.dialogVisible = true;

  state.type = type;
  if (type !== "add") {
    state.form = { ...article };
  } else {
    Object.keys(state.form).forEach((key) => {
      state.form[key] = "";
    });
  }
};

// 表单提交
const submit = () => {
  if (state.type == "update") {
    updateArticle(state.form).then(() => {
      state.dialogVisible = false;
      getAllArticle();
      ElMessage({
        message: "修改成功",
        type: "success",
      });
    });
  } else {
    state.form.createTime = new Date().toLocaleString();
    addArticle(state.form).then(() => {
      state.dialogVisible = false;
      getAllArticle();
      ElMessage({
        message: "添加成功",
        type: "success",
      });
    });
  }
};

//删除帖子
const deleteArticle = (id) => {
  ElMessageBox.confirm("是否要删除此篇资讯？", "删除资讯", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      delArticle(id).then(() => {
        ElMessage({
          type: "success",
          message: "删除成功",
        });
        getAllArticle();
      });
    })
    .catch(() => {});
};

//批量删除
const delArticleList = () => {
  ElMessageBox.confirm("是否要删除选中的资讯？", "批量删除", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      delArticle(state.articleId).then(() => {
        ElMessage({
          type: "success",
          message: "删除成功",
        });
        getAllArticle();
      });
    })
    .catch(() => {});
};

//监听选择项
const handleSelectionChange = (val) => {
  state.articleId = val.map((item) => item.id).join(",");
};

//重置表单
const closeDialog = () => {
  articleFormRef.value.resetFields();
};
</script>

<style lang="less" scoped>
.box-card {
  min-height: 100%;
  .el-card .is-always-shadow {
    min-height: 100% !important;
  }
  .el-table {
    .content {
      display: -webkit-box; //将对象作为弹性伸缩盒子模型显示。
      -webkit-box-orient: vertical; //从上到下垂直排列子元素（设置伸缩盒子的子元素排列方式）
      -webkit-line-clamp: 6; //限制行数
      overflow: hidden; //超出部分隐藏
      text-overflow: ellipsis; //用一个省略号代替超出的内容
    }
  }
  .el-pagination {
    display: flex;
    justify-content: center;
    margin-top: 20px;
  }
}
</style>
