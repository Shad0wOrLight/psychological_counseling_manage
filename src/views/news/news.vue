<template>
  <div class="newsList">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <el-input
            style="width: 300px; margin-right: 10px"
            placeholder="请输入标题或者标签"
            v-model="state.keyword"
            @change="findNews"
            clearable
          >
            <template #append>
              <el-button :icon="Search" @click="findNews" />
            </template>
          </el-input>
          <el-button type="success" :icon="Plus" plain @click="showDialog()">
            发布资讯
          </el-button>
        </div>
      </template>
      <el-table :data="state.newsList" style="width: 100%" border stripe>
        <el-table-column type="expand">
          <template #default="scope">
            <p v-html="scope.row.content" class="content"></p>
          </template>
        </el-table-column>
        <el-table-column prop="id" label="编号" width="60" />
        <el-table-column prop="title" label="资讯标题" />
        <el-table-column prop="cover" label="资讯封面" width="125">
          <template #default="scope">
            <el-image
              style="width: 100px; height: 100px"
              :src="scope.row.cover"
              fit="cover"
            />
          </template>
        </el-table-column>
        <el-table-column prop="type" label="类型" width="60" />
        <el-table-column prop="author" label="作者" width="100" />

        <el-table-column prop="tags" label="标签">
          <template #default="scope">
            <el-tag v-for="item in scope.row.tags" class="tag">
              {{ item }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="isHot" label="是否热门" width="100">
          <template #default="scope">
            <el-switch
              v-model="scope.row.isHot"
              @change="changeIsHot(scope.row)"
            />
          </template>
        </el-table-column>

        <el-table-column prop="createTime" label="发布时间" sortable />
        <el-table-column label="操作" width="160">
          <template #default="scope">
            <el-button type="primary" @click="showDialog(scope.row, 'update')">
              修改
            </el-button>

            <el-button type="danger" @click="deleteNews(scope.row.id)">
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
      :title="state.type == 'add' ? '添加资讯' : '修改资讯'"
      v-model="state.dialogVisible"
      width="70%"
      @closed="closeDialog"
    >
      <!-- 对话框主体区域 -->
      <el-form :model="state.form" ref="newsFormRef" label-width="70px">
        <el-form-item label="标题" prop="title">
          <el-input v-model="state.form.title" style="width: 500px" />
        </el-form-item>

        <el-form-item label="封面" prop="cover">
          <el-upload
            class="avatar-uploader"
            action="#"
            :http-request="uploadImage"
            :show-file-list="false"
          >
            <el-image
              v-if="state.form.cover"
              style="width: 100px; height: 100px"
              fit="cover"
              :src="state.form.cover"
              class="avatar"
            />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
        </el-form-item>
        <el-form-item label="作者" prop="userId">
          <el-select v-model="state.form.userId">
            <el-option
              v-for="(item, index) in authorList"
              :key="index"
              :label="item.username"
              :value="item.userId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-select v-model="state.form.type">
            <el-option
              v-for="(item, index) in typeList"
              :key="index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="标签" prop="tags">
          <el-tree-select
            v-model="state.form.tags"
            default-expand-all
            :data="findTagsByType(typeList, state.form.type)"
            show-checkbox
            multiple
          />
        </el-form-item>
        <el-form-item label="热门" prop="isHot">
          <el-radio-group v-model="state.form.isHot">
            <el-radio :label="true">是</el-radio>
            <el-radio :label="false">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <EditContent
            ref="editRef"
            :content="state.form.content"
            v-if="state.dialogVisible"
          />
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
import {
  getNewsList,
  updateNews,
  findNewsByKeyword,
  addNews,
  delNews,
} from "@/http/news";
import EditContent from "@/components/EditContent.vue";
import { onMounted, reactive, ref } from "vue";
import { Search, Plus } from "@element-plus/icons-vue";
import { findUserNameById, findAuthorName, findTagsByType } from "@/utils/find";
import typeList from "@/assets/data/types";
import { ElMessage, ElMessageBox } from "element-plus";

//状态数据
const state = reactive({
  newsList: [],
  total: 0, // 总条数
  currentPage: 1, // 当前页
  pageSize: 5, // 分页大小
  keyword: "",
  dialogVisible: false,
  type: "add",
  form: {
    title: "",
    cover: "",
    type: "",
    tags: "",
    isHot: "",
    content: "",
  },
});
const newsFormRef = ref(null); // 表单组件dom
const editRef = ref(null); // 子组件dom
let authorList = null; // 作者列表
onMounted(async () => {
  authorList = await findAuthorName();
  getAllNews();
});

// 获取资讯列表
const getAllNews = async () => {
  const res = await getNewsList(state.currentPage, state.pageSize);
  state.newsList = await findUserNameById(res.data.items);
  state.total = res.data.total;
  state.currentPage = res.data.pageNo;
};
// 获取当前页数的资讯列表
const changePage = (val) => {
  state.currentPage = val;
  getAllNews();
};
//对话框显示
const showDialog = (news, type = "add") => {
  state.dialogVisible = true;
  state.type = type;
  if (type !== "add") {
    state.form = { ...news };
  } else {
    Object.keys(state.form).forEach((key) => {
      state.form[key] = "";
    });
  }
};
// 上传图片展示
const uploadImage = (e) => {
  const fd = new FileReader();
  fd.readAsDataURL(e.file);
  fd.onload = () => {
    state.form.cover = fd.result;
  };
};
// 重置表单
const closeDialog = () => {
  newsFormRef.value.resetFields();
};
// 表单提交
const submit = () => {
  state.form.content = editRef.value.content;
  state.form.tags = state.form.tags.join(",");
  state.form.isHot = state.form.isHot ? 1 : 0;
  if (state.type == "update") {
    updateNews(state.form).then(() => {
      state.dialogVisible = false;
      getAllNews();
      ElMessage({
        message: "修改成功",
        type: "success",
      });
    });
  } else {
    addNews(state.form).then(() => {
      state.dialogVisible = false;
      getAllNews();
      ElMessage({
        message: "添加成功",
        type: "success",
      });
    });
  }
};
//删除资讯
const deleteNews = (id) => {
  ElMessageBox.confirm("是否要删除此篇资讯？", "删除资讯", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      delNews(id).then(() => {
        ElMessage({
          type: "success",
          message: "删除成功",
        });
        getAllNews();
      });
    })
    .catch(() => {});
};

// 关键字查询
const findNews = async () => {
  if (state.keyword) {
    const res = await findNewsByKeyword(state.keyword);

    state.newsList = await findUserNameById(res.data);
    state.total = res.data.length;
    state.currentPage = 1;
  } else {
    getAllNews();
  }
};
// 改变热门资讯
const changeIsHot = (item) => {
  const data = {
    isHot: item.isHot ? 1 : 0,
    id: item.id,
  };
  updateNews(data).then(() => {
    getAllNews();
  });
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
      padding: 0 15px;
      height: 500px;
      overflow-y: scroll;
      font-size: 14px;
      line-height: 1.7em;
    }
    .tag {
      margin-right: 5px;
      margin-bottom: 5px;
    }
    .avatar-uploader {
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: var(--el-transition-duration-fast);

      .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 50px;
        height: 50px;
        text-align: center;
      }
    }
  }
  .el-pagination {
    display: flex;
    justify-content: center;
    margin-top: 20px;
  }
}
</style>
