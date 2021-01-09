import { vary } from './number.js'

export const getLinearGradient = (...params) => new echarts.graphic.LinearGradient(...params)


export const drawDataValue = (raws, idxs) => {
    const draw = (raw) => {
        let value
        if (Array.isArray(idxs)) {
            const value = []
            idxs.forEach(idx => {
                value.push(raw.value[idx])
            })
        } else {
            value = raw.value[idxs]
        }
        return { ...raw, value }
    }
    return raws.map(draw)
}

export const convertColorStops = (offsets, colors) => {
    return offsets.map((offset, idx) => ({ offset, color: colors[idx] }))
}

export const colorStops = (offsets, colors) => ({ colorStops: convertColorStops(offsets, colors) })

export const convertDataName = (obj, convert = x => x) => {
    return Object.entries(obj).map(([name, value]) => {
        return {
            name,
            ...convert(value)
        }
    })
}

export const getTextStyle = (color, fontSize = 14,) => {
    return {
        textStyle: {
            fontSize,
            color
        }
    }
}

export const tooltip = ({ trigger = 'axis', backgroundColor = 'rgba(255,255,255,0.1)', formatter }) => {
    return {
        tooltip: {
            trigger,
            backgroundColor,
            axisPointer: {
                type: 'cross',
                crossStyle: {
                    color: '#999'
                }
            },
            formatter,
        }
    }
}

export const gradient = (getGradient, pos, offsets, colors) => {
    return getGradient(...pos, offsets.map((offset, idx) => ({ offset, color: colors[idx] })))
}

export const getLineSerie = ({ name, data }, {
    type = 'solid',
    area,
    color,
    // colorStops = [{ offset: 0.5, color: 'red' }, { offset: 0.7, color: 'blue' }]
    yAxisIndex = 0,
} = {}) => {
    return {
        type: 'line',
        yAxisIndex,
        name,
        data: data.map(item => Number(item).toFixed(2)),
        smooth: true,
        symbol: 'circle',
        symbolSize: 1,
        lineStyle: {
            type,
            width: 2,
            color,
        },
        itemStyle: {
            color,
        },
        areaStyle: {
            color: area ? {
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [{
                    offset: 0,
                    color: "#fdc558" // 0% 处的颜色
                }, {
                    offset: 0.7,
                    color: "rgba(38,29,102,0.7)" // 100% 处的颜色
                }],
            } : 'transparent',
        },
        emphasis: {
            itemStyle: {
                borderColor: 'rgba(64, 74, 189, 0.56)',
                shadowColor: 'rgba(64, 74, 189, 0.2)',
                shadowBlur: 20,
                opacity: 1,
                borderWidth: 10,
                color: {
                    type: 'radial',
                    x: 0.5,
                    y: 0.5,
                    r: 0.6,
                    colorStops: [{
                        offset: 0,
                        color: '#fdc558'
                    },
                    {
                        offset: .5,
                        color: '#c32129'
                    },
                    {
                        offset: 1,
                        color: '#582ed3'
                    }],
                }
            },
        }
    }
}

export const getPieSerie = ({ name, data, clockwise = false, minShowLabelAngle = 0, color, }) => {
    const total = data.reduce((a, b) => a + b.value, 0)
    return {
        name,
        type: 'pie',
        top: '0%',
        left: '0%',
        radius: ['33%', '50%'],
        clockwise,
        hoverAnimation: true,
        hoverOffset: 5,
        color,
        avoidLabelOverlap: true,
        minShowLabelAngle,
        legend: {
            show: false
        },
        label: {
            formatter(params) {
                const percent = ((Number(params.value) / total) * 100).toFixed(2);
                return '{blue|' + params.name + '\n ' + percent + '%}';
            },
            rich: {
                blue: {
                    color: '#297eb5',
                    fontSize: 14,
                    align: 'center'
                },
            },
        },
        labelLine: {
            length: 10,
            length2: 10,
            lineStyle: {
                color: '#297eb5'
            }
        },
        data,
    }
}


export const getBarSerie = ({
    name, data, unit }, { colorStops = [{ offset: 0, color: '#e04606' }, {
        offset: 0.5,
        color: '#5c5792'
    }, {
        offset: 1,
        color: '#2b5ecb'
    }],
        yAxisIndex = 0,
        showBackground = false,
        label = false,
    } = {}, vertical) => {
    return {
        name,
        type: 'bar',
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: "cross",
                crossStyle: {
                    color: "#999"
                },
            },
            formatter(params) {
                // debugger
                // return `${Number(params.value).toFixed(2)}${unit}`
                return params.map(param => `${param.name}: ${param.seriesName}${param.value}${unit}`).join('\n')
            }
        },
        label: {
            show: !!label,
            position: 'top',
            color: '#fff',
            formatter(params) {
                return `${Number(params.value).toFixed(2)}${unit}`
            }
        },
        // barGap: '30%',
        showBackground,
        backgroundStyle: {
            color: 'rgba(180, 180, 180, 0.2)'
        },
        barWidth: '30%',
        yAxisIndex,
        itemStyle: {
            color: vertical ? getLinearGradient(0, 0, 1, 0, colorStops) : getLinearGradient(0, 0, 0, 1, colorStops),
            barBorderRadius: 7,
        },
        emphasis: {
            itemStyle: {
                // 
                // shadowColor: 'rgba(0, 0, 0, 0.5)',
                // shadowBlur: 10
                borderWidth: 20,
                barBorderRadius: 0,
                borderColor: 'rgba(180, 180, 180, 0.2)'
            }
        },
        data: data.map(item => Number(item).toFixed(2)),
    }
}


export const getRadarSerie = (data, colors) => {
    return {
        name: '雷达图',
        type: 'radar',
        symbolSize: 2.5,
        label: {                    // 单个拐点文本的样式设置                            
            // show: false,             // 单个拐点文本的样式设置。[ default: false ]
            position: 'top',        // 标签的位置。[ default: top ]
            distance: 2,            // 距离图形元素的距离。当 position 为字符描述值（如 'top'、'insideRight'）时候有效。[ default: 5 ]
            fontSize: 14,           // 文字的字体大小
            formatter(params) {
                return params.value;
            }
        },

        data: data.map(({ name, value }, idx) => {
            return {
                name,
                value: value,
                areaStyle: {
                    color: colors[idx]
                },
            }
        }),
    }
}


export const getRadar = (indicator, show = { legend: true, }) => {
    return {
        name: {
            formatter: '{value}',
            textStyle: {
                fontSize: 14,
                color: '#36b2f8'
            }
        },
        textStyle: {
            color: 'red'
        },
        legend: {
            show: show.legend,
        },
        indicator,
        orient: 'horizontal',
        center: ['50%', '50%'],
        radius: 142,
        // startAngle: 90,
        // shape: 'circle',
        // backgroundColor: {
        //     image: imgPath[0]
        // },

        // axisLabel: {
        //     show: false
        // },
        axisLine: {
            lineStyle: {
                color: '#153269'
            }
        },
        splitLine: {
            lineStyle: {
                color: '#113865',
                width: 1,
            }
        },
        splitArea: {
            show: true,
            areaStyle: {
                color: ['#141c42', '#141c42'],
            }
        },
    }
}


export const getEffectScatterSerie = ({ name, data, coordinateSystem = 'bmap' }) => {
    return {
        name,
        type: 'effectScatter',
        coordinateSystem,
        data,
        symbolSize: 2,
        showEffectOn: 'render',
        rippleEffect: {
            brushType: 'stroke'
        },
        hoverAnimation: true,
        label: {
            formatter: '{b}',
            position: 'right',
            show: true,
            color: '#fff',
            fontSize: 16
        },
        itemStyle: {
            color: '#fbc965',
            shadowColor: '#fbc965',
            shadowBlur: 10,
        },
        zlevel: 10
    }
}


export const getAverageData = (detailData) => {
    const tempArr = Object.values(detailData);
    const data = tempArr
        .map((item) => item[1][0].data)
        .reduce((a, b) => {
            b.forEach((_, idx) => {
                a[idx] += b[idx];
            });
            return a;
        })
        .map((num) => Number((num / tempArr.length).toFixed(2)));

    return [
        tempArr[0][0],
        [
            {
                name: "平均",
                data,
            },
        ],
    ];
}


export const getLinesSerie = (data, width = 1, colorStops = [{ offset: 0, color: '#a93a10' }, { offset: 1, color: '#7f533a' }]) => ({
    type: 'lines',
    coordinateSystem: 'bmap'/* 'geo' */,
    zlevel: 2,
    tooltip: {
        trigger: 'item',
        formatter(params) {
            const { direction, value } = params.data
            return `${direction.join('--->')}: ${Number(value).toFixed(2)}`;
        }
    },
    effect: {
        show: true,
        period: 4, //箭头指向速度，值越小速度越快
        trailLength: 0.02, //特效尾迹长度[0,1]值越大，尾迹越长重
        symbol: 'arrow', //箭头图标
        symbolSize: 5, //图标大小
    },
    data: data.map(item => ({
        coords: [item[0].coord, item[1].coord],
        name: item[0].name,
        value: item[0].value || item[1].value,
        direction: [item[0].name, item[1].name],
        lineStyle: {
            width: width * ((item[0].value || item[1].value - data.slice(-1)[0][1].value) / (data[0][1].value - data.slice(-1)[0][1].value) + .05), //尾迹线条宽度
            opacity: .45, //尾迹线条透明度
            curveness: .6 * vary(item[0].value || item[1].value, [(data.slice(-1))[0][1].value, data[0][1].value]),
            color: getLinearGradient(0, 0, 0, 1, colorStops),
            barBorderRadius: 10,
        },
    })),
    emphasis: {
        lineStyle: {
            width
        }
    }
})