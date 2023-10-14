<script>
import { reactive, ref, onMounted, getCurrentInstance } from 'vue'
import { useStore } from 'vuex'
import * as echarts from "echarts"
// import axios from 'axios'
export default {
    setup(){
        const {proxy} = getCurrentInstance()
        const store = useStore()
        const tableLabel = {
            name: '手机名称',
            todayBuy: '今日购买',
            monthBuy: '本月购买',
            totalBuy: '总购买'
        }
        const grade = ref(store.state.menu.length)
        const tableData = ref([])
        // 获取左侧菜单数据
        const getTableList = async() => {
            // const {data: {data: data}} = await axios.get('/home/getData')
            const res = await proxy.$api.getTableData()
            tableData.value = res.tableData
        }
        const countData = ref([])
        // 获取count数据
        const getCountData = async() => {
            const res = await proxy.$api.getCountData()
            countData.value = res
        }
        onMounted(() => {
            getTableList()
            getCountData()
            getChartData()
        })

        let xOptions = reactive({
            // 图例文字颜色
            textStyle: {
                color: "#333",
            },
            grid: {
                left: "20%",
            },
            // 提示框
            tooltip: {
                trigger: "axis",
            },
            xAxis: {
                type: "category", // 类目轴
                data: [],
                axisLine: {
                    lineStyle: {
                        color: "#17b3a3",
                    },
                },
                axisLabel: {
                    interval: 0,
                    color: "#333",
                },
            },
            yAxis: [
                {
                    type: "value",
                    axisLine: {
                        lineStyle: {
                            color: "#17b3a3",
                        },
                    },
                },
            ],
            color: ["#2ec7c9", "#b6a2de", "#5ab1ef", "#ffb980", "#d87a80", "#8d98b3"],
            series: [],
        })
        let pieOptions = reactive({
            tooltip: {
                trigger: "item",
            },
            color: [
                "#0f78f4",
                "#dd536b",
                "#9462e5",
                "#a6a6a6",
                "#e1bb22",
                "#39c362",
                "#3ed1cf",
            ],
            series: [],
        })
        let orderData = reactive({
            xData: [],
            series: []
        })
        let userData = reactive({
            xData: [],
            series: [],
        })
        let videoData = reactive({
            series: []
        })
        // 获取统计图
        const getChartData = async() => {
            let result = await proxy.$api.getChartData()
            let res = result.orderData
            let userRes = result.userData
            let videoRes = result.videoData
            orderData.xData = res.date
            const keyArr = Object.keys(res.data[0])
            const series = []
            keyArr.forEach((key) => {
                series.push({
                    name: key,
                    data: res.data.map((item) => item[key]),
                    type: 'line'
                })
            })
            orderData.series = series;
            xOptions.xAxis.data = orderData.xData;
            xOptions.series = orderData.series;
            // userData进行渲染
            let lEcharts = echarts.init(proxy.$refs["lineChart"]);
            lEcharts.setOption(xOptions);

            // 柱状图进行渲染的过程
            userData.xData = userRes.map((item) => item.date);
            userData.series = [
                {
                    name: "新增用户",
                    data: userRes.map((item) => item.new),
                    type: "bar",
                },
                {
                    name: "活跃用户",
                    data: userRes.map((item) => item.active),
                    type: "bar",
                },
            ];

            xOptions.xAxis.data = userData.xData;
            xOptions.series = userData.series;
            let uEcharts = echarts.init(proxy.$refs["userechart"]);
            uEcharts.setOption(xOptions);
            videoData.series = [
                {
                    data: videoRes,
                    type: "pie",
                },
            ];
            pieOptions.series = videoData.series;
            let vEcharts = echarts.init(proxy.$refs["videoechart"]);
            vEcharts.setOption(pieOptions);
        }
        
        return {
            tableLabel,
            tableData,
            countData,
            grade
        }
    }
}
</script>

<template>
    <el-row class="home" :gutter="20">
        <el-col :span="8" style="margin-top: 20px">
            <el-card shadow="hover">
                <div class="userInfo">
                    <img src="../../assets/images/R-C.jpg" alt="">
                    <div class="info">
                        <p class="name">Admin</p>
                        <p class="role" v-text="grade > 3 ? '超级管理员' : '管理员'"></p>
                    </div>
                </div>
                <div class="loginInfo">
                    <p>上次登录时间：<span>2022-1-23</span></p>
                    <p>上次登录地点：<span>芜湖</span></p>
                </div>
            </el-card>
            <el-card shadow="hover" style="margin-top: 20px; height: 451px">
                <el-table :data="tableData" style="width: 100%">
                    <el-table-column v-for="(val, key) in tableLabel" :prop="key" :label="val"/>
                </el-table>
            </el-card>
        </el-col>
        <el-col :span="16" style="margin-top: 20px">
            <div class="count">
                <el-card 
                    shadow="hover" 
                    :body-style="{display: 'flex', padding: 0}"
                    v-for="item in countData"
                    :key="item.name">
                    <div class="img" :style="{ backgroundColor: item.color }">
                        <component 
                            class="icons" 
                            :is="item.icon" 
                            ></component>
                    </div>
                    <div class="detail">
                        <p class="num">￥{{ item.value }}</p>
                        <p class="text">{{ item.name }}</p>
                    </div>
                </el-card>
            </div>
            <el-card style="height: 280px" shadow="hover">
                <div ref="lineChart" style="height: 280px"></div>
            </el-card>
            <div class="graph">
                <el-card style="height: 260px" shadow="hover">
                    <div ref="userechart" style="height: 240px"></div>
                </el-card>
                <el-card style="height: 260px" shadow="hover">
                    <div ref="videoechart" style="height: 240px"></div>
                </el-card>
            </div>
        </el-col>
    </el-row>
</template>

<style lang="less" scoped>
.home {
    margin-top: -20px;
    .userInfo {
        display: flex;
        align-items: center;
        padding-bottom: 20px;
        margin-bottom: 20px;
        border-bottom: 1px solid #ccc;
        img {
            width: 150px;
            height: 150px;
            border-radius: 50%;
            margin-right: 40px;
        }
        .info {
            .name {
                font-size: 32px;
                margin-bottom: 10px;
            }
        }
    }
    .loginInfo {
        p {
            line-height: 30px;
            font-size: 14px;
            color: #999;
            span {
                color: #666;
                margin-left: 70px
            }
        }
    }
    .count {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        .el-card {
            width: 32%;
            margin-bottom: 20px;
        }
        
        .img {
            width: 80px;
            height: 80px;
            display: flex;
            justify-content: center;
            align-items: center;
            .icons {
                width: 30px;
                height: 30px;
                color: #fff;
            }
        }
        .icon{
        width: 80px;
        height: 80px;
        font-size: 30px;
        text-align: center;
        line-height: 80px;
        color: #fff
        }
        .detail {
            margin-left: 15px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            .num {
                font-size: 30px;
                margin-bottom: 10px;
            }
            .text {
                font-size: 14px;
                text-align: center;
                color: #999;
            }
        }
    }
    .graph {
        margin-top: 20px;
        display: flex;
        justify-content: space-between;
        .el-card {
            width: 48%;
        }
    }
}
.icons {
    height: 20px;
    width: 20px
}
</style>