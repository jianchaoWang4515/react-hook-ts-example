import JSONSessionStorage from '@/utils/session-storage';
import { IGlobalState } from './type';
const breadcrumbList = JSONSessionStorage.getItem('crumb');

export const GlobalState: IGlobalState = {
    breadcrumbList: breadcrumbList || [],
    userInfo: null
} 
