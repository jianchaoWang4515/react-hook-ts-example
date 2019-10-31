import { AxiosRequestConfig, AxiosResponse } from 'axios';

export interface IReqConf extends AxiosRequestConfig {
    cancelName?: string
}

export interface IResConf extends AxiosResponse {
    config: IReqConf
}
