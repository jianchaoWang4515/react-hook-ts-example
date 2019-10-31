import React, { useState, useReducer, useEffect, useCallback } from 'react';
import JSONSessionStorage from '@/utils/session-storage';
import { PageTitle } from '@/components';
import './index.less';
import { Button, Table, Popconfirm, message, Modal, Tooltip, Icon } from 'antd';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { useAddBreadcrumb } from '@/hook';
import { API } from '@/api';
import { InitSearchFormData, InitTableState, dbList, InitModalState, InitAddFormState } from './state';
import { IAddFormState, ISearchFormData, ITableState, IModalState } from './type';
import { modalReducer } from './reducer';
import SearchForm from './search-form';
import AddForm from './components/add-form';
const { Column } = Table;
function ParamsTemplate(props: RouteComponentProps) {
  let addFormRef: any;
  const { paramsTemplate:XHR } = API;
  let formRef: any;
  useAddBreadcrumb(props);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [tableState, setTableState] = useState<ITableState>(InitTableState);
  const {tableData, total} = tableState;

  const [searchFormData, setSearchFormData] = useState<ISearchFormData>(InitSearchFormData(props));
  const [addFormState, setAddFormState] = useState<IAddFormState>(InitAddFormState);
  const [loading, setLoading] = useState<boolean>(false);
 
  const { search, dbtype, page, page_size } = searchFormData;
  const fetch = useFetch({search, dbtype, page});
  
  const [modalState, dispathModal] = useReducer(modalReducer, InitModalState);

  useEffect(() => {
    // fetch();
    return () => {
      XHR.list.cancel();
    }
  }, [fetch]);

  function useFetch({ search = '', dbtype = '-1', page = 1, page_size = 10 }) {
    return useCallback(() => {
      getData({search, dbtype, page, page_size});
    }, [search, dbtype, page, page_size]);
  }

  function getData({ search, dbtype, page, page_size }: ISearchFormData) {

    JSONSessionStorage.updateItem('history', {[props.match.path]: {search, dbtype, page }});

    setLoading(true);

    XHR.list.send({
      params: {
        search,
        db_type: dbtype === '-1' ? "" : dbtype,
        page,
        page_size
      }
    }).then((res: any) => {
      const { results = [], count } = res;
      setTableState({
        ...tableState,
        total: count || 0,
        tableData: results
      })
    }).finally(() => {
      setLoading(false);
    })
  }
  function submit() {
    addFormRef.props.form.validateFields((errors: any, values: IAddFormState) => {
        if (!errors) {
            let params = { ...values };
            let promise;
            let msg = '新增成功!';
            dispathModal({ type: 'submit' });
            if (!isEdit) {
                promise = () => XHR.add(params);
            } else {
                msg = '修改成功!';
                const { editId } = addFormState;
                promise = () => XHR.edit(editId, params);
            };
            promise().then(() => {
                message.success(msg);
                dispathModal({ type: 'success' });
                getData({search, dbtype, page, page_size});
            }).catch(() => {
                dispathModal({ type: 'error' });
            });
        };
    });
  }
  /**
   * 搜索项改变之后搜索
   */
  function searchData() {
    // 用setTimeout获取select控件onChange事件更新过后的值
    setTimeout(() => {
      const { search, dbtype } = formRef.props.form.getFieldsValue();
      setSearchFormData({
        search,
        dbtype,
        page: 1,
      });
    });
  }

  /**
   * 页码改变之后搜索
   */
  function changePage(page: number) {
    setSearchFormData({
      ...searchFormData,
      page,
    });
  }

  /**
   * 删除
   * @param { Number } id 主机id 
   */
  function onDel(id: string | number) {
    XHR.delete(id).then(() => {
      const dataSource = [...tableData];
      setTableState({ ...tableState, tableData: dataSource.filter(item => item.id !== id), total: total - 1 });
      message.success('删除成功');
    })
  }

  /**
   * 重置
   */
  function onReset() {
    setSearchFormData({
      search: '',
      dbtype: '-1',
      page: 1
    });
    formRef.props.form.resetFields();
  }

  function onEdit(record: any) {
    const { db_type, version, variable_name, default_value, valid_values, editable, description, id: editId } = record;
    setIsEdit(true);
    setAddFormState({
        db_type: `${db_type}`,
        version,
        variable_name,
        default_value,
        valid_values,
        editable,
        description,
        editId
    });
    dispathModal({type: 'change'});
  }
function resetAddForm() {
    addFormRef.props.form.resetFields();
    setAddFormState({
        ...InitAddFormState
    });
    setIsEdit(false);
}
  return (
      <div className="app-page server-page">
        <PageTitle title="参数模板"></PageTitle>
        <div className="clear-box app-flex app-flex-middle">
          <Button type="primary" onClick={() => dispathModal({type: 'change'})}>新增模板</Button>
          <SearchForm wrappedComponentRef={(form: any) => formRef = form} data={{search, dbtype}} onChange={searchData} dbList={dbList}/>
          <Button type="primary" onClick={onReset}>重置</Button>
        </div>
        <Table className="m-t-24" size="middle"
            rowKey={(record) => record.id} 
            dataSource={tableData} 
            loading={loading}
            pagination={{
                total,
                showTotal: (total) => `总共 ${total} 条数据`,
                pageSize: page_size,
                current: page,
                size: "default",
                onChange: changePage
            }} >
                <Column
                title="数据库类型"
                dataIndex="db_type"
                align="center"
                key="db_type"
                render={(text) => (
                    <span>
                      {dbList[text]}
                    </span>
                )}
                />
                <Column
                title="版本"
                dataIndex="version"
                key="version"
                align="center"
                />
                <Column
                title="参数名"
                dataIndex="variable_name"
                key="variable_name"
                align="center"
                />
                <Column
                title="默认值"
                dataIndex="default_value"
                key="default_value"
                align="center"
                />
                <Column
                title="取值范围"
                dataIndex="valid_values"
                key="valid_values"
                align="center"
                width="100px"
                />
                <Column
                title="是否可修改"
                dataIndex="editable"
                key="editable"
                align="center"
                render={(text) => (
                    <span>{text ? '是' : '否'}</span>    
                )}
                />
                <Column
                title="备注"
                dataIndex="description"
                key="description"
                align="center"
                render={(text) => (
                    <Tooltip title={text} overlayStyle={{maxWidth:'50%'}} placement="left">
                        <Icon type="info-circle" style={{color: '#1890ff'}}/>
                    </Tooltip>
                )}
                />
                <Column
                title="操作"
                key="action"
                align="center"
                render={(text, record: any) => (
                    <>
                        <a href="javascript:;" 
                        onClick={() => onEdit(record)}>
                            修改
                        </a>
                        <Popconfirm title="是否确定删除?" cancelText="取消" okText="确定" onCancel={(e:any) => e.stopPropagation()} onConfirm={() => onDel(record.id)}>
                            <a href="javascript:;" 
                            className="m-l-16"
                            style={{
                                color: '#ff4d4f'
                            }}>
                                删除
                            </a>
                        </Popconfirm>
                    </>
                )}
                />
            </Table>
            <Modal
                title={isEdit ? '修改用户' : '增加用户'}
                cancelText="取消"
                okText="确定"
                maskClosable={false}
                visible={modalState.visible}
                onOk={submit}
                confirmLoading={modalState.loading}
                onCancel={() => dispathModal({type: 'change'})}
                afterClose={resetAddForm}
                bodyStyle={{
                  maxHeight: `${document.body.clientHeight * 0.6}px`,
                  overflow: 'auto'
                }}
                >
                <AddForm wrappedComponentRef={(form: any) => addFormRef = form} dbList={dbList} formData={addFormState}/>
            </Modal>
      </div>
  )
}

export default withRouter(ParamsTemplate);
