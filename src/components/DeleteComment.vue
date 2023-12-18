<template>
    <div class="delete-Comment">
        <p>Are you sure you want to delete this comment?</p>
        <button class="replybuttons" @click="confirmDelete">Yes</button>
        <button class="replybuttons" @click="cancelDelete">No</button>
    </div>
</template>
  
<script>
export default {
    methods: {
        confirmDelete() {
            this.$emit('confirm-delete');
        },
        cancelDelete() {
            this.$emit('cancel-delete');
        },
    },
};
</script>
  
<style scoped>
/* Add your styling here */
</style>
  