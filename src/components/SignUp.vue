<template>
  <img class="logo" src="../assets/blog.png">
  <h3>Sign Up</h3>
  <div class="register">
    <input type="text" v-model="name" placeholder="Enter Name" />
    <input type="text" v-model="email" placeholder="Enter Email" />
    <input type="password" v-model="password" placeholder="Enter Password" />
    <button v-on:click="signUp">Sign Up</button>
  </div>
  <p>Have account? <router-link to="/login"> Login</router-link></p>
</template>

<script>
import axios from 'axios'
export default {
  name: 'SignUp',
  data() {
    return {
      name: '',
      email: '',
      password: '',
    }
  },
  methods: {
    async signUp() {
      console.warn("signUp")
      let result = await axios.post("http://127.0.0.1:8000/api/register", {
        name: this.name,
        email: this.email,
        password: this.password
      });

      console.warn(result);
      if (result.status == 201) {

        alert("sign-up done");
        localStorage.setItem("user-info", JSON.stringify(result.data))
        this.$router.push({ name: 'BlogHome' })
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
<style></style>
