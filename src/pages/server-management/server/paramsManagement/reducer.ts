import { ITableState } from './type';
export function tableReducer(state: ITableState, action: any) {
    switch (action.type) {
        case 'fetch':
          return {
              ...state,
              loading: true
          }
        case 'success':
            return {
                data: action.data,
                total: action.total,
                loading: false
            }
        case 'error':
                return {
                    ...state,
                    loading: false
                }
        default:
          return state;
      }
}