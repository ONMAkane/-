<script>
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'
export default {
    setup(){
        const store = useStore()
        const router = useRouter()
        const route = useRoute()
        const tags = store.state.tagsList
        const changeMenu = (tag) => {
            store.commit('selectMenu', tag)
            router.push({name: tag.name})
        }
        const handleClose = (tag, index) => {
            store.commit('closeTag', tag)
            if(route.name !== tag.name) return
            if(index === tags.length) {
                store.commit('selectMenu', tags[index - 1])
                router.push({ name: tags[index - 1].name })
            } else {
                store.commit('selectMenu', tags[tags.length - 1])
                router.push({ name: tags[tags.length - 1].name })
            }
        }
        return {
            tags,
            changeMenu,
            handleClose
        }   
    }
}
</script>
<template>
    <div class="tags">
        <el-tag
            v-for="(tag, index) in tags"
            :key="tag.name"
            :closable="tag.name !== 'home'"
            :effect="$route.name === tag.name ? 'dark' : 'plain'"
            @click="changeMenu(tag)"
            @close="handleClose(tag, index)"
          >
            {{tag.label}}
        </el-tag>
    </div>
</template>

<style lang="less" scoped>
.tags {
    padding-bottom: 20px;
    .el-tag {
        margin-right: 10px;
        cursor: pointer;
    }
}
</style>