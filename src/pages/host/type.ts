
export interface IState {
    total: number,
    tableData: any[]
}

export interface ISearchForm {
    search: string,
    servermode: string,
    servertype: string,
    page: number,
    page_size: number
}