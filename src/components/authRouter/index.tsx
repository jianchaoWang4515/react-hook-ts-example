import React from 'react';
import { Route, RouteProps } from 'react-router-dom';

interface IProps extends RouteProps {
    component: any
}

function AuthRouter(props: IProps) {
    const { component: Component, ...rest } = props;
    return (
        <Route {...rest} render={props => {
            return <Component {...props} />
          }} />
    )
}

export default AuthRouter;
