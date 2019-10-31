import React from 'react';
import { Form, Input, Select, Icon, Button } from 'antd';
import { FormComponentProps } from 'antd/lib/form/Form';
import { IInstalledFormState } from './type';
import { IDbList } from '@/pages/server-management/server/type';
import { API } from '@/api';
const { Option } = Select;
let id = 1;
interface IProps extends FormComponentProps {
    changeForm: (x: IInstalledFormState) => void,
    formData: IInstalledFormState,
    dbList: IDbList
}
// key 对应IDbList中数据库类型的key值
interface IFrameworkList {
    [key: string]: any[]
}
interface IState {
    frameworkList: IFrameworkList,
    hostIpList: any[],
    ownersList: any[],
    isLoading: boolean,
    hostIpLoading: boolean,
    ownersLoading: boolean,
    API: any,
    XHR: any
}
class InstalledServerForm extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            frameworkList: {},
            hostIpList: [],
            ownersList: [],
            isLoading: false,
            hostIpLoading: false,
            ownersLoading: false,
            API,
            XHR: API.server
        };
    }
    componentWillMount() {
        this.getHostIpList();
        this.getFrameworkList();
        this.getOwners();
    };
    /**
     * 获取架构类型列表
     */
    getFrameworkList = (dbtype: number | string = 0) => {
        if (
            !this.state.frameworkList[String(dbtype)]
            ) {
                this.setState({
                    isLoading: true
                });
                const param = {
                    params: {
                        page_size: 9999,
                        dbtype,
                    }
                }
                this.state.XHR.framework(param).then((res: any) => {
                    this.setState({
                        frameworkList: { ...this.state.frameworkList, [ dbtype ]: res.results || [] } 
                    });
                }).finally(() => {
                    this.setState({
                        isLoading: false
                    });
                });
            }
    };
    /**
     * 获取主机列表
     */
    getHostIpList = () => {
        this.setState({
            hostIpLoading: true
        });
        const param = {
            params: {
                page_size: 9999
            }
        }
        this.state.API.host.list.send(param).then((res: any) => {
            this.setState({
                hostIpList: res.results || []
            });
        }).finally(() => {
            this.setState({
                hostIpLoading: false
            });
        });
    };
    getOwners = () => {
        this.setState({
            ownersLoading: true
        });
        const param = {
            params: {
                page_size: 99999
            }
        }
        this.state.API.userMgt.user.list.send(param).then((res: any) => {
            this.setState({
                ownersList: res.results || []
            });
        }).finally(() => {
            this.setState({
                ownersLoading: false
            });
        });
    }
    onDbTypeChange = (val: string | number) => {
        this.getFrameworkList(Number(val));// 重新获取架构类型列表
        this.props.form.setFieldsValue({
            framework: undefined
        });
        this.props.changeForm({dbtype: val});
    }

    add = () => {
        const { form } = this.props;
        const keys = form.getFieldValue('keys');
        const nextKeys = keys.concat(id++);
        form.setFieldsValue({
            keys: nextKeys,
        });
    }
    remove = (k: number) => {
        const { form } = this.props;
        const keys = form.getFieldValue('keys');
        if (keys.length === 1) {
          return;
        }
        form.setFieldsValue({
          keys: keys.filter((key: number) => key !== k),
        });
      };

      /**
       * 把选择过的ip禁用掉
       */
      refreshHostIpList = () => {
        const { form } = this.props;
        // 在onChange合成事件无法同步获取hostList的值 利用setTimeout解决
        setTimeout(() => {
            const schemas = form.getFieldValue('schemas');
            const existIpId = schemas.map((item: any) => item.hostname); // 已经选择的主机ip的id集合
            let newHostIpList = [ ...this.state.hostIpList ];
            newHostIpList.forEach(item => {
                if (existIpId.includes(item.id)) item.disabled = true;
                else item.disabled = false;
            })
            this.setState({
                hostIpList: newHostIpList
            })
        });
      }


    render () {
        const { getFieldDecorator, getFieldValue } = this.props.form;
        const { formData, dbList } = this.props;
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
        getFieldDecorator('keys', { initialValue: [0] })
        const keys = getFieldValue('keys');
        return (
            <Form className="add-host-form" {...formItemLayout}>
                <Form.Item label="服务名称">
                {getFieldDecorator('servicename', {
                    rules: [{ required: true, message: '请输入服务名称' }],
                    initialValue: formData.servicename
                })(
                    <Input
                    placeholder="服务名称"
                    />,
                )}
                </Form.Item>
                <Form.Item label="数据库类型">
                    {getFieldDecorator('dbtype', {
                        initialValue: formData.dbtype,
                        rules: [{ required: true, message: '请选择数据库类型' }],
                    })(
                        <Select onChange={this.onDbTypeChange}>
                            {Object.keys(dbList).map(id => (
                                <Option key={id} value={id}>{dbList[id]}</Option>
                            ))}
                        </Select>
                    )}
                </Form.Item>
                <Form.Item label="架构类型">
                    {getFieldDecorator('framework', {
                        rules: [{ required: true, message: '请选择架构类型' }],
                    })(
                        <Select placeholder="请选择架构类型" loading={this.state.isLoading} allowClear={true}>
                            {formData.dbtype && this.state.frameworkList[formData.dbtype] && this.state.frameworkList[formData.dbtype].map((item) => (
                                <Option key={item.id} value={item.id}>{item.name}</Option>
                            ))}
                            {/* {formData.dbtype === '1' && this.state.frameworkList.mysql.map((item) => (
                                <Option key={item.id} value={item.id}>{item.name}</Option>
                            ))} */}
                        </Select>
                    )}
                </Form.Item>
                <Form.Item label="数据库版本">
                {getFieldDecorator('service_version', {
                    rules: [
                        { required: true, message: '请输入数据库版本' }
                    ],
                    initialValue: formData.service_version
                })(
                    <Input
                        placeholder="数据库版本"
                    />,
                )}
                </Form.Item>
                <Form.Item label="链接地址">
                {getFieldDecorator('linkaddress', {
                    rules: [{ required: true, message: '请输入管理用户' }],
                    initialValue: formData.linkaddress
                })(
                    <Input
                        placeholder="链接地址"
                    />,
                )}
                </Form.Item>
                <Form.Item label="链接端口">
                {getFieldDecorator('port', {
                    rules: [{ required: true, message: '请输入管理用户' }],
                    initialValue: formData.port
                })(
                    <Input
                        placeholder="链接端口"
                    />,
                )}
                </Form.Item>
                {formData.dbtype === '0' && 
                    <Form.Item label="SID">
                    {getFieldDecorator('sid', {
                        rules: [{ required: true, message: '请输入SID' }],
                        initialValue: formData.sid
                    })(
                        <Input
                        placeholder="SID"
                        />,
                    )}
                    </Form.Item>
                }
                <Form.Item label="管理用户">
                {getFieldDecorator('adminuser', {
                    rules: [{ required: true, message: '请输入管理用户' }],
                    initialValue: formData.adminuser
                })(
                    <Input
                    placeholder="管理用户"
                    />,
                )}
                </Form.Item>
                <Form.Item label="管理密码">
                {getFieldDecorator('adminpassword', {
                    rules: [{ required: true, message: '请输入管理密码' }],
                    initialValue: formData.adminpassword
                })(<Input.Password placeholder="管理密码"/>)}
                </Form.Item>
                <Form.Item label="负责人">
                {getFieldDecorator('owners', {
                    rules: [{ required: true, message: '请选择负责人' }],
                    initialValue: formData.owners
                })(
                    <Select mode="multiple" allowClear>
                        {this.state.ownersList.map(item => (
                            <Option key={item.id} value={item.id}>{item.real_name || `${item.username}(用户名)`}</Option>
                        ))}
                    </Select>
                )}
                </Form.Item>
                <Form.Item label="备注">
                {getFieldDecorator('remarks', {
                    rules: [{ required: false }],
                    initialValue: formData.remarks
                })(<Input.TextArea placeholder=""/>)}
                </Form.Item>
                {keys.map((k: number) => (
                    <div key={k} className="app-flex app-flex-wrap" style={{paddingTop: '12px', background: '#fafafa', marginBottom: '12px'}}>
                        <Form.Item
                        label='主机'
                        required={false}
                        style={{width: formData.dbtype === '0' ? '60%' : '55%', marginBottom: '12px'}}
                        labelCol={{sm: { span: 5 }}}
                        wrapperCol={{sm: { span: 18 }}}
                        >
                        {getFieldDecorator(`schemas[${k}]hostname`, {
                            rules: [
                                {
                                    required: false
                                },
                            ],
                        })(
                            <Select placeholder="请选择主机ip" 
                                loading={this.state.hostIpLoading} 
                                allowClear={true}
                                onChange={this.refreshHostIpList}
                                showSearch
                                filterOption={(input: any, option: any) =>
                                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }>
                                {this.state.hostIpList.map((item) => (
                                    <Option key={item.id} value={item.id} disabled={item.disabled}>{item.ip}</Option>
                                ))}
                            </Select>
                        )}
                        </Form.Item>
                        <Form.Item
                            label='port'
                            style={{width: '40%', marginBottom: '12px'}}
                        >
                            {getFieldDecorator(`schemas[${k}]port`, {
                            rules: [
                                {
                                required: false,
                                whitespace: true,
                                message: "Please input",
                                },
                            ],
                            })(<Input placeholder="port" />)}
                        </Form.Item>
                        { formData.dbtype === '0' && 
                            <Form.Item
                            label='SID'
                            required={false}
                            style={{width: '60%', marginBottom: '12px'}}
                            labelCol={{sm: { span: 5 }}}
                            wrapperCol={{sm: { span: 18 }}}
                            >
                                {getFieldDecorator(`schemas[${k}]SID`, {
                                    rules: [
                                    {
                                        required: false,
                                        whitespace: true,
                                        message: "Please input",
                                    },
                                    ],
                                })(<Input placeholder="SID" />)}
                            </Form.Item>
                        }
                        <Form.Item style={{fontSize: '24px', marginBottom: '12px'}}>
                            {keys.length > 1 ? (
                                <Icon
                                className="dynamic-delete-button"
                                type="minus-circle-o"
                                style={{cursor: 'pointer'}}
                                onClick={() => this.remove(k)}
                                    />
                            ) : null}
                        </Form.Item>
                    </div>
                ))}
                <Form.Item wrapperCol={{sm: { span: 24 }}}>
                    <Button type="dashed" onClick={this.add} style={{width: '100%'}}>
                        <Icon type="plus" /> Add
                    </Button>
                </Form.Item>
            </Form>
        )
    }
}

export default Form.create<IProps>()(InstalledServerForm);
