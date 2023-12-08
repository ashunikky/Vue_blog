<template>
  <div>
    <NavBar />
    <div class="narrow-div">
      <div v-if="blog.title && !isEditing">
        <div class="blog-image">
          <img src="../assets/sample_blog.jpg" alt="Blog cover" />
        </div>
        <h2>{{ blog.title }}</h2>
        <div v-if="blog && blog.user">
          <p>by {{ blog.user.name }}, {{ formatDate(blog.updated_at) }}</p>
        </div>
        <!-- <p>by {{ blog.user.name }} ,{{ formatDate(blog.updated_at) }}</p> -->
        <p class="styled-content">{{ blog.content }}</p>
        <div>
          <button @click="goBack">Back</button>
          <button v-if="isUserAuthorised" @click="startEditing">Edit</button>
          <button v-if="isUserAuthorised" @click="deleteBlog">Delete</button>

        </div>
      </div>
      <div v-if="isEditing">
        <h2>Edit Blog</h2>
        <div>
          <form class="submitBlogForm" @submit.prevent="updateBlog">
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
      <form @submit.prevent="postComment">
        <label for="comment"></label>
        <input type="text" placeholder="Post Comment" id="comment" v-model="comment.content" required>
        <button type="submit" class="btn btn-primary">Post</button>
      </form>

      <div class="comment-scroll"><blog-comment v-for="comment in comments" :key="comment.id" :comment="comment" /></div>
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
      comment: {
        content: '',
        parent_id: '',
        user_id: '',
      },
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
          window.location.reload();
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
    },
    async postComment() {
      try {
        let user = JSON.parse(localStorage.getItem('user-info'));
        this.comment.user_id = user.id;
        this.comment.parent_id = null; // Set parent_id to null

        const blogId = this.$route.params.id;
        const response = await axios.post(`http://127.0.0.1:8000/api/blog/${blogId}/comments`, this.comment);

        // Assuming your API returns the posted comment in the response
        const postedComment = response.data;

        console.log('Comment Posted:', postedComment);
        alert("Comment Posted");
        this.$router.go();

        // You may want to reset the comment input after posting
        this.comment = '';
      } catch (error) {
        // Handle errors, show an error message, etc.
        console.error('Error creating blog post:', error);
      }
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
/* Enhanced button styles */
button {
  background-color: #687efa;
  color: white;
  padding: 10px 10px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  margin: 5px 10px;
  /* Shorthand for margin values */
  transition: background-color 0.3s ease, color 0.3s ease, transform 0.3s ease;
  box-shadow: 5px 5px 10px 2px rgba(0, 0, 0, 0.3);
}

button:hover {
  background-color: #4d63c1;
  transform: scale(1.05);
  /* Scale up on hover for a subtle effect */
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

/* Improved styles for a narrow div */
.narrow-div {
  width: 80%;
  margin: 10px auto;
  box-sizing: border-box;
  /* Include padding and border in the element's total width */
  border: 1px solid #ccc;
  /* Border color adjusted for better contrast */
  border-radius: 2px;
  /* Rounded corners for a softer look */
  background-color: #f7f4f4;
  /* Light background color for better readability */
  padding: 20px;
  /* Increased padding for better spacing */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  /* Subtle box shadow for depth */
}


.comment-scroll {
  max-height: 400px;
  /* Adjust the height as needed */
  overflow-y: auto;
}

.blog-image {
  position: relative;
  overflow: hidden;
  height: 50%;
}

.blog-image img {
  width: 60%;
  height: auto;
  align-items: center;
}

.blog-image::before {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 50%;
  /* Adjusted to cover the bottom 50% */
  background: linear-gradient(to bottom, rgba(255, 255, 255, 0), #f7f4f4);
}
</style>
