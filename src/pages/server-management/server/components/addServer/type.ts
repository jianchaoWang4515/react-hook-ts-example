export interface IState {
    loading: boolean,
    error: string
}

export interface IInstalledFormState {
    servicename?: string,
    dbtype?: string | number,
    framework?: number | null,
    service_version?: string,
    linkaddress?: string,
    port?: string,
    sid?: string,
    adminuser?: string,
    adminpassword?: string,
    schemas?: any[],
    remarks?: string,
    owners?: any[]
}

export interface IInstallFormState {
    servicename?: string,
    dbtype?: string | number,
    framework?: number | null,
    vip?: string,
    mysql_port?: string,
    oracle_port?: string,
    sid?: string,
    hostList?: any[],
    master_info?: string,
    slave_info?: string,
    owners?: any[]
}