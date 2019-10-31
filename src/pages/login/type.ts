export interface ILoginState {
    username: string,
    password: string,
    rememberMe: boolean,
    loading: boolean
}

export interface Ireducer extends ILoginState {
    error?: string
}
