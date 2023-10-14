import request from "./request.js";
export default {
    getTableData(params){
        return request({
            url: '/home/getTableData',
            method: 'get',
            data: params,
            mock: true
        })
    },
    getCountData(){
        return request({
            url: '/home/getCountData',
            method: 'get',
            mock: true
        })
    },
    getChartData(){
        return request({
            url: '/home/getChartData',
            method: 'get',
            // 线上mock模拟
            mock: true
        })
    },
    getUserData(params){
        return request({
            url: '/user/getData',
            method: 'get',
            // 本地mock模拟
            mock: false,
            data: params
        })
    },
    addUser(params){
        return request({
            url: '/user/addUser',
            method: 'post',
            mock: false,
            data: params
        })
    },
    editUser(params){
        return request({
            url: 'user/editUser',
            method: 'post',
            mock: false,
            data: params
        })
    },
    delUser(params) {
        return request({
            url: 'user/delUser',
            method: 'get',
            mock: false,
            data: params
        })
    },
    getMenu(params) {
        return request({
            url: 'permission/getMenu',
            method: 'post',
            mock: false,
            data: params
        })
    }
}