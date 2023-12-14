<template>
  <router-view/>
  
</template>

<script>
import { library } from "@fortawesome/fontawesome-svg-core";
import { faAngleLeft,faAngleRight,faHouse,faBook,faCircleInfo,faPenNib,faPenToSquare,faTrash,faPaperPlane,faXmark,faReply,faFloppyDisk,faComments,faPowerOff,faBookOpen,faUserTie,faFeather,faUserCheck,faArrowRightToBracket,faUserPlus,faArrowUpFromBracket,faBullhorn,faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
library.add(faAngleLeft,faAngleRight,faHouse,faBook,faCircleInfo,faPenNib,faPenToSquare,faTrash,faPaperPlane,faXmark,faReply,faFloppyDisk,faComments,faPowerOff,faBookOpen,faUserTie,faFeather,faUserCheck,faArrowRightToBracket,faUserPlus,faArrowUpFromBracket,faBullhorn,faMagnifyingGlass);
export default {
  name: 'App',
  
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  background-color: #f5f7f8;
  /* margin-top: 60px; */
}
.logo {
  width: 100px
}

.register input {
  width: 300px;
  height: 40px;
  padding-left: 20px;
  display: block;
  margin-bottom: 30px;
  margin-left: auto;
  margin-right: auto;
  border: 1px solid skyblue;
}

.register button {
  width: 40%;
  height: 40px;
  border: 1px solid skyblue;
  color: #fff;
  background-color: skyblue;
  cursor: pointer;

}
</style>
