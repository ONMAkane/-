<script>
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
export default {
    setup(){
        const store = useStore()
        const menuData = [
            {
                path: '/user',
                name: 'user',
                label: '用户管理',
                icon: 'user',
                url: 'UserManage/UserManage'
            },
            {
                label: '其他',
                icon: 'location',
                children: [
                    {
                        path: '/page1',
                        name: 'page1',
                        label: '页面1',
                        icon: 'setting',
                        url: 'Other/PageOne'
                    },
                    {
                        path: '/page2',
                        name: 'page2',
                        label: '页面2',
                        icon: 'setting',
                        url: 'Other/PageTwo'
                    }
                ]
            }
        ]
        const asyncMenu = store.state.menu
        const router = useRouter()
        // 有子路由
        const hasChildren = () => {
            return asyncMenu.filter((item) => item.children)
        }
        // 无子路由
        const noChildren = () => {
            return asyncMenu.filter((item) => !item.children)
        }
        // 跳转路由
        const changeMenu = (item) => {
            router.push({name: item.name})
            store.commit('selectMenu',item)
        }
        return {
            hasChildren,
            noChildren,
            changeMenu
        }
    }
}
</script>

<template>
    <el-aside :width="$store.state.isCollapse ? '200px' : '64px'">
        <el-menu
        class="el-menu-vertical-demo"
        :collapse="!$store.state.isCollapse"
        :collapse-transition="false"
        backgroundColor="#545c64"
        textColor="#fff">
            <h3 v-text="$store.state.isCollapse ? '后台管理系统' : '后台'"></h3>
            <el-menu-item 
                v-for="item in noChildren()"
                @click="changeMenu(item)"
                :index="item.path"
                :key="item.path">
                <component class="icons" :is="item.icon"></component>
                <span>{{ item.label }}</span>
            </el-menu-item>
            <el-sub-menu 
                v-for="item in hasChildren()"
                :index="item.path + ''"
                :key="item.path">
            <template #title>
                <component class="icons" :is="item.icon"></component>
                <span>{{ item.label }}</span>
            </template>
            <el-menu-item-group>
                <el-menu-item  
                v-for="subItem in item.children" 
                @click="changeMenu(subItem)"
                :index="subItem.path"
                :key="subItem.path">
                    <component class="icons" :is="subItem.icon"></component>
                    <span>{{ subItem.label }}</span>
                </el-menu-item>
            </el-menu-item-group>
            </el-sub-menu>
        </el-menu>
    </el-aside>
</template>

<style lang="less" scoped>
.el-aside {
    height: 120vh;
    background-color:#545c64;
    .el-menu {
        border-right: none;
        h3 {
            line-height: 48px;
            text-align: center;
            color: #fff;
        }
    }
    .el-sub-menu{
        display: grid;
    }
}

.icons{
    width: 18px;
    height: 18px;
}
</style>