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
        <router-link to="/yourblogs">Your Blogs</router-link>
        <!-- Add more navigation links as needed -->
      </div>
      <div v-if="isUserLoggedIn" class="user-menu">
        <p>{{userName }}</p>
        <button v-on:click="logout">Logout</button>
      </div>
    </div>
  </nav>
</template>
<script>
export default {
  methods: {
    logout() {
      const isConfirmed = window.confirm('Are you sure you want to Log Out');
      if(isConfirmed){
      localStorage.clear();
      this.$router.push({ name: 'LoginPage' })
    }
    },
  },
  computed: {
    isUserLoggedIn() {
      // Check if the user is logged in (modify this logic based on your authentication system)
      return localStorage.getItem('user-info') !== null;
    },
    userName() {
      const user = JSON.parse(localStorage.getItem('user-info'));
      console.log(user);
      return user ? user.name : '';
    }
  }
};
</script>
<style>
/* Navbar styles */
.navbar {
  background-color: #2a3b4e; /* Darker shade for a more modern look */
  color: #fff;
  padding: 15px 0; /* Increased padding for better spacing */
  box-shadow: 0 2px 4px rgba(96, 192, 139, 0.1); /* Subtle shadow for depth */
}

.container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 55px;
}

.logo img {
  width: 40px;
  height: 40px;
  margin-right: 10px;
}

.nav-links {
  display: flex;
  gap: 20px; /* Reduced gap for a more compact look */
}
.nav-links a {
  color: #92a4f5; /* Change to a more vibrant color */
  text-decoration: none;
  transition: color 0.3s ease;
  font-weight: bold; /* Add bold font-weight for better visibility */
}

.nav-links a:hover {
  color: #fff; /* Brighter color on hover */
}
/* Updated styles for the user menu */
.user-menu {
  background-color: #fff;
  color: #333;
  border-radius: 8px;
  box-shadow: 0 4px 8px #ccc;
  /* padding: 15px; */
  text-align: center;
}

.user-menu p {
  font-size: 18px;
  margin-bottom: 10px;
  color: #333;
}

.user-menu button {
  background-color: #ccc;
  color: #d81e1e;
  border: none;
  border-radius: 5px;
  padding: 10px 15px;
  cursor: pointer;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.user-menu button:hover {
  background-color: #d81e1e;
}

</style>
