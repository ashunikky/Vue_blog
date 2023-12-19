<template>
    <div>
        <NavBar />
        <div class="narrow-div">
            <!-- <h1>Hello, Welcome to ABC Blog</h1> -->
            <div style=" align-items: center;">
                <font-awesome-icon icon="magnifying-glass" style="margin-right: 10px;" />
                <input type="text" placeholder="Search" id="search" v-model="searchTerm">
            </div>

            <p v-if="!isUserLoggedIn">to write & Read blogs <button><router-link to="/login"
                        style="color: inherit; text-decoration: inherit;"><font-awesome-icon
                            icon="arrow-right-to-bracket" /> Login</router-link></button>,
                need an account? <button><router-link to="/sign-up"
                        style="color: inherit; text-decoration: inherit;"><font-awesome-icon icon="user-plus" /> Sign
                        Up</router-link></button></p>
            <div v-if="isUserLoggedIn && isFormVisible">

                <div class="blog-heading">
                    <h3>Write a Blog</h3>
                </div>
                <form class="submitBlogForm" @submit.prevent="submitBlogForm">
                    <input type="text" style="width:90%" id="title" placeholder="Title" v-model="blogForm.title" required><br>
                    <select id="category" v-model="blogForm.category" required class="custom-select">
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

                    <textarea style="width:90%" id="content" placeholder="Content" v-model="blogForm.content" required></textarea><br>

                    <input type="text" style="width:90%" id="tags" placeholder="Tags(optional)" v-model="blogForm.tags"><br>

                    <button type="submit"><font-awesome-icon icon="bullhorn" /> Publish </button>
                    <button type="button" @click="cancelForm"><font-awesome-icon icon="xmark" /> Cancel</button>
                </form>
            </div>
            <button v-if="isUserLoggedIn && !isFormVisible" @click="toggleFormVisibility"><font-awesome-icon
                    icon="feather" /> Write Blog</button>
            <div v-if="searchTerm === ''">
                <div class="blog-heading">
                    <h3>Recent Blogs</h3>
                </div>
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
                            <p><font-awesome-icon icon="pen-nib" /> {{ blog.user.name }}</p>
                            <router-link :to="'/blog/' + blog.id">
                                <button><font-awesome-icon icon="book-open" /> Read More</button>
                            </router-link>
                        </div>
                    </div>
                </div>

            </div>
            <div v-else>
                <div class="blog-heading">
                    <h3>Searched Blogs</h3>
                </div>
                <div class="blog-card-container">
                    <div class="blog-card" v-for="blog in paginatedFilteredBlogs" :key="blog.id">
                        <div class="blog-card-header" style="background: linear-gradient(90deg, #64d798fc, #434b21);">
                            <h3><b>{{ blog.title }}</b></h3>
                            <p>{{ blog.category }}</p>
                        </div>
                        <div class="blog-card-content">
                            <p>{{ truncateText(blog.content, 100) }}</p>
                        </div>
                        <div class="blog-card-footer">
                            <p><font-awesome-icon icon="pen-nib" /> {{ blog.user.name }}</p>
                            <router-link :to="'/blog/' + blog.id">
                                <button><font-awesome-icon icon="book-open" /> Read More</button>
                            </router-link>
                        </div>
                    </div>
                    <div v-if="showNoBlogsMessage">
                        <p class=" warning-text">did not find any match, please refine your search !!</p>
                    </div>
                </div>

            </div>
        </div>
    </div>
    <div class="pagination">
        <button @click="changePage(-1)" :disabled="currentPage === 1"><font-awesome-icon icon="angle-left" /></button>
        <span>{{ currentPage }}/{{ totalPages }}</span>
        <button @click="changePage(1)" :disabled="currentPage === totalPages"><font-awesome-icon
                icon="angle-right" /></button>
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
            result: [],
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
            currentPage: 1,
            blogsPerPage: 5,
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
                const searchTermLowerCase = this.searchTerm.toLowerCase();
                const titleIncludesTerm = blog.title.toLowerCase().includes(searchTermLowerCase);
                const contentIncludesTerm = blog.content.toLowerCase().includes(searchTermLowerCase);

                // Check if blog.tags and blog.user are defined before accessing their properties
                const categoryIncludesTerm = blog.category && blog.category.toLowerCase().includes(searchTermLowerCase);
                const userNameIncludesTerm = blog.user && blog.user.name.toLowerCase().includes(searchTermLowerCase);

                return titleIncludesTerm || contentIncludesTerm || categoryIncludesTerm || userNameIncludesTerm;
            });
        },

        paginatedBlogs() {
            const startIndex = (this.currentPage - 1) * this.blogsPerPage;
            const endIndex = startIndex + this.blogsPerPage;
            return this.result.slice(startIndex, endIndex);
        },
        paginatedFilteredBlogs() {
            const startIndex = (this.currentPage - 1) * this.blogsPerPage;
            const endIndex = startIndex + this.blogsPerPage;
            const paginatedBlogs = this.filteredBlogs.slice(startIndex, endIndex);
            this.updateNoBlogsMessage(paginatedBlogs);
            return paginatedBlogs;
        },
        totalPages() {
            const totalBlogs = this.filteredBlogs.length;
            return totalBlogs > 0 ? Math.ceil(totalBlogs / this.blogsPerPage) : 1;
        },

    },

    methods: {
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
        changePage(offset) {
            this.currentPage += offset;
        },
        toggleFormVisibility() {
            this.isFormVisible = !this.isFormVisible;
        },
        submitBlogForm() {
            let user = JSON.parse(localStorage.getItem('user-info'));
            this.blogForm.user_id = user.id;
            console.log(this.blogForm);
            console.log(this.userId);
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
        updateNoBlogsMessage(paginatedBlogs) {
            this.showNoBlogsMessage = paginatedBlogs.length === 0;
        },
    }
}
</script>
<style>
body {
    font-family: Arial, sans-serif;
    margin: 0;
    /* Remove default body margin */
}



/* Blog table styles */
/* Add this to your existing styles or create a new style block */

.blog-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
    box-shadow: 0 0 5px rgba(26, 27, 27, 0.5);
}

.blog-table th,
.blog-table td {
    padding: 15px;
    text-align: left;
    border-bottom: 2px solid #ddd;
}

.blog-table th {
    background-color: #f2f2f2;
    font-weight: bold;
    /* Make the header text bold */
}

/* Style the "Read More" button */
.blog-table button {
    background-color: #3498db;
    color: #fff;
    border: none;
    padding: 8px 15px;
    border-radius: 6px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.blog-table button:hover {
    background-color: #0f5c8f;
}

/* Responsive styling for small screens */
@media screen and (max-width: 768px) {

    .blog-table th,
    .blog-table td {
        padding: 10px;
    }
}

/* Form styles */
.submitBlogForm {
    max-width: 100%;
    margin: 0 auto;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 15px;
    box-shadow: 0 0 10px 5px rgba(0, 0, 0, 0.2);
}

label {
    display: block;
    margin-bottom: 10px;
}

/* Common styles for input and textarea */
input[type="text"],
input[type="password"],
input[type="email"],
textarea {
    width: 50%;
    padding: 10px;
    margin-bottom: 15px;
    /* margin-left: 10px; */
    border: 1px solid #ccc;
    border-radius: 15px;
    font-size: 16px;
    box-sizing: border-box;
    box-shadow: 0 0 5px rgba(91, 155, 213, 0.5);
    /* Include padding and border in the element's total width and height */
}

/* Focus styles for better user feedback */
input[type="text"]:focus,
input[type="password"]:focus,
input[type="email"]:focus,
textarea:focus {
    outline: none;
    border-color: #5b9bd5;
    /* Adjust the color to match your design */
    box-shadow: 0 0 5px rgba(91, 155, 213, 0.5);
    /* Add a subtle box shadow on focus */
}

/* Placeholder text color */
input[type="text"]::placeholder,
input[type="password"]::placeholder,
input[type="email"]::placeholder,
textarea::placeholder {
    color: #999;
    /* Adjust the color to match your design */
}

/* Specific styles for textarea */
textarea {
    height: 200px;
    /* Set a specific height for textarea */
    resize: vertical;
    /* Allow vertical resizing only */
}


/* Button styles */
button[type="submit"] {
    background: linear-gradient(171deg, #b6d1bc, #085a1de3);
}

button[type="submit"]:hover {
    background: linear-gradient(171deg, #a396c5, #7041c5e3);
}

/* Warning text styles */
.warning-text {
    color: rgb(167, 0, 0);
    font-size: 20px;
    text-align: center;
}

/* Add this to your existing styles or create a new style block */

/* Custom select styles */
.custom-select {
    width: 90%;
    /* Adjust the width as needed */
    padding: 10px;
    margin: 15px;
    border: 1px solid rgb(190, 153, 97);
    border-radius: 15px;
    font-size: 16px;
}

/* Style the options */
.custom-select option {
    padding: 10px;
}

.blog-heading {
    text-align: center;
    margin-bottom: 20px;
}

.blog-heading h3 {
    color: #333;
    /* Set your desired text color */
    font-size: 24px;
    font-weight: bold;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin: 0;
    padding: 10px 0;
    border-bottom: 2px solid #a4a7ac;
    /* Set your desired border color */
}


/* Media query for smaller screens */
@media screen and (max-width: 768px) {

    input[type="text"],
    textarea {
        width: 50%;
    }

    .blog-card-container {
        display: flex;
        flex-wrap: wrap;
        gap: 20px;
    }

}

.blog-card-container {
    display: flex;
    /* flex-wrap: wrap; */
    gap: 20px;
}

.blog-card {
    border: 1px solid #ddd;
    border-radius: 15px;
    overflow: hidden;
    width: 100%;
    max-width: 400px;
    box-shadow: 10px 2px 6px rgba(0, 0, 0, 0.1);
    /* Adjust the maximum width of the card as needed */
}

.blog-card-header {
    color: #fff;
    padding: 15px;
    background: linear-gradient(90deg, #74c4ba, #083737);
}

.blog-card-content {
    padding: 15px;
}

.blog-card-footer {
    padding: 5px;
}

.blog-card-footer button {
    background-color: #2f4664;
    color: #fff;
    padding: 8px 16px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.blog-card-footer button:hover {
    background-color: #308dbb;
}

.link-button {
    color: white;
}
.write {
  background-color: #228cf0; /* Set your desired background color */
  color: #fff; /* Set your desired text color */
  padding: 10px 15px;
  border: none;
  border-radius: 15px;
  cursor: pointer;
  font-size: 16px;
}

.write:hover {
  background-color: #0ab0f1; /* Set your desired background color on hover */
}

</style>