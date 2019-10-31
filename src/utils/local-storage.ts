import { string } from "prop-types";

/**
 * @file 封装 localStorage
 */

const { localStorage } = window;

export default {
    /**
     * 设置一个值
     */
    setItem(key: string, value: any): void {
        localStorage.setItem(key, JSON.stringify(value));
    },

    /**
     * 获取一个值
     */
    getItem(key: string): any {
        const result: any = localStorage.getItem(key);
        return JSON.parse(result);
    },

    /**
     * 删除一个值
     */
    removeItem(key: string) {
        localStorage.removeItem(key);
    },

    /**
     * 清空所有值
     */
    clear() {
        localStorage.clear();
    }
};
