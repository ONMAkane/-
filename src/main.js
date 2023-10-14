import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import router from './router/index.js'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import './assets/less/index.less'
import store from './store/index.js'
import './api/mock.js'
import api from './api/api.js'

const app = createApp(App)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
app.config.globalProperties.$api = api
store.commit('addMenu', router)

// 检查即将跳转的路径是否为动态路由
function checkRouter(path){
    const hasRoute = router.getRoutes().filter(route => route.path === path).length
    return hasRoute ? true : false
}

router.beforeEach((to, from, next) => {
    store.commit('getToken')
    const token = store.state.token
    if (!token && to.path !== '/login') {
        next({ name: 'login' })
    } else if (token && (to.path === '/login' || !checkRouter(to.path))){
        next({ name: 'home'})
    } else {
        next()
    }
})

app.use(ElementPlus)
app.use(router).use(store)
app.mount('#app')
