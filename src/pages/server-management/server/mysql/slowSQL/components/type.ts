export interface IState {
    data: any[],
    loading: boolean
}

export interface IData extends IAnyObj {
    checksum: string
}
export interface IProps {
    serverid: string,
    data: IData | undefined
}