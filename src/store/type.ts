import { Imenus } from '@/menus/type';

const UPDATE_BREADCRUMB = 'UPDATE_BREADCRUMB';
const UPDATE_USER_INFO = 'UPDATE_USER_INFO';

export { UPDATE_BREADCRUMB, UPDATE_USER_INFO };

/**
 * 面包屑
 * {
 *    breadcrumbName: 名称
 *    params: url参数
 *    search: hash,
 *    state: {},
 *    matchPath,
 *    path,
 *    menu: 所属菜单项数据
 * }
 */
export interface IBreadcrumbList {
    breadcrumbName: string,
    params: object,
    search: string,
    state: object,
    matchPath: string,
    path: string,
    menu: Imenus,
    prtMenu: Imenus
}

export interface IGlobalState {
    breadcrumbList: IBreadcrumbList[],
    userInfo: object | null
}

export interface IGlobalReducer {
    type: 'UPDATE_BREADCRUMB' | 'UPDATE_USER_INFO',
    breadcrumbList: IBreadcrumbList,
    userInfo: object | null
}
