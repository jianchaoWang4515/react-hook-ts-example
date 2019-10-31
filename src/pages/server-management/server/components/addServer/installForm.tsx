import React from 'react';
import { Form, Input, Select, Tag } from 'antd';
import { FormComponentProps } from 'antd/lib/form/Form';
import { IInstallFormState } from './type';
import { API } from '@/api';
const { Option } = Select;
interface IProps extends FormComponentProps {
    changeForm: (x: IInstallFormState) => void,
    formData: IInstallFormState
}
interface IFrameworkList {
    oracle: any[],
    mysql: any[]
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
class InstallServerForm extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            frameworkList: {
                oracle: [{
                    id: 1,
                    name: 'Single'
                },
                {
                    id: 2,
                    name: 'DG'
                }],
                mysql: []
            },
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
     * 获取mysql架构类型列表
     */
    getFrameworkList = () => {
        this.setState({
            isLoading: true
        });
        const param = {
            params: {
                page_size: 9999,
                dbtype: 1,
            }
        }
        this.state.XHR.framework(param).then((res: any) => {
            this.setState({
                frameworkList: { ...this.state.frameworkList, mysql: res.results || []}
            });
        }).finally(() => {
            this.setState({
                isLoading: false
            });
        });
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
    onDbTypeChange = (val: any) => {
        // this.getFrameworkList(Number(val));// 重新获取架构类型列表
        this.props.form.setFieldsValue({
            framework: undefined
        });
        this.props.changeForm({dbtype: val, framework: null});
    }

      /**
       * 把选择过的ip禁用掉
       */
      refreshHostIpList = () => {
        const { form } = this.props;
        // 在onChange合成事件无法同步获取hostList的值 利用setTimeout解决
        setTimeout(() => {
            const hostList = form.getFieldValue('hostList');
            const existIpId = hostList.map((item: any) => item.hostname); // 已经选择的主机ip的id集合
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

    changeFramework = (val: number) => {
        this.props.changeForm({framework: val});
        const { form, formData } = this.props;
        const { dbtype } = formData;
        if (dbtype === '1') {
            // mysql
            switch (val) {
                // 且为单机时只显示一条
                case 6:
                    form.setFieldsValue({
                        keys: [0]
                    })
                    break;
            
                default:
                    form.setFieldsValue({
                        keys: [0, 1]
                    })
                    break;
            }
        } else if (dbtype === '0') {
             // oracle
             switch (val) {
                // 且为Single时只显示一条
                case 1:
                    form.setFieldsValue({
                        keys: [0]
                    })
                    break;
            
                default:
                    form.setFieldsValue({
                        keys: [0, 1]
                    })
                    break;
            }
        }
    }

    render () {
        const { getFieldDecorator, getFieldValue } = this.props.form;
        const { formData } = this.props;
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
                            <Option value="0">Oracle</Option>
                            <Option value="1">Mysql</Option>
                        </Select>
                    )}
                </Form.Item>
                <Form.Item label="架构类型">
                    {getFieldDecorator('framework', {
                        rules: [{ required: true, message: '请选择架构类型' }],
                    })(
                        <Select placeholder="请选择架构类型" loading={this.state.isLoading} allowClear={true} onChange={this.changeFramework}>
                            {formData.dbtype === '0' && this.state.frameworkList.oracle.map((item) => (
                                <Option key={item.id} value={item.id}>{item.name}</Option>
                            ))}
                            {formData.dbtype === '1' && this.state.frameworkList.mysql.map((item) => (
                                <Option key={item.id} value={item.id}>{item.name}</Option>
                            ))}
                        </Select>
                    )}
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
                {/* mysql且为主主架构类型或者oracle且为DG架构类型时显示 */}
                {(
                    (formData.dbtype === '1' && formData.framework === 5) ||
                    (formData.dbtype === '0' && formData.framework === 2)
                    ) && (
                    <>
                        <Form.Item label="VIP">
                            {getFieldDecorator('vip', {
                                rules: [{ required: true, message: '请输入VIP' }]
                            })(
                                <Input
                                    placeholder="VIP"
                                />,
                            )}
                            </Form.Item>
                            <Form.Item label="链接端口">
                            {getFieldDecorator(formData.dbtype === '0' ? 'oracle_port' : 'mysql_port', {
                                rules: [{ required: true, message: '请输入链接端口' }]
                            })(
                                <Input
                                    placeholder="链接端口"
                                />,
                            )}
                        </Form.Item>
                    </>
                )}
                {/* oracle且为DG架构类型时显示 */}
                {formData.dbtype === '0' && formData.framework === 2 && 
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
                {formData.framework && keys.map((k: number,index: number) => (
                    <div key={k} className="app-flex app-flex-wrap" style={{position: 'relative', paddingLeft: '15px', paddingTop: '12px', background: '#fafafa', marginBottom: '12px'}}>
                        <div className="app-flex app-flex-middle" style={{
                            position: 'absolute',
                            left: 0,
                            top: 0,
                            height: '100%',
                            backgroundColor: 'rgba(207,207,207,.5)'
                        }}>{index === 0 ? '主' : '从'}</div>
                        <Form.Item
                        label='主机'
                        style={{width: (formData.dbtype === '0' && formData.framework === 2) ? '100%' : '50%', marginBottom: '12px'}}
                        labelCol={{sm: { span: (formData.dbtype === '0' && formData.framework === 2) ? 4 : 7 }}}
                        wrapperCol={{sm: { span: 17 }}}
                        >
                        {getFieldDecorator(`hostList[${k}]hostname`, {
                            rules: [{ required: true, message: '请选择主机' }],
                        })(
                            <Select placeholder="请选择主机ip" 
                                loading={this.state.hostIpLoading} 
                                allowClear={true}
                                onChange={this.refreshHostIpList}
                                showSearch
                                filterOption={(input, option: any) =>
                                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }>
                                {this.state.hostIpList.map((item) => (
                                    <Option key={item.id} value={item.id} disabled={item.disabled}>{item.ip}</Option>
                                ))}
                            </Select>
                        )}
                        </Form.Item>
                        {/* oracle且架构类型为Single时或者mysql且架构类型不为主主时显示 */}
                        {(
                            (formData.dbtype === '0' && formData.framework === 1) || 
                            (formData.dbtype === '1' && formData.framework !== 5)
                            ) && (
                                <Form.Item
                                label='port'
                                style={{width: '50%', marginBottom: '12px'}}
                            >
                                {getFieldDecorator(`hostList[${k}]port`, {
                                rules: [
                                    {
                                    required: true,
                                    whitespace: true,
                                    message: "请输入端口",
                                    },
                                ],
                                })(<Input placeholder="port" />)}
                            </Form.Item>
                        )}
                        {!(formData.dbtype === '0' && formData.framework === 2) && (
                            <Form.Item
                                label={(formData.dbtype === '0' && formData.framework === 1) ? 'SID' : '安装目录'}
                                style={{width: '50%', marginBottom: '12px'}}
                                labelCol={{sm: { span: 7 }}}
                                wrapperCol={{sm: { span: 17 }}}
                                >
                                {getFieldDecorator(`hostList[${k}]info`, {
                                    rules: [
                                    {
                                        required: true,
                                        whitespace: true,
                                        message: `请输入${(formData.dbtype === '0' && formData.framework === 1) ? 'SID' : '安装目录'}`,
                                    },
                                    ],
                                })(<Input placeholder={(formData.dbtype === '0' && formData.framework === 1) ? 'SID' : '安装目录'} />)}
                            </Form.Item>
                        )}
                    </div>
                ))}
            </Form>
        )
    }
}

export default Form.create<IProps>()(InstallServerForm);
