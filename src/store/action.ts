import {
    UPDATE_BREADCRUMB,
    UPDATE_USER_INFO
} from './type';
import { IGlobalState } from './type';
import JSONSessionStorage from '@/utils/session-storage';

export const GlobalReducer = (state: IGlobalState, action: any) => {
    switch(action.type) {
        /**
         * 更新面包屑
         */
    case UPDATE_BREADCRUMB:
        const { menu: currentMenu, prtMenu }  = action.breadcrumbList;
        let breadcrumbList = [ ...state.breadcrumbList ];
        if ((currentMenu.prtId === '-1' && (!currentMenu.child || (currentMenu.child && !currentMenu.child.includes(action.breadcrumbList.matchPath))))
            || (prtMenu && prtMenu.prtId === '-1' && !prtMenu.path)) {
            // 选中菜单根节点且不是无菜单的子页面 或 下拉形式的顶级菜单时清空面包屑列表
            breadcrumbList = [];
        } else {
          let INDEX = 0; // 同级菜单索引
          breadcrumbList.forEach((item,index) => {
            if (
                item.menu.prtId === currentMenu.prtId &&
                (
                  !item.menu.child || 
                  (
                    item.menu.child && !item.menu.child.includes(action.breadcrumbList.matchPath)
                  ) || item.matchPath === action.breadcrumbList.matchPath
                )
              ) {
                // 访问的页面与面包屑中其中一个属于同一个菜单项且不为他的child页面或者访问的是面包屑中存在的页面
              INDEX = index;
            };
          });
          if (INDEX > 0) {
            // 如果存在同级菜单索引 清除同级菜单及后面的面包屑
            breadcrumbList = breadcrumbList.filter((item, index) => index < INDEX);
          };
        };
        breadcrumbList.push(action.breadcrumbList);
        JSONSessionStorage.setItem('crumb', [ ...breadcrumbList ]);
        return { ...state, ...{ breadcrumbList } };
      case UPDATE_USER_INFO:
        // 更新登录人的用户信息
        return { ...state, userInfo: action.userInfo }
      default:
        return state  
    }
  }
