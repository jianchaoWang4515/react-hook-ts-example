export interface IDbList {
    '0': 'Oracle',
    '1': 'Mysql',
    '2': 'SQL Server',
    '3': 'MongoDB',
    '4': 'PostgreSQL',
    [key: string]: any
}

export interface ITableState {
    total?: number,
    tableData?: any[]
}

export interface ISearchFormData {
    search?: string,
    dbtype?: string,
    schemaip?: string,
    page?: number,
    page_size?: number
}