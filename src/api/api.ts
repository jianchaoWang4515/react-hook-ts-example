import { AxiosRequestConfig } from 'axios';
export declare namespace IApi {
    interface ILogin {
        username: string;
        password: string;
    }
    namespace host {
        interface list extends AxiosRequestConfig {
            params?: {
                search: string,
                servermode: string,
                servertype: string,
                page: number,
                page_size: number
            }
        }
        interface detailInfo extends AxiosRequestConfig {
            params?: {
                refresh?: boolean
            }
        }
    }
    
}