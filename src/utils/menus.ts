import { clone } from './index';
/**
 * 动态向菜单数据增加有层级结构的id
 * {
 *  id: 1,
 *  prtId: -1,
 *  children:[{
 *      id: 1-1,
 *      prtId: 1,
 *  }]
 * }
 * @param { String } menu 菜单数据
 * @return { Array } 增加id唯一值后的菜单
 */
export interface Imenu {
    id?: number | string,
    prtId?: string,
    children?: Imenu[],
    twoLevel?: Imenu[]
}
export const addMenuId = function (menu: Imenu[]) {
    let arr = clone(menu);
    function transform (data: Imenu[], prev = '') {
        for (let i = 0; i < data.length; i++) {
            const item = data[i];
            if (!prev) {
                item.id = `${i + 1}`;
                item.prtId = '-1';
            } else {
                item.id = `${prev}-${i + 1}`;
                item.prtId = prev;
            };
            if (item.children && item.children.length) {
                transform(item.children, item.id);
            } else if (item.twoLevel && item.twoLevel.length) {
                transform(item.twoLevel, item.id);
            }
        };
    };
    transform(arr);
    return arr;
};

/**
 * 多维数据转为以keyName字段为key值的对象
 * @param { Array } tree 多维结构数据
 * @param { String } keyName 选做为key的字段
 * @return { Object } keyName为key值的对象
 */
export const transformMenuNameKey = function (tree: any[], keyName: any) {
    const myTree = clone(tree);
    interface IObj {
        [key: string]: any
    }
    let obj: IObj = {};
    function transform (data: any[]) {
        for (let i = 0; i < data.length; i++) {
            let item = data[i];
            if (item[keyName] && !obj[item[keyName]]) obj[item[keyName]] = item;
            if ((item.children && item.children.length)) {
                transform(item.children);
            } else if (item.twoLevel && item.twoLevel.length) transform(item.twoLevel);
        };
    }
    transform(myTree);
    return obj;
};