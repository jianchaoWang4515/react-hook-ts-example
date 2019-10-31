import React, { useReducer, useEffect, useState } from 'react';
import { Button, Table, Modal, message, Popconfirm } from 'antd';
import { RouteComponentProps } from 'react-router-dom';
import './index.less';
import { parse } from '@/utils';
import { PageTitle } from '@/components';
import { FCopy } from '@/pages/components';
import { useAddBreadcrumb } from '@/hook';
import { InitModalState, InitTableState, InitAddFormState, TableStatus, UserType } from './state';
import { IAddFormState } from './type';
import { modalReducer, tableReducer } from './reducer';
import { ResetDbMode } from '@/pages/server-management/server/util';
import AddUserForm from './components/addForm';
import { API } from '@/api';
const { Column } = Table;

function MysqlDbUser(props: RouteComponentProps) {
  let addFormRef: any;
  useAddBreadcrumb(props);
  const serverid = parse(props.location.search, 'serviceid');
  const { oracle:XHR } = API.serverDetail;

  const [modalState, dispathModal] = useReducer(modalReducer, InitModalState);
  const [tableState, dispathTable] = useReducer(tableReducer, InitTableState);
  const [addFormState, setAddFormState] = useState(InitAddFormState);
  const { data, loading } = tableState;

  const [syncLoading, setSyncLoading] = useState(false);
  const [actionUser, setActionUser] = useState<IAnyObj | undefined>(undefined); // 当前操作的用户信息

  useEffect(() => {
    ResetDbMode(props).then(() => {
      // getUser(serverid)
    });
    return () => {
      XHR.dbUserList.cancel();
    };
  }, []);

  function getUser(id: string) {
    const params = {
      page_size: 9999,
      serviceid: id
    }
    dispathTable({type: 'fetch'});
    XHR.dbUserList.send({ params }).then((res: any) => {
      let data = res.results || [];
      data.forEach((item: any) => {
        item.delLoading = false;
        item.resetLoading = false;
      });
      dispathTable({type: 'success', data: res.results || []});
    }).catch(() => {
      dispathTable({type: 'error', data: []});
    });
  }

  function submit(id: string) {
    addFormRef.props.form.validateFields((errors: any, values: IAddFormState) => {
        if (!errors) {
            dispathModal({type: 'submit'});
            let xhr = null;
            if (!actionUser) {
              const params = {
                ...values,
                user_type: Number(values.user_type),
                database_privilege: JSON.stringify(addFormState.database_privilege),
                dbtype: 1,
                serviceid: id,
                mode: 0
              };
              xhr = XHR.createDbUser(params);
            } else {
              const params = {
                ...values,
                database_privilege: JSON.stringify(addFormState.database_privilege),
                serviceid: id,
              };
              xhr = XHR.editUser(actionUser.id, params);
            }
            xhr.then(() => {
                getUser(serverid)
                message.success(actionUser ? '新增成功！' : '修改成功');
                dispathModal({type: 'success'});
            }).finally(() => {
              dispathModal({type: 'error'});
            });
        };
    });
  }
  /**
   * 改变某一行loading状态
   * @param {Object} id 
   * @param {string} type del 修改删除loading  reset 重置密码loading
   */
  function setRowLoading(id: number, type: 'del' | 'reset') {
    let newData = data.map((item: any) => {
      if (item.id === id) {
        if (type === 'del') item.delLoading = !item.delLoading;
        else item.resetLoading = !item.resetLoading;
      }
      return item;
    });
    dispathTable({type: 'success', data: newData});
  }

  function resetAddForm() {
    addFormRef.props.form.resetFields();
    setAddFormState({
      ...InitAddFormState
    });
  };

  function resetPwd(userId: number, serviceid: string) {
    const params = {
      serviceid,
      password: ''
    };
    setRowLoading(userId, 'reset');
    XHR.resetPwd(userId, params).then(() => {
      getUser(serviceid);
      message.success('重置成功');
    }).finally(() => {
      setRowLoading(userId, 'reset');
    });
  };

  /**
   * 删除数据库
   * @param id 数据库id 
   * @param mode 0 删除数据库数据 1 只删除记录 
   */
  function onDel(e: any, userId: number, mode: 0 | 1) {
    e.stopPropagation();
    setRowLoading(userId, 'del');
    XHR.deleteUser(userId, { mode }).then(() => {
      const dataSource = [...data];
      dispathTable({ type: 'success', data: dataSource.filter(item => item.id !== userId) });
      message.success('删除成功');
    }).catch(() => {
      setRowLoading(userId, 'del');
    });
  };

  function syncDbUser(id: string) {
    setSyncLoading(true);
    API.serverDetail.mysql.syncDbUser(id).then(() => {
      getUser(id);
      message.success('同步成功');
    }).finally(() => {
      setSyncLoading(false);
    });
  };

  function onEdit(record: any) {
    const { password, username, mysql_host = '%', user_type, status, database_privilege, privilege = "", remarks } = record;
    const owners = privilege.owners ? privilege.owners.reduce((a: string,b: any,index: number) => {
      return a + `${index === 0 ? '' : ','}${b.ownername}`;
    }, '') : '';
    const applications = privilege.applications ? privilege.applications.reduce((a: string,b: any,index: number) => {
      return a + `${index === 0 ? '' : ','}${b.appname}`;
    }, '') : '';
    setAddFormState({
      ...addFormState,
      username,
      password,
      user_type: `${user_type}`,
      status: `${status}`,
      owners,
      mysql_host,
      applications,
      database_privilege: database_privilege || [],
      remarks
    });
    setActionUser(record);
    dispathModal({type: 'change'});
  }
  /**
   * 穿梭框列表复选框变化时设置databases
   */
  function transferChange (e: any, data: any) {
    const { checked } = e.target;
    const { databasename, privilege } = data;
    let preSelected = addFormState.database_privilege;
    let newData;
    if (checked) {
        let obj = {
            databasename,
            privilege
        }
        newData = [ obj, ...preSelected ];
    } else {
      newData = preSelected.filter(item => item.databasename !== databasename);
    }
    addFormRef.props.form.setFieldsValue({database_privilege: newData});
    setAddFormState({
      ...addFormState,
      database_privilege: newData
    });
}
/**
 * 穿梭框已选数据库
 */
function transferDel(data: any) {
  const newData = addFormState.database_privilege.filter(item => item.databasename !== data.databasename);
  addFormRef.props.form.setFieldsValue({database_privilege: newData});
  setAddFormState({
    ...addFormState,
    database_privilege: newData
  });
}
/**
 * 改变梭框已选数据库权限时回调
 */
function onAuthChange(e: any, data: any) {
  let newData = addFormState.database_privilege.map(item => {
    if (item.databasename === data.databasename) {
      item.privilege = e.target.value;
    }
    return item;
  });
  addFormRef.props.form.setFieldsValue({database_privilege: newData});
  setAddFormState({
    ...addFormState,
    database_privilege: newData
  });
}
  return (
      <div className="app-page db-user-page">
        <PageTitle title={`数据库用户-Mysql-${props.location.state.servicename ? props.location.state.servicename : '未知'}`}></PageTitle>
        <Button type="primary" className="m-t-8 m-b-24" onClick={() => {dispathModal({type: 'change'});setActionUser(undefined);}}>添加用户</Button>
        <Button loading={syncLoading} type="primary" className="m-t-8 m-l-24" onClick={() => syncDbUser(serverid)}>同步数据库用户</Button>
        <Table
          bordered
          size="middle"
          loading={loading}
          pagination={false}
          rowKey={(record: any) => record.id}
          dataSource={data}
        >
          <Column
            title="用户"
            dataIndex="username"
            key="username"
            align="center"
            width="150px"
          />
          <Column
            title="Host"
            dataIndex="mysql_host"
            key="mysql_host"
            align="center"
            width="100px"
          />
          <Column
            title="用户类型"
            dataIndex="user_type"
            key="user_type"
            align="center"
            width="100px"
            render={(text) => (
              <span>
                {UserType.get(String(text))}
              </span>
            )}
          />
          <Column
            title="状态"
            dataIndex="status"
            key="status"
            align="center"
            width="80px"
            render={(text) => (
              <span>
                {TableStatus.get(String(text))}
              </span>
            )}
          />
          <Column
            title="数据库"
            dataIndex="databases"
            key="databases"
            align="center"
            width="200px"
            className="word-wrap"
          />
          <Column
            title="加密串"
            dataIndex="encryption_string"
            key="encryption_string"
            align="center"
            className="mw-100"
            render={(text) => (
              <FCopy isTooltip={true} TooltipProps={{overlayStyle: {maxWidth:'50%'}}}>{text}</FCopy>
            )}
          />
          <Column
            title="操作"
            key="action"
            align="center"
            width="250px"
            render={(text, record: any) => (
              <>
                {record.user_type !== 0 && (
                  <Button size="small" type="primary" onClick={() => onEdit(record)}>修改</Button>
                )}
                <Popconfirm title="此操作会重置数据库中该用户密码,是否重置?" cancelText="取消" okText="确定" onCancel={(e: any) => e.stopPropagation()} onConfirm={() => {resetPwd(record.id, serverid)}}>
                  <Button size="small" loading={record.resetLoading} className={record.user_type !== 0 ? 'm-l-8' : ''} type="danger">重置密码</Button>
                </Popconfirm>
                {record.user_type !== 0 && (
                  <Popconfirm title="是否在数据库中删除数据?" cancelText="只删除记录" okText="确定" onCancel={(e) => onDel(e, record.id, 1)} onConfirm={(e) => onDel(e, record.id, 0)}>
                    <Button size="small" loading={record.delLoading} className="m-l-8" type="danger">删除</Button>
                  </Popconfirm>
                )}
              </>
            )}
          />
        </Table>
        <Modal
          title='创建数据库'
          cancelText="取消"
          okText="确定"
          maskClosable={false}
          visible={modalState.visible}
          onOk={() => submit(serverid)}
          confirmLoading={modalState.loading}
          onCancel={() => dispathModal({type: 'change'})}
          afterClose={resetAddForm}
          bodyStyle={{
            maxHeight: `${document.body.clientHeight * 0.6}px`,
            overflow: 'auto'
          }}
        >
          <AddUserForm wrappedComponentRef={(form: any) => addFormRef = form} 
                      formData={addFormState}
                      serviceid={serverid} 
                      transferChange={transferChange}
                      transferDel={transferDel}
                      onAuthChange={onAuthChange}
                      isAdd={Boolean(actionUser)}/>
        </Modal>
      </div>
  )
}

export default MysqlDbUser;
