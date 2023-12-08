import { createRouter, createWebHashHistory } from 'vue-router'
import BlogHome from './components/BlogHome.vue'
import SignUp from './components/SignUp.vue'
import LoginPage from './components/LoginPage.vue'
import ReadMore from './components/ReadMore.vue';
import YourBlogs from './components/YourBlogs.vue';
import AboutPage from './components/AboutPage.vue';
import BlogHome1 from './components/BlogHome1.vue'
const routes = [
    {
        name: 'BlogHome',
        component: BlogHome,
        path: '/'
    },
    {
        name: 'BlogHome1',
        component: BlogHome1,
        path: '/bh1'
    },
    {
        name: 'SignUp',
        component: SignUp,
        path: '/sign-up'
    },
    {
        name: 'LoginPage',
        component: LoginPage,
        path: '/login'
    },
    {
        name: 'ReadMore',
        component: ReadMore,
        path: '/blog/:id',
    },
    {
        name: 'YourBlogs',
        component: YourBlogs,
        path: '/yourblogs',
    },
    {
        name: 'AboutPage',
        component: AboutPage,
        path: '/about-page'
    }

]
const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router