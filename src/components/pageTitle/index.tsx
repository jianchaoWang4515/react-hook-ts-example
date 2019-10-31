import React from 'react';
import { Icon } from 'antd';
import './index.less';

/**
 * isIcon 只有为false时不显示icon
 */
interface Iprops {
    isIcon?: any,
    icon?: string,
    title: string,
    className?: string,
    children?: React.ReactNode
}

function PageTitle(props: Iprops) {
    return (
        <div className="app-page-title p-b-8 clear-box">
            { props.isIcon !== false && <Icon type={props.icon || "environment"} />}
            <span className="title m-l-8">{props.title}</span>
            {props.children}
        </div>
    ) 
}

export default React.memo(PageTitle);
