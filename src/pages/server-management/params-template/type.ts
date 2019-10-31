export interface IAddFormState {
    db_type: string,
    version: string,
    variable_name: string,
    default_value: any,
    valid_values: any,
    editable: boolean,
    description: string | null,
    editId: string | null
}

export interface ISearchFormData {
    search: string,
    dbtype: string,
    page?: number,
    page_size?: number
}

export interface ITableState {
    total: number,
    tableData: any[]
}

export interface IModalState {
    visible: boolean,
    loading: boolean
}