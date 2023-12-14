<template>
  <nav class="navbar">
    <div class="container">
      <div class="logo">
        <img src="../assets/ABC.svg" alt="Blog Logo" />
        <p class="logo-text">Blog</p>
      </div>
      <div class="nav-links">
        <router-link to="/"><font-awesome-icon icon="house" /> <br>Home</router-link>
        <router-link to="/about-page"><font-awesome-icon icon="circle-info" /><br>About</router-link>
        <router-link to="/yourblogs"><font-awesome-icon icon="book" /><br>Your Blogs</router-link>
        <!-- Add more navigation links as needed -->
      </div>
      <div v-if="isUserLoggedIn" class="user-menu">
        <p><font-awesome-icon icon="user-tie" /> {{userName }}</p>
        <button v-on:click="logout"><font-awesome-icon icon="power-off" /> </button>
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
  background-color: #2a3b4e;
  color: #fff;
  padding: 1px 20px;
  box-shadow: 0px 2px 6px rgb(69, 100, 83);
}

.container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 5px auto;
  padding: 0 20px; /* Adjusted padding for smaller screens */
}
.logo {
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}
.logo img {
  width: 40px;
  height: 40px;
  margin-right: 10px;
}
.logo-text {
  font-size: 24px;
  font-weight: bold;
  color: rgb(255, 255, 255); /* Set your desired text color */
  margin: 0;
}
.nav-links {
  display: flex;
  flex-direction: row; /* Stack links vertically on smaller screens */
  gap: 25px; /* Reduced gap for a more compact look */
  text-align: center; /* Center align links on smaller screens */
}

.nav-links a {
  color: #d4daf5;
  text-decoration: none;
  transition: color 0.3s ease;
  /* font-weight: bold; */
}

.nav-links a:hover {
  color: rgb(8, 222, 250);
}

/* Updated styles for the user menu */
.user-menu {
  background-color: #fff;
  color: rgb(133, 128, 128);
  border-radius: 8px;
  box-shadow: 0 4px 8px #ccc;
  text-align: center;
  
}

.user-menu p {
  font-size: 18px;
  margin: 5px;
  color: #333;
}

.user-menu button {
  background-color: rgba(10, 10, 10, 0.438);
  color: #ffffff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.user-menu button:hover {
  background-color: #db5959;
}

/* Media query for smaller screens */
@media screen and (max-width: 768px) {
  .container {
    padding: 0 10px; /* Adjusted padding for even smaller screens */
  }

  .nav-links {
    flex-direction: column; /* Align links horizontally on smaller screens */
  }
}
</style>