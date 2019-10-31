/**
 * 配置详情见src/menus.js
 */

const Host = [{
    path: '/host',
    title: '主机管理',
    icon: 'laptop',
    child: [
        '/host/detail/:id'
    ]
}];

export default Host;
