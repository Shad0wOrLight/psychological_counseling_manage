<template>
  <div class="layout">
    <!-- 主体 -->
    <el-container class="container">
      <!-- 侧边栏 -->
      <el-aside class="aside">
        <el-header>
          <el-image class="logo" :src="logo" />
          <span>后台管理</span>
        </el-header>
        <div class="line" />
        <!-- 菜单栏 -->
        <el-menu
          background-color="#222832"
          text-color="#fff"
          router
          :default-openeds="state.defaultOpen"
          :default-active="state.currentPath"
        >
          <el-sub-menu
            :index="item.id + ''"
            v-for="item in menuList"
            :key="item.id"
          >
            <template #title>
              <el-icon :color="item.icon.color" :size="item.icon.size">
                <component :is="item.icon.name" />
              </el-icon>
              <span>{{ item.text }}</span>
            </template>
            <el-menu-item-group>
              <el-menu-item :index="e.path" v-for="e in item.children">
                <span>{{ e.text }}</span>
              </el-menu-item>
            </el-menu-item-group>
          </el-sub-menu>
        </el-menu>
      </el-aside>
      <!-- 内容区域 -->
      <el-container class="content">
        <Header />
        <el-main class="main">
          <RouterView />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import logo from "@/assets/image/favicon.png";
import Header from "@/components/Header.vue";
import menuList from "@/assets/data/menu";
import { computed, reactive } from "vue";
import { useRoute } from "vue-router";
const state = reactive({
  defaultOpen: ["1", "2", "3", "4"], //默认展开的菜单栏索引
  currentPath: "", //当前菜单项
});
const route = useRoute();
state.currentPath = computed(() => route.path);
</script>

<style lang="less" scoped>
.layout {
  min-height: 100vh;
  background-color: #ffffff;
  .container {
    height: 100vh;
    .aside {
      width: 200px !important;
      background-color: #222832;
      .el-header {
        font-size: 20px;
        color: #ffffff;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 50px;
      }
      .logo {
        width: 30px;
        height: 30px;
        margin-right: 10px;
      }
      .line {
        border-top: 1px solid hsla(0, 0%, 100%, 0.05);
        border-bottom: 1px solid rgba(0, 0, 0, 0.2);
      }
      .el-menu {
        border-right: none !important;
        .el-submenu {
          border-top: 1px solid hsla(0, 0%, 100%, 0.05);
          border-bottom: 1px solid rgba(0, 0, 0, 0.2);
        }
      }
    }
    .content {
      display: flex;
      flex-direction: column;
      max-height: 100vh;
      overflow: hidden;
      .main {
        height: calc(100vh - 100px);
        overflow: auto;
        padding: 10px;
      }
    }
  }
}
</style>
