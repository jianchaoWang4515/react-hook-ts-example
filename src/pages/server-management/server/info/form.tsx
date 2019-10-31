import React from 'react';
import { Form, Input, Select } from 'antd';
import {FormComponentProps} from 'antd/lib/form/Form';
const { Option } = Select;
const Search = Input.Search;

interface IProps extends FormComponentProps {
  data: any
}

class InfoForm extends React.Component<IProps> { 
  render () {
    const { serviceid, servicename, dbtype, framework, linkaddress, port, sid, service_version } = this.props.data;
    const formItemLayout = {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },
      };
    return (
      <Form { ...formItemLayout } layout='inline'>
          <Form.Item label="ServiceID">
            {this.props.form.getFieldDecorator('serviceid', {
              initialValue: serviceid,
            })(<Input />)}
          </Form.Item>
          <Form.Item label="服务名称">
            {this.props.form.getFieldDecorator('servicename', {
              initialValue: servicename,
            })(<Input />)}
          </Form.Item>
          <Form.Item label="数据库类型">
            {this.props.form.getFieldDecorator('dbtype', {
              initialValue: dbtype,
            })(<Input />)}
          </Form.Item>
          <Form.Item label="架构类型">
            {this.props.form.getFieldDecorator('framework', {
              initialValue: framework,
            })(<Input />)}
          </Form.Item>
          <Form.Item label="链接地址">
            {this.props.form.getFieldDecorator('linkaddress', {
              initialValue: linkaddress,
            })(<Input />)}
          </Form.Item>
          <Form.Item label="链接端口">
            {this.props.form.getFieldDecorator('port', {
              initialValue: port,
            })(<Input />)}
          </Form.Item>
          <Form.Item label="SID">
            {this.props.form.getFieldDecorator('sid', {
              initialValue: sid,
            })(<Input />)}
          </Form.Item>
          <Form.Item label="服务版本">
            {this.props.form.getFieldDecorator('service_version', {
              initialValue: service_version,
            })(<Input />)}
          </Form.Item>
        </Form>
    )
  }
}

export default Form.create<IProps>()(InfoForm);
