import React, { useState, useEffect, useReducer } from 'react';
import { Button, Table, Modal, message } from 'antd';
import { RouteComponentProps } from 'react-router-dom';
import { useAddBreadcrumb } from '@/hook';
import { parse } from '@/utils';
import { PageTitle } from '@/components';
import FileTable from './components/fileTable';
import AddTablespaceForm from './components/addForm';
import { API } from '@/api';
import { InitTableState, InitModalState, InitAddFormState } from './state';
import { tableReducer, modalReducer } from './reducer';
import { ResetDbMode } from '@/pages/server-management/server/util';
import { IAddFormState } from './type';
const { Column } = Table;
function OracleTabelSpace(props: RouteComponentProps) {
  useAddBreadcrumb(props);
  let addFormRef: any;
  const serverid = parse(props.location.search, 'serviceid');
  const { oracle:XHR } = API.serverDetail;

  const [tableState, dispath] = useReducer(tableReducer, InitTableState);
  const { data, loading } = tableState;

  const [modalState, dispathModal] = useReducer(modalReducer, InitModalState);

  const [addFormState, setAddFormState] = useState(InitAddFormState);

  const [addSpaceState, setAddSpaceState] = useState(false); // true 增加表空间 false 增加数据文件

  useEffect(() => {
    ResetDbMode(props).then(() => {
      // getData(serverid)
    });
    return () => {
      XHR.space.cancel();
    }
  }, [])

  function getData(id: string) {
    const params = {
      params: {
        action: 'tablespace'
      }
    }
    dispath({type: 'fetch'});
    XHR.space.send(id, params).then((res: any) => {
      dispath({type: 'success', data: res || []});
    }).catch(() => {
      dispath({type: 'error', data: []});
    })
  }

  function submit() {
    addFormRef.props.form.validateFields((errors: boolean, values: IAddFormState) => {
        if (!errors) {
            dispathModal({type: 'submit'});
            const action = addSpaceState ? 'create_tablespace' : 'add_datafile'; // 区分增加表空间还是数据文件 
            XHR.add(serverid, action, { ...values }).then(() => {
                getData(serverid)
                message.success('新增成功！');
                dispathModal({type: 'success'});
            }).finally(() => {
              dispathModal({type: 'error'});
            });
        };
    });
  }

  function addDataFile(record: any) {
    dispathModal({type: 'change'});
    setAddSpaceState(false);
    setAddFormState({...addFormState,tablespace_name: record.TABLESPACE_NAME})
  }

  function resetAddForm() {
    addFormRef.props.form.resetFields();
    setAddFormState({
      tablespace_name: '',
      datafile: '',
      tablespace_size: ''
    });
  } 

  return (
      <div className="app-page">
        <PageTitle title={`表空间-Oracle-${props.location.state.servicename ? props.location.state.servicename : '未知'}`}></PageTitle>
        <Button type="primary" className="m-t-8 m-b-24" onClick={() => {dispathModal({type: 'change'});setAddSpaceState(true)}}>增加表空间</Button>
        <Table
          size="middle"
          loading={loading}
          pagination={false}
          rowKey={(record: any) => record.TABLESPACE_NAME} 
          expandedRowRender={record => <FileTable data={record.DATAFILE}/>}
          dataSource={data}
        >
          <Column
            title="名称"
            dataIndex="TABLESPACE_NAME"
            key="TABLESPACE_NAME"
            width="130px"
          />
          <Column
            title="总大小"
            dataIndex="FREE_TBS_SIZE"
            key="FREE_TBS_SIZE"
            width="130px"
            render={(text) => (
              <span>{Number(text / 1024 / 1024 / 1024).toFixed(4)}G</span>
            )}
          />
          <Column
            title="已使用大小"
            dataIndex="TBS_USED"
            key="TBS_USED"
            width="130px"
            render={(text) => (
              <span>{Number(text / 1024 / 1024 / 1024).toFixed(4)}G</span>
            )}
          />
          <Column
            title="剩余使用大小"
            dataIndex="TBS_ALLOC"
            key="TBS_ALLOC"
            width="130px"
            render={(text) => (
              <span>{Number(text / 1024 / 1024 / 1024).toFixed(4)}G</span>
            )}
          />
          <Column
            title="使用率"
            dataIndex="USED_RATE"
            key="USED_RATE"
            width="130px"
          />
          <Column
            title="操作"
            key="action"
            width="130px"
            render={(text, record) => (
              <a href="javascript:;" 
                  onClick={() => addDataFile(record)}>
                添加数据文件
              </a>
            )}
          />
        </Table>
        <Modal
          title={addSpaceState ? '增加表空间' : '增加数据文件'}
          cancelText="取消"
          okText="确定"
          maskClosable={false}
          visible={modalState.visible}
          onOk={submit}
          confirmLoading={modalState.loading}
          onCancel={() => dispathModal({type: 'change'})}
          afterClose={resetAddForm}
        >
          <AddTablespaceForm wrappedComponentRef={(form: any) => addFormRef = form} formData={addFormState}/>
        </Modal>
      </div>
  )
}

export default OracleTabelSpace;
