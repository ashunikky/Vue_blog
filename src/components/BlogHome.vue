<template>
  <div>
    <NavBar />
    <!-- <h1>Hello, Welcome to ABC Blog</h1> -->
    <div><label for="search">Search:</label>
      <input type="text" id="search" v-model="searchTerm">
    </div>
    <p v-if="!isUserLoggedIn">to write blogs <router-link to="/login"> Login</router-link>,
      need an account? <router-link to="/sign-up"> Sign Up</router-link></p>
    <div v-if="isUserLoggedIn && isFormVisible">
      <h2>Write a Blog</h2>
      <form @submit.prevent="submitBlogForm">
        <label for="title">Title:</label>
        <input type="text" id="title" v-model="blogForm.title" required><br>

        <label for="category">Category:</label>
        <input type="text" id="category" v-model="blogForm.category" required><br>

        <label for="content">Content:</label>
        <textarea id="content" v-model="blogForm.content" required></textarea><br>

        <label for="tags">Tags:</label>
        <input type="text" id="tags" v-model="blogForm.tags"><br>

        <button type="submit">Submit</button>
        <button type="button" @click="cancelForm">Cancel</button>
      </form>
    </div>
    <button v-if="isUserLoggedIn && !isFormVisible" @click="toggleFormVisibility">Write Blog</button>
    <div v-if="searchTerm === ''">
      <h2>Recent Blogs</h2>
      <table class="blog-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Category</th>
            <th>Content</th>
            <th> Author </th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="blog in result" :key="blog.id">
            <td><b>{{ blog.title }}</b></td>
            <td>{{ blog.category }}</td>
            <td>{{ truncateText(blog.content, 60) }}</td>
            <td>{{ blog.user.name }}</td>
            <td><router-link :to="'/blog/' + blog.id">Read More</router-link></td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-else>
      <table class="blog-table">
        <tbody>
          <tr v-for="blog in filteredBlogs" :key="blog.id">
            <td><b>{{ blog.title }}</b></td>
            <td>{{ blog.category }}</td>
            <td>{{ truncateText(blog.content, 60) }}</td>
            <td>{{ blog.user.name }}</td>
            <td><router-link :to="'/blog/' + blog.id">Read More</router-link></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script>
import NavBar from './NavBar.vue'
import axios from 'axios'

export default {
  name: 'BlogsHome',
  components: {
    NavBar
  },
  data() {
    return {
      isFormVisible: false,
      result: {},
      blog: {
        id: '',
        category: '',
        title: '',
        content: ''
      },
      blogForm: {
        title: '',
        category: '',
        content: '',
        tags: '',
        user_id: ''
      },
      searchTerm: '',
    }
  },
  created() {
    this.BlogsLoad();
  },
  computed: {
    isUserLoggedIn() {
      // Check if the user is logged in (modify this logic based on your authentication system)
      return localStorage.getItem('user-info') !== null;
    },
    filteredBlogs() {
      return this.result.filter(blog => {
        // Check if the blog title or content contains the search term
        return blog.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          blog.content.toLowerCase().includes(this.searchTerm.toLowerCase()) || blog.tags.toLowerCase().includes(this.searchTerm.toLowerCase())||
          blog.user.name.toLowerCase().includes(this.searchTerm.toLowerCase());
      });
    }
  },

  methods: {
    
    mounted() {
      let user = JSON.parse(localStorage.getItem('user-info'));
      if (user) {
        this.userId = user.id;
      }
    },
    BlogsLoad() {
      var page = "http://127.0.0.1:8000/api/blog";
      axios.get(page)
        .then(
          ({ data }) => {
            data.sort((a, b) => b.id - a.id);
            // console.log(data);
            this.result = data;
          }
        );
    },
    toggleFormVisibility() {
      this.isFormVisible = !this.isFormVisible;
    },
    submitBlogForm() {
      this.blogForm.user_id = this.userId;
      // Send a POST request to create a new blog post
      axios.post('http://127.0.0.1:8000/api/blog', this.blogForm)
        .then(response => {
          // Handle the response, for example, show a success message
          alert('Blog posted successfully!');
          console.log('Blog post created successfully:', response.data);
          // Clear the form fields after successful submission
          this.blogForm.title = '';
          this.blogForm.category = '';
          this.blogForm.content = '';
          this.blogForm.tags = '';
          // Optionally, reload the list of blogs after submission
          this.BlogsLoad();
        })
        .catch(error => {
          // Handle errors, show an error message, etc.
          console.error('Error creating blog post:', error);
        });
    },
    cancelForm() {
      this.isFormVisible = false; // Hide the form when cancel button is clicked
    },
    truncateText(text, maxLength) {
      if (text.length > maxLength) {
        return text.slice(0, maxLength) + "...";
      }
      return text;
    },
  }
}
</script>
<style scoped>
.blog-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.blog-table th,
.blog-table td {
  padding: 10px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.blog-table th {
  background-color: #f2f2f2;
}

form {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

label {
  display: block;
  margin-bottom: 10px;
}

input[type="text"],
textarea {
  width: 60%;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
}

button[type="submit"] {
  background-color: #4CAF50;
  color: white;
  padding: 12px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
}

button[type="submit"]:hover {
  background-color: #45a049;
}
</style>