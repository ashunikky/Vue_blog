<template>
    <div>
        <NavBar />
        <div class="narrow-div">
            <!-- <h1>Hello, Welcome to ABC Blog</h1> -->
            <div><label for="search"></label>
                <input type="text" placeholder="Search" id="search" v-model="searchTerm">
            </div>
            <p v-if="!isUserLoggedIn">to write blogs <router-link to="/login"> Login</router-link>,
                need an account? <router-link to="/sign-up"> Sign Up</router-link></p>
            <div v-if="isUserLoggedIn && isFormVisible">
                <h3>Write a Blog</h3>
                <form class="submitBlogForm" @submit.prevent="submitBlogForm">
                    <label for="title">Title:</label>
                    <input type="text" id="title" v-model="blogForm.title" required><br>

                    <label for="category">Category:</label>
                    <select id="category" v-model="blogForm.category" required class="custom-select">
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


                    <label for="content">Content:</label>
                    <textarea id="content" v-model="blogForm.content" required></textarea><br>

                    <label for="tags">Tags(optional):</label>
                    <input type="text" id="tags" v-model="blogForm.tags"><br>

                    <button type="submit">Submit</button>
                    <button type="button" @click="cancelForm">Cancel</button>
                </form>
            </div>
            <button v-if="isUserLoggedIn && !isFormVisible" @click="toggleFormVisibility">Write Blog</button>
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
                            <p>Author: {{ blog.user.name }}</p>
                            <router-link :to="'/blog/' + blog.id">
                                <button>Read More</button>
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
                        <p class=" warning-text">did not find any match, please refine your search !!</p>
                    </div>
                </div>

            </div>
        </div>
    </div>
    <div class="pagination">
        <button @click="changePage(-1)" :disabled="currentPage === 1">Previous</button>
        <span>{{ currentPage }}/{{ totalPages }}</span>
        <button @click="changePage(1)" :disabled="currentPage === totalPages">Next</button>
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
.blog-card-container {
    display: flex;
    /* flex-wrap: wrap; */
    gap: 20px;
}

.blog-card {
    border: 1px solid #ddd;
    border-radius: 8px;
    overflow: hidden;
    width: 100%;
    max-width: 400px;
    /* Adjust the maximum width of the card as needed */
}

.blog-card-header {
    background-color: #427670;
    color: #fff;
    padding: 15px;
}

.blog-card-content {
    padding: 15px;
}

.blog-card-footer {
    padding: 5px;
}

.blog-card-footer button {
    background-color: #65686c;
    color: #fff;
    padding: 8px 16px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.blog-card-footer button:hover {
    background-color: #308dbb;
}
</style>