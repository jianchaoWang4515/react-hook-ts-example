import React, { useReducer, useEffect } from 'react';
import { Table, Button, Popconfirm, message } from 'antd';
import { parse } from '@/utils';
import { PageTitle } from '@/components';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { InitTableState } from './state';
import { tableReducer } from './reducer';
import { useAddBreadcrumb } from '@/hook';
import { ResetDbMode } from '@/pages/server-management/server/util';
import { API } from '@/api';
const { Column } = Table;
function MysqlLink(props: RouteComponentProps) {
  const serverid = parse(props.location.search, 'serviceid');
  const { mysql:XHR } = API.serverDetail;
  useAddBreadcrumb(props);

  const [tableState, dispathTable] = useReducer(tableReducer, InitTableState);
  const { data, loading } = tableState;

  useEffect(() => {
    ResetDbMode(props).then(() => {
      // getData(serverid);
    });
    return () => {
      XHR.dbLink.cancel();
    };
  }, []);

  function getData(id: string) {
    dispathTable({ type: 'fetch'});
    XHR.dbLink.send(id).then((res: any) => {
      let data = res || [];
      data.forEach((item: any) => {
        item.loading = false;
      });
      dispathTable({ type: 'success', data});
    }).catch(() => {
      dispathTable({ type: 'error'});
    });
  };

  /**
   * 改变某一行loading状态
   * @param {number} id 
   * @param {string} type del 修改删除loading  reset 重置密码loading
   */
  function setRowLoading(id: string) {
    let newData = data.map((item: any) => {
      if (item.ID === id) item.loading = !item.loading;
      return item;
    });
    dispathTable({type: 'success', data: newData});
  }

  function onKill(e: any, id: string, pid: number) {
    e.stopPropagation();
    setRowLoading(id);
    XHR.killDbLink(id, pid).then(() => {
      getData(id);
      message.success('操作成功');
    }).finally(() => {
      setRowLoading(id);
    });
  }
  return (
      <div className="app-page">
        <PageTitle title={`数据库链接-Mysql-${props.location.state.servicename ? props.location.state.servicename : '未知'}`}></PageTitle>
        <Table
         className="m-t-24"
          bordered
          size="middle"
          loading={loading}
          pagination={false}
          rowKey={(record: any) => record.ID}
          dataSource={data}
        >
          <Column
            title="ID"
            dataIndex="ID"
            key="ID"
            align="center"
          />
          <Column
            title="HOST"
            dataIndex="HOST"
            key="HOST"
            align="center"
          />
          <Column
            title="DB"
            dataIndex="DB"
            key="DB"
            align="center"
          />
          <Column
            title="COMMAND"
            dataIndex="COMMAND"
            key="COMMAND"
            align="center"
          />
          <Column
            title="TIME"
            dataIndex="TIME"
            key="TIME"
            align="center"
          />
          <Column
            title="STATE"
            dataIndex="STATE"
            key="STATE"
            align="center"
          />
          <Column
            title="INFO"
            dataIndex="INFO"
            key="INFO"
            align="center"
            className="word-wrap"
          />
          <Column
            title="操作"
            key="action"
            align="center"
            render={(text, record: any) => (
              <Popconfirm title="是否KILL此链接？" cancelText="取消" okText="确定" onCancel={(e: any) => e.stopPropagation()} onConfirm={(e: any) => onKill(e, serverid, record.ID)}>
                <Button size="small" type="danger" loading={record.loading}>KILL</Button>
              </Popconfirm>
            )}
          />
        </Table>
      </div>
  )
}

export default withRouter(MysqlLink);
