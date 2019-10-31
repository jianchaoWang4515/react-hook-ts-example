import React, { useEffect } from 'react';
import echarts from 'echarts';

export interface IPieEchartsData {
    titleText?: string,
    data?: number[]
}

export interface IProps {
    data: [IPieEchartsData, IPieEchartsData],
    el: string
}

function PieEcharts(props: IProps) {
    const { data = [], el = '' } = props;

    interface optionCommon {
        title: echarts.EChartTitleOption,
        tooltip: echarts.EChartOption.Tooltip,
        legend: echarts.EChartOption.Legend,
        series: echarts.EChartOption.SeriesPie
    }
    const optionCommon: optionCommon = {
        title: {
            top: '3%',
            textAlign: 'center',
            textStyle: {
                fontWeight: '400'
            }
        },
        tooltip: {
            trigger: 'item'
        },
        legend: {
            bottom: '10%',
            left: 'center'
        },
        series: {
            type: 'pie',
            radius : '40%',
            labelLine: {
                length2: 0
            }
        }
    }
    useEffect(() => {
        let ele: any = document.getElementById(el);
        let myChart = echarts.init(ele);
        function resize() {
            myChart.resize({
                width: 'auto'
            })
        }
        window.addEventListener('resize', resize);
        // 指定图表的配置项和数据
        let option: echarts.EChartOption = {
            title: [{
                ...optionCommon.title,
                text: data[0].titleText || '',
                left: '25%'
            }, {
                ...optionCommon.title,
                text: data[1].titleText || '',
                left:'75%'
            }],
            tooltip: {
                ...optionCommon.tooltip,
            },
            legend: {
                ...optionCommon.legend
            },
            series: [
                {
                    ...optionCommon.series,
                    name: '用户',
                    center: ['25%', '50%'],
                    tooltip: {
                        formatter: "{b} <br/>用户数 : {c} ({d}%)"
                    },
                    data: data[0].data,
                },
                {
                    ...optionCommon.series,
                    name: '数据库',
                    center: ['75%', '50%'],
                    data: data[1].data,
                    tooltip: {
                        formatter: "{b} <br/>数量 : {c} ({d}%)"
                    }
                }
            ]
        };
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
        resize()
        return () => {
            window.removeEventListener('resize', resize)
        }
    }, [data, el]);
    
    return (
        <div id={el} style={{height: '100%'}}></div>
    )
}

export { PieEcharts };