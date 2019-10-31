import { ILoginState, Ireducer } from './type';

export function submitReducer(state: ILoginState, action: any): any {
    switch(action.type) {
        case 'login':
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
        default: 
            return state;
    }
}