import Host from '@/pages/host';
import HostDetail from '@/pages/host/detail';

export default [{
    path: '/host',
    breadcrumbName: '主机管理',
    exact: true,
    component: Host,
    children: []
},{
    path: '/host/detail/:id',
    breadcrumbName: '主机详情',
    exact: true,
    component: HostDetail,
    children: []
}]