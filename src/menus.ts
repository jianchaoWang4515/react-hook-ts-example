import { Imenus } from '@/menus/type';
import { addMenuId } from '@/utils/menus';
import Home from '@/menus/home';
import Host from '@/menus/host';
import ServerManagement from '@/menus/server-management';
import TimedInspection from '@/menus/timed-inspection';
import TimedTask from '@/menus/timed-task';
import UserManagement from '@/menus/userManagement';
/**
 * 菜单数据
 * 不存在同一级中即存在children又存在twoLevel的场景
 * 所以在同一级不可以共存
 * {
 *    path: url,
 *    title: 菜单title,
 *    children: 下拉形态子菜单,
 *    twoLevel: 二级菜单,
 *    child: 没有独立菜单项的子页面,
 *    isQuery: 是否在点击菜单时把当前路由search与state带上,
 *    twoLevel[*].model: 根据history.state.model === twoLevel.model 来判断哪些二级菜单需要显示 不传则显示model为空值的菜单
 * }
 */

const menus: Imenus[] = [
    ...Home,
    ...Host,
    ...ServerManagement,
    ...TimedInspection,
    ...TimedTask,
    ...UserManagement
]

export default addMenuId(menus);
