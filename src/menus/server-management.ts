/**
 * 配置说明见src/menus.js
 */

import { DbList } from '@/pages/server-management/server/state';
 
// server 数据库详情的二级菜单有多种情况
// 0：Oracle、1：Mysql 后续可能会增加
const Model = Object.keys(DbList);

const OracleMenu = [{
   path: '/server/oracle/space',
   title: '表空间',
   isQuery: true,
   model: Model[0]
},{
   path: '/server/oracle/asm',
   title: 'ASM',
   isQuery: true,
   model: Model[0]
},{
   path: '/server/oracle/user',
   title: '数据库用户',
   isQuery: true,
   model: Model[0]
},{
   path: '/server/oracle/params',
   title: '参数管理',
   isQuery: true,
   model: Model[0]
},{
   path: '/server/oracle/lock',
   title: '锁等待',
   isQuery: true,
   model: Model[0]
},{
   path: '/server/oracle/report',
   title: '巡检报告',
   isQuery: true,
   model: Model[0]
}];

const MysqlMenu = [{
   path: '/server/mysql/db',
   title: '数据库',
   isQuery: true,
   model: Model[1]
},{
   path: '/server/mysql/user',
   title: '数据库用户',
   isQuery: true,
   model: Model[1]
},{
   path: '/server/mysql/params',
   title: '参数管理',
   isQuery: true,
   model: Model[1]
},{
   path: '/server/mysql/link',
   title: '数据库链接',
   isQuery: true,
   model: Model[1]
},{
   path: '/server/mysql/slowSQL',
   title: '慢SQL',
   isQuery: true,
   model: Model[1]
}]

const Server = [{
   title: '服务管理',
   icon: 'cloud-server',
   children: [{
       path: '/server',
       title: 'DB服务管理',
       twoLevel: [
           {
               path: `/server/info`,
               title: '基本信息',
               isQuery: true,
               model: [ ...Model ]
           },
           ...OracleMenu,
           ...MysqlMenu
       ]
   },{
       path: '/paramsTemplate',
       title: '参数模板',
   }]
}]

export default Server;
