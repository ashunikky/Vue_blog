<template>
  <NavBar />
  <!-- <img class="logo" src="../assets/ABC.svg"> -->
  <h3>Login</h3>
  <div class="register">
    <form id="loginForm">
      <input type="email" v-model="email" placeholder="Enter Email" required />
      <input type="password" v-model="password" placeholder="Enter Password" required />
      <button v-on:click="login">Login</button>
    </form>
    <p>need an account? <router-link to="/sign-up"><font-awesome-icon icon="user-plus" /> Sign Up</router-link></p>
  </div>
</template>
<script>
import axios from "axios";
import NavBar from './NavBar.vue'
export default {
  name: "LoginPage",
  components: {
    NavBar
  },
  data() {
    return {
      email: '',
      password: '',
    }
  },
  methods: {
    async login() {
      try {
        let result = await axios.post('http://127.0.0.1:8000/api/login', {
          email: this.email,
          password: this.password
        });

        console.log('Login response:', result.data);
        console.log('HTTP status:', result.status);

        if (result.status === 200) {
          alert("Successfully Logged in");
          localStorage.setItem("user-info", JSON.stringify(result.data));
          this.$router.push({ name: 'BlogHome' });
        }

      } catch (error) {
        console.error('Login error:', error);
        if (error.response && error.response.status === 401) {
          alert("Credentials did not match!!");
        }
        // Handle the error, show an error message, etc.
      }
    }


  },
  mounted() {
    let user = localStorage.getItem('user-info');
    if (user) {
      alert('Already Logged-in');
      this.$router.push({ name: 'BlogHome' })
    }
  }
}
</script>
