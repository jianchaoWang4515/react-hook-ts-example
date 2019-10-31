import { IModalState, IAddFormState, ITableState } from './type';
export const InitModalState: IModalState = {
    visible: false,
    loading: false
}

export const InitTableState: ITableState = {
    data: [],
    loading: false
}

export const InitAddFormState: IAddFormState = {
    username: '',
    user_type: '1',
    database_privilege: [],
    owners: '',
    applications: '',
    status: '',
    password: '',
    remarks: '',
    mysql_host: '%'
}

export const TableStatus = new Map([
    ['-1', '下线'],
    ['0', '正常'],
    ['1', '连接失败'],
    ['2', '创建中'],
])

export const UserType = new Map([
    ['0', '管理用户'],
    ['1', '普通用户'],
    ['2', '只读用户']
])