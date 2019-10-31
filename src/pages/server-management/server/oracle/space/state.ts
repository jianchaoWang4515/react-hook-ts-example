import { IAddFormState, IModalState, ITableState } from './type';
export const InitTableState: ITableState = {
    data: [],
    loading: false
}

export const InitModalState: IModalState = {
    visible: false,
    loading: false
}

export const InitAddFormState: IAddFormState = {
    tablespace_name: '',
    datafile: '',
    tablespace_size: ''
}