<template>
    <NavBar />
    <div>
        <h2>User Details</h2>
        <div v-if="user">
            <p><strong>Name:</strong> {{ user.name }}</p>
            <p><strong>Email:</strong> {{ user.email }}</p>
            <button v-if="!isFollowing" @click="followUser">Follow</button>
            <button v-else @click="unfollowUser">Unfollow</button>
        </div>
        <div v-else>
            <p>User not found.</p>
        </div>
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
            isFollowing: false
        };
    },
    mounted() {
        // Fetch user details and follow status when the component is mounted
        this.fetchUserDetails();
    },
    methods: {
        fetchUserDetails() {
            let loggeduser = JSON.parse(localStorage.getItem('user-info'));
            
            axios.get(`http://127.0.0.1:8000/api/user/${loggeduser.id}`)
                .then(apiResponse => {
                    this.user = apiResponse.data;
                    this.isFollowing = apiResponse.data.isFollowing;
                    console.log('userdata',apiResponse.data);
                    console.log('following', apiResponse.data.isFollowing);
                })
                .catch(error => {
                    console.error('Error fetching user details:', error);
                });
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
        //         })
        //         .catch(error => {
        //             console.error('Error unfollowing user:', error);
        //         });
        // }
    }
};
</script>
  
<style scoped>
/* Add your component-specific styles here if needed */
</style>
  