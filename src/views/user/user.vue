<template>
  <div class="userList">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <el-input
            style="width: 300px; margin-right: 10px"
            placeholder="请输入用户名"
            v-model="state.keyword"
            @change="findUser"
            clearable
          >
            <template #append>
              <el-button :icon="Search" @click="findUser" />
            </template>
          </el-input>
          <el-button type="success" plain :icon="Plus" @click="showDialog()">
            添加用户
          </el-button>
        </div>
      </template>
      <el-table :data="state.userList" style="width: 100%" border stripe>
        <el-table-column prop="uid" label="编号" width="60" />
        <el-table-column prop="username" label="用户名" />
        <el-table-column prop="avatar" label="头像" width="125">
          <template #default="scope">
            <el-image
              style="width: 100px; height: 100px"
              :src="scope.row.avatar"
              fit="cover"
            />
          </template>
        </el-table-column>
        <el-table-column prop="gender" label="性别" width="80"/>
        <el-table-column prop="age" label="年龄" sortable width="80" />
        <el-table-column prop="address" label="地址" />
        <el-table-column prop="phone" label="电话号码" width="120" />
        <el-table-column prop="role" label="角色">
          <template #default="scope">
            {{ formatRole(scope.row.role) }}
          </template>
        </el-table-column>
        <el-table-column prop="declare" label="个人简介" />
        <el-table-column prop="skillField" label="擅长领域" />
        <el-table-column prop="createTime" label="注册时间" sortable/>
        <el-table-column label="操作" width="160">
          <template #default="scope">
            <el-button type="primary" @click="showDialog(scope.row, 'update')">
              修改
            </el-button>

            <el-button type="danger" @click="deleteUser(scope.row.uid)">
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

    <!-- 修改用户对话框 -->
    <el-dialog
      :title="state.type == 'add' ? '添加用户' : '修改用户'"
      v-model="state.dialogVisible"
      width="400px"
      @closed="closeDialog"
    >
      <!-- 对话框主体区域 -->
      <el-form :model="state.form" ref="userFormRef" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="state.form.username" />
        </el-form-item>
        <el-form-item label="密码" prop="password" v-if="state.type == 'add'">
          <el-input v-model="state.form.password" type="password" />
        </el-form-item>
        <el-form-item label="头像" prop="avatar">
          <el-upload
            class="avatar-uploader"
            action="#"
            :http-request="uploadImage"
            :show-file-list="false"
          >
            <el-image
              v-if="state.form.avatar"
              style="width: 100px; height: 100px"
              fit="cover"
              :src="state.form.avatar"
              class="avatar"
            />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
        </el-form-item>

        <el-form-item label="性别" prop="gender">
          <el-radio-group v-model="state.form.gender">
            <el-radio label="男" />
            <el-radio label="女" />
          </el-radio-group>
        </el-form-item>
        <el-form-item label="年龄" prop="age">
          <el-input v-model="state.form.age" />
        </el-form-item>
        <el-form-item label="电话号码" prop="phone">
          <el-input v-model="state.form.phone" />
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input v-model="state.form.address" />
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-select v-model="state.form.role">
            <el-option label="普通用户" value="0" />
            <el-option label="咨询师" value="1" />
            <el-option label="管理员" value="2" />
          </el-select>
        </el-form-item>
        <el-form-item
          label="擅长领域"
          prop="skillField"
          v-if="state.form.role == 1"
        >
          <el-select v-model="state.form.skillField">
            <el-option
              v-for="item in skillFieldList"
              :key="item.id"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="个人简介" prop="declare">
          <el-input v-model="state.form.declare" type="textarea" />
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
  getUserList,
  updateUser,
  delUser,
  addUser,
  findUserList,
} from "@/http/user";
import { reactive, ref } from "vue";
import { formatRole } from "@/utils/format";
import skillFieldList from "@/assets/data/skillField";
import { ElMessage, ElMessageBox } from "element-plus";
import { Search ,Plus} from "@element-plus/icons-vue";

const state = reactive({
  userList: [],
  total: 0, // 总条数
  currentPage: 1, // 当前页
  pageSize: 5, // 分页大小
  dialogVisible: false,
  type: "update",
  //用户表单
  form: {
    username: "",
    password: "",
    gender: "",
    age: "",
    phone: "",
    address: "",
    declare: "",
    skillField: "",
    avatar: "",
    role: "",
  },
  keyword: "", //搜索词
});
const userFormRef = ref(null);

// 获取用户列表
const getAllUser = async () => {
  const res = await getUserList(state.currentPage, state.pageSize);
  state.userList = res.data.items;
  state.total = res.data.total;
  state.currentPage = res.data.pageNo;
};
getAllUser();
// 获取当前页数的用户列表
const changePage = (val) => {
  state.currentPage = val;
  getAllUser();
};

// 控制对话框显示
const showDialog = (user, type = "add") => {
  state.dialogVisible = true;
  state.type = type;
  if (type !== "add") {
    state.form = { ...user };
  } else {
    Object.keys(state.form).forEach((key) => {
      state.form[key] = "";
    });
  }
};
// 提交表单
const submit = () => {
  if (state.type == "update") {
    updateUser(state.form).then(() => {
      state.dialogVisible = false;
      getAllUser();
      ElMessage({
        message: "修改成功",
        type: "success",
      });
    });
  } else {
    addUser(state.form).then(() => {
      state.dialogVisible = false;
      getAllUser();
      ElMessage({
        message: "添加成功",
        type: "success",
      });
    });
  }
};

// 上传图片展示
const uploadImage = (e) => {
  const fd = new FileReader();
  fd.readAsDataURL(e.file);
  fd.onload = () => {
    state.form.avatar = fd.result;
  };
};
//删除用户
const deleteUser = (id) => {
  ElMessageBox.confirm("此操作将永久删除该用户信息, 是否继续？", "删除用户", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      delUser(id).then(() => {
        ElMessage({
          type: "success",
          message: "删除成功",
        });
        getAllUser();
      });
    })
    .catch(() => {});
};
// 重置表单
const closeDialog = () => {
  userFormRef.value.resetFields();
};

const findUser = async (val) => {
  if (state.keyword) {
    const res = await findUserList({ username: val });
    state.userList = res.data;
    state.total = res.data.length;
    state.currentPage = 1;
  } else {
    getAllUser();
  }
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
</style>
