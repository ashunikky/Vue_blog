<template>
    <div class ="container">
      <h2>blog Registation</h2>
                    <form @submit.prevent="save">
                    
                    <div class="form-group">
                        <label>blog title</label>
                        <input type="text" v-model="blog.title" class="form-control"  placeholder="blog title">
                    
                    </div>
  
                    <div class="form-group">
                        <label>blog category</label>
                        <input type="text" v-model="blog.category" class="form-control"  placeholder="blog category">
                    
                    </div>
  
                    
                    <div class="form-group">
                        <label>content</label>
                        <input type="text" v-model="blog.content" class="form-control"  placeholder="content">
                    
                    </div>
                    
                    <button type="submit" class="btn btn-primary">Save</button>
                    </form>
  
  
  <h2>Blog View</h2>
      <table class="table table-dark">
  <thead>
    <tr>
      <th scope="col">ID</th>
      <th scope="col">blog title</th>
      <th scope="col">category</th>
      <th scope="col">content</th>
      <th scope="col">Option</th>
    </tr>
  </thead>
  
  <tbody>
    <tr v-for="blog in result" v-bind:key="blog.id">
          
          <td>{{ blog.id }}</td>
          <td>{{ blog.title }}</td>
          <td>{{ blog.category }}</td>
          <td>{{ blog.content }}</td>
          <td>
            <button type="button" class="btn btn-warning" @click="edit(blog)">Edit</button>
            <button type="button" class="btn btn-danger"  @click="remove(blog)">Delete</button>
          </td>
        </tr>
    
  </tbody>
  
  
  </table>
     
    </div>
  
  </template>
  
  <script>
    
   import axios from 'axios';
  
  
  export default {
    title: 'blog',
    data () {
      return {
        result: {},
        blog:{
                   id: '',
                   title: '',
                   category: '',
                   content: ''
  
  
        }
      }
    },
    created() { 
        this.blogLoad();
    },
    mounted() {
          console.log("mounted() called.......");
         
      },
  
    methods: {
           blogLoad()
           {
                 var page = "http://127.0.0.1:8000/api/blog";
                 axios.get(page)
                  .then(
                      ({data})=>{
                        console.log(data);
                        this.result = data;
                      }
                  );
           },
           
          
           save()
           {
            if(this.blog.id == '')
              {
                this.saveData();
              }
              else
              {
                this.updateData();
              }       
  
           },
           saveData()
           {
            axios.post("http://127.0.0.1:8000/api/blog", this.blog)
            .then(
              ({data})=>{
                alert("saveddddd");
                console.log(data);
                this.blogLoad();
                 this.blog.title = '';
                  this.blog.category = '',
                  this.blog.content = ''
                   this.id = ''
              }
            )
  
           },
           edit(blog)
           {
            this.blog = blog;
           
           },
           updateData()
           {
              var editrecords = 'http://127.0.0.1:8000/api/blog/'+ this.blog.id;
              axios.put(editrecords, this.blog)
              .then(
                ({data})=>{
                  this.blog.title = '';
                  console.log(data);
                  this.blog.category = '',
                  this.blog.content = ''
                  this.id = ''
                  alert("Updated!!!");
                  this.blogLoad();
                }
              );
  
           },
  
           remove(blog){
  
             var url = `http://127.0.0.1:8000/api/blog/${blog.id}`;
  
  
  
             // var url = 'http://127.0.0.1:8000/api/blog/'+ blog.id;
              axios.delete(url);
              alert("Deleteddd");
              this.blogLoad();
            }
      }
  }
  </script>