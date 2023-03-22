const menuList = [
  {
    id: 1,
    text: "用户管理",
    icon: {
      name: "User",
      color: "#409EFC",
      size: 20,
    },
    children: [
      {
        id: 101,
        text: "用户列表",
        path: "/user",
      },
    ],
  },
  {
    id: 2,
    text: "资讯管理",

    icon: {
      name: "Document",
      color: "#409EFC",
      size: 20,
    },
    children: [
      {
        id: 102,
        text: "资讯列表",
        path: "/news",
      },
    ],
  },
  {
    id: 3,
    text: "论坛管理",

    icon: {
      name: "Comment",
      color: "#409EFC",
      size: 20,
    },
    children: [
      {
        id: 103,
        text: "帖子列表",
        path: "/forum",
      },
      {
        id: 104,
        text: "评论管理",
        path: "/comment",
      },
    ],
  },
  {
    id: 4,
    text: "测评管理",

    icon: {
      name: "List",
      color: "#409EFC",
      size: 20,
    },
    children: [
      {
        id: 105,
        text: "测评问卷",
        path: "/evaluation",
      },
    ],
  },
];
export default menuList;
