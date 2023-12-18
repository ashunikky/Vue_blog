<template>
    <form class="edit-comment-form">
        <textarea v-model="editedComment.content" placeholder="Edit your comment..." required></textarea>
        <button class="replybuttons" @click="submitEdit"><font-awesome-icon icon="check" /> Save</button>
        <button class="replybuttons" @click="cancelEdit"><font-awesome-icon icon="times" /> Cancel</button>
    </form>
</template>
  
<script>
export default {
    props: ['comment'],
    data() {
        return {
            editedComment: { ...this.comment },
        };
    },
    methods: {
        submitEdit() {
            this.$emit('submit-edit', this.editedComment);
        },
        cancelEdit() {
            this.$emit('cancel-edit');
        },
    },
};
</script>
  
<style scoped>
/* Add your styling here */
</style>
  