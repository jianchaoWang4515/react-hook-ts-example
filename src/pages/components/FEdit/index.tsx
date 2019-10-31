import React, { useState, useRef } from 'react';
import './index.less';
import { Icon, Input, Select, Popconfirm } from 'antd';
import { SelectProps } from 'antd/lib/select';
interface IProps {
    type?: 'input' | 'select' | undefined,
    defaultValue?: any,
    onOk?: (x: React.InputHTMLAttributes<HTMLInputElement> | IProps, y: any) => void,
    onEdit?: () => void,
    onPressEnter?: (x: any, y: any) => void,
    onBlur?: (x: any, y: any) => void,
    dropdownRender?: (menu?: React.ReactNode, props?: SelectProps) => React.ReactNode,
    isPop?: boolean, // 是否需要Popconfirm
    isEditShow?: boolean, // 是否展示修改按钮
    opt?: any, // select或input其他属性
    children?: React.ReactNode
}
function FEdit(props: IProps) {
    let isOk = false;
    let isCancel = false;
    const inputEl = useRef<any>(null);
    const {
        type = 'input',
        defaultValue = '-',
        onOk: dOnOk = false,
        onEdit: dOnEdit = false,
        onPressEnter: dOnPressEnter = false,
        onBlur: dOnBlur = false,
        dropdownRender,
        isPop = false,
        opt = {},
        isEditShow = true
    } = props;
    const [isEdit, setIsEdit] = useState(false);
    function onEdit() {
        if (dOnEdit) dOnEdit();
        setIsEdit(true);
        setTimeout(() => {
            if (inputEl && inputEl.current) {
                inputEl.current.focus();
            }
        });
    }
    function onBlur(e: any) {
        const { target = {} } = e
        setTimeout(() => {
            // isOk和isCancel解决失焦事件与外部点击事件冲突问题
            if (!isOk && !isCancel && dOnBlur) {
                new Promise(resolve => {
                    if (type === 'select') {
                        dOnBlur(props, resolve);
                    } else {
                        dOnBlur(target, resolve);
                    }
                }).then(() => {
                    setIsEdit(false);
                })
            }
        }, 200)
    }
    function onPressEnter(e: any) {
        new Promise(resolve => {
            if (dOnPressEnter) dOnPressEnter(e.target, resolve);
        }).then(() => {
            setIsEdit(false);
        })
    }
    function onOk(e: any) {
        isOk = true;
        new Promise(resolve => {
            if (dOnOk) {
                if (type === 'select') {
                    dOnOk(props, resolve);
                } else {
                    if (dOnOk) dOnOk(e.current.input, resolve);
                }
            }
        }).then(() => {
            setIsEdit(false);
            setTimeout(() => {
                isOk = false;
            }, 300);
        });
    }
    function onCancel() {
        isCancel = true;
        setIsEdit(false);
        setTimeout(() => {
            isCancel = false;
        }, 300);
    }
    return (
        <div className="f-edit"> 
            {isEdit && (
                <>
                    {type === 'select' && (
                        <>
                            <Select ref={inputEl} style={{ minWidth: '150px' }}
                                dropdownRender={dropdownRender}
                                onPressEnter={onPressEnter}
                                {...opt}
                            >
                                {props.children}
                            </Select>
                            {isPop && (
                                <Popconfirm
                                    title="确定修改吗?"
                                    cancelText="取消"
                                    okText="确定"
                                    onCancel={(e: any) => e.stopPropagation()}
                                    onConfirm={() => onOk(inputEl)}>
                                    <Icon className="m-l-8 edit-active" style={{ color: 'green' }} type="check" />
                                </Popconfirm>
                            )}
                            {!isPop && (
                                <Icon className="m-l-8 edit-active" style={{ color: 'green' }} type="check" onClick={() => onOk(inputEl)} />
                            )}
                            <Icon className="m-l-8 edit-active" style={{ color: 'red' }} type="close" onClick={onCancel} />
                        </>
                    )}
                    {type !== 'select' && (
                        <>
                            <Input ref={inputEl} style={{ width: 'auto' }} {...opt} onBlur={onBlur} onPressEnter={onPressEnter} />
                            {isPop && (
                                <Popconfirm
                                    title="确定修改吗?"
                                    cancelText="取消"
                                    okText="确定"
                                    onCancel={(e: any) => e.stopPropagation()}
                                    onConfirm={() => onOk(inputEl)}>
                                    <Icon className="m-l-8 edit-active" style={{ color: 'green' }} type="check" />
                                </Popconfirm>
                            )}
                            {!isPop && (
                                <Icon className="m-l-8 edit-active" style={{ color: 'green' }} type="check" onClick={() => onOk(inputEl)} />
                            )}
                            <Icon className="m-l-8 edit-active" style={{ color: 'red' }} type="close" onClick={onCancel} />
                        </>
                    )}
                </>
            )}
            {!isEdit && (
                <>
                    <span>{defaultValue || '-'}</span>
                    {isEditShow && (
                        <a href="javascript:;" className="m-l-16" onClick={onEdit}>
                            <Icon type="edit" />
                        </a>
                    )}
                </>
            )}
        </div>
    )
}

export default React.memo(FEdit);
