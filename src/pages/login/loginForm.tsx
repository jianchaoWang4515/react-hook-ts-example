import React from 'react';
import { Form, Icon, Input, Button, Checkbox } from 'antd';
import {FormComponentProps} from 'antd/lib/form/Form';

interface IProps extends FormComponentProps {
  formData: any,
  onSubmit(e: React.FormEvent<HTMLFormElement>): void
}

class LoginForm extends React.Component<IProps> {

  render() {
    const { getFieldDecorator } = this.props.form;
    const { formData, onSubmit } = this.props;
    return (
      <Form onSubmit={onSubmit} className="login-form">
        <Form.Item>
          {getFieldDecorator('username', {
            rules: [{ required: true, message: '请输入账号' }],
            initialValue: formData.username
          })(
            <Input
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="账号"
            />,
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: '请输入密码' }],
            initialValue: formData.password
          })(
            <Input
              prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
              onPaste={() => { return false }}
              type="password"
              placeholder="密码"
            />,
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('rememberMe', {
            valuePropName: 'checked',
            initialValue: formData.rememberMe,
          })(<Checkbox>记住密码</Checkbox>)}
          <Button type="primary" block loading={formData.loading} htmlType="submit" className="login-form-button">
            登录
          </Button>
        </Form.Item>
      </Form>
    );
  }
}

export default Form.create<IProps>()(LoginForm);