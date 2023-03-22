<template>
  <div class="login">
    <div class="login-container">
      <div class="head">
        <img class="logo" :src="logo" />
        <div class="name">
          <div class="title">在线咨询</div>
          <div class="tips">心理咨询后台管理系统</div>
        </div>
      </div>
      <el-form
        label-position="top"
        :rules="state.rules"
        :model="state.ruleForm"
        ref="loginForm"
        class="login-form"
      >
        <el-form-item label="账号" prop="username">
          <el-input type="text" v-model.trim="state.ruleForm.username" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model.trim="state.ruleForm.password" />
        </el-form-item>
        <el-form-item>
          <div style="color: #333">
            登录表示您已同意<a href="#">《服务条款》</a>
          </div>
          <el-button style="width: 100%" type="primary" @click="submitForm">
            立即登录
          </el-button>
          <el-checkbox v-model="state.checked" @change="!state.checked">
            下次自动登录
          </el-checkbox>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import logo from "@/assets/image/favicon.png";
import { ElMessage } from "element-plus";
import { reactive, ref } from "vue";
import { userLogin } from "@/http/user";
import { useRouter } from "vue-router";
import {
  saveUserInfo,
  setCookie,
  removeCookie,
  getCookie,
} from "@/utils/storage";

const router = useRouter();
// 数据
const state = reactive({
  ruleForm: {
    username: getCookie("username"),
    password: getCookie("password"),
  },
  checked: true,
  rules: {
    username: [{ required: "true", message: "账户不能为空", trigger: "blur" }],
    password: [{ required: "true", message: "密码不能为空", trigger: "blur" }],
  },
});

const loginForm = ref(null); //表单实例

//登录提交表单
const submitForm = async () => {
  loginForm.value.validate(async (valid) => {
    if (valid) {
      const res = await userLogin({
        username: state.ruleForm.username,
        password: state.ruleForm.password,
      });

      // 判断是否是管理员
      if (res.data.role == 2) {
        if (res.code == "1000") {
          ElMessage({
            message: "登录成功！",
            type: "success",
          });
          //是否7天内免登录
          if (state.checked) {
            setCookie(state.ruleForm);
          } else {
            removeCookie();
          }
          saveUserInfo(res.data);
          loginForm.value.resetFields();
          router.push("/home");
        } else {
          ElMessage({
            message: "用户名或密码错误！",
            type: "warning",
          });
        }
      } else {
        ElMessage({
          message: "您暂无权限进入，请联系管理员！",
          type: "warning",
        });
      }
    } else {
      ElMessage({
        message: "请输入完整的用户名和密码",
        type: "warning",
      });
      return false;
    }
  });
};
</script>

<style lang="less" scoped>
.login {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  background-color: #fff;
  height: 100vh;
  .login-container {
    width: 420px;
    height: 500px;
    background-color: #fff;
    border-radius: 4px;
    box-shadow: 0px 21px 41px 0px rgba(0, 0, 0, 0.2);
    .head {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 40px 0 20px 0;
      img {
        width: 100px;
        height: 100px;
        margin-right: 20px;
      }
      .title {
        font-size: 28px;
        color: #1baeae;
        font-weight: bold;
      }
      .tips {
        font-size: 12px;
        color: #999;
      }
    }

    .login-form {
      width: 70%;
      margin: 0 auto;
      a {
        color: #409eff;
        text-decoration: none;
      }
    }
  }
}
</style>
