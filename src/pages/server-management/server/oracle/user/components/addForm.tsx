import React from 'react';
import { Form, Input, Radio, Select, Checkbox, Transfer } from 'antd';
import {FormComponentProps} from 'antd/lib/form/Form';
import { API } from '@/api';
import { TableStatus } from '../state';
import { IAddFormState } from '../type';
const { Option } = Select;
const { TextArea } = Input;
interface IProps extends FormComponentProps {
    serviceid: string,
    formData: IAddFormState,
    isAdd?: boolean,
    transferChange?: (x: string[]) => void,
    changeUserType?: () => void
}
interface IState {
    tableSpaceList: any[],
    tableSpaceLoading: boolean,
    XHR: any,
    transferLeftData: any[],
    transferRightDataKeys: any[],
    selectedKeys: string[],
    ownerList: any[]
}
class AddDbUserForm extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            tableSpaceList: [],
            tableSpaceLoading: false,
            XHR: API.serverDetail.oracle,
            transferLeftData: [],
            transferRightDataKeys: [],
            selectedKeys: [],
            ownerList: []
        };
    };

    componentWillMount() {
        this.getTableSpaceList(this.props.serviceid);
        this.getOwnerList(this.props.serviceid);
    }

    ownersTagChange = () => {
        // 在onChange合成事件中无法同步拿到owners_tag，利用setTimeout解决
        setTimeout(() => {
            const ownerTable = this.props.form.getFieldValue('owners_tag');
            this.getOwnerTables(this.props.serviceid, ownerTable);
        });
    }
    /**
     * 获取表空间
     */
    getTableSpaceList = (id: string) => {
        const params = {
            params: {
              action: 'tablespace'
            }
          }
          this.setState({
            tableSpaceLoading: true
          })
          this.state.XHR.space.send(id, params).then((res: any) => {
            this.setState({
                tableSpaceList: res || []
            });
          }).finally(() => {
            this.setState({
                tableSpaceLoading: false
            });
        });
    };
    /**
     * 用户类型为只读用户时所用的owner
     */
    getOwnerList = (id: string) => {
        this.state.XHR.owners(id).then((res: any) => {
            this.setState({
                ownerList: res || []
            })
        })
    };
    /**
     * 获取owner下所有tables
     */
    getOwnerTables = (id: string, owner: any[]) => {
        this.state.XHR.ownersTables(id, owner).then((res: any) => {
            this.setState({
                transferLeftData: res || [],
                transferRightDataKeys: [ ...this.state.transferRightDataKeys ]
            });
        })
    }
    /**
     * 穿梭值改变时同步修改formData.tables的值
     */
    handleChange = (nextTargetKeys: string[]) => {
        if (this.props.transferChange) this.props.transferChange(nextTargetKeys);
    }

    handleSelectChange = (sourceSelectedKeys: string[], targetSelectedKeys: string[]) => {
        this.setState({ selectedKeys: [...sourceSelectedKeys, ...targetSelectedKeys] });
    }
    /**
     * user_type变换时清空transferLeftData与formData.tables
     */
    userTypeChange = () => {
        this.setState({
            transferLeftData: []
        });
        if (this.props.changeUserType) this.props.changeUserType();
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
            <Form className="add-tablespace-form" {...formItemLayout}>
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
                <Form.Item label="用户类型">
                {getFieldDecorator('user_type', {
                    rules: [{ required: true }],
                    initialValue: formData.user_type
                })(
                    <Radio.Group onChange={this.userTypeChange} disabled={!this.props.isAdd}>
                        <Radio value="1">普通用户</Radio>
                        <Radio value="2">只读用户</Radio>
                  </Radio.Group>,
                )}
                </Form.Item>
                {!this.props.isAdd && (
                    <Form.Item label="状态">
                    {getFieldDecorator('status', {
                        rules: [{ required: true, message: '状态' }],
                        initialValue: formData.status
                    })(
                        <Select disabled={!this.props.isAdd}>
                            {[...TableStatus].map((item) => (
                                <Option key={item[0]} value={item[0]}>{item[1]}</Option>
                            ))}
                        </Select>,
                    )}
                    </Form.Item>
                )}
                <Form.Item label="默认表空间">
                {getFieldDecorator('databases', {
                    rules: [{ required: true}],
                    initialValue: formData.databases
                })(
                    <Select disabled={!this.props.isAdd} placeholder="请选择默认表空间" loading={this.state.tableSpaceLoading} allowClear={true}>
                        {this.state.tableSpaceList.map((item) => (
                            <Option key={item.TABLESPACE_NAME} value={item.TABLESPACE_NAME}>{item.TABLESPACE_NAME}</Option>
                        ))}
                    </Select>,
                )}
                </Form.Item>
                <Form.Item label="角色">
                {getFieldDecorator('role', {
                    rules: [{ required: true, message: '请选择角色'}],
                    initialValue: formData.role
                })(
                    <Checkbox.Group style={{ width: '100%' }} disabled={!this.props.isAdd}>
                        <Checkbox value="connect">connect</Checkbox>
                        <Checkbox value="resource">resource</Checkbox>
                    </Checkbox.Group>,
                )}
                </Form.Item>
                {formData.user_type === '2' && this.props.isAdd && (
                    <div>
                        <Form.Item style={{marginBottom: '5px'}} label="owner" labelCol={{sm: { span: 3 }}} wrapperCol={{sm: { span: 7 }}}>
                        {getFieldDecorator('owners_tag')(
                            <Select placeholder="请选择owners" allowClear={true} onChange={this.ownersTagChange}>
                                {this.state.ownerList.map((item) => (
                                    <Option key={item.OWNER} value={item.OWNER}>{item.OWNER}</Option>
                                ))}
                            </Select>,
                        )}
                        </Form.Item>
                        <Form.Item labelCol={{sm: { span: 0 }}} wrapperCol={{sm: { span: 24 }}}>
                            {getFieldDecorator('tables')(
                                <Transfer
                                    listStyle={{
                                        width: '200px',
                                        height: '300px'
                                    }}
                                    rowKey={record => {
                                        // 拼接成最终后台所需数据格式
                                        const owner = this.props.form.getFieldValue('owners_tag');
                                        return `${owner}.${record.TABLE_NAME}`
                                    }}
                                    dataSource={this.state.transferLeftData}
                                    targetKeys={formData.tables}
                                    selectedKeys={this.state.selectedKeys}
                                    onChange={this.handleChange}
                                    onSelectChange={this.handleSelectChange}
                                    render={item => item.TABLE_NAME}
                                />
                            )}
                        </Form.Item>
                    </div>
                )}
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

export default Form.create<IProps>()(AddDbUserForm);
