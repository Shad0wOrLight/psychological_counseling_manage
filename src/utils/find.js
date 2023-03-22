import menuList from "@/assets/data/menu";
import { getArticleByCondition } from "@/http/forum";
import { getEvaluationByCondition } from "@/http/evaluation";
import { findUserList } from "@/http/user";
import { formatIsHot } from "./format";

export const findName = (path) => {
  let name = "";
  menuList.forEach((item) => {
    item.children.forEach((e) => {
      if (e.path == path) {
        name = e.text;
      }
    });
  });

  return name;
};

//根据资讯的作者id查找用户
export const findUserNameById = async (newsList) => {
  const res = await findUserList({});

  const list = [...newsList];
  list.forEach((news) => {
    news.tags = news.tags.split(",");
  });

  res.data.forEach(({ uid, username }) => {
    list.forEach((news) => {
      if (news.userId == uid) {
        news.author = username;
      }
    });
  });

  return formatIsHot(list);
};

export const findAuthorName = async () => {
  const res = await findUserList({ role: 1 });
  const list = res.data.map((item) => {
    const obj = {};
    obj["userId"] = item.uid;
    obj["username"] = item.username;
    return obj;
  });

  return list;
};

export const findTagsByType = (tagsList, type) => {
  return tagsList.filter((item) => item.label == type);
};

export const findUserById = async (list) => {
  const res = await findUserList({});
  res.data.forEach(({ uid, username }) => {
    list.forEach((item) => {
      if (item.authorId == uid) {
        item.author = username;
      }
    });
  });
  return list;
};
export const findUsername = async () => {
  const res = await findUserList({});
  const list = res.data.map((item) => {
    const obj = {};
    obj["userId"] = item.uid;
    obj["username"] = item.username;
    return obj;
  });

  return list;
};

export const findArticleName = async (commentList) => {
  const res1 = await findUserList({});
  const res2 = await getArticleByCondition({});
  commentList.forEach((item) => {
    res1.data.forEach((user) => {
      if (user.uid == item.userId) {
        item.username = user.username;
      }
    });
    res2.data.forEach((article) => {
      if (article.id == item.articleId) {
        item.articleTitle = article.title;
      }
    });
  });

  return commentList;
};

export const findQuestionnaireName = async (topicList) => {
  const res = await getEvaluationByCondition();

  topicList.forEach((item) => {
    res.data.forEach((topic) => {
      if (item.questionnaireId == topic.id) {
        item.questionnaireName = topic.name;
      }
    });
  });
  return topicList;
};

export const findUQuestionnaire = async () => {
  const res = await getEvaluationByCondition({});
  const list = res.data.map((item) => {
    const obj = {};
    obj["questionnaireId"] = item.id;
    obj["name"] = item.name;
    return obj;
  });

  return list;
};
