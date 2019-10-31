import React from 'react';
import { Form, Input, Select, Radio } from 'antd';
import { FormComponentProps } from 'antd/lib/form/Form';
import { IAddFormState } from '../../type';
import { IDbList } from '../../../server/type';
const { Option } = Select;
interface IProps extends FormComponentProps {
    formData: IAddFormState,
    dbList: IDbList
}
class AddUserForm extends React.Component<IProps> {
    render () {
        const { getFieldDecorator } = this.props.form;
        const { formData, dbList } = this.props;
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
            <Form className="add-form" {...formItemLayout}>
                <Form.Item label="数据库类型">
                {getFieldDecorator('db_type', {
                    rules: [{ required: true, message: '请选择数据库类型' }],
                    initialValue: formData.db_type
                })(
                    <Select>
                        {Object.keys(dbList).map(id => (
                            <Option key={id} value={id}>{dbList[id]}</Option>
                        ))}
                    </Select>
                )}
                </Form.Item>
                <Form.Item label="版本">
                {getFieldDecorator('version', {
                    rules: [{ required: true, message: '请输入用户名' }],
                    initialValue: formData.version
                })(
                    <Input
                    placeholder="版本"
                    />,
                )}
                </Form.Item>
                <Form.Item label="参数名">
                {getFieldDecorator('variable_name', {
                    rules: [
                        { required: true, message: '请输入参数名' }
                    ],
                    initialValue: formData.variable_name
                })(
                    <Input
                    placeholder="参数名"
                    />,
                )}
                </Form.Item>
                <Form.Item label="默认值">
                {getFieldDecorator('default_value', {
                    rules: [{ required: true, message: '请输入默认值' }],
                    initialValue: formData.default_value
                })(
                    <Input
                    placeholder="默认值"
                    />,
                )}
                </Form.Item>
                <Form.Item label="取值范围">
                {getFieldDecorator('valid_values', {
                    rules: [{ required: true, message: '请输入取值范围' }],
                    initialValue: formData.valid_values
                })(
                    <Input
                    placeholder="取值范围"
                    />,
                )}
                </Form.Item>
                <Form.Item label="是否可修改">
                {getFieldDecorator('editable', {
                    rules: [{ required: true, message: '请输入editable' }],
                    initialValue: formData.editable
                })(
                    <Radio.Group>
                        <Radio value={true}>是</Radio>
                        <Radio value={false}>否</Radio>
                    </Radio.Group>
                )}
                </Form.Item>
                <Form.Item label="备注">
                {getFieldDecorator('description', {
                    rules: [{ required: true, message: '请输入备注' }],
                    initialValue: formData.description
                })(
                    <Input.TextArea autosize={{ minRows: 5 }} placeholder="备注"/>
                )}
                </Form.Item>
            </Form>
        )
    }
}

export default Form.create<IProps>()(AddUserForm);
