<template>
  <div class="comment-div">
    <p><b>{{ comment.user_name }}</b> : {{ comment.content }}</p>
    <div >
      <button class="replybuttons" @click="showReplyForm">Reply{{ comment.id }}</button>
      <ReplyForm v-if="isReplyFormVisible" @submit-reply="handleReplySubmission" @cancel-reply="cancelReplyForm" />
    </div>
    <div v-if="comment.children_recursive.length > 0" class="reply-div">
      <blog-comment v-for="childComment in comment.children_recursive" :key="childComment.id" :comment="childComment" />

    </div>
  </div>
</template>
  
<script>
import ReplyForm from './ReplyForm.vue';
export default {
  props: ['comment'],
  components: {
    ReplyForm
  },
  data() {
    return {
      isReplyFormVisible: false
    };
  },
  methods: {
    showReplyForm() {
      this.isReplyFormVisible = true;
    },
    handleReplySubmission(replyText) {
      // Handle the submitted reply in the parent component
      console.log('Submitted reply:', replyText);
      // You can perform additional logic or send the reply to the server
      // Close the reply form after submission
      this.isReplyFormVisible = false;
    },
    cancelReplyForm() {
      // Handle cancel logic here
      this.isReplyFormVisible = false;
    }
  }
};
</script>
<style>
.comment-div {

  border-top: 1px solid #ccc;
  border-bottom: 1px solid #ccc;
}
button.replybuttons {
  background-color: #042e3be3;
    color: white;
    padding: 5px 10px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size:15px;
}
</style>