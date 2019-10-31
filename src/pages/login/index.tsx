import React, { useReducer, useContext } from 'react';
import { message } from 'antd';
import { RouteComponentProps } from 'react-router-dom';
import './index.less';
import LoginForm from './loginForm';
import { InitLoginState } from './state';
import { submitReducer } from './reducer';
import { API } from '@/api';
import JSONLocalStorage from '@/utils/local-storage';
import { GlobalContext } from '@/store';

function Login(props: RouteComponentProps) {
  let formRef: any;
  const { login:XHR } = API;
  const { state, dispatch } = useContext(GlobalContext);
  const [formState, setFormState] = useReducer(submitReducer, InitLoginState());

  function submit(e: React.FormEvent<HTMLFormElement>): void {
    e.preventDefault();
    setFormState({type: 'login'});
    formRef.props.form.validateFields((err: any, values: any) => {
        if (!err) {
          const { username, password, rememberMe } = values;
          // const params = {
          //   username,
          //   password
          // };
          // XHR.submit(params).then((res: any) => {
            let rememberState = {
              username,
              password: '',
              rememberMe: false
            };
            if (rememberMe) {
              rememberState.password = password;
              rememberState.rememberMe = rememberMe;
            };
            JSONLocalStorage.setItem('loginForm', rememberState);
            // 由于后端登录权限认证方式为拿req.header.Authorization的值去认证，
            // 故先储存token 在xhr设置header.Authorization
            // sessionStorage.setItem('sessionToken', `JWT ${res.token || ''}`);
            message.success('登录成功');
            dispatch({type: 'UPDATE_USER_INFO', userInfo: { username: '张三' }});
            props.history.push('/');
          // }).catch(() => {
          //   setFormState({type: 'error'});
          // })
        };
      });
      
  }
  return (
      <div className="app-login">
        <div className="app-login_box">
          <div className="title">Forrest</div>
          <LoginForm wrappedComponentRef={(form: any) => formRef = form} formData={formState} onSubmit={submit}/>
        </div>
      </div>
  )
}

export default Login;
