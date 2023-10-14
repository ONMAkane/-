import { createStore } from 'vuex'
import Cookies from 'js-cookie'

export default createStore({
    state: {
        isCollapse: true,
        currentMenu: null,
        tagsList: [
            {
                path: '/',
                name: 'home',
                label: '首页',
                icon: 'home'
            }
        ],
        menu: [],
        removeRoute: [],
        token: ''
    },
    mutations: {
        changeCollapse(state){
            state.isCollapse = !state.isCollapse
        },
        selectMenu(state, item){
            if (item.name === 'home'){
                state.currentMenu = null
            } else {
                state.currentMenu = item
                state.tagsList.findIndex(key => key.name === item.name) === -1 ? state.tagsList.push(item) : ''
            }
        },
        closeTag(state, tag){
            const index = state.tagsList.findIndex(item => item.name === tag.name)
            state.tagsList.splice(index, 1)
        },
        setMenu(state, menu){
            state.menu = menu
            Cookies.set('menuData', JSON.stringify(menu))
        },
        addMenu(state, router){
            if(!Cookies.get('menuData')) return
            const menu = JSON.parse(Cookies.get('menuData'))
            state.menu = menu

            const menuArr = []
            menu.forEach(item => {
                if(item.children){
                    item.children = item.children.map(item => {
                        let url = `../views/${item.url}.vue`
                        item.component = () => import(url)
                        return item
                    })
                    menuArr.push(...item.children)
                } else {
                    let url = `../views/${item.url}.vue`
                    item.component = () => import(url)
                    menuArr.push(item)
                }
            })
            menuArr.forEach(item => {
                state.removeRoute.push(router.addRoute('main', item))
            })
        },
        clearMenu(state){
            state.menu = []
            state.tagsList = [
                {
                    path: '/',
                    name: 'home',
                    label: '首页',
                    icon: 'home'
                }
            ]
            Cookies.remove('menuData')
            state.removeRoute.forEach(removeRoute => {
                removeRoute()
            })
        },
        setToken(state, token){
            state.token = token
            Cookies.set('token', token)
        },
        getToken(state){
            state.token = state.token || Cookies.get('token')
        },
        clearToken(state){
            Cookies.remove('token')
            state.token = ''
        }
    }
})