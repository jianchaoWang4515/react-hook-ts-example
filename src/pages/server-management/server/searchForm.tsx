import React from 'react';
import { Form, Input, Select } from 'antd';
import { FormComponentProps } from 'antd/lib/form/Form';
import { IDbList, ISearchFormData } from './type';
const { Option } = Select;
const Search = Input.Search;

interface IProps extends FormComponentProps {
  data: ISearchFormData,
  onChange(): void,
  dbList: IDbList
}

class SearchForm extends React.Component<IProps> {

  /**
   * 针对清空情况自动搜索
   */
  changeSearch(e: any) {
    if (!e.target.value) {
      this.props.onChange();
    };
  }

  render() {
    const { dbList } = this.props
    return (
      <Form layout='inline' className="app-flex-1">
        <Form.Item label="" style={{ float: "right" }}>
          {this.props.form.getFieldDecorator('search', {
            initialValue: this.props.data.search,
          })(
            <Search
              placeholder="请输入服务名"
              onPressEnter={this.props.onChange}
              onSearch={this.props.onChange}
              allowClear
              onChange={this.changeSearch.bind(this)}
              style={{ width: 250 }}
            />,
          )}
        </Form.Item>
        <Form.Item label="实例IP" style={{ float: "right" }}>
          {this.props.form.getFieldDecorator('schemaip', {
            initialValue: this.props.data.schemaip,
          })(
            <Search
              placeholder="请输入实例IP"
              allowClear
              onPressEnter={this.props.onChange}
              onSearch={this.props.onChange}
              onChange={this.changeSearch.bind(this)}
              style={{ width: 250 }}
            />,
          )}
        </Form.Item>
        <Form.Item label="数据库类型" className="m-l-24" style={{ float: "right" }}>
          {this.props.form.getFieldDecorator('dbtype', {
            initialValue: this.props.data.dbtype,
          })(
            <Select placeholder="数据库类型" style={{ width: 150 }} onChange={this.props.onChange}>
              <Option value="-1">全部</Option>
              {Object.keys(dbList).map((id) => (
                <Option key={id} value={id}>{dbList[id]}</Option>
              ))}
            </Select>
          )}
        </Form.Item>
      </Form>
    )
  }
}

export default Form.create<IProps>()(SearchForm);
