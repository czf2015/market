const adapter = {
    '全球电竞市场收入情况（单位：亿美元）': {
        title: '全球电竞市场收入情况（单位：亿美元）',
        category: '年份',
        axis: true,
        series: [
            {
                name: '收入',
                type: 'bar',
            },
            {
                name: '同比增长',
                type: 'line',
                yAxisIndex: 1,
            }
        ]
    },
    '2020年全球游戏玩家（单位：亿人）': {
        title: '2020年全球游戏玩家（单位：亿人）',
        category: '地区',
        axis: true,
        vertical: true,
        series: [
            {
                name: '金额',
                type: 'bar',
            },
            {
                name: '占比',
                type: 'pie',
                center: ['70%', '55%'],
            }
        ]
    },
    '2020年全球游戏所占地区市场（单位：亿美元）': {
        title: '2020年全球游戏所占地区市场（单位：亿美元）',
        category: '地区',
        axis: true,
        vertical: true,
        series: [
            {
                name: '金额',
                type: 'bar',
            },
            {
                name: '占比',
                type: 'pie',
                center: ['70%', '55%'],
            }
        ]
    },
    '2019、2020、2023全球云游戏市场（单位：亿美元）': {
        title: '2019、2020、2023全球云游戏市场（单位：亿美元）',
        category: '年份',
        axis: true,
        series: [
            {
                name: '金额',
                type: 'line',
            },
        ]
    },
    '全球XR市场收入情况（单位：亿美元）': {
        title: '全球XR市场收入情况（单位：亿美元）',
        category: '年份',
        axis: true,
        series: [
            {
                name: '收入',
                type: 'bar',
            },
            {
                name: '同比增长',
                type: 'line',
                yAxisIndex: 1,
            }
        ]
    },
    '2020年全球XR市场份额占比': {
        title: '2020年全球XR市场份额占比',
        category: '地区',
        axis: false,
        series: [
            {
                name: '占比',
                type: 'pie',
            }
        ]
    },
    '2020年全球XR市场（单位：亿美元）': {
        title: '2020年全球XR市场（单位：亿美元）',
        category: '类型',
        axis: true,
        vertical: true,
        series: [
            {
                name: '金额',
                type: 'bar',
            },
            {
                name: '占比',
                type: 'pie',
                center: ['70%', '55%'],
            }
        ]
    },
    '2019、2020、2023全球XR市场（单位：亿美元）': {
        title: '2019、2020、2023全球XR市场（单位：亿美元）',
        category: '年份',
        axis: true,
        series: [
            {
                name: '金额',
                type: 'line',
            },
        ]
    },
}


const convertToChartData = (raw) => {
    const ret = {}
    Object.keys(raw).forEach(key => {
        if (typeof adapter[key] !== 'undefined') {
            const { title = key, category, vertical = false, series, axis } = adapter[key]
            const categories = category && raw[key].map(item => item[category])
            ret[key] = {
                title,
                axis,
                categories,
                series: series.map(serie => ({
                    ...serie,
                    categories,
                    data: raw[key].map((item, idx) => serie.type == 'pie' ? { name: categories[idx], value: item[serie.name] } : item[serie.name]),
                    barWidth: serie.type == 'bar' ? 40 : undefined,
                    radius: serie.type == 'pie' ? [0, '55%'] : undefined,
                })),
                vertical,
            }
        }
    })
    return ret
}

const provinces = ["河北", "山西", "辽宁", "吉林", "黑龙江", "江苏", "浙江", "安徽", "福建", "江西", "山东", "河南", "湖北", "湖南", "广东", "海南", "四川", "贵州", "云南", "陕西", "甘肃", "青海", "台湾", "内蒙古", "广西", "西藏", "宁夏", "新疆", "北京", "天津", "上海", "重庆", "香港", "澳门"]
const convertToHeatData = (records) => {
    return provinces.map(province => {
        const details = records.filter(item => item.province == province).map(item => {
            return {
                company: item.company,
                city: item.city,
            }
        })
        return {
            name: province,
            value: details.length,
            details,
        }
    })
}


export const getMarketInfo = async (url, industry) => {
    return await fetch(url)
        .then(res => res.json())
        .then((data) => {
            const chartData = data["云游戏、XR、互动视频、沉浸式展示"][industry]
            const heatData = { '企业坐标': convertToHeatData(data["企业坐标"][industry]) }
            switch (industry) {
                case '云游戏':
                    return {
                        ...convertToChartData(chartData),
                        ...heatData
                    }
                case 'XR':
                    return {
                        ...convertToChartData({
                            ...chartData,
                            '全球XR市场收入情况（单位：亿美元）': chartData['全球VR市场收入情况（单位：亿美元）'].map((item, idx) => {
                                const currentValue = item['收入'] + chartData['全球移动AR市场收入情况（单位：亿美元）'][idx]['收入'] + chartData['全球头戴AR/MR市场收入情况（单位：亿美元）'][idx]['收入']
                                let changeValue = 0
                                if (idx > 0) {
                                    const lastValue = chartData['全球VR市场收入情况（单位：亿美元）'][idx - 1]['收入'] + chartData['全球移动AR市场收入情况（单位：亿美元）'][idx - 1]['收入'] + chartData['全球头戴AR/MR市场收入情况（单位：亿美元）'][idx - 1]['收入']
                                    changeValue = currentValue / lastValue - 1
                                }
                                return {
                                    ...item, '收入': currentValue, '同比增长': changeValue
                                }
                            })
                        }),
                        ...heatData
                    }
                case '互动视频':
                    return {
                        ...convertToChartData(chartData),
                        ...heatData
                    }
                case '沉浸式':
                    return {
                        ...convertToChartData(chartData),
                        ...heatData
                    }
                default:
                    throw new Error('参数错误--可选值：云游戏、XR、互动视频、沉浸式')
            }
        })
}