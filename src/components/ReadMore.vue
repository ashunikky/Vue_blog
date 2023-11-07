<template>
  <div>
    <NavBar />
    <div v-if="blog.title && !isEditing">
      <h2>{{ blog.title }}</h2>
      <div v-if="blog && blog.user">
        <p>by {{ blog.user.name }},{{ formatDate(blog.updated_at) }}</p>
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
    </div>
</template>

<script>
import axios from 'axios';
import NavBar from './NavBar.vue';

export default {
  name: 'ReadMore',
  components: {
    NavBar
  },
  data() {
    return {
      isEditing: false,
      isButtonVisible: false,
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
  /* Add margin to the right side of the first button */
}

button:hover {
  background-color: #092df7;
}

.styled-content {
  font-size: 17px;
  line-height: 2;
}

p {
  font-size: 12px;
}
</style>
