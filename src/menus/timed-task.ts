/**
 * 配置详情见src/menus.js
 */

const TimedTask = [{
    title: '定时任务',
    icon: 'clock-circle',
    children: [{
        path: '/timed-task-list',
        title: '任务列表'
    },{
        path: '/timed-task-cycle',
        title: '周期任务'
    },{
        path: '/timed-task',
        title: '定时任务'
    }],
    child: [
    ]
}];

export default TimedTask;
