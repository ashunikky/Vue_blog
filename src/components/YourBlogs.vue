<template>
  <div>
    <NavBar />
    <div>
      <h2>Your Blogs</h2>
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
            console.log(data);
            this.result = data;
          }
        );
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