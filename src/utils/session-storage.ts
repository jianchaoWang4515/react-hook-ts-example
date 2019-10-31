/**
 * @file 封装 sessionStorage
 */

const { sessionStorage } = window;

export default {
    /**
     * 设置一个值
     * @param {string} key - 键名
     * @param {*} value - 键值
     */
    setItem(key: string, value: any): void {
        sessionStorage.setItem(key, JSON.stringify(value));
    },

    /**
     * 获取一个值
     * @param {string} key - 键名
     * @returns {*} 键值
     */
    getItem(key: string): any {
        var result: any = sessionStorage.getItem(key);
        return JSON.parse(result);
    },

    /**
     * 更新一个对象的某个key值
     * @param {string} key - 键名
     * @returns {Object} newVal 新值
     */
    updateItem(key: string, newVal: any): void {
        let oldVal = this.getItem(key);
        this.setItem(key, { ...oldVal, ...newVal });
    },

    /**
     * 删除一个值
     * @param {string} key - 键名
     */
    removeItem(key: string): void {
        sessionStorage.removeItem(key);
    },

    /**
     * 清空所有值
     */
    clear(): void {
        sessionStorage.clear();
    }
};
