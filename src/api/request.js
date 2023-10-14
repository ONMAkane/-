import axios from 'axios'
import config from '../config/index.js'
import {ElMessage} from 'element-plus'

const NETWORK_ERROR = '网络请求异常,请稍后再试...'

const service = axios.create({
    baseURL: config.baseApi
})

// 请求拦截器
service.interceptors.request.use((req) => {
    return req
})

// 响应拦截器
service.interceptors.response.use((res) => {
    const {data, code} = res.data
    if(code == 200) {
        return data
    } else {
        ElMessage.error(data.message || NETWORK_ERROR)
        return Promise.reject(data.message || NETWORK_ERROR)
    }
})

function request (options) {
    options.method = options.method || 'get'
    if(options.method.toLowerCase() === 'get'){
        options.params = options.data
    }
    let isMock = config.mock
    if(typeof options.mock !== 'undefined'){
        isMock = options.mock
    }
    if(config.env === 'prod'){
        service.defaults.baseURL = config.baseApi   
    } else {
        service.defaults.baseURL = isMock ? config.mockApi : config.baseApi
    }

    return service(options)
}

export default request