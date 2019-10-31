import qs from 'qs';

/**
 * 克隆一个对象
 * @param {object|array} obj 要克隆的对象
 * @returns {object|array} 克隆后的对象
 */
export const clone = (obj: object | []) => {
    if (obj && typeof obj === 'object') {
        return JSON.parse(JSON.stringify(obj));
    }
    return obj;
};

/**
 * 多维数据转为以keyName字段为key值的对象
 * @param { Array } tree 多维结构数据
 * @param { String } keyName 选做为key的字段
 * @return { Object } keyName为key值的对象
 */
export const transformNameKey = function (tree: IAnyObj[] = [], keyName: any) {
    const myTree = clone(tree);
    let obj: IAnyObj = {};
    function transform (data: IAnyObj[]) {
        for (let i = 0; i < data.length; i++) {
            let item = data[i];
            if (!obj[item[keyName]]) obj[item[keyName]] = item;
            if (item.children && item.children.length) {
                transform(item.children);
            };
        };
    }
    transform(myTree);
    return obj;
};

/**
 * 序列化
 * @param {Object} params 需要序列化的对象
 */
export const stringify = function (params: any) {
    let data: any = {};
    // 为空值则不序列化
    for (const key in params) {
        if (params[key] !== '') {
            data[key] = params[key];
        }
    }
    return encodeURI(qs.stringify(data));
}

/**
 * 反序列化
 * @param {string} url 需要反序列化的字符串
 * @param {string} key 需要获取的key值 不传则返回全部
 */
export const parse = function (url: string, key: string) {
    url = encodeURI(url);
    if (url[0] === '?') url = url.substring(1);
    if (key) return qs.parse(url)[key];
    else return qs.parse(url);
}
/**
 * 可取消的promise
 */
export const makeCancelable = (promise: Promise<any>): object => {
    let hasCanceled_ = false;
  
    const wrappedPromise = new Promise<any>((resolve, reject) => {
      promise.then((val) =>
        hasCanceled_ ? reject({isCanceled: true}) : resolve(val)
      );
      promise.catch((error) =>
        hasCanceled_ ? reject({isCanceled: true}) : reject(error)
      );
    });
  
    return {
      promise: wrappedPromise,
      cancel() {
        hasCanceled_ = true;
      },
    };
  };

  /**
 * 导出功能
 * @params { String } url  ajaxUrl
 * @params { String } methods  ajax方法
 * @params { Object } params  参数
 */
interface IObj {
  [key: string]: any
}
export const download = function (url: string, methods: string, params?: IObj) {
  var form = document.createElement('form')
  form.style.display = 'none'
  form.action = url
  form.method = methods || 'get'
  document.body.appendChild(form)

  if (params && Object.prototype.toString.call(params) === '[object object]') {
    for (var key in params) {
      var input = document.createElement('input')
      input.type = 'hidden'
      input.name = key
      input.value = params[key]
      form.appendChild(input)
    }
  }
  form.submit()
  document.body.removeChild(form)
}
