<!-- ReplyForm.vue -->
<template>
    <div class="reply-form">
        <textarea v-model="replyText" placeholder="Type your reply..."></textarea>
        <button class="replybuttons" @click="submitReply">Submit</button>
        <button class="replybuttons" @click="cancelReply">Cancel</button>
    </div>
</template>
  
<script>
export default {
    data() {
        return {
            replyText: ''
        };
    },
    methods: {
    submitReply() {
      // Handle submission logic here
      // You might emit an event or call a method in the parent component
      const replyData = {
        content: this.replyText,
        user_id: '',     // Assuming this.user_id is a prop passed from the parent
        parent_id: this.parent_id  // Assuming this.parent_id is a prop passed from the parent
      };
      this.$emit('submit-reply', replyData);
      // Reset the replyText for the next use
      this.replyText = '';
    },
    cancelReply() {
      // Handle cancel logic here
      this.$emit('cancel-reply');
      this.replyText = ''; // Reset the replyText for the next use
    }
  },
  props: {
    user_id: {
      type: String, // Change the type accordingly
      required: true
    },
    parent_id: {
      type: String, // Change the type accordingly
      required: true
    }
  }
};
</script>
  
<style scoped>
/* Add your styling here */
</style>
  