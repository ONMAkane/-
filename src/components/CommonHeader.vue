<script>
import { useStore } from 'vuex'
import { computed } from 'vue'
import { useRouter } from 'vue-router'
export default {
    setup(){
        const store = useStore()
        const router = useRouter()
        // 获取图片地址属性
        const getImgSrc = (name) => {
            return new URL(`../assets/images/${name}.jpg`, import.meta.url).href
        }
        // 菜单折叠方法
        const changeCollapse = () => {
            store.commit('changeCollapse')
        }
        // 面包屑焦点获取
        const current = computed(() => {
            return store.state.currentMenu
        })
        // 退出
        const handleExit = () => {
            store.commit('clearMenu')
            store.commit('clearToken')
            router.push({name: 'login'})
        }
        return {
            getImgSrc,
            changeCollapse,
            current,
            handleExit
        }
    }
}
</script>

<template>
    <el-header>
        <div class="l-content">
            <el-button size="small" plain @click="changeCollapse">
                <el-icon>
                    <Menu />
                </el-icon>
            </el-button>
            <!-- <span class="text">首页</span> -->
            <el-breadcrumb class="text" separator="/">
                <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item v-if="current" :to="{ path: current.path }">{{current.label}}</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="r-content">
            <el-dropdown>
                <span class="el-dropdown-link">
                    <img class="user" :src="getImgSrc('R-C')" alt="">
                </span>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item>个人中心</el-dropdown-item>
                        <el-dropdown-item @click="handleExit">退出</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>
    </el-header>
</template>

<style lang="less" scoped>
.el-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    background-color: #333;
    .user {
        width: 40px;
        height: 40px;
        border-radius: 50%;
    }
    .el-dropdown-link:focus {
        outline: none;
    }
    .l-content {
        display: flex;
        align-items: center;
        color: #fff;
        .text {
            margin-left: 20px;
            :deep(span) {
                color: #fff;
                cursor: pointer;
            }
        }
    }
}
</style>