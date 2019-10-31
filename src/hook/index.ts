import { useContext, useEffect } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { GlobalContext } from '@/store';
import { UPDATE_BREADCRUMB } from '@/store/type';
import { transformNameKey } from '@/utils';
import routes from '@/routes';
import menus from '@/menus';
import { transformMenuNameKey } from '@/utils/menus';
const MenuPathKeyObj = transformMenuNameKey(menus, 'path');// path为key值的菜单对象
const MenuIdKeyObj = transformMenuNameKey(menus, 'id');// path为id值的菜单对象
/**
 * 路由变化时更新面包屑
 * @param { Object } props 页面组件props
 */
export function useAddBreadcrumb(props: RouteComponentProps) {
    const { dispatch } = useContext(GlobalContext);
    let routesKey: IAnyObj = {};// 以path为key的对象
    useEffect(() => {
        routesKey = transformNameKey(routes, 'path'); // 以path为key的对象
    }, [])
    useEffect(() => {
        let currentMenu = null;
        const { match, location } = props;
        const { path: matchPath, params } = match;
        const { search, pathname: path, state } = location;
        /**
         * 在面包屑中储存当前页面所属的菜单，用于获取二级菜单
         */
        for (const key in MenuPathKeyObj) {
            // 如果菜单path匹配到或者在child中存在储存当前菜单
            if (key === matchPath || 
            (MenuPathKeyObj[key].child && MenuPathKeyObj[key].child.includes(matchPath))
            ) {
                currentMenu = MenuPathKeyObj[key];
            }
        };
        dispatch({ 
            type: UPDATE_BREADCRUMB,
            breadcrumbList: {
                breadcrumbName: routesKey[matchPath].breadcrumbName,
                path,
                matchPath,
                params,
                search,
                state,
                prtMenu: MenuIdKeyObj[currentMenu.prtId] || null,
                menu: currentMenu
            }
        })
    }, [props.location]);
}