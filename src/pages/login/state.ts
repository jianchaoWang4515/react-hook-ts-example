import JSONLocalStorage from '@/utils/local-storage';
import { ILoginState } from './type';

export function InitLoginState(): ILoginState {
    const { username = '', password = '', rememberMe = false } = JSONLocalStorage.getItem('loginForm') || {};
    return {
        username,
        password,
        rememberMe,
        loading: false
    }
};