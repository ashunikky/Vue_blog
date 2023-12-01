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
            this.$emit('submit-reply', this.replyText);
            // Reset the replyText for the next use
            this.replyText = '';
        },
        cancelReply() {
            // Handle cancel logic here
            this.$emit('cancel-reply');
            this.replyText = ''; // Reset the replyText for the next use
        }
    }
};
</script>
  
<style scoped>
/* Add your styling here */
</style>
  