<template>
  <div class="evaluationList">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <el-input
            style="width: 300px; margin-right: 10px"
            placeholder="请输入关键字"
            v-model="state.keyword"
            @change="findTest"
            clearable
          >
            <template #append>
              <el-button :icon="Search" @click="findTest" />
            </template>
          </el-input>
          <el-button type="success" plain @click="showDialog()" :icon="Plus">
            创建问卷
          </el-button>
        </div>
      </template>
      <el-table
        :data="state.testList"
        style="width: 100%"
        border
        stripe
        @expand-change="expandChange"
      >
        <el-table-column type="expand">
          <template #default="scope">
            <Topic :questionnaireId="scope.row.id"/>

          </template>
        </el-table-column>

        <el-table-column prop="name" label="标题" width="150" />
        <el-table-column
          prop="cover"
          label="问卷封面"
          width="125"
          align="center"
        >
          <template #default="scope">
            <el-image
              style="width: 100px; height: 100px"
              :src="scope.row.cover"
              fit="cover"
            />
          </template>
        </el-table-column>
        <el-table-column prop="introduction" label="简介" align="center">
          <template #default="scope">
            <div class="content" v-html="scope.row.introduction" />
          </template>
        </el-table-column>

        <el-table-column prop="type" label="类型" width="80" align="center" />
        <el-table-column prop="isHot" label="是否热门" width="100">
          <template #default="scope">
            <el-switch
              v-model="scope.row.isHot"
              @change="changeIsHot(scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="spentTime"
          label="耗时（分钟）"
          width="150"
          sortable
          align="center"
        />

        <el-table-column
          prop="createTime"
          label="创建时间"
          width="200"
          sortable
          align="center"
        />
        <el-table-column label="操作" width="160" align="center">
          <template #default="scope">
            <el-button type="primary" @click="showDialog(scope.row, 'update')">
              修改
            </el-button>

            <el-button type="danger" @click="deleteTest(scope.row.id)">
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
      :title="state.type == 'add' ? '添加问卷' : '修改问卷'"
      v-model="state.dialogVisible"
      width="50%"
      @closed="closeDialog"
    >
      <!-- 对话框主体区域 -->
      <el-form :model="state.form" ref="testFormRef" label-width="70px">
        <el-form-item label="标题" prop="title">
          <el-input v-model="state.form.name" style="width: 400px" />
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

        <el-form-item label="热门" prop="isHot">
          <el-radio-group v-model="state.form.isHot">
            <el-radio :label="true">是</el-radio>
            <el-radio :label="false">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="类别" prop="type">
          <el-select v-model="state.form.type">
            <el-option
              v-for="(item, index) in typeList"
              :key="index"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="耗时" prop="spentTime">
          <el-input v-model="state.form.spentTime" style="width: 100px" />
        </el-form-item>
        <el-form-item label="简介" prop="introduction">
          <EditContent
            ref="editRef"
            :content="state.form.introduction"
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
import { reactive, ref } from "vue";
import EditContent from "@/components/EditContent.vue";
import Topic from "./topic";
import {
  getEvaluationList,
  updateEvaluation,
  getEvaluationByCondition,
  addEvaluation,
  delEvaluation,
} from "@/http/evaluation";
import { Search, Plus } from "@element-plus/icons-vue";
import { formatIsHot } from "@/utils/format";
import { ElMessage, ElMessageBox } from "element-plus";

const state = reactive({
  testList: [],
  total: 0, // 总条数
  currentPage: 1, // 当前页
  pageSize: 5, // 分页大小
  keyword: "",
  type: "add",
  dialogVisible: false,

  form: {},
});
const testFormRef = ref(null);
const editRef = ref(null); // 子组件dom
const typeList = ["健康", "婚恋", "职场", "亲子", "能力", "人格"];
const getAllTest = async () => {
  const res = await getEvaluationList(state.currentPage, state.pageSize);
  state.testList = formatIsHot(res.data.items);
  state.total = res.data.total;
  state.currentPage = res.data.pageNo;
};
getAllTest();

// 关键字查询
const findTest = async () => {
  if (state.keyword) {
    const res = await getEvaluationByCondition({ name: state.keyword });
    state.testList = formatIsHot(res.data);
    state.total = res.data.length;
    state.currentPage = 1;
  } else {
    getAllTest();
  }
};
// 获取当前页数的问卷列表
const changePage = (val) => {
  state.currentPage = val;
  getAllTest();
};
//显示对话框
const showDialog = (questionnaire, type = "add") => {
  state.dialogVisible = true;
  state.type = type;
  if (type !== "add") {
    state.form = { ...questionnaire };
  } else {
    Object.keys(state.form).forEach((key) => {
      state.form[key] = "";
    });
  }
};
//删除问卷
const deleteTest = (id) => {
  ElMessageBox.confirm("是否要删除此测评问卷？", "删除问卷", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      delEvaluation(id).then(() => {
        ElMessage({
          type: "success",
          message: "删除成功",
        });
        getAllTest();
      });
    })
    .catch(() => {});
};
// 改变热门测评
const changeIsHot = (item) => {
  const data = {
    isHot: item.isHot ? 1 : 0,
    id: item.id,
  };
  updateEvaluation(data).then(() => {
    getAllTest();
  });
};
// 上传图片展示
const uploadImage = (e) => {
  const fd = new FileReader();
  fd.readAsDataURL(e.file);
  fd.onload = () => {
    state.form.cover = fd.result;
  };
};
//表单提交
const submit = () => {
  state.form.introduction = editRef.value.content;
  state.form.isHot = state.form.isHot ? 1 : 0;
  state.form.answerId = 1;

  if (state.type == "update") {
    updateEvaluation(state.form).then(() => {
      state.dialogVisible = false;
      getAllTest();
      ElMessage({
        message: "修改成功",
        type: "success",
      });
    });
  } else {
    addEvaluation(state.form).then(() => {
      state.dialogVisible = false;
      getAllTest();
      ElMessage({
        message: "添加成功",
        type: "success",
      });
    });
  }
};
//重置表单
const closeDialog = () => {
  testFormRef.value.resetFields();
};
const expandChange = ({ id }, b) => {

  // console.log(id, b.length);
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
