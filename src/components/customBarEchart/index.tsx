/// <reference path="./index.d.ts" />
import React, { useState, useEffect } from 'react';
import './index.less';

function CustomBarEcharts(props: CustomBarEcharts.IProps) {
    const color: string[] = ['#c23531','#2f4554', '#61a0a8', '#d48265', '#91c7ae','#749f83',  '#ca8622', '#bda29a','#6e7074', '#546570', '#c4ccd3'];
    const { titleText = "", data = {} } = props;
    const [maxNum, setMaxNum] = useState<number>(0);

    useEffect(() => {
        setMaxNum(getMaxNum(data));
    }, [data])

    function getMaxNum(data: CustomBarEcharts.IPropsData): number {
        let nums = [];
        for (const key in data) {
            let item = data[key];
            for (const key2 in item) {
                nums.push(item[key2])
            }
        }
        if (!nums.length) return 0;
        return Math.max(...nums);
    }
    return (
        <div className="f-chart">
            <div className="title">{titleText}</div>
            <div className="grid app-flex">
                {Object.keys(data).map((item,index) => (
                    <div className="grid-item  app-flex-1" key={index}>
                        <div className="grid-item__bar app-flex" app-mode='y' app-align='right'>
                            {Object.keys(data[item]).map((el,j) => (
                                <div style={{height: maxNum > 0 ?  `${data[item][el] / (maxNum + 10) * 100}%` : 0, backgroundColor: color[j]}} className="grid-item__bar-item app-flex-1" key={j}>
                                    <span className="label" style={{color: color[j]}}>{el}({data[item][el]})</span>
                                </div>
                            ))}
                        </div>
                        <div className="grid-item__label">{item}</div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export { CustomBarEcharts };