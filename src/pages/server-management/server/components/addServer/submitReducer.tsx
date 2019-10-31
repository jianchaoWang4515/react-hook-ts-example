import { IState } from './type'
export function submitReducer(state: IState, action: any) {
    switch(action.type) {
        case 'submit':
            return {
                ...state,
                loading: true,
                error: '',
            }
        case 'success':
            return {
                ...state,
                loading: false,
            }
        case 'error':
            return {
                ...state,
                error: action.errorMsg || '',
                loading: false,
            }
        case 'reset':
                return {
                    ...state,
                    error: '',
                    loading: false,
                }
        default: 
            return state;
    }
}