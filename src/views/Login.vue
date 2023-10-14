<script>
import { ref, reactive, getCurrentInstance } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
export default {
    setup(){
        const {proxy} = getCurrentInstance()
        const router = useRouter()
        const store = useStore()
        const loginForm = reactive({
            username: '',
            password: ''
        })
        // 点击登录操作
        const login = () => {
            proxy.$refs.loginform.validate(async(valid) => {
                if(valid){
                    const res = await proxy.$api.getMenu(loginForm)
                    store.commit('setMenu', res.menu)
                    store.commit('addMenu', router)
                    store.commit('setToken', res.token)
                    proxy.$router.push({ name: 'home' })
                }
            })
        }
        // 表单校验规则
        const rules = ref({
            username: [
                { required: true, message: '请输入您的用户名', trigger: 'blur' }
            ],
            password: [
                { required: true, message: '请输入您的密码', trigger: 'blur' }
            ]
        })
        return{
            loginForm,
            login,
            rules
        }
    }
}
</script>

<template>
    <div class="login">
        <el-form ref="loginform" :model="loginForm" :rules="rules" class="login-container" label-width="70px">
            <h3>系统登陆</h3>
            <el-form-item label="用户名" prop="username">
                <el-input v-model="loginForm.username" placeholder="请输入用户名"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
                <el-input v-model="loginForm.password" type="password" placeholder="请输入密码"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="login">登录</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<style lang="less" scoped>
.login {
    position: relative;
    .login-container {
        position: absolute;
        left: 50%;
        transform: translate(-50%,-50%);
        height: 230px;
        width: 350px;
        margin-top: 50vh;
        background-color: #fff;
        border: 1px solid #eaeaea;
        border-radius: 15px;
        padding: 35px 35px 15px 35px;
        box-shadow: 0 0 25px #cacaca;
        h3 {
            text-align: center;
            margin-bottom: 20px;
            color: #505450;
        }
        .el-button {
            margin-left: 50px;
        }
}
}
</style>