import React, { useEffect, useReducer } from 'react';
import { Table } from 'antd';
import { RouteComponentProps } from 'react-router-dom';
import { useAddBreadcrumb } from '@/hook';
import { parse } from '@/utils';
import { PageTitle } from '@/components';
import { API } from '@/api';
import { InitTableState } from './state';
import { tableReducer } from './reducer';
import { ResetDbMode } from '@/pages/server-management/server/util';
const { Column } = Table;
function OracleAsm(props: RouteComponentProps) {
  useAddBreadcrumb(props);
  const serverid = parse(props.location.search, 'serviceid');
  const { oracle:XHR } = API.serverDetail;

  const [tableState, dispath] = useReducer(tableReducer, InitTableState);
  const { data, loading } = tableState;

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
        action: 'asminfo'
      }
    }
    dispath({type: 'fetch'});
    XHR.space.send(id, params).then((res: any) => {
      dispath({type: 'success', data: res || []});
    }).catch(() => {
      dispath({type: 'error', data: []});
    })
  }

  return (
      <div className="app-page">
        <PageTitle className="m-b-24" title={`ASM-Oracle-${props.location.state.servicename ? props.location.state.servicename : '未知'}`}></PageTitle>
        <Table
          className="m-t-24"
          size="middle"
          loading={loading}
          pagination={false}
          rowKey={(record: any) => record.NAME} 
          dataSource={data}
        >
          <Column
            title="NAME"
            dataIndex="NAME"
            key="NAME"
          />
          <Column
            title="TOTAL_MB"
            dataIndex="TOTAL_MB"
            key="TOTAL_MB"
          />
          <Column
            title="FREE_MB"
            dataIndex="FREE_MB"
            key="FREE_MB"
          />
          <Column
            title="USED_RATE"
            dataIndex="USED_RATE"
            key="USED_RATE"
            render={(text) => (
              <span>{text}%</span>
            )}
          />
        </Table>
      </div>
  )
}

export default OracleAsm;
