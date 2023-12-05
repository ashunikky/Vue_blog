<template>
  <img class="logo" src="../assets/blog.png">
  <h3>Login</h3>
  <div class="register">
    <input type="email" v-model="email" placeholder="Enter Email" />
    <input type="password" v-model="password" placeholder="Enter Password" />
    <button v-on:click="login">Login</button>
    <p>need an account? <router-link to="/sign-up"> Sign Up</router-link></p>
  </div>
</template>
<script>
import axios from "axios";
export default {
  name: "LoginPage",
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
        if (result.status == 200) {

          alert("successfuly Logged in");
          localStorage.setItem("user-info", JSON.stringify(result.data))
          this.$router.push({ name: 'BlogHome' })
        }

        console.log('Login response:', result.data);

        // Handle the response as needed
      } catch (error) {
        console.error('Login error:', error);
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
