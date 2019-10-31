import React from 'react';
import { Form, Input, Select } from 'antd';
import {FormComponentProps} from 'antd/lib/form/Form';
import { API } from '@/api';
import './index.less';
import { TableStatus } from '../state';
import { IAddFormState } from '../type';
import DbTransfer from './dbTransfer';
import * as dbTransferType from './dbTransfer/type';
const { TextArea } = Input;
const { Option } = Select;
interface IProps extends FormComponentProps {
    serviceid: string,
    formData: IAddFormState,
    isAdd: boolean,
    transferChange: dbTransferType.onSelect<any>,
    transferDel: dbTransferType.onDel<any>,
    onAuthChange: dbTransferType.onAuthChange<any>
}
interface IState {
    dbList: any[],
    loading: boolean
}
class AddUserForm extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            dbList: [],
            loading: false
        };
    }
    componentWillMount() {
        this.getMysqlDbList(this.props.serviceid);
    }
     /**
     * 获取表空间
     */
    getMysqlDbList = (id: string) => {
        const params = {
            page_size: 9999,
            serviceid: id
          }
          this.setState({
            loading: true
          })
          API.serverDetail.mysql.db({ params }).then((res: any) => {
              let data = res.results || [];
              data.forEach((item: any) => {
                  if (!item.privilege) item.privilege = 'ALL'; // 默认数据库权限
              });
              this.setState({
                dbList: [ ...data ]
              })
          }).finally(() => {
                this.setState({
                loading: false
              });
          });
    };
    render () {
        const { getFieldDecorator } = this.props.form;
        const { formData } = this.props;
        const formItemLayout = {
            labelCol: {
              xs: { span: 24 },
              sm: { span: 5 },
            },
            wrapperCol: {
              xs: { span: 24 },
              sm: { span: 18 },
            },
          };
        return (
            <Form className="add-dbUrer-form" {...formItemLayout}>
                {!this.props.isAdd && (
                    <Form.Item label="密码">
                    {getFieldDecorator('password', {
                        rules: [{ required: true, message: '请输入密码' }],
                        initialValue: formData.password
                    })(
                        <Input.Password />,
                    )}
                    </Form.Item>
                )}
                <Form.Item label="用户名称">
                {getFieldDecorator('username', {
                    rules: [{ required: true, message: '请输入用户名称' }],
                    initialValue: formData.username
                })(
                    <Input
                    disabled={this.props.isAdd ? false : true}
                    placeholder="用户名称"
                    />,
                )}
                </Form.Item>
                {!this.props.isAdd && (
                    <Form.Item label="状态">
                    {getFieldDecorator('status', {
                        rules: [{ required: true, message: '状态' }],
                        initialValue: formData.status
                    })(
                        <Select disabled={!this.props.isAdd}>
                            {[...TableStatus].map((item: any) => (
                                <Option key={item[0]} value={item[0]}>{item[1]}</Option>
                            ))}
                        </Select>,
                    )}
                    </Form.Item>
                )}
                <Form.Item label="Host">
                {getFieldDecorator('mysql_host', {
                    rules: [{ required: true, message: '请输入Host' }],
                    initialValue: formData.mysql_host
                })(
                    <Input
                    disabled={!this.props.isAdd}
                    placeholder="Host"
                    />,
                )}
                </Form.Item>
                <Form.Item label="用户授权" className="form-transfer-box">
                    {getFieldDecorator('database_privilege', {
                        rules: [{ required: true, message: '请授权' }],
                        initialValue: formData.database_privilege
                    })(
                        <DbTransfer
                        sellectedAll={formData.database_privilege}
                        dataSource={this.state.dbList}
                        keyname="databasename"
                        title="databasename"
                        onSelect={this.props.transferChange}
                        onDel={this.props.transferDel}
                        onAuthChange={this.props.onAuthChange}
                        >
                        </DbTransfer>
                    )}
                    </Form.Item>
                
                <Form.Item label="使用者">
                {getFieldDecorator('owners', {
                    rules: [{ required: true, message: '请输入使用者' }],
                    initialValue: formData.owners
                })(
                    <Input
                    placeholder="使用者"
                    />,
                )}
                </Form.Item>
                <Form.Item label="使用应用">
                {getFieldDecorator('applications', {
                    rules: [{ required: true, message: '请输入使用应用' }],
                    initialValue: formData.applications
                })(
                    <Input
                    placeholder="使用应用"
                    />,
                )}
                </Form.Item>
                <Form.Item label="备注">
                {getFieldDecorator('remarks', {
                    initialValue: formData.remarks
                })(
                    <TextArea />,
                )}
                </Form.Item>
            </Form>
        )
    }
}

export default Form.create<IProps>()(AddUserForm);
