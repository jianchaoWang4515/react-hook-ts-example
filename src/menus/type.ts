export interface ImenusBase {
    path?: string,
    title: string,
    icon?: string,
    id?: string,
    child?: string[],
    prtId?: string,
    model?: string[] | string,
    isQuery?: boolean
}

export interface ImenusTwoLevel extends ImenusBase {
    children?: ImenusBase[],
}

export interface ImenusChildren extends ImenusTwoLevel {
    twoLevel?: ImenusTwoLevel[]
}

export interface Imenus extends ImenusBase {
    children?: ImenusChildren[],
    twoLevel?: ImenusTwoLevel[]
}
