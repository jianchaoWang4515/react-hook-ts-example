export interface IModalState {
    visible: boolean,
    loading: boolean
}

export interface ITableState {
    data: any[],
    loading: boolean
}

export interface IAddFormState {
    databasename?: string,
    charcter?: string,
    collate?: string
}