<script>
import { ElMessage, ElMessageBox } from 'element-plus'
import { onMounted, getCurrentInstance, ref, reactive } from 'vue'
export default {
    setup(){
        // == this
        const {proxy} = getCurrentInstance()
        let tableData = ref([])
        const tableLabel = reactive([
            {
                prop: "name",
                label: "姓名",
            },
            {
                prop: "age",
                label: "年龄",
            },
            {
                prop: "sexLabel",
                label: "性别",
            },
            {
                prop: "birth",
                label: "出生日期",
                width: 200,
            },
            {
                prop: "addr",
                label: "地址",
                width: 320,
            },
        ])
        // 刷新表格数据
        const getTableData = async() => {
            const res = await proxy.$api.getUserData({ ...pageConfig, ...searchForm })
            pageConfig.total = res.count
            tableData.value = res.list.map(item => {
                item.sexLabel = item.sex == 0 ? '女' : '男'
                return item
            })
        }
        // 分页数据
        const pageConfig = reactive({
            page: 1,
            total: 0
        })
        // 点击分页栏
        const pageChange = (page) => {
            pageConfig.page = page
            getTableData()
        }
        // 查询表单
        const searchForm = reactive({
            name: ''
        })
        // 新增或修改的表单
        let userForm = reactive({
            name: '',
            age: '',
            sex: '',
            birth: '',
            addr: ''
        })
        // 搜索数据
        const handleSearch = () => {
            getTableData()
        }
        // 对话框显隐
        let dialogVisible = ref(false)
        // 提交信息
        const onSubmit = () => {
            proxy.$refs.userform.validate(async(valid) => {
                if(valid){
                    if(modal.value === 'add'){
                        const res = await proxy.$api.addUser(userForm)
                        dialogVisible.value = false
                        proxy.$refs.userform.resetFields()
                        getTableData()
                    } else {
                        // userForm.sex == '男' ? (userForm.sex = 1) : (userForm.sex = 0)
                        const res = await proxy.$api.editUser(userForm)
                        dialogVisible.value = false
                        proxy.$refs.userform.resetFields()
                        getTableData()
                    }
                }
            })
        }
        // 关闭弹窗
        const handleClose = () => {
            proxy.$refs.userform.resetFields()
            dialogVisible.value = false
        }
        // 表单校验规则
        const rules = ref({
            name: [
                { required: true, message: '请输入您的姓名', trigger: 'blur' },
                { min: 2, max: 5, message: '姓名必须为2-5个字', trigger: 'blur' }
            ],
            age: [
                { type: 'number', required: true, message: '请输入您的年龄', trigger: 'blur' }
            ],
            sex: [
                { required: true, message: '请选择您的性别', trigger: 'blur' }
            ],
            birth: [
                { required: true, message: '请选择您的出生日期', trigger: 'blur' }
            ],
            addr: [
                { required: true, message: '请输入您的居住地址', trigger: 'blur' }
            ]
        })
        // 判断新增和修改
        const modal = ref('add')
        // 修改表格数据
        const handleEdit = (row) => {
            modal.value = 'edit'
            dialogVisible.value = true
            // userForm = JSON.parse(JSON.stringify(row))
            row.sex == 1 ? row.sex = '男' : row.sex = '女'
            // 浅拷贝
            proxy.$nextTick(() => {
                Object.assign(userForm, row);
            })
        }
        // 点击新增操作
        const handleAdd = () => {
            modal.value = 'add'
            dialogVisible.value = true
        }
        // 删除用户
        const handleDel = (row) => {
            ElMessageBox.confirm(
                '你确定要删除该用户吗?',
                '提示',
                {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    type: 'warning',
                }
            ).then(async() => {
                await proxy.$api.delUser({id: row.id})
                ElMessage({
                    type: 'success',
                    message: '删除成功',
                })
                getTableData()
            })
        }
        onMounted(()=>{
            getTableData()
        })
        return {
            tableData,
            tableLabel,
            pageChange,
            pageConfig,
            searchForm,
            handleSearch,
            dialogVisible,
            userForm,
            onSubmit,
            handleClose,
            rules,
            modal,
            handleEdit,
            handleAdd,
            handleDel
        }
    }
}
</script>

<template>
    <div class="user-header">
        <el-button type="primary" @click="handleAdd">
            + 新增
        </el-button>
        <el-form
        :inline="true"
        label-width="100px"
        :model="searchForm">
            <el-form-item label="搜索：">
              <el-input
                type="text"
                autocomplete="off"
                placeholder="请输入关键字"
                v-model="searchForm.name"
              />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleSearch">查询</el-button>
            </el-form-item>
        </el-form>
    </div>
    <div class="table">
        <el-table :data="tableData" stripe style="width: 100%" height="70vh">
            <el-table-column
                v-for="item in tableLabel"
                :prop="item.prop" 
                :label="item.label" 
                :width="item.width ? item.width : 125" />
            <el-table-column fixed="right" label="操作" min-width="180">
                <template #default="scope">
                    <el-button type="primary" size="small" @click="handleEdit(scope.row)">修改</el-button>
                    <el-button type="danger" size="small" @click="handleDel(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination :page-size='20' class="pager" @current-change="pageChange" layout="prev, pager, next" :total="pageConfig.total" />
    </div>
    <el-dialog
        v-model="dialogVisible"
        :before-close="handleClose"
        :title="modal === 'add' ? '新增用户' : '修改用户'"
        width="45%">
        <el-form :inline="true" :model="userForm" ref="userform" :rules="rules">
            <el-row>
                <el-col :span="12">
                    <el-form-item label="姓名" prop="name">
                        <el-input v-model="userForm.name" placeholder="请输入姓名" />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="年龄" prop="age">
                        <el-input v-model.number="userForm.age" placeholder="请输入年龄" />
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="性别" prop="sex">
                        <el-select
                            v-model="userForm.sex"
                            placeholder="请选择性别"
                            clearable>
                            <el-option label="男" value="1" />
                            <el-option label="女" value="0" />
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="出生日期" prop="birth">
                        <el-date-picker
                            type="date"
                            placeholder="请选择出生日期"
                            v-model="userForm.birth"
                            value-format="YYYY-MM-DD"
                            style="width: 100%" />
                    </el-form-item>
                </el-col>
            </el-row>
            <el-form-item label="地址" prop="addr">
                <el-input v-model="userForm.addr" placeholder="请输入居住地址" />
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button type="primary" @click="handleClose">取消</el-button>
                <el-button type="primary" @click="onSubmit">确定</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<style lang="less" scoped>
.table {
    position: relative;
    height: 600px;
    .pager {
        position: absolute;
        right: 0;
        bottom: 30px;
    }
}
.user-header {
    display: flex;
    justify-content: space-between;
}
</style>