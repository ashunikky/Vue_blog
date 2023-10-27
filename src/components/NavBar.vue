<template>
    <nav class="navbar">
      <div class="container">
        <div class="logo">
          <img src="../assets/blog.png" alt="Blog Logo" />
          <p>ABC Blog</p>
        </div>
        <div class="nav-links">
          <router-link to="/">Home</router-link>
          <router-link to="/">About</router-link>
          <router-link to="/">Blog</router-link>
          <!-- Add more navigation links as needed -->
        </div>
        <div v-if="isUserLoggedIn" class="user-menu">
          <button v-on:click="logout">Logout</button>
        </div>
      </div>
    </nav>
  </template>
  <script>
  export default {
    methods: {
      logout() {
        localStorage.clear();
        this.$router.push({name:'LoginPage'})
      }
    },
    computed: {
    isUserLoggedIn() {
      // Check if the user is logged in (modify this logic based on your authentication system)
      return localStorage.getItem('user-info') !== null;
    },
  }
  };
  </script>
  <style scoped>
  /* Navbar styles */
  .navbar {
    background-color: #288f54;
    color: rgb(255, 255, 255);
    padding: 5px 0;
  }
  
  .container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
  }
  
  .logo img {
    width: 40px;
    height: 40px;
    margin-right: 10px;
  }
  
  .nav-links {
    display: flex;
    gap: 80px;
  }
  
  .nav-links a {
    color:  rgba(229, 245, 14, 0.993);
    text-decoration: none;
  }
  
  .user-menu button {
    background-color: #e74c3c;
    color: #fff;
    border: none;
    padding: 8px 16px;
    cursor: pointer;
  }
  </style>