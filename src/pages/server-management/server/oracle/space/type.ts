export interface ITableState {
    data: any[],
    loading: boolean
}

export interface IModalState {
    visible: boolean,
    loading: boolean
}

export interface IAddFormState {
    tablespace_name: string,
    datafile: string,
    tablespace_size: string
}