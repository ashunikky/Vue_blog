<template>
    <NavBar />
    <div class="narrow-div">
        <div>
            <h2>User Details</h2>
            <div v-if="user">
                <div class="user-img">
                    <img src="../assets/user.png" alt="Blog cover" />
                </div>
                <div>
                <p><strong>Name:</strong> {{ user.name }}</p>
                <p><strong>Email:</strong> {{ user.email }}</p>
                <p><strong>Bio:</strong> some bio about {{ user.name }}</p>
                <button v-if="!isFollowing" @click="followUser">Follow</button>
                <button v-else @click="unfollowUser">Unfollow</button>
            </div>
            </div>
            <div v-else>
                <p>User not found.</p>
            </div>
        </div>

        <div class="blog-heading">
            <h3>Blogs</h3>
        </div>
        <div class="blog-card-container">
            <div class="blog-card" v-for="blog in paginatedBlogs" :key="blog.id">
                <div class="blog-card-header" style="background: linear-gradient(90deg, #c07d7d, #4b2121);">
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
                <p class="warning-text">User haven't written any blogs yet.</p>
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
import axios from 'axios';
import NavBar from './NavBar.vue';
export default {
    // props: {
    //     loggeduser: {
    //         type: Number,
    //         required: true
    //     }
    // },
    components: {
        NavBar,
    },
    data() {
        return {
            user: null,
            isFollowing: false,
            filteredBlogs: [],
            currentPage: 1,
            blogsPerPage: 5,
        };
    },
    created() {
        this.BlogsLoad();
    },
    mounted() {
        // Fetch user details and follow status when the component is mounted
        this.fetchUserDetails();
    },
    methods: {
        async fetchUserDetails() {
            try {
                // Retrieve the user ID from localStorage
                const userdetailId = localStorage.getItem('userdetailId');
                console.log('Fetching user details for user ID:', userdetailId);

                const response = await axios.get(`http://127.0.0.1:8000/api/user/${userdetailId}`);
                const userData = response.data;

                this.user = userData;
                this.isFollowing = userData.isFollowing;

                console.log('User data:', userData);
                console.log('Is Following:', userData.isFollowing);
            } catch (error) {
                if (error.response && error.response.status === 404) {
                    console.warn('User not found. Handle this case appropriately.');
                    // You might want to redirect to a 404 page or show a user-friendly message.
                } else {
                    console.error('Error fetching user details:', error.message || error);
                    // Log additional information from the error object if needed.
                }
            }
        },



        // followUser() {
        //     // Assume you have an API endpoint to follow a user
        //     // You can replace this with your actual API endpoint
        //     const apiUrl = `http://127.0.0.1:8000/api/user/${this.userId}/follow`;

        //     // Make an API request to follow the user
        //     // This example uses the Fetch API, but you can use Axios or any other library
        //     fetch(apiUrl, { method: 'POST' })
        //         .then(response => response.json())
        //         .then(data => {
        //             this.isFollowing = true;
        //             console.log(data);
        //         })
        //         .catch(error => {
        //             console.error('Error following user:', error);
        //         });
        // },
        // unfollowUser() {
        //     // Assume you have an API endpoint to unfollow a user
        //     // You can replace this with your actual API endpoint
        //     const apiUrl = `http://127.0.0.1:8000/api/user/${this.userId}/unfollow`;

        //     // Make an API request to unfollow the user
        //     // This example uses the Fetch API, but you can use Axios or any other library
        //     fetch(apiUrl, { method: 'POST' })
        //         .then(response => response.json())
        //         .then(data => {
        //             this.isFollowing = false;
        //             console.log(data);
        //         })
        //         .catch(error => {
        //             console.error('Error unfollowing user:', error);
        //         });
        // },

        BlogsLoad() {
            let user = localStorage.getItem('user-info');
            if (!user) {
                alert('Please login to access this content.');
                this.$router.push({ name: 'BlogHome' });
            } else {
                var page = "http://127.0.0.1:8000/api/blog";
                console.log('userdetailId', this.userdetailId);
                axios.get(page)
                    .then(({ data }) => {
                        data.sort((a, b) => b.id - a.id);
                        const userdetailId = localStorage.getItem('userdetailId');
                        this.filteredBlogs = data.filter(blog => blog.user_id == userdetailId);

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
        // userdetailId() {
        //     let userdetail = JSON.parse(localStorage.getItem('userdetailId'));
        //     return userdetail ? userdetail.id : null;
        // },
    },
};
</script>
  
<style scoped>
.user-img img {
  width: 100px;
  height: auto;
  align-items: left;
  border-radius: 50px;
}
</style>
  