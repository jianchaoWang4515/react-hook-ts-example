import React, { useEffect, useState } from 'react';
import { Imenus } from '@/menus/type';
import { Menu, Icon } from 'antd';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import JSONSessionStorage from '@/utils/session-storage';
import { transformMenuNameKey } from '@/utils/menus';
import H from 'history';
const { SubMenu } = Menu;

interface Iprops extends RouteComponentProps {
    menus: Imenus[],
    selectedKeys: string[]
  }
const AppMenu = (props: Iprops) => {
    const [menuIdKeyObj, setMenuIdKeyObj] = useState<any>({});
    useEffect(() => {
        setMenuIdKeyObj(transformMenuNameKey(props.menus, 'id'));
    }, [props.menus])
    function goTo(item: any, location: H.Location) {
        const { path:pathname } = item;
        const { search, state } = location;
        // isQuery为真跳转时携带search与state
        props.history.push({
            pathname,
            search: item.isQuery ? search : '',
            state: item.isQuery ? state : {},
        });
        // 点击跟菜单清空历史数据
        if (item.prtId === '-1' || (menuIdKeyObj[item.prtId] && menuIdKeyObj[item.prtId].prtId === '-1')) {
            JSONSessionStorage.setItem('history', {});
        }
    }
    return (
        <Menu
                mode="inline"
                selectedKeys={props.selectedKeys}
            >
            {props.menus.map((item) => {
                if (!item.children || !item.children.length) {
                    return <Menu.Item key={item.id} onClick={e => goTo(item, props.location)}>
                                    { item.icon && 
                                        <Icon type={item.icon} />
                                    }
                                    <span>
                                        {item.title}
                                    </span>
                            </Menu.Item>
                } else {
                    return <SubMenu
                            key={item.id}
                            title={
                                <span>
                                    <Icon type={item.icon} />
                                    <span>{item.title}</span>
                                </span>
                            }
                        >
                            {item.children.map((ele: any) => {
                                return <Menu.Item key={ele.id}  onClick={e => goTo(ele, props.location)}>{ele.title}</Menu.Item>
                            })}
                    </SubMenu>
                }
            })}
        </Menu>
    )
}

export default withRouter(React.memo(AppMenu));
