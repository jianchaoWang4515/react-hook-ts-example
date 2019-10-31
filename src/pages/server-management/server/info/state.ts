import { IServerInfoState, IAddFormState, IModalState } from './type';
export const InitServerInfoState: IServerInfoState = {
    serviceid: '',
    servicename: '',
    dbtype: '',
    framework: {},
    linkaddress: '',
    ownersList: [],
    port: '',
    sid: '',
    service_version: '',
    remarks: ''
}

export const InitAddFormState: IAddFormState = {
    host_id: '',
    port: '',
    sid: ''
}

export const InitModalState: IModalState = {
    visible: false,
    loading: false
}