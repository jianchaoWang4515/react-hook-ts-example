export interface IHostInfo {
    hostname: string,
    admin_user: string,
    ip: string,
    admin_password: string,
    port: string,
    os_cpu: string,
    os_mem: string,
    os_kernel: string,
    os_version: string
}

export interface IHostBaseInfo {
    ansible_uptime_seconds: number | null,
    ipv4Addresses: string,
    ansible_processor_count: string,
    ansible_processor: string,
    ansible_mounts: any[],
    ansible_devices: any[]
}

export interface IState {
    hostInfo: IHostInfo,
    hostBaseInfo: IHostBaseInfo,
    diskMount: any[],
    diskInfo: any[]
}