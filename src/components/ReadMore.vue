<template>
  <div>
    <NavBar />
    <div class="narrow-div">
      <div v-if="blog.title && !isEditing">
        <div class="blog-title">
          <p class="author-name"><font-awesome-icon icon="pen-nib" /> {{ blog.user.name }}</p>
          <h3>{{ blog.title }}</h3>
          <p class="updated-at"><font-awesome-icon icon="clock" /> {{ formatDate(blog.updated_at) }}</p>
        </div>

        <div class="blog-image">
          <img src="../assets/sample_blog.jpg" alt="Blog cover" />
        </div>
        <p class="styled-content">{{ blog.content }}</p>
        <div>
          <div style="margin-bottom: 10px;"><font-awesome-icon icon="heart" class="heart-icon" /> 2 <b>Likes</b></div>
          <button @click="goBack"><font-awesome-icon icon="angle-left" /> Back</button>

          <button v-if="isUserAuthorised" @click="startEditing"><font-awesome-icon icon="pen-to-square" /> Edit</button>
          <button v-if="isUserAuthorised" @click="deleteBlog"><font-awesome-icon icon="trash" /> Delete</button>

        </div>
      </div>
      <div v-if="isEditing">
        <h2>Edit Blog</h2>
        <div>
          <form class="submitBlogForm" @submit.prevent="updateBlog">
            <div class="form-group">

              <input type="text" v-model="blog.title" class="form-control" placeholder="Blog Title">
            </div>
            <div class="form-group">

              <!-- <input type="text" v-model="blog.category" class="form-control" placeholder="Blog Category"> -->
              <select v-model="blog.category" required class="custom-select">
                <option value="" disabled selected hidden>Category</option>
                <option value="Technology">Technology</option>
                <option value="Science">Science</option>
                <option value="Travel">Travel</option>
                <option value="Food">Food</option>
                <option value="Lifestyle">Lifestyle</option>
                <option value="Fashion">Fashion</option>
                <option value="Health">Health</option>
                <option value="Sports">Sports</option>
                <option value="Other">Other</option>
                <!-- Add more options as needed -->
              </select>
            </div>
            <div class="form-group">

              <textarea v-model="blog.content" class="form-control" placeholder="Content"></textarea>
            </div>
            <button type="submit" class="btn btn-primary"><font-awesome-icon icon="floppy-disk" /> Save</button>
            <button type="button" @click="cancelForm"><font-awesome-icon icon="xmark" /> Cancel</button>
          </form>
        </div>
      </div>
      
      <h3><font-awesome-icon icon="comments" /> Comments ({{ totalComments }})</h3>
      <form @submit.prevent="postComment">
        <label for="comment"></label>
        <input type="text" placeholder="Post Comment" id="comment" v-model="comment.content" required>
        <button type="submit"><font-awesome-icon icon="paper-plane" /> Post</button>
      </form>

      <div class="comment-scroll"><blog-comment v-for="comment in comments" :key="comment.id" :comment="comment" /></div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import NavBar from './NavBar.vue';
import BlogComment from './BlogComment.vue';
import { library } from "@fortawesome/fontawesome-svg-core";
import { faAngleLeft } from "@fortawesome/free-solid-svg-icons";
library.add(faAngleLeft);
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
      this.$router.go(-1);
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
    },
  }
};
</script>
<style>
/* Enhanced button styles */
button {
  /* background-color: #06546be3; */
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 15px;
  cursor: pointer;
  font-size: 16px;
  margin: 5px 10px;
  /* Shorthand for margin values */
  transition: background-color 0.3s ease, color 0.3s ease, transform 0.3s ease;
  box-shadow: 5px 5px 10px 2px rgba(0, 0, 0, 0.3);
  background: linear-gradient(180deg, #83c8eb, #0d0e0d);
}

button:hover {
  /* background-color: #0b6ff1; */
  transform: scale(1.05);
  /* Scale up on hover for a subtle effect */
  color: white;
  background: linear-gradient(180deg, #6bd2f1, #063777);
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
  width: 75%;
  margin: 10px auto;
  box-sizing: border-box;
  /* Include padding and border in the element's total width */
  border: 1px solid #ccc;
  /* Border color adjusted for better contrast */
  border-radius: 2px;
  /* Rounded corners for a softer look */
  /* Light background color for better readability */
  padding: 20px;
  /* Increased padding for better spacing */
  box-shadow: 0px 0px 10px 10px rgba(0, 0, 0, 0.2);
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
  border-radius: 50px;
}

.blog-image::before {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 30%;
  /* Adjusted to cover the bottom 50% */
  background: linear-gradient(to bottom, rgba(255, 255, 255, 0), #f7f4f4);
}

.blog-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #333;
  font-size: 18px;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 10px;
  padding: 0px 10px;
  border-bottom: 1px solid #a4a7ac;
}

.author-name,
.updated-at {
  margin: 0;
  /* Remove default margin for <p> elements */
  font-weight: lighter;
}

@media screen and (max-width: 768px) {
  .blog-title {
    display: inline;
  }

  .blog-image img {
    width: 80%;
    border-radius: 30px;
  }
}

.heart-icon {
  color: #a4a7ac;
  font-size: 35px;
}

.heart-icon:hover {
  color: rgb(230, 21, 21);
}</style>
