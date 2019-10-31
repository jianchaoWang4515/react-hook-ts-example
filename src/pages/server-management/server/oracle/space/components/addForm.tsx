import React from 'react';
import { Form, Input } from 'antd';
import {FormComponentProps} from 'antd/lib/form/Form';
import { IAddFormState } from '../type';
interface IProps extends FormComponentProps {
    formData: IAddFormState
}
class AddTablespaceForm extends React.Component<IProps> {
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
                <Form.Item label="表空间">
                {getFieldDecorator('tablespace_name', {
                    rules: [{ required: true, message: '请输入名称' }],
                    initialValue: formData.tablespace_name
                })(
                    <Input
                    disabled={formData.tablespace_name ? true : false}
                    placeholder="表空间"
                    />,
                )}
                </Form.Item>
                <Form.Item label="文件路径">
                {getFieldDecorator('datafile', {
                    rules: [
                        { required: true, message: '请输入文件路径' }
                    ],
                    initialValue: formData.datafile
                })(
                    <Input
                    placeholder="文件路径"
                    />,
                )}
                </Form.Item>
                <Form.Item label="文件大小">
                {getFieldDecorator('tablespace_size', {
                    rules: [{ required: true, message: '请输入文件大小' }],
                    initialValue: formData.tablespace_size
                })(
                    <Input
                    placeholder="文件大小"
                    />,
                )}
                </Form.Item>
            </Form>
        )
    }
}

export default Form.create<IProps>()(AddTablespaceForm);
