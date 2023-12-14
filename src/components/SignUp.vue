<template>
  <NavBar />
  <!-- <img class="logo" src="../assets/ABC.svg"> -->
  <h3>Sign Up</h3>
  <div class="register">
    <form>
      <input type="text" v-model="name" placeholder="Enter Name" required />
      <input type="text" v-model="email" placeholder="Enter Email" required />
      <input type="password" v-model="password" placeholder="Enter Password" required />
      <button v-on:click="signUp">Sign Up</button>
    </form>
  </div>
  <p>Have account? <router-link to="/login"><font-awesome-icon icon="arrow-right-to-bracket" /> Login</router-link></p>
</template>

<script>
import axios from 'axios'
import NavBar from './NavBar.vue'
export default {
  name: 'SignUp',
  components: {
    NavBar
  },
  data() {
    return {
      name: '',
      email: '',
      password: '',
    }
  },
  methods: {
    async signUp() {
      try{
      console.warn("signUp")
      let result = await axios.post("http://127.0.0.1:8000/api/register", {
        name: this.name,
        email: this.email,
        password: this.password
      });

      console.warn(result);
      if (result.status == 200) {

        alert("sign-up done");
        // localStorage.setItem("user-info", JSON.stringify(result.data))
        this.$router.push({ name: 'LoginPage' })
      }}
      catch (error) {
        console.error('Login error:', error);
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

