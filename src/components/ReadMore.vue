<template>
  <div>
    <NavBar />
    <div class="narrow-div">
      <div v-if="blog.title && !isEditing">
        <h2>{{ blog.title }}</h2>
        <div v-if="blog && blog.user">
          <p>by {{ blog.user.name }}, {{ formatDate(blog.updated_at) }}</p>
        </div>
        <div v-else>
          <p>Loading...</p>
        </div>
        <!-- <p>by {{ blog.user.name }} ,{{ formatDate(blog.updated_at) }}</p> -->
        <p class="styled-content">{{ blog.content }}</p>
        <div>
          <button @click="goBack">Back</button>
          <button v-if="isUserAuthorised" @click="startEditing">Edit</button>
          <button v-if="isUserAuthorised" @click="deleteBlog">Delete</button>

        </div>
      </div>
      <div v-else>
        <p>Loading...</p>
      </div>
      <div v-if="isEditing">
        <div class="container">
          <h2>Edit Blog</h2>
          <form @submit.prevent="updateBlog">
            <div class="form-group">
              <label>Blog Title</label>
              <input type="text" v-model="blog.title" class="form-control" placeholder="Blog Title">
            </div>
            <div class="form-group">
              <label>Blog Category</label>
              <input type="text" v-model="blog.category" class="form-control" placeholder="Blog Category">
            </div>
            <div class="form-group">
              <label>Content</label>
              <textarea v-model="blog.content" class="form-control" placeholder="Content"></textarea>
            </div>
            <button type="submit" class="btn btn-primary">Save</button>
            <button type="button" @click="cancelForm">Cancel</button>
          </form>
        </div>
      </div>
      <h3>Comments ({{ totalComments }})</h3>
      <div class="comment-div"><blog-comment v-for="comment in comments" :key="comment.id" :comment="comment" /></div>
    </div> 
  </div>
</template>

<script>
import axios from 'axios';
import NavBar from './NavBar.vue';
import BlogComment from './BlogComment.vue';

export default {
  name: 'ReadMore',
  components: {
    NavBar,
    BlogComment,
  },
  data() {
    return {
      isEditing: false,
      isButtonVisible: false,
      comments: [],
      blog: {
        id: '',
        title: '',
        category: '',
        content: ''
      }
    };
  },
  mounted() {
    this.loadBlog();
    this.fetchComments();
  },
  methods: {
    loadBlog() {
      let user = localStorage.getItem('user-info');
      if (!user) {
        alert('Please login to access this content.');
        this.$router.push({ name: 'BlogHome' });
      } else {
        const blogId = this.$route.params.id;
        axios.get(`http://127.0.0.1:8000/api/blog/${blogId}`)
          .then(({ data }) => {
            this.blog = data;
          })
          .catch(error => {
            console.error(error);
            // Handle error
          });
      }
    },
    formatDate(timestamp) {
      const options = { year: 'numeric', month: 'short', day: 'numeric' };
      const formattedDate = new Date(timestamp).toLocaleDateString(undefined, options);
      return formattedDate;
    },
    startEditing() {
      this.isEditing = true;
    },
    goBack() {
      // Assuming this.blog.id contains the ID of the current blog
      this.$router.push({ name: 'BlogHome' });
    },
    save() {
      if (this.blog.id == '') {
        this.saveBlog();
      } else {
        this.updateBlog();
      }
    },

    saveBlog() {
      const blogId = this.$route.params.id;
      axios.post(`http://127.0.0.1:8000/api/blog/${blogId}`, this.blog) // Send blog data with the request
        .then(({ data }) => { // Use response data here
          alert("Saved successfully");
          this.blog = data; // Update the blog data with the response data
          this.isEditing = false; // Exit editing mode
        })
        .catch(error => {
          console.error(error);
          // Handle error
        });
    },

    updateBlog() {
      const blogId = this.$route.params.id;
      axios.put(`http://127.0.0.1:8000/api/blog/${blogId}`, this.blog) // Send blog data with the request
        .then(({ data }) => { // Use response data here
          alert("Updated successfully");
          console.log(data);
          this.blog = data; // Update the blog data with the response data
          this.isEditing = false; // Exit editing mode
        })
        .catch(error => {
          console.error(error);
          // Handle error
        });
    },
    deleteBlog() {
      const blogId = this.blog.id;
      const isConfirmed = window.confirm('Are you sure you want to delete this blog?');
      if (isConfirmed) {
        axios.delete(`http://127.0.0.1:8000/api/blog/${blogId}`)
          .then(() => {
            alert('Deleted successfully');
            this.$router.push({ name: 'BlogHome' });
          })
          .catch(error => {
            console.error(error);
            // Handle error
          });
      }
    },
    cancelForm() {
      this.isEditing = false;
    },
    async fetchComments() {
      try {
        const blogId = this.$route.params.id;
        const response = await axios.get(`http://127.0.0.1:8000/api/blog/${blogId}/comments`);
        this.comments = response.data;
        console.log(response);
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    },
    getRecursiveCommentsCount(comments) {
      let count = comments.length;

      for (const comment of comments) {
        if (comment.children_recursive && comment.children_recursive.length > 0) {
          count += this.getRecursiveCommentsCount(comment.children_recursive);
        }
      }

      return count;
    }
  },
  computed: {
    isUserLoggedIn() {
      return localStorage.getItem('user-info') !== null;
    },
    userId() {
      let user = JSON.parse(localStorage.getItem('user-info'));
      return user ? user.id : null;
    },
    isUserAuthorised() {
      let user = JSON.parse(localStorage.getItem('user-info'));
      return user.id === this.blog.user_id;
    },
    totalComments() {
      return this.getRecursiveCommentsCount(this.comments);
    }
  }
};
</script>
<style>
button {
  background-color: #687efa;
  color: white;
  padding: 12px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  margin-right: 10px;
  margin-top: 5px;
  margin-bottom: 5px;
  margin-left: 10px;
  /* Add margin to the right side of the first button */
}

button:hover {
  background-color: #660569;
  color: white;
}

.styled-content {
  font-size: 17px;
  line-height: 2;
}

p {
  font-size: 15px;
  line-height: 2;
}

.narrow-div {
  width: 80%;
  /* Adjust the percentage to your desired width */
  margin: 0 auto;
  /* Center the div horizontally (optional) */
  border: 1px solid #ccc;
  /* Optional border for visualization */
  padding: 10px;
  /* Optional padding for content inside the div */
}
.comment-div {
  text-align: left;
  margin-left: 20px;
 
}
</style>
