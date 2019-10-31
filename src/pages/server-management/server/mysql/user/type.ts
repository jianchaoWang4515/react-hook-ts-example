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
    database_privilege: any[],
    owners: string,
    applications: string,
    status: string,
    password: string,
    remarks: string,
    mysql_host: string
}