import { RouteProps } from 'react-router-dom';
import Home from '@/router/home';
import Host from '@/router/host';
import Server from '@/router/server';
import ParamsTemplate from '@/router/params-template';
// import TimeInspection from '@/router/timed-inspection';
// import TimedTask from '@/router/timed-task';
// import userManagement from '@/router/userManagement';
import Error from '@/router/error';

const routes: RouteProps[] = [
    ...Home,
    ...Host,
    ...Server,
    ...ParamsTemplate,
    // ...TimeInspection,
    // ...TimedTask,
    // ...userManagement,
    ...Error
]

export default routes;
