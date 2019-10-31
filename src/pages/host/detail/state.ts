import { IState } from './type';
export const InitState: IState = {
    hostInfo: {
        hostname: '',
        admin_user: '',
        ip: '',
        admin_password: '******',
        port: '',
        os_cpu: '',
        os_mem: '',
        os_kernel: '',
        os_version: ''
    },
    hostBaseInfo: {
        ansible_uptime_seconds: null,
        ipv4Addresses: '',
        ansible_processor_count: '',
        ansible_processor: '',
        ansible_mounts: [],
        ansible_devices: []
    },
    diskMount: [],
    diskInfo: []
}
