import { ITableState, IModalState, IAddFormState } from './type';
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
    databases: '',
    role: ['connect'],
    owners: '',
    applications: '',
    tables: [],
    status: '',
    password: '',
    remarks: ''
}

export const TableStatus = new Map([
    ['-1', '下线'],
    ['0', '正常'],
    ['1', '连接失败'],
    ['2', '创建中'],
])