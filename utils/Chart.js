export default class Chart {
    constructor(el, theme, opts) {
        this.instance = echarts.init(el, theme, opts)
    }
    setOption(option) {
        this.instance.setOption(option)
        return this
    }
    draw({ title, categories, series, axis, vertical }) {
        const option = {
            toolbox: {
                show: false,
                feature: {
                    mark: {
                        show: true
                    },
                    dataView: {
                        show: true,
                        readOnly: true
                    },
                    magicType: {
                        // show: false,
                        show: true,
                        type: ["line", "bar", "stack", "tiled"]
                    },
                    restore: {
                        show: true
                    },
                    saveAsImage: {
                        show: true
                    }
                }
            },
            grid: vertical ? [{
                top: '20%',
                width: '40%',
                left: '5%',
                // containLabel: true
            }, {
                top: '20%',
                width: '40%',
                left: '5%',
                // containLabel: true
            }] : [{
                top: '20%',
                width: '75%',
                // containLabel: true
            }],
            calculable: true,
            tooltip: {
                trigger: 'axis',
                showDelay: 0,
                axisPointer: {
                    type: "cross",
                    lineStyle: {
                        type: "dashed",
                        width: 1
                    }
                }
            },
            title: {
                text: title
            },
            legend: {
                data: series.map(item => item.name),
                right: '20%',
            },
            series,
        }
        if (axis) {
            if (typeof axis == 'object') {
                Object.assign(option, axis)
            } else {
                if (vertical) {
                    const xAxis = []
                    series.forEach(({
                        xAxisIndex = 0,
                        unit,
                        type
                    }) => {
                        if (!xAxis[xAxisIndex]) {
                            xAxis[xAxisIndex] = {
                                type: 'value',
                                name: unit,
                                offset: 40,
                                splitLine: {
                                    show: false
                                },
                            }
                        }
                    })
                    Object.assign(option, {
                        yAxis: {
                            type: "category",
                            data: categories,
                            boundaryGap: false,
                            axisLine: {
                                onZero: false
                            },
                        },
                        xAxis
                    })
                } else {
                    const yAxis = []
                    series.forEach(({
                        yAxisIndex = 0,
                        unit
                    }) => {
                        if (!yAxis[yAxisIndex]) {
                            yAxis[yAxisIndex] = {
                                type: 'value',
                                name: unit,
                                offset: 40,
                                splitLine: {
                                    show: false
                                }
                            }
                        }
                    })
                    Object.assign(option, {
                        xAxis: {
                            type: "category",
                            data: categories,
                            boundaryGap: false,
                            axisLine: {
                                onZero: false
                            },
                        },
                        yAxis
                    })
                }
            }
        }
        return this.setOption(option)
    }
}


export class LineChart extends Chart {
    draw({ title, categories, series }) {
        return super.draw({ title, categories, series, axis: true })
    }
}

export class BarChart extends Chart {
    draw({ title, categories, series }) {
        return super.draw({ title, categories, series, axis: true })
    }
}

export class ScatterChart extends Chart {
    draw({ title, series }) {
        return super.draw({
            title,
            series,
            axis: {
                xAxis: [
                    {
                        type: "value",
                        power: 1,
                        precision: 2,
                        scale: true
                    }
                ],
                yAxis: [
                    {
                        type: "value",
                        power: 1,
                        precision: 2,
                        scale: true
                    }
                ],
            }
        })
    }
}

export class RadarChart extends Chart {
    draw({ title, series, axis }) {
        return super.draw({ title, series, axis })
    }
}

export class PieChart extends Chart {
    draw({ title, series }) {
        return super.draw({ title, series })
    }
}

// 漏斗图
export class FunnelChart extends Chart {
    draw({ title, series }) {
        return super.draw({ title, series })
    }
}

// 仪表盘
export class GaugeChart extends Chart {
    draw({ title, series }) {
        return super.draw({ title, series })
    }
}

export const getRandomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //不含最大值，含最小值
}

export class MapChart extends Chart {
    draw(data, subject) {
        const renderHTML = (data, subject) => {
            return data.details.length > 0 ? `
            <article class="alert-box">
                <h4 class="flex">${data.name}${subject}企业(数量：${data.details.length})</h4>       
                <dl class="content">
                <dt class="flex highlight">
                    <span>企业名称</span>
                    <span>所在城市</span>
                </dt>
                ${data.details.map(({ company, city }) => `<dd class="flex">
                    <span>${company}</span>
                    <span>${city}</span>
                </dd>`).join('')}
                </dl>
            </article>
            ` : ''
        }
        const option = {
            title: {
                text: subject,
                subtext: '更新时间 2020/10/26 9:30',
                sublink: 'http://www.census.gov/popest/data/datasets.html',
                left: 'left'
            },
            tooltip: {
                // trigger: 'item',
                triggerOn: 'click',
                showDelay: 0.4,
                transitionDuration: 0.4,
                formatter(params) {
                    return renderHTML(params.data, subject)
                }
            },
            // left: 0,
            visualMap: {
                type: 'piecewise',
                right: 'center',
                bottom: 40,
                min: 0,
                max: 100,
                pieces: [
                    { min: 1, max: 9, color: '#fbe2d6', label: '1-9' },
                    { min: 10, max: 49, color: '#ffc1a6', label: '10-49' },
                    { min: 50, max: 99, color: '#fe9466', label: '50-99' },
                    { min: 100, max: 199, color: '#ff6619', label: '100-199' },
                    { min: 200, max: 499, color: '#cc3d00', label: '200-499' },
                    { min: 500, color: '#732200', label: '500以上' },
                ],
                // text: ['High', 'Low'],           // 文本，默认为数值文本
                // calculable: true,
                orient: 'horizontal',
                inverse: true,
            },
            series: [
                {
                    name: 'China',
                    type: 'map',
                    roam: false,
                    map: 'china',
                    // center: [112.968049, 36.757468],
                    center: [108.968049, 36.757468],
                    emphasis: {
                        label: {
                            show: true
                        }
                    },
                    // 文本位置修正
                    textFixed: {
                        // Alaska: [20, -20]
                    },
                    data
                }
            ]
        }

        this.setOption(option)

        return this
    }
}
