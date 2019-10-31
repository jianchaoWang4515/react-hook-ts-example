import moment from 'moment';
export interface ITableState {
    data: any[],
    loading: boolean
}
export interface ISearchState {
    time?: undefined | [string, string],
    page?: number,
    pageSize?: number,
    total?: number,
    serverid?: string
}