export interface IModalState {
    visible: boolean,
    loading: boolean
}

export interface ITableState {
    data: any[],
    loading: boolean
}

export interface IAddFormState {
    username: string,
    user_type: string,
    databases: string,
    role: string[],
    owners: string,
    applications: string,
    tables: any[],
    status: string,
    password: string,
    remarks: string
}
