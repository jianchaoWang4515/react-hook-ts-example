import { IState, IInstallFormState, IInstalledFormState } from './type'

export const InitState: IState = {
    loading: false,
    error: ''
}

// 添加已安装服务表单数据
export const InitInstalledFormState: IInstalledFormState = {
    servicename: '',
    dbtype: '0',
    framework: undefined,
    service_version: '',
    linkaddress: '',
    port: '',
    sid: '',
    adminuser: '',
    adminpassword: '',
    schemas: [],
    remarks: '',
    owners: []
}

// 安装服务表单数据
export const InitInstallFormState: IInstallFormState = {
    servicename: '',
    dbtype: '0',
    framework: undefined,
    vip: '',
    mysql_port: '',
    oracle_port: '',
    sid: '',
    hostList: [],
    master_info: '',
    slave_info: '',
    owners: []
}