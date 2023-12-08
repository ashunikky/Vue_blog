<template>
  <div>
    <NavBar />
    <div class="narrow-div">
      <h2>Your Blogs</h2>
      <div class="blog-card-container">
        <div class="blog-card" v-for="blog in paginatedBlogs" :key="blog.id">
          <div class="blog-card-header">
            <h3><b>{{ blog.title }}</b></h3>
            <p>{{ blog.category }}</p>
          </div>
          <div class="blog-card-content">
            <p>{{ truncateText(blog.content, 100) }}</p>
          </div>
          <div class="blog-card-footer">
            <p>Author: {{ blog.user.name }}</p>
            <router-link :to="'/blog/' + blog.id">
              <button>Read More</button>
            </router-link>
          </div>
        </div>
        <div v-if="showNoBlogsMessage">
          <p class="warning-text">You haven't written any blogs yet.</p>
        </div>
      </div>
      <div class="pagination">
        <button @click="changePage(-1)" :disabled="currentPage === 1">Previous</button>
        <span>{{ currentPage }}/{{ totalPages }}</span>
        <button @click="changePage(1)" :disabled="currentPage === totalPages">Next</button>
      </div>
    </div>
  </div>
</template>

<script>
import NavBar from './NavBar.vue';
import axios from 'axios';

export default {
  name: 'YourBlogs',
  components: {
    NavBar,
  },
  data() {
    return {
      filteredBlogs: [],
      currentPage: 1,
      blogsPerPage: 5,
    };
  },
  created() {
    this.BlogsLoad();
  },
  methods: {
    BlogsLoad() {
      let user = localStorage.getItem('user-info');
      if (!user) {
        alert('Please login to access this content.');
        this.$router.push({ name: 'BlogHome' });
      } else {
        var page = "http://127.0.0.1:8000/api/blog";
        axios.get(page)
          .then(({ data }) => {
            data.sort((a, b) => b.id - a.id);
            this.filteredBlogs = data.filter(blog => blog.user_id === this.userId);
            if (this.filteredBlogs.length === 0) {
              this.showNoBlogsMessage = true; // Add a property to your data to control the message display
            } else {
              this.showNoBlogsMessage = false;
            }
          })
          .catch(error => {
            console.error("Error loading blogs:", error);
          });
      }
    },
    truncateText(text, maxLength) {
      if (text.length > maxLength) {
        return text.slice(0, maxLength) + "...";
      }
      return text;
    },
    changePage(offset) {
      this.currentPage += offset;
    },
  },
  computed: {
    paginatedBlogs() {
      const startIndex = (this.currentPage - 1) * this.blogsPerPage;
      const endIndex = startIndex + this.blogsPerPage;
      return this.filteredBlogs.slice(startIndex, endIndex);
    },
    totalPages() {
      const numberOfBlogs = this.filteredBlogs.length;
      const blogsPerPage = this.blogsPerPage;

      // Ensure at least 1 page if there are no blogs
      if (numberOfBlogs === 0) {
        return 1;
      }

      // Calculate total pages
      const totalPages = Math.ceil(numberOfBlogs / blogsPerPage);

      // Ensure at least 1 page if there are up to 5 blogs
      return Math.min(totalPages, 1);
    },
    userId() {
      let user = JSON.parse(localStorage.getItem('user-info'));
      return user ? user.id : null;
    },
  },
};
</script>

<style>
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

/* form {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
} */

label {
  display: block;
  margin-bottom: 10px;
}

/* input[type="text"],
textarea {
  width: 60%;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
} */

/* button[type="submit"] {
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
} */
</style>