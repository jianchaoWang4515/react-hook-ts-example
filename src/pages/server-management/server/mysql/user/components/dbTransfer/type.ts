import React from 'react';
import { RadioChangeEvent } from 'antd/lib/radio/interface';
import { CheckboxChangeEvent } from 'antd/lib/checkbox/Checkbox';

export type dataSource<T> = T[]
export type onSelect<T> = (e: CheckboxChangeEvent, item: T) => void;
export type onDel<T> = (item: T) => void;
export type onAuthChange<T> = (e: RadioChangeEvent, item: T) => void;

export interface IState {
    data: any[]
}

export default interface IProps<T> {
    dataSource: dataSource<T>,
    keyname?: string,
    title?: string,
    sellectedAll?: any[],
    onSelect?: onSelect<T>,
    onDel?: onDel<T>,
    onAuthChange?: onAuthChange<T>,
    listStyle?: React.CSSProperties,
    children?: any
}
