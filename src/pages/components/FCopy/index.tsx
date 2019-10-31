import React from 'react';
import { Icon, message, Tooltip } from 'antd';
import { AbstractTooltipProps } from 'antd/lib/tooltip';
import './index.less';
import ClipboardJS from 'clipboard';

interface IProps {
    isTooltip?: boolean, // 是否显示Tooltip
    bodyStyle?: HTMLStyleElement,
    TooltipProps?: AbstractTooltipProps
    children?: string
}

const CLIPBOARD = new ClipboardJS('.f-copy-btn');
CLIPBOARD.on('success', function(e: any) {
    message.success('复制成功');
    e.clearSelection();
});

function FCopy(props: IProps) {
    const { children = '', bodyStyle = {}, isTooltip, TooltipProps = {} } = props;

    return (
        <>
            {isTooltip && (
                <Tooltip title={children} {...TooltipProps}>
                   <div className='f-copy' style={{ width: '100%', ...bodyStyle }}>
                        {children}
                        <Tooltip title="复制">
                            <Icon className="f-copy-btn" type="copy" data-clipboard-text={children}/>
                        </Tooltip>
                    </div>
                </Tooltip>
            )}
            {!isTooltip && (
                <div className='f-copy' style={{ width: '100%', ...bodyStyle }}>
                    {children}
                    <Icon className="f-copy-btn" type="copy" data-clipboard-text={children}/>
                </div>
            )}
        </>
    )
}

export default React.memo(FCopy);
