import React from 'react';
import { Form, Input } from 'antd';
import {FormComponentProps} from 'antd/lib/form/Form';
import { IAddFormState } from '../type';
interface IProps extends FormComponentProps {
    formData: IAddFormState
}
class AddDbForm extends React.Component<IProps> {
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
                <Form.Item label="数据库名称">
                {getFieldDecorator('databasename', {
                    rules: [{ required: true, message: '请输入数据库名称' }]
                })(
                    <Input
                    placeholder="数据库名称"
                    />,
                )}
                </Form.Item>
                <Form.Item label="默认字符集">
                {getFieldDecorator('charcter', {
                    rules: [
                        { required: true, message: '请输入默认字符集' }
                    ]
                })(
                    <Input
                    placeholder="默认字符集"
                    />,
                )}
                </Form.Item>
                <Form.Item label="默认排序规则">
                {getFieldDecorator('collate', {
                    rules: [{ required: true, message: '请输入默认排序规则' }]
                })(
                    <Input
                    placeholder="默认排序规则"
                    />,
                )}
                </Form.Item>
            </Form>
        )
    }
}

export default Form.create<IProps>()(AddDbForm);
