import React from 'react';
import { message, Dropdown, Menu, Icon } from 'antd';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import Breadcrumb from '../breadcrumb';
import { IBreadcrumbList } from '@/store/type';
import './index.less';

interface Iprops extends RouteComponentProps {
  global: any,
  userInfo: any,
  breadcrumbList: IBreadcrumbList[]
}

const appHeader = (props: Iprops) => {
  function Logout() {
    sessionStorage.setItem('sessionToken', '');
    props.global.dispatch({ type: 'UPDATE_USER_INFO', userInfo: null});
      message.success('登出成功');
      props.history.push('/login');
  }
  function onClick({ key }: any) {
    if (key === '1') {
      Logout();
    }
  }
  return (
    <header>
        <Dropdown overlay={(
            <Menu onClick={onClick}>
              <Menu.Item key="1">登出</Menu.Item>
            </Menu>
          )}>
          <div className="user-info cursor-p">
            <img alt="" className="user-info__avatar" src="http://5b0988e595225.cdn.sohucs.com/images/20171030/26ed195281334ba4b1752394b60eb29a.jpeg"></img> 
            <span>{props.userInfo.username}</span>  
            <Icon type="down" className="m-l-8"/>
          </div> 
        </Dropdown>
        <Breadcrumb breadcrumbList={props.breadcrumbList}/>
    </header>
  )
}

export default withRouter(React.memo(appHeader));
