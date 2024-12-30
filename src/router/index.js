import { createRouter, createWebHistory } from 'vue-router'
import { isAuth, isLoggedIn } from '@/composables/auth'

import Home from '@/components/home/index.vue'
import Signin from '@/components/user/signin.vue'

import Dashboard from '@/components/user/dashboard/index.vue'
import DashboardMain from '@/components/user/dashboard/main.vue'
import UserProfile from '@/components/user/dashboard/pages/user_profile.vue'
import AdminArticles from '@/components/user/dashboard/admin/articles.vue'
import AdminAdd from '@/components/user/dashboard/admin/add.vue'
import AdminEdit from '@/components/user/dashboard/admin/edit.vue'
import NotFound from '@/components/404.vue'

import Article from '@/components/articles/article.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/article/:id',
      name: 'article',
      component: Article
    },
    {
      path: '/signin',
      name: 'signin',
      beforeEnter:isLoggedIn,
      component: Signin,
    },
    {
      path: '/user/dashboard',
      component: Dashboard,
      beforeEnter:isAuth, 
      children: [
        {path:'', component: DashboardMain, name:'dashboard' },
        {path:'profile', component: UserProfile, name:'user_profile' },
        {path:'articles', component: AdminArticles, name:'admin_articles' },
        {path:'articles/add', component: AdminAdd, name:'admin_add' },
        {path:'articles/edit/:id', component: AdminEdit, name:'admin_edit' }
      ]
    },
    { 
      path: '/:notFound(.*)*',
      component:NotFound, 
      name:'404'}
  ],
})

export default router
