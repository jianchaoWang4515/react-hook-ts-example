import React, { useReducer, useEffect, useState } from 'react';
import { Button, Table, Modal, message, Popconfirm } from 'antd';
import { RouteComponentProps } from 'react-router-dom';
import '../../mysql/user/index.less';
import { parse } from '@/utils';
import { PageTitle } from '@/components';
import { FCopy } from '@/pages/components';
import { useAddBreadcrumb } from '@/hook';
import { InitModalState, InitTableState, InitAddFormState, TableStatus } from './state';
import { modalReducer, tableReducer } from './reducer';
import AddDbUserForm from './components/addForm';
import { ResetDbMode } from '@/pages/server-management/server/util';
import { API } from '@/api';
import { IAddFormState } from './type';
const { Column } = Table;
function OracleDbUser(props: RouteComponentProps) {
  let addFormRef: any;
  useAddBreadcrumb(props);
  const serverid = parse(props.location.search, 'serviceid');
  const { oracle:XHR } = API.serverDetail;
  
  const [modalState, dispathModal] = useReducer(modalReducer, InitModalState);
  const [tableState, dispathTable] = useReducer(tableReducer, InitTableState);
  const [addFormState, setAddFormState] = useState(InitAddFormState);
  const { data, loading } = tableState;

  const [syncLoading, setSyncLoading] = useState<boolean>(false);
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
        item.resetLoading = false;
        item.delLoading = false;
      });
      dispathTable({type: 'success', data});
    }).catch(() => {
      dispathTable({type: 'error', data: []});
    });
  }

  function submit(id: string) {
    addFormRef.props.form.validateFields((errors: boolean, values: IAddFormState) => {
        if (!errors) {
            dispathModal({type: 'submit'});
            let xhr = null;
            if (!actionUser) {
              const params = {
                ...values,
                user_type: Number(values.user_type),
                dbtype: 0,
                role: values.role.join(),
                serviceid: id,
                mysql_host: '%',
                tables: values.tables ? values.tables.join() : '',
                mode: 0
              };
              xhr = XHR.createDbUser(params);
            } else {
              const params = {
                ...values,
                serviceid: id,
                role: values.role.join(),
              };
              xhr = XHR.editUser(actionUser.id, params);
            };
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
  function resetAddForm() {
    addFormRef.props.form.resetFields();
    setAddFormState({
      ...InitAddFormState
    })
  } 

   /**
   * 改变某一行loading状态
   * @param id 
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

  /**
   * 删除用户
   * @param { Number } userId 用户id 
   * @param { Number } mode 0 在数据库中删除 1 只删除记录
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
    })
  }

  function syncDbUser(id: string) {
    setSyncLoading(true);
    XHR.syncDbUser(id).then(() => {
      getUser(id);
      message.success('同步成功');
    }).finally(() => {
      setSyncLoading(false);
    })
  }

  function resetPwd(userId: number, serviceid: string) {
    const params = {
      serviceid,
      password: ''
    }
    setRowLoading(userId, 'reset');
    XHR.resetPwd(userId, params).then(() => {
      getUser(serviceid);
      message.success('重置成功');
    }).finally(() => {
      setRowLoading(userId, 'reset');
    })
  }

  /**
   * 改变用户类型回调 用于更换新增用户表单内容
   */
  function changeUserType() {
    // 在onChange合成事件中无法同步拿到owners_tag，利用setTimeout解决
    setTimeout(() => {
      const user_type = addFormRef.props.form.getFieldValue('user_type');
      setAddFormState({
        ...addFormState,
        user_type,
        tables: []
      });
    });
  }
  /**
   * 穿梭框值改变后设置tables的值
   * @param {Array} data 改变后选中项key的集合
   */
  function transferChange(data: any[]) {
    const newData = [ ...data ];
    addFormRef.props.form.setFieldsValue({tables: newData.join()});
    setAddFormState({
      ...addFormState,
      tables: newData
    })
  }
  
  function onEdit(record: any) {
    const { password, username, user_type, status, databases, role, privilege = "", remarks } = record;
    const owners = privilege.owners ? privilege.owners.reduce((a: string,b: IAnyObj,index: number) => {
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
      applications,
      databases,
      role: role ? role.toLowerCase().split(',') : [],
      remarks
    });
    setActionUser(record);
    dispathModal({type: 'change'});
  }
  return (
      <div className="app-page db-user-page">
        <PageTitle title={`数据库用户-Oracle-${props.location.state.servicename ? props.location.state.servicename : '未知'}`}></PageTitle>
        <Button type="primary" className="m-t-8 m-b-24" onClick={() => {setActionUser(undefined);dispathModal({type: 'change'});}}>添加用户</Button>
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
          />
          <Column
            title="用户类型"
            dataIndex="user_type"
            key="user_type"
            align="center"
            render={(text) => (
              <span>
                {text === 0 && '管理用户'}
                {text === 1 && '普通用户'}
                {text === 2 && '只读用户'}
              </span>
            )}
          />
          <Column
            title="状态"
            dataIndex="status"
            key="status"
            align="center"
            render={(text) => (
              <span>
                {TableStatus.get(String(text))}
              </span>
            )}
          />
          <Column
            title="默认表空间"
            dataIndex="databases"
            key="databases"
            align="center"
          />
          <Column
            title="角色"
            dataIndex="role"
            key="role"
            align="center"
            className="word-wrap"
          />
          <Column
            title="加密串"
            dataIndex="encryption_string"
            key="encryption_string"
            align="center"
            className="word-wrap mw-100"
            render={(text) => (
              <FCopy isTooltip={true} TooltipProps={{overlayStyle: {maxWidth:'80%'}}}>{text}</FCopy>
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
                  <Popconfirm title="是否删除记录?" cancelText="取消" okText="确定" onCancel={(e: any) => e.stopPropagation()} onConfirm={(e: any) => onDel(e, record.id, 1)}>
                    <Button size="small" loading={record.delLoading} className="m-l-8" type="danger">删除</Button>
                  </Popconfirm>
                )}
              </>
            )}
          />
        </Table>
        <Modal
          title={actionUser ? '创建用户' : '修改用户'}
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
          <AddDbUserForm wrappedComponentRef={(form: any) => addFormRef = form} 
                          serviceid={serverid} 
                          formData={addFormState} 
                          changeUserType={changeUserType}
                          transferChange={transferChange}
                          isAdd={Boolean(actionUser)}/>
        </Modal>
      </div>
  )
}

export default OracleDbUser;
