import { createRouter, createWebHashHistory } from "vue-router";
import { getCookie, getUserInfo } from "@/utils/storage";
import { ElMessage } from "element-plus";

const routes = [
  {
    path: "/",
    redirect: "/home",
  },
  {
    path: "/home",
    redirect: "/user",
    name: "Home",
    component: () => import("@/views/home/home.vue"),
    children: [
      {
        path: "/user",
        component: () => import("@/views/user/user.vue"),
      },
      {
        path: "/news",
        component: () => import("@/views/news/news.vue"),
      },
      {
        path: "/forum",
        component: () => import("@/views/forum/forum.vue"),
      },
      {
        path: "/comment",
        component: () => import("@/views/forum/comment.vue"),
      },
      {
        path: "/evaluation",
        component: () => import("@/views/evaluation/evaluation.vue"),
      },
      {
        path: "/topic",
        component: () => import("@/views/evaluation/topic.vue"),
      },
    ],
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("@/views/login/login.vue"),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const user = getUserInfo();

  if (to.name == "Login") {
    next();
  } else {
    if (!user) {
      ElMessage({
        message: "您还未登录，请先登录！",
        type: "warning",
      });
      next({ name: "Login" });
    } else {
      next();
    }
  }
});
export default router;
