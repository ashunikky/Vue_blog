<template>
  <div class="comment-div">
    <p><b>{{comment.user_name}}</b> : {{ comment.content }}</p>
    <div v-if="comment.children_recursive.length > 0" class="reply-div">
      <blog-comment v-for="childComment in comment.children_recursive" :key="childComment.id" :comment="childComment" />
    </div>
  </div>
</template>
  
<script>
export default {
  props: ['comment'],
};
</script>
<style>
.comment-div {
 
  border-top: 1px solid #ccc;
  border-bottom: 1px solid #ccc;
}



</style>