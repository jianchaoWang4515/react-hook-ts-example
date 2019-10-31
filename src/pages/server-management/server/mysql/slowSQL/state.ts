import { ITableState, ISearchState } from './type';
export const InitTableState: ITableState = {
    data: [],
    loading: false
}
export const InitSearchState: ISearchState = {
    time: undefined,
    page: 1,
    pageSize: 20,
    total: 0
}