const env = import.meta.env.MODE || 'prod'

const envConfig = {
    development: {
        baseApi: '/api',
        mockApi: 'https://www.fastmock.site/mock/c4970c9cdc30e915bdb17f4d8e1dd6e8/api'
    },
    test: {
        baseApi: '//test.future.com/api',
        mockApi: 'https://www.fastmock.site/mock/c4970c9cdc30e915bdb17f4d8e1dd6e8/api'
    },
    prod: {
        baseApi: '//prod.future.com/api',
        mockApi: 'https://www.fastmock.site/mock/c4970c9cdc30e915bdb17f4d8e1dd6e8/api'
    }
}

export default {
    env,
    mock: true,
    ...envConfig[env]
}