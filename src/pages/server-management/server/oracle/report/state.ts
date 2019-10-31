import { ISearchData, ITableState } from './type';
export const InitTableState: ITableState = {
    data: [],
    loading: false
}

export const InitSearchData: ISearchData = {
    page: 1,
    page_size: 20
}