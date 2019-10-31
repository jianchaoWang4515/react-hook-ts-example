import { IModalState, ITableState, IAddFormState } from './type';

export const InitModalState: IModalState = {
    visible: false,
    loading: false
}

export const InitTableState: ITableState = {
    data: [],
    loading: false
}

export const InitAddFormState: IAddFormState = {
    databasename: '',
    charcter: '',
    collate: ''
}