<template>
  <div class="edit">
    <div style="border: 1px solid #ccc">
      <Toolbar
        style="border-bottom: 1px solid #ccc"
        :editor="editorRef"
        :defaultConfig="toolbarConfig"
        mode="default"
      />
      <Editor
        style="height: 500px; overflow-y: hidden"
        v-model="content"
        :defaultConfig="editorConfig"
        mode="default"
        @onCreated="handleCreated"
      />
    </div>
  </div>
</template>

<script setup>
import "@wangeditor/editor/dist/css/style.css"; // 引入 css

import { onBeforeUnmount, ref, shallowRef } from "vue";
import { Editor, Toolbar } from "@wangeditor/editor-for-vue";

const props = defineProps({
  content: String,
});
// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef();

// 内容 HTML
const content = ref(props.content);

const toolbarConfig = {};
const editorConfig = { placeholder: "请输入内容..." };

// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value;
  if (editor == null) return;
  editor.destroy();
});

const handleCreated = (editor) => {
  editorRef.value = editor; // 记录 editor 实例，重要！
};

defineExpose({
  content,
});
</script>

<style lang="less" scoped></style>
