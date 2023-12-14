<template>
  <div class="comment-div">
    <p><b>{{ comment.user_name }}</b> : {{ comment.content }}</p>
    <div>
      <button class="replybuttons" @click="showReplyForm"><font-awesome-icon icon="reply" /> Reply</button>
      <ReplyForm v-if="isReplyFormVisible" @submit-reply="handleReplySubmission" @cancel-reply="cancelReplyForm"
         :parent_id="comment.id" />
    </div>
    <div v-if="comment.children_recursive.length > 0" class="reply-div">
      <blog-comment v-for="childComment in comment.children_recursive" :key="childComment.id" :comment="childComment" />
    </div>
  </div>
</template>
  
<script>
import axios from 'axios'
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
    async handleReplySubmission(replyData) {
      // Handle the submitted reply in the parent component
      console.log('Submitted reply:', replyData);

      // Send the reply data to the server
      try {
        const blogId = this.$route.params.id;
        let user = JSON.parse(localStorage.getItem('user-info'));
        replyData.user_id= user.id;
        const response = await axios.post(`http://127.0.0.1:8000/api/blog/${blogId}/comments`, replyData);

        console.log('Server response:', response.data);
        alert("Reply Posted");
        window.location.reload();
      } catch (error) {
        console.error('Error submitting reply:', error);
        // Handle error logic if necessary
      }
      // Close the reply form after submission
      this.isReplyFormVisible = false;
    },
    cancelReplyForm() {
      // Handle cancel logic here
      this.isReplyFormVisible = false;
    },
    updateComment() {
      this.isEditing = true;
    },
  },
  computed:{
    commentUserAuthorised() {
      let user = JSON.parse(localStorage.getItem('user-info'));
      return user.id === this.comment.user_id;

  }
}
}
</script>
<style>
.comment-div {
  text-align: left;
  margin-left: 50px;
  border-top: 1px solid #ccc;
  /* border-bottom: 1px solid #ccc; */
}
/* .reply-div {
  border-bottom: 1px solid rgb(10, 10, 10);
  border-top: 1px solid #ccc;
} */

button.replybuttons {
  background-color: #5b7faf;
  color: white;
  padding: 5px 10px;
  border: none;
  border-radius: 15px;
  cursor: pointer;
  font-size: 13px;
}

</style>