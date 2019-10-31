import React from 'react';
import './index.less';
import { Breadcrumb } from 'antd';
import { Link } from 'react-router-dom';
import { IBreadcrumbList } from '@/store/type';

interface Iprops {
  breadcrumbList: IBreadcrumbList[]
}

function appBreadcrumb(props: Iprops) {
    const { breadcrumbList } = props;
    return (
        <Breadcrumb className="app-breadcrumb">
          {breadcrumbList.map((crumb,index) => {
            const { breadcrumbName, path, search, state } = crumb;
              return <Breadcrumb.Item key={index}>
                      <Link to={{pathname: path, search, state}}>{breadcrumbName}</Link>
                    </Breadcrumb.Item>
          })}
        </Breadcrumb>
    )
}

export default React.memo(appBreadcrumb);