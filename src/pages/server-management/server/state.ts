import JSONSessionStorage from '@/utils/session-storage';
import { RouteComponentProps } from 'react-router-dom';
import { IDbList, ITableState, ISearchFormData } from './type';

export const InitTableState: ITableState = {
    total: 0,
    tableData: []
};

export function InitSearchFormData(props: RouteComponentProps): ISearchFormData {
    const { search = '', dbtype = '-1', schemaip = '', page = 1 } = JSONSessionStorage.getItem('history')[props.match.path] || {};
    return {
        search,
        dbtype,
        schemaip,
        page,
        page_size: 10
    }
}

// 数据库类型
export const DbList: IDbList = {
    '0': 'Oracle',
    '1': 'Mysql',
    '2': 'SQL Server',
    '3': 'MongoDB',
    '4': 'PostgreSQL'
}
