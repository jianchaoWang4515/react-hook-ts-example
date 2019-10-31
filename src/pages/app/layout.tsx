import React, { useState, useContext, useEffect, useCallback, ReactNode } from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { ImenusTwoLevel } from '@/menus/type';
import './index.less';
import { Layout, Icon } from 'antd';
import { Menu,AppHeader } from '@/components';

import { GlobalContext } from '@/store';
const { Header, Content, Sider } = Layout;

interface Iprops extends RouteComponentProps {
    children?: ReactNode,
    menus: any[]
}

function MyLayout(props: Iprops) {
    const { state, dispatch } = useContext(GlobalContext);
    const { breadcrumbList } = state;
    const [twoLevelMenu, setTwolevelMenu] = useState<ImenusTwoLevel[]>([]);
    const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
    const [collapsed, setCollapsed] = useState<boolean>(false); 

    const updateTwoLevelMenu = useCallback(() => {
        const newTwoLevelMenu: ImenusTwoLevel[] = getTwoLevelMenu();
        const newSelectedKeys = getSelectedKeys(breadcrumbList[breadcrumbList.length - 1]);
        setTwolevelMenu(newTwoLevelMenu);
        setCollapsed(newTwoLevelMenu.length > 0);
        setSelectedKeys(newSelectedKeys);
    },[breadcrumbList])

    useEffect(() => {
        updateTwoLevelMenu();
    }, [updateTwoLevelMenu])
    
    function toggle() {
        setCollapsed(!collapsed);
    }

    /**
     * 根据当前路由prtId 判断有无二级菜单 有则显示
     */
    function getTwoLevelMenu (): ImenusTwoLevel[] {
        let twoLevelMenu: ImenusTwoLevel[] = [];
        const currentLocationState = props.location.state || {};
        const { model = '' } = currentLocationState;
        if (breadcrumbList && breadcrumbList.length) {
            const { menu: currenMenu, prtMenu } = breadcrumbList[breadcrumbList.length - 1];
            if (currenMenu.prtId !== '-1') {
                if (prtMenu.twoLevel) {
                    if (model) {
                        // 菜单中model存在且与location中的model相同的菜单
                        prtMenu.twoLevel.forEach((item: any) => {
                            if (item.model) {
                                if (item.model === model || 
                                    (Array.isArray(item.model) && item.model.includes(model))
                                    ) {
                                    twoLevelMenu.push(item)
                                }
                            }
                        });
                    } else {
                        // model不存在的菜单
                        prtMenu.twoLevel.forEach((item: any) => {
                            if (!item.model) {
                                twoLevelMenu.push(item)
                            }
                        });
                    }
                }
            }
        }
        return twoLevelMenu;
    }

    function getPrtId(arr:string[], id: string) {
        arr.unshift(id)
        let index = id.lastIndexOf('-');
        let prtId = id.substr(0, index);
        if (prtId.indexOf('-') > 0) {
            getPrtId(arr, prtId);
        } else if (prtId) {
            arr.unshift(prtId);
        }
    }

    /**
     * 获取需要高亮显示的菜单keys
     */
    function getSelectedKeys(currentRoute: any): string[] {
        const selectedKeys: string[] = [];
        if (currentRoute) {
            const currentMenuId = currentRoute.menu.id;
            getPrtId(selectedKeys, currentMenuId);
        }
        return selectedKeys;
    }
    return (
        <Layout className="app-layout">
            <Sider style={{ background: '#fff'}} trigger={null} collapsible collapsed={collapsed}>
                <div className={`app-title ${collapsed ? 'hidden' : ''}`}>Forrest</div>
                <Menu selectedKeys={selectedKeys} menus={props.menus}></Menu>
            </Sider>
            <Layout>
                <Header style={{ position: 'fixed', zIndex: 99, background: 'rgb(52, 61, 80)'}}>
                    <Icon
                        className="trigger menu-toggle"
                        type={collapsed ? 'menu-unfold' : 'menu-fold'}
                        onClick={toggle}
                    />
                    <AppHeader breadcrumbList={breadcrumbList} userInfo={state.userInfo} global={{state, dispatch}}></AppHeader>
                </Header>
                <Content style={{ marginTop: 64 }}>
                    <Layout className="app-layout_main">
                        { twoLevelMenu.length > 0 &&
                            <Sider className="app-layout_main-aside">
                                <Menu  selectedKeys={selectedKeys} menus={twoLevelMenu}></Menu>
                            </Sider>
                        }
                        <Content className="app-layout_main-content">
                            { props.children }
                        </Content>
                    </Layout>
                </Content>
            </Layout>
        </Layout>
    )
}

export default withRouter(MyLayout);
