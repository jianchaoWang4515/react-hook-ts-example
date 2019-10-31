import { IAddFormState, IModalState } from './type';
export function submitReducer(state: IAddFormState, action: any) {
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

export function modalReducer(state: IModalState, action: any) {
    switch (action.type) {
        case 'submit':
          return {
              ...state,
              loading: true
          }
        case 'success':
            return {
                visible: false,
                loading: false
            }
        case 'error':
                return {
                    ...state,
                    loading: false
                }
        case 'change':
                return {
                    ...state,
                    visible: !state.visible
                }
        default:
          return state;
      }
}
