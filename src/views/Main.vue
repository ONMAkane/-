<script>
import { defineComponent } from 'vue'
import CommonHeader from '../components/CommonHeader.vue'
import CommonAside from '../components/CommonAside.vue'
import CommonTags from '../components/CommonTags.vue'
export default defineComponent({
    components: {
        CommonHeader,
        CommonAside,
        CommonTags
    },
    setup (){
        return {}
    }
})
</script>

<template>
    <div class="common-layout">
        <el-container class="layContainer">
            <CommonAside />
            <el-container class="r-container">
                <CommonHeader />
                <el-main>
                    <CommonTags />
                    <router-view />
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>

<style lang="less" scoped>
.el-container {
    flex-wrap: wrap;
    align-items: flex-start;
}

.layContainer {
    flex-wrap: nowrap;
}
</style>
