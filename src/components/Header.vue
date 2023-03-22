<template>
  <div class="header">
    <div class="left">
      <span style="font-size: 20px">{{ state.name }}</span>
    </div>
    <div class="right">
      <el-tooltip placement="bottom" effect="light">
        <div class="author">
          <el-avatar :src="state.userInfo.avatar" />
          <span class="name">{{ state.userInfo.username }}</span>
          <el-icon><CaretBottom /></el-icon>
        </div>
        <template #content>
          <el-button @click="logout" size="small">退出登录</el-button>
        </template>
      </el-tooltip>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive } from "vue";
import { getUserInfo, userLogout } from "@/utils/storage";
import { useRoute, useRouter } from "vue-router";
import { findName } from "@/utils/find";
import { ElMessage, ElMessageBox } from "element-plus";

const router = useRouter();
const route = useRoute();
const state = reactive({
  name: "", // 当前菜单项名称
  userInfo: getUserInfo(), // 用户信息变量
  hasBack: false, // 是否展示返回icon
});

state.name = computed(() => findName(route.path));

//退出登录
const logout = () => {
  ElMessageBox.confirm("是否要注销？", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      ElMessage({
        type: "success",
        message: "注销成功",
      });
      userLogout();
      router.push("/login");
    })
    .catch(() => {});
};
</script>

<style lang="less" scoped>
.header {
  height: 50px;
  border-bottom: 1px solid #e9e9e9;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  .left {
    .back {
      border: 1px solid #e9e9e9;
      padding: 5px;
      border-radius: 50%;
      margin-right: 5px;
      cursor: pointer;
    }
  }
  .right {
    .icon {
      font-size: 18px;
      margin-right: 6px;
    }
    .author {
      display: flex;
      align-items: center;
      margin-left: 10px;
      cursor: pointer;
      .name {
        margin-left: 10px;
        margin-right: 10px;
      }
    }
  }
}
</style>
