export interface IServerInfoState {
    serviceid?: string,
    servicename?: string,
    dbtype?: string,
    framework?: IAnyObj,
    linkaddress?: string,
    ownersList?: any[],
    owners?: any[], 
    port?: string,
    sid?: string,
    service_version?: string,
    remarks?: string
}

export interface IAddFormState {
    host_id: string,
    port: string,
    sid: string
}

export interface IModalState {
    visible: boolean,
    loading: boolean
}