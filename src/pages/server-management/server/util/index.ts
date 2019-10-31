import { RouteComponentProps } from 'react-router-dom';
/**
 * 手动修改路由serviceid情况下需要重新匹配props.history.state.mode来动态显示二级菜单
 * 针对server页面下的二级菜单变化做动态变更， props.history.state.mode不存在的情况下统一跳转到/server/info
 * @param {object} props 页面组件props
 */
export function ResetDbMode(props: RouteComponentProps) {
    const { state = '' } = props.location;
    return new Promise((resolve,reject) => {
        if (state && state.model && state.servicename) {
            resolve()
        } else {
            props.history.replace({
                pathname: '/server/info',
                search: props.location.search
            });
            reject();
        };
    });
}