<template>
    <div>
      <p>{{ comment.content }}</p>
      <blog-comment v-for="childComment in comment.children" :key="childComment.id" :comment="childComment" />
    </div>
  </template>
  
  <script>
  export default {
    props: ['comment'],
  };
  </script>