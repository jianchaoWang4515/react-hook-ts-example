import React, { useReducer, useEffect, useState, useCallback } from 'react';
import { Table, Button, DatePicker, Pagination, Typography, Tooltip, Drawer } from 'antd';
import DetailTable from './detailTable';
import SampleInfo from './components/sample';
import OptimizeInfo from './components/optimize';
import { parse } from '@/utils';
import { PageTitle } from '@/components';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { InitTableState, InitSearchState } from './state';
import { ISearchState } from './type';
import { IData } from './components/type';
import { tableReducer } from './reducer';
import { useAddBreadcrumb } from '@/hook';
import { ResetDbMode } from '@/pages/server-management/server/util';
import { API } from '@/api';
const { Column } = Table;
const { RangePicker } = DatePicker;
const { Paragraph } = Typography;

function SlowSQL(props: RouteComponentProps) {
  const serverid = parse(props.location.search, 'serviceid');
  const { mysql:XHR } = API.serverDetail;
  useAddBreadcrumb(props);

  const [visible, setVisible] = useState<boolean>(false);
  const [actionType, setActionType] = useState<'sample' | 'optimize' | null>(null); // 样例或优化
  const [activityData, setActivityData] = useState<IData>();
  const [tableState, dispathTable] = useReducer(tableReducer, InitTableState);
  const { data, loading } = tableState;
  const [searchState, setSearchState] = useState(InitSearchState);
  const { time, pageSize, total } = searchState;
  const [page, setPage] = useState(1);
  
  function getData({serverid, time, page = 1, pageSize = 20}: ISearchState) {
    interface IParams extends ISearchState {
      start_time?: string,
      stop_time?: string,
      serviceid?: string
    }
    const params: IParams = {
        page,
        pageSize,
        serviceid: serverid
      }
    if (time) {
      params.start_time = time[0];
      params.stop_time = time[1];
    }
    dispathTable({ type: 'fetch'});
    XHR.slowSQLList.send({params}).then((res: any) => {
      dispathTable({ type: 'success', data: res.results || []});
      setSearchState({
        ...searchState,
        total: res.count || 0
      })
    }).catch(() => {
      dispathTable({ type: 'error'});
    });
  };

  let fetch = useCallback(() => {
    // getData({serverid, time, page, pageSize});
  }, [serverid, time, page, pageSize]);

  useEffect(() => {
    ResetDbMode(props).then(() => {
      fetch();
    });
    return () => {
      XHR.slowSQLList.cancel();
    }
  }, [fetch]);

  function onOk(dates: any) {
    const time: [string, string] = [dates[0].format('YYYY-MM-DD HH:MM:ss'), dates[1].format('YYYY-MM-DD HH:MM:ss')]
    setSearchState({
      ...searchState,
      time
    });
  }

  return (
      <div className="app-page">
        <PageTitle title={`数据库链接-Mysql-${props.location.state.servicename ? props.location.state.servicename : '未知'}`}></PageTitle>
        <div className="clear-box">
          <RangePicker style={{float: "right"}} format="YYYY-MM-DD HH:MM:ss" showTime={{ format: 'HH:MM:ss' }} onOk={onOk} />
        </div>
        <Table
         className="m-t-24"
          bordered
          size="middle"
          loading={loading}
          pagination={false}
          expandedRowRender={(record, index) => <DetailTable index={index} data={[record]}/>}
          rowKey={(record: any) => record.checksum}
          dataSource={data}
        >
          <Column
            title="checksum"
            dataIndex="checksum"
            key="checksum"
            align="center"
            width="200px"
          />
          <Column
            title="SQL模型"
            dataIndex="fingerprint"
            key="fingerprint"
            align="center"
            width="200px"
            className="word-wrap"
            render={(text) => (
              <Tooltip title={text} overlayStyle={{maxWidth:'50%'}}>
                <Paragraph ellipsis={{rows: 2}}>{text}</Paragraph>
              </Tooltip>
            )}
          />
          <Column
            title="数据库"
            dataIndex="slowqueryhistory__db_max"
            key="slowqueryhistory__db_max"
            align="center"
            width="150px"
          />
          <Column
            title="执行次数"
            dataIndex="ts_cnt"
            key="ts_cnt"
            align="center"
            width="150px"
          />
          <Column
            title="平均执行时间"
            dataIndex="avg_query_time"
            key="avg_query_time"
            align="center"
            width="150px"
          />
          <Column
            title="操作"
            key="action"
            align="center"
            width="150px"
            render={(text, record: any) => (
              <>
                <Button size="small" type="primary" onClick={() => {setVisible(true);setActivityData(record);setActionType('sample')}}>样例</Button>
                <Button className="m-l-16" size="small" type="primary" onClick={() => {setVisible(true);setActivityData(record);setActionType('optimize')}}>优化</Button>
              </>
            )}
          />
        </Table>
        <Pagination
          style={{
            textAlign: "right"
          }}
          className="m-t-24"
          hideOnSinglePage
          total={total}
          showTotal={total => `共 ${total} 条`}
          pageSize={pageSize}
          current={page}
          onChange={(page) => setPage(page)}
        />
        <Drawer
          width={700}
          placement="right"
          closable={false}
          onClose={() => setVisible(false)}
          visible={visible}
        >
          {actionType === 'sample' && (
            <SampleInfo data={activityData} serverid={serverid}></SampleInfo>
          )}
          {actionType === 'optimize' && (
            <OptimizeInfo data={activityData} serverid={serverid}></OptimizeInfo>
          )}
        </Drawer>
      </div>
  )
}

export default withRouter(SlowSQL);
