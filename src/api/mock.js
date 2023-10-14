import Mock from 'mockjs'
import homeApi from './mockData/home.js'
import userApi from './mockData/user.js'
import permissionApi from './mockData/permission.js'

// 模拟获取首页数据
Mock.mock('/home/getData', homeApi.getHomeData)
// 模拟获取用户表单
Mock.mock(/user\/getData/, userApi.getUserList)
// 模拟新增用户
Mock.mock(/user\/addUser/, 'post', userApi.createUser)
// 模拟修改用户
Mock.mock(/user\/editUser/, 'post', userApi.updateUser)
// 模拟删除用户
Mock.mock(/user\/delUser/, 'get', userApi.deleteUser)
// 登录
Mock.mock(/permission\/getMenu/, 'post', permissionApi.getMenu)