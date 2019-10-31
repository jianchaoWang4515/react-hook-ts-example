import { IState } from './type';
export function stateReducer(state: IState, action: any) {
    switch (action.type) {
        case 'fetch':
          return {
              ...state,
              loading: true
          }
        case 'success':
            return {
                data: action.data,
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