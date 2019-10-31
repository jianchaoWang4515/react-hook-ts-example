import React, { useEffect, useReducer } from 'react';
import {  BrowserRouter as Router, withRouter, Route, Switch, RouteComponentProps } from 'react-router-dom';
import MyLayout from './layout';
import Menus from '@/menus';
import { AuthRouter } from '@/components';
import routes from '@/routes';
import Login from '@/pages/login';
import { GlobalContext,GlobalReducer,GlobalState } from '@/store';
import { API } from '@/api';

const AppLayout = withRouter(function (props: RouteComponentProps) {
    const [state, dispatch] = useReducer(GlobalReducer,GlobalState);

    const { global:XHR } = API;
    useEffect(() => {
        if (!state.userInfo && props.location.pathname !== '/login') {
            props.history.push('/login');
        } else if (state.userInfo && props.location.pathname === '/login') {
            props.history.push('/');
        }
        // 判断session是否存在
        // XHR.session().then((res: any) => {
            // if (props.location.pathname === '/login') {
            //     props.history.goBack();
            // } else {
            //     dispatch({type: 'UPDATE_USER_INFO', userInfo: res ? res[0] : null});
            // };
        // });
    }, [props.location, state.userInfo, props.history]);
    
    return (
        <GlobalContext.Provider value={{state, dispatch}}>
            <Switch>
                <Route exact path="/login" component={Login} />
                {
                    state.userInfo && (
                        <MyLayout menus={Menus}>
                            <Switch>
                                {routes.map((route,index) => {
                                    let { component: Component } = route;
                                    return <AuthRouter { ...route } key={index} component={Component} />
                                })}
                            </Switch>
                        </MyLayout>
                    )
                }
            </Switch>
        </GlobalContext.Provider>
    );
})

function App() {
    return <Router>
            <AppLayout></AppLayout>
        </Router>
}
export default App;
