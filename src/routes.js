import { createRouter, createWebHashHistory } from 'vue-router'
import BlogHome from './components/BlogHome.vue'
import SignUp from './components/SignUp.vue'
import LoginPage from './components/LoginPage.vue'
import ReadMore from './components/ReadMore.vue';


const routes = [
    {
        name: 'BlogHome',
        component: BlogHome,
        path: '/'
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
    }

]
const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router