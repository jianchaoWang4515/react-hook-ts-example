import JSONSessionStorage from '@/utils/session-storage';
import { RouteComponentProps } from 'react-router-dom';
import { DbList } from '../server/state';
import { IDbList } from '../server/type';
import { IAddFormState, ISearchFormData, ITableState, IModalState } from './type';
export const InitTableState: ITableState = {
    total: 0,
    tableData: []
};

export function InitSearchFormData(props: RouteComponentProps): ISearchFormData {
    const { search = '', dbtype = '-1', page = 1 } = JSONSessionStorage.getItem('history')[props.match.path] || {};
    return {
        search,
        dbtype,
        page,
        page_size: 10
    }
}

export const InitModalState: IModalState = {
    visible: false,
    loading: false
}

export const InitAddFormState: IAddFormState = {
    db_type: '0',
    version: '',
    variable_name: '',
    default_value: '',
    valid_values: '',
    editable: false,
    description: null,
    editId: null
}

// 数据库类型
export const dbList: IDbList = { ...DbList };
