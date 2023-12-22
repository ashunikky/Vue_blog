<template>
  <div>
    <NavBar />
    <div class="narrow-div">
      <div class="blog-heading">
                    <h3>Your Blogs</h3>
                </div>
      <div class="blog-card-container">
        <div class="blog-card" v-for="blog in paginatedBlogs" :key="blog.id">
          <div class="blog-card-header" style="background: linear-gradient(90deg, #968ad8fc, #21224b);">
            <h3><b>{{ blog.title }}</b></h3>
            <p>{{ blog.category }}</p>
            <p class="updated-at"><font-awesome-icon icon="clock" /> {{ formatDate(blog.updated_at) }}</p>
          </div>
          <div class="blog-card-content">
            <p>{{ truncateText(blog.content, 100) }}</p>
          </div>
          <div class="blog-card-footer">
            <!-- <p><font-awesome-icon icon="pen-nib" /> {{ blog.user.name }}</p> -->
            <router-link :to="'/blog/' + blog.id">
              <button>Read More</button>
            </router-link>
          </div>
        </div>
        <div v-if="showNoBlogsMessage">
          <p class="warning-text">You haven't written any blogs yet.</p>
        </div>
      </div>
    </div>
    <div class="pagination">
        <button @click="changePage(-1)" :disabled="currentPage === 1"><font-awesome-icon icon="angle-left" /></button>
        <span>{{ currentPage }}/{{ totalPages }}</span>
        <button @click="changePage(1)" :disabled="currentPage === totalPages"><font-awesome-icon icon="angle-right" /></button>
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
    formatDate(timestamp) {
      const options = { year: 'numeric', month: 'short', day: 'numeric' };
      const formattedDate = new Date(timestamp).toLocaleDateString(undefined, options);
      return formattedDate;
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

label {
  display: block;
  margin-bottom: 10px;
}


</style>