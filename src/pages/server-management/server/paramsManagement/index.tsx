import React, { useReducer, useEffect, useState } from 'react';
import { Select, Table, Tooltip, Icon, Input, message, Button, Modal } from 'antd';
import { RouteComponentProps } from 'react-router-dom';
import { parse } from '@/utils';
import { PageTitle } from '@/components';
import { useAddBreadcrumb } from '@/hook';
import { InitTableState } from './state';
import { tableReducer } from './reducer';
import { ResetDbMode } from '@/pages/server-management/server/util';
import { FEdit } from '@/pages/components';
import OperationLog from './operation-log';
import { DbList } from '../state';
import { API } from '@/api';
const { Column } = Table;
function MysqlDbUser(props: RouteComponentProps) {
  useAddBreadcrumb(props);
  const serverid = parse(props.location.search, 'serviceid');
  const { serverDetail:XHR } = API;
  const pageSize = 20;
  const [tableState, dispathTable] = useReducer(tableReducer, InitTableState);
  const { data, loading } = tableState;
  const [modalVisible, setModalVisible] = useState(false);
  const [schameList, setSchameList] = useState<any[]>([]);
  const [selectedSchame, setSelectedSchame] = useState<string | number | undefined>(undefined);
  const [searchKey, setSearchKey] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    ResetDbMode(props).then(() => {
      // getSchema(serverid);
    });
    return () => {
      XHR.schema.cancel();
    };
  }, []);

  useEffect(() => {
    if (selectedSchame) getList({selectedSchame, searchKey, page});
    return () => {
      XHR.params.cancel();
    }
  }, [selectedSchame, searchKey, page]);

  function getSchema (id: string) {
    const params ={ 
      params: {
        serviceid: id,
        page_size: pageSize
      }
    }
    return XHR.schema.send(params).then((res: any) => {
      const data = res.results || [];
      const result = data.map((item: any) => {
        const { hosts = {}, id } = item;
        const { ip } = hosts;
        return {
          id,
          ip
        };
      });
      const defaultScameId = result.length ? result[0].id : null;
      setSelectedSchame(defaultScameId);
      setSchameList([...result]);
    });
  }
  interface IGetListParam {
    selectedSchame?: string | number,
    searchKey?: string,
    page?: number
  }
  function getList({selectedSchame, searchKey, page}: IGetListParam) {
    const params = {
      page_size: 20,
      page,
      search: searchKey,
      schemaid: selectedSchame
    }
    dispathTable({type: 'fetch'});
    XHR.params.send({ params }).then((res: any) => {
      dispathTable({type: 'success', data: res.results || [], total: res.count || 0 });
    }).catch(() => {
      dispathTable({type: 'error'});
    });
  }
  function onChange(id: string | number) {
    setSelectedSchame(id);
  }
  interface IEditParam {
    e: any,
    resolve: () => void,
    record: any,
    oldVal: string,
    schemaid: string | number | undefined
  }
  function onEdit({e, resolve, record, oldVal, schemaid}: IEditParam) {
    const { value } = e;
    const params = {
      old_variable_value: oldVal,
      new_variable_value: value,
      schemaid
    }
    XHR.editParams(record.id, params).then(() => {
      getList({selectedSchame, searchKey, page});
      message.success('修改成功！');
      resolve();
    });
  }
  return (
      <div className="app-page">
        <PageTitle title={`参数管理-${DbList[props.location.state.model]}-${props.location.state.servicename ? props.location.state.servicename : '未知'}`}></PageTitle>
        <div className="m-t-8 m-b-24" style={{overflow: 'hidden'}}>
          <Button style={{ float: 'left' }} type="primary" icon="eye" onClick={() => setModalVisible(true)}>查看操作日志</Button>
          <Input.Search
            className="m-l-24"
            placeholder="请输入关键字"
            allowClear
            onPressEnter={(e: any) => setSearchKey(e.target.value)}
            onSearch={(value) => setSearchKey(value)}
            style={{ width: 250, float: 'right' }}
          />
          <Select placeholder="数据库类型" style={{width: 150, float: 'right'}} onChange={onChange} value={selectedSchame}>
              {schameList.map(item => (
                <Select.Option key={item.id} value={item.id}>{item.ip}</Select.Option>
              ))}
          </Select>
        </div>
        
        <Table
          bordered
          size="middle"
          loading={loading}
          pagination={{
            total: tableState.total,
            showTotal: (total) => `总共 ${total} 条数据`,
            pageSize: pageSize,
            current: page,
            size: "default",
            onChange: (num) => setPage(num)
          }}
          rowKey={(record: any) => record.id}
          dataSource={data}
        >
          <Column
            title="参数名"
            dataIndex="variable_name"
            key="variable_name"
            align="center"
          />
          <Column
            title="值"
            dataIndex="variable_value"
            key="variable_value"
            align="center"
            width="200px"
            render={(text, record: any) => {
              const oldVal = text;
              const schemaid = selectedSchame;
              return (
                <FEdit 
                defaultValue={text}
                onOk={(e, resolve) => onEdit({oldVal, record, schemaid, e, resolve})}
                isPop={true}
                isEditShow={!!record.editable}
                opt={{
                  name: 'new_variable_value',
                  defaultValue: text,
                  style: {
                    width: '100px'
                  }
                }}/>
              )
            }}
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
            className="word-wrap"
          />
          <Column
            title="说明"
            dataIndex="description"
            key="description"
            align="center"
            render={(text) => (
              <Tooltip title={text} overlayStyle={{maxWidth:'50%'}} placement="left">
                <Icon type="info-circle" style={{color: '#1890ff'}}/>
              </Tooltip>
            )}
          />
        </Table>
        <Modal
          title="操作日志列表"
          visible={modalVisible}
          onCancel={() => setModalVisible(false)}
          destroyOnClose={true}
          footer={null}
          width={800}
        >
          <OperationLog serviceId={serverid}/>
        </Modal>
      </div>
  )
}

export default MysqlDbUser;
