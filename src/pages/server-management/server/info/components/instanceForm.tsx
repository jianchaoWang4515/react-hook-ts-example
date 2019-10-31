import React from 'react';
import { Form, Input, Select } from 'antd';
import {FormComponentProps} from 'antd/lib/form/Form';
import { API } from '@/api';
const { Option } = Select;
interface IProps extends FormComponentProps {
    dbtype: number | string | null
}
interface IState {
    hostIpList: any[],
    hostIpLoading: boolean,
    API: any,
    XHR: any
}
class InstanceForm extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            hostIpList: [],
            hostIpLoading: false,
            API,
            XHR: API.server
        };
    }
    componentWillMount() {
        this.getHostIpList();
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
    render () {
        const { getFieldDecorator } = this.props.form;
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
                <Form.Item label="主机">
                {getFieldDecorator('host_id', {
                    rules: [{ required: true, message: '请选择主机ip' }]
                })(
                    <Select placeholder="请选择主机ip" 
                        loading={this.state.hostIpLoading}
                        allowClear={true}
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
                <Form.Item label="port">
                {getFieldDecorator('port', {
                    rules: [
                        { required: true, message: '请输入port' }
                    ]
                })(
                    <Input
                    placeholder="port"
                    />,
                )}
                </Form.Item>
                {this.props.dbtype === 0 && (
                    <Form.Item label="SID">
                        {getFieldDecorator('sid', {
                            rules: [{ required: true, message: '请输入SID' }]
                        })(
                            <Input
                            placeholder="SID"
                            />,
                        )}
                    </Form.Item>
                )}
            </Form>
        )
    }
}

export default Form.create<IProps>()(InstanceForm);
