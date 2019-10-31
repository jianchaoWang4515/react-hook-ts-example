import React, { useState, useEffect, useReducer } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import './index.less';
import { Descriptions, message, Tag, Button, Empty, Modal, Popconfirm, Select } from 'antd';
import { Link } from 'react-router-dom';
import { useAddBreadcrumb } from '@/hook';
import { PageTitle } from '@/components';
import { parse } from '@/utils';
import { InitServerInfoState, InitAddFormState, InitModalState } from './state';
import { modalReducer } from './reducer';
import InstanceForm from './components/instanceForm';
import { API } from '@/api';
import { DbList } from '../state';
import { FEdit } from '@/pages/components';
/**
 * 所有类型的数据库的基本信息公用此组件
 */
function ServerInfo(props: RouteComponentProps) {
  useAddBreadcrumb(props);
  let addFormRef: any;

  const { serverDetail:XHR } = API;
  const serverid = parse(props.location.search, 'serviceid');
  const [instanceState, setInstanceState] = useState<any[]>([{ ip: '127.0.0.1', port: 8080,}]);
  const [serverInfoState, setServerInfoState] = useState(InitServerInfoState);
  const [currentDbtype, setCurrentDbtype] = useState<string | number | null>(null);
  const [addFormState] = useState(InitAddFormState);
  const [modalState, dispathModal] = useReducer(modalReducer, InitModalState);
  const [ownersAll, setOwnersAll] = useState([]);
  const [ownersChecked, setOwnersChecked] = useState<any[]>([]);
  const [ownersLoading, setOwnersLoading] = useState(false);
  const { serviceid,
          servicename, 
          dbtype, 
          framework = {}, 
          service_version, 
          linkaddress,
          ownersList = [],
          port, 
          sid,
          remarks } = serverInfoState;

  useEffect(() => {
    // getInfo(serverid);
    // getSchema(serverid);
    // getOwners(true);
    return () => {
      XHR.info.cancel();
      XHR.schema.cancel();
    }
  }, []);
  /**
   * 获取数据库信息
   * @param id 服务id
   */
  function getInfo(id: number | string) {
    XHR.info.send(id).then((res: any) => {
      const ownersList = res.privilege ? JSON.parse(res.privilege.replace(/"([^"]*)"/g, "$1").replace(/'([^']*)'/g, '"$1"')).owner : [];
      setServerInfoState({
        ...serverInfoState,
        ...res,
        ownersList
      });
      setOwnersChecked(ownersList.map((item: any) => item.userid));
      // 针对手动修改路由serviceid情况下需要重新匹配state.model类型
      if (!props.location.state || (props.location.state && String(res.dbtype) !== props.location.state.model) || !props.location.state.servicename) {
        props.history.replace({
          ...props.location,
          state: {
            ...props.location.state,
            model: String(res.dbtype),
            servicename: res.servicename
          }
        });
      };
    });
  };
  /**
   * 获取数据库实例
   */
  function getSchema(id: number | string) {
    const params ={ 
      params: {
        serviceid: id,
        page_size: 9999
      }
    }
    XHR.schema.send(params).then((res: any) => {
      const dbtype = (res.results && res.results.length) ? res.results[0].dbtype : null;
      setCurrentDbtype(dbtype);
      let data = [];
      switch (dbtype) {
        case 0:
          // oracle
          data = res.results ? res.results.map((item: any) => {
            const { schematype, schemastate, port = '', id, remarks = '' } = item;
            const { ip = '', id: hostId } = item.hosts || {};
            const schema_config = item.schema_config ? JSON.parse(item.schema_config.replace(/'([^']*)'/g, '"$1"')) : {};
            interface INewSchemaConfig {
              MYLABEL?: string,
              VAL?: any
            }
            let newSchemaConfig: INewSchemaConfig[] = [];
            for (const key in schema_config) {
              let obj: INewSchemaConfig = {};
              if (key !== 'VERSION') {
                obj.MYLABEL = key;
                obj.VAL = schema_config[key];
                newSchemaConfig.push(obj);
              };
            };
            return {
              schema_config: [ ...newSchemaConfig ],
              version: schema_config.VERSION,
              schematype,
              schemastate,
              port,
              ip,
              id,
              hostId,
              remarks,
              refreshLoading: false,
              delLoading: false
            }
          }) : [];
            break;
        default:
          // 其他
           data = res.results ? res.results.map((item: any) => {
            const { schematype, schemastate, id, port = '', remarks = '' } = item;
            const { ip = '', id: hostId } = item.hosts || {};
            const schema_config = item.schema_config ? JSON.parse(item.schema_config.replace(/'([^']*)'/g, '"$1"')) : {};
            return {
              ...schema_config,
              ip,
              port,
              schematype,
              schemastate,
              id,
              hostId,
              remarks,
              refreshLoading: false,
              delLoading: false
            }
          }) : [];
          break;
      }
      setInstanceState([
        ...data
      ]);
    });
  }
  function getOwners(open: boolean) {
    if (open) {
      const params = {
        page_size: 99999
      }
      setOwnersLoading(true);
      API.userMgt.user.list.send({ params }).then((res: any) => {
        setOwnersAll(res.results || []);
        setOwnersLoading(false);
      });
    };
  }
  /**
   * 修改某一项
   */
  function onEdit(e: any, resolve: any) {
    const { value } = e;
    type nameType = 'servicename' | 'linkaddress' | 'port' | 'sid' | 'owners' | 'remarks';
    const name: nameType = e.name;
    if (serverInfoState[name] !== value) {
      const params = {
        ...serverInfoState,
        [name]: value
      }
      XHR.edit(serverid, params).then((res: any) => {
          setServerInfoState({
            ...serverInfoState,
            [name]: value
          })
          message.success('修改成功');
          resolve();
      });
    } else {
      resolve();
    };
  }
  function onSelectEdit(props: any, resolve: any) {
    const { name } = props.opt;
    const params = {
      ...serverInfoState,
      [name]: ownersChecked
    }
    XHR.edit(serverid, params).then((res: any) => {
        getInfo(serverid);
        message.success('修改成功');
        resolve()
    });
  }
  /**
   * 改变某一行loading状态
   * @param {Object} id 
   * @param {string} type del 修改删除loading  refresh 修改刷新loading
   */
  function setRowLoading(id: number | string, type: 'del' | 'refresh') {
    let newData = instanceState.map(item => {
      if (item.id === id) {
        if (type === 'del') item.delLoading = !item.delLoading;
        else item.refreshLoading = !item.refreshLoading;
      }
      return item;
    });
    setInstanceState([
      ...newData
    ]);
  }

  function onRefresh(id: number | string) {
    setRowLoading(id, 'refresh');
    XHR.schemaDetail(id).then(() => {
      setRowLoading(id, 'refresh');
      message.success('刷新成功');
    });
  }

  function addInstanceSubmit(id: number | string) {
    addFormRef.props.form.validateFields((errors: any, values: any) => {
        if (!errors) {
            dispathModal({type: 'submit'});
            const params = {
              ...values,
              serviceid: id,
              schematype: 1,
              dbtype: currentDbtype
            };
            XHR.addSchema(params).then(() => {
                getSchema(serverid)
                message.success('新增成功！');
                dispathModal({type: 'success'});
            }).finally(() => {
              dispathModal({type: 'error'});
            });
        };
    });
  }
  
  function delInstance(id: number | string) {
    setRowLoading(id, 'del');
    XHR.delSchema(id).then(() => {
        setInstanceState([...instanceState.filter((item) => item.id !== id)]);
        message.success('删除成功！');
    });
  }
  function onChange(value: any[]) {
    setOwnersChecked(value);
  }
  return (
      <div className="app-page server-info-page">
        <PageTitle title={`DB服务详情-${DbList[String(dbtype)]}-${props.location.state ? props.location.state.servicename : ''}`}>
          </PageTitle>
        <Descriptions className="host-detail p-16" column={{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }}>
            <Descriptions.Item label="ServiceID">{serviceid || '-'}</Descriptions.Item>
            <Descriptions.Item label="服务名称">
              <FEdit 
              defaultValue={servicename}
              onOk={(e, resolve) => onEdit(e, resolve)}
              onPressEnter={(e, resolve) => onEdit(e, resolve)}
              onBlur={(e, resolve) => onEdit(e, resolve)}
              opt={{
                name: 'servicename',
                defaultValue: servicename
              }}/>
            </Descriptions.Item>
            <Descriptions.Item label="数据库类型">
                {DbList[String(dbtype)]}
              </Descriptions.Item>
            <Descriptions.Item label="架构类型">{framework.name || '-'}</Descriptions.Item>
            <Descriptions.Item label="链接地址">
              <FEdit 
              defaultValue={linkaddress}
              onOk={(e, resolve) => onEdit(e, resolve)}
              onBlur={(e, resolve) => onEdit(e, resolve)}
              onPressEnter={(e, resolve) => onEdit(e, resolve)}
              opt={{
                name: 'linkaddress',
                defaultValue: linkaddress
              }}/>
            </Descriptions.Item>
            <Descriptions.Item label="链接端口">
              <FEdit 
              defaultValue={port}
              onOk={(e, resolve) => onEdit(e, resolve)}
              onBlur={(e, resolve) => onEdit(e, resolve)}
              onPressEnter={(e, resolve) => onEdit(e, resolve)}
              opt={{
                name: 'port',
                defaultValue: port,
              }}/>
            </Descriptions.Item>
            <Descriptions.Item label="SID">
              <FEdit 
              defaultValue={sid}
              onOk={(e, resolve) => onEdit(e, resolve)}
              onBlur={(e, resolve) => onEdit(e, resolve)}
              onPressEnter={(e, resolve) => onEdit(e, resolve)}
              opt={{
                name: 'sid',
                defaultValue: sid
              }}/>
            </Descriptions.Item>
            <Descriptions.Item label="负责人">
              <FEdit 
              type="select"
              defaultValue={ownersList.length > 0 ? ownersList.reduce((a, b, index) => {
                return `${a}${index > 0 ? '、': ''}${b.real_name}`
              }, '') :'-'}
              onOk={(props, resolve) => onSelectEdit(props, resolve)}
              onEdit={() => getOwners(true)}
              onBlur={(props, resolve) => onEdit(props, resolve)}
              onPressEnter={(props, resolve) => onEdit(props, resolve)}
              opt={{
                name: 'owners',
                mode: "multiple",
                defaultValue: ownersList.map(item => item.userid),
                loading: ownersLoading,
                onDropdownVisibleChange: (open: boolean) => getOwners(open),
                onChange: onChange
              }}> 
                {ownersAll.map((item: any) => (
                  <Select.Option key={item.id} value={item.id}>{item.real_name || `${item.username}(用户名)`}</Select.Option>
                ))}
              </FEdit>
            </Descriptions.Item>
            <Descriptions.Item label="服务版本">{service_version || '-'}</Descriptions.Item>
            <Descriptions.Item label="备注">
              <FEdit 
              defaultValue={remarks}
              onOk={(e, resolve) => onEdit(e, resolve)}
              onBlur={(e, resolve) => onEdit(e, resolve)}
              onPressEnter={(e, resolve) => onEdit(e, resolve)}
              opt={{
                name: 'remarks',
                defaultValue: remarks
              }}/>
            </Descriptions.Item>
        </Descriptions>
        <PageTitle title="数据库实例" isIcon={false}>
          <Button type="primary" size="small" style={{float: 'right', padding: '0 18px'}} onClick={() => {dispathModal({type: 'change'})} }>新增实例</Button>
        </PageTitle>
        {currentDbtype === 0 && (
          instanceState.map((item, index) => (
            <div className="db-instance m-b-16 p-16" key={index}>
                <header className="db-instance_header">
                  <Descriptions>
                    <Descriptions.Item label="IP">
                      <Link to={`/host/detail/${item.hostId}`}>{item.ip || '-'}</Link>
                    </Descriptions.Item>
                    <Descriptions.Item label="端口">{item.port || '-'}</Descriptions.Item>
                    <Descriptions.Item label="版本">{item.version || '-'}</Descriptions.Item>
                  </Descriptions>
                  <div className="db-instance_header-tag">
                    {item.schematype === 0 ? <Tag color="blue">主</Tag> : <Tag color="geekblue">从</Tag>}
                    {item.schemastate === -2 && <Tag color="red">创建失败</Tag>}
                    {item.schemastate === -1 && <Tag>下线</Tag>}
                    {item.schemastate === 0 && <Tag color="green">正常</Tag>}
                    {item.schemastate === 1 && <Tag color="magenta">连接失败</Tag>}
                    {item.schemastate === 2 && <Tag color="lime">创建中</Tag>}
                    <Button type="primary" size="small" 
                             loading={item.refreshLoading}
                            style={{fontSize: '12px', height: '22px'}}
                            className="m-r-8"
                            onClick={() => onRefresh(item.id)}>
                      刷新
                    </Button>
                    <Popconfirm title="确定删除吗?" cancelText="取消" okText="确定" onCancel={(e: any) => e.stopPropagation()} onConfirm={() =>delInstance(item.id)}>
                      <Button type="danger" size="small" loading={item.delLoading}
                              style={{fontSize: '12px', height: '22px'}}>
                          删除
                      </Button>
                    </Popconfirm>
                  </div>
                </header>
                <Descriptions column={{ xxl: 4, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }}>
                  {item.schema_config.map((el: any,index: number) => (
                    <Descriptions.Item key={index} label={el.MYLABEL}>{el.VAL || '-'}</Descriptions.Item>
                  ))}
                </Descriptions>
              </div>
          ))
        )}
        {currentDbtype !== 0 && (
          instanceState.map((item,index) => (
            <div className="db-instance m-b-16 p-16" key={index}>
              <header className="db-instance_header">
              <Descriptions>
                <Descriptions.Item label="IP">
                  <Link to={`/host/detail/${item.hostId}`}>{item.ip || '-'}</Link>
                </Descriptions.Item>
                <Descriptions.Item label="端口">{item.port || '-'}</Descriptions.Item>
                <Descriptions.Item label="版本">{item.version || '-'}</Descriptions.Item>
              </Descriptions>
              <div className="db-instance_header-tag">
                {item.schematype === 0 ? <Tag color="blue">主</Tag> : <Tag color="geekblue">从</Tag>}
                {item.schemastate === -2 && <Tag color="red">创建失败</Tag>}
                {item.schemastate === -1 && <Tag>下线</Tag>}
                {item.schemastate === 0 && <Tag color="green">正常</Tag>}
                {item.schemastate === 1 && <Tag color="magenta">连接失败</Tag>}
                {item.schemastate === 2 && <Tag color="lime">创建中</Tag>}
                <Button type="primary" size="small" 
                        style={{fontSize: '12px', height: '22px'}}
                        className="m-r-8"
                        loading={item.refreshLoading}
                        onClick={() => onRefresh(item.id)}>
                  刷新
                </Button>
                <Popconfirm title="确定删除吗?" cancelText="取消" okText="确定" onCancel={(e: any) => e.stopPropagation()} onConfirm={() =>delInstance(item.id)}>
                  <Button type="danger" size="small"  loading={item.delLoading}
                          style={{fontSize: '12px', height: '22px'}}>
                      删除
                  </Button>
                </Popconfirm>
              </div>
            </header>
            <Descriptions column={{ xxl: 4, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }}>
              <Descriptions.Item label="character_set_server">{item.character_set_server || '-'}</Descriptions.Item>
              <Descriptions.Item label="BASEDIR">{item.basedir || '-'}</Descriptions.Item>
              <Descriptions.Item label="DATADIR">{item.datadir || '-'}</Descriptions.Item>
              <Descriptions.Item label="ERROR">{item.log_error || '-'}</Descriptions.Item>
              <Descriptions.Item label="bin_log">{item.log_bin || '-'}</Descriptions.Item>
              <Descriptions.Item label="binlog_Format">{item.binlog_format || '-'}</Descriptions.Item>
              <Descriptions.Item label="binlog_row_image">{item.binlog_row_image || '-'}</Descriptions.Item>
              <Descriptions.Item label="log_bin_basename">{item.log_bin_basename || '-'}</Descriptions.Item>
              <Descriptions.Item label="slow_query_log">{item.slow_query_log || '-'}</Descriptions.Item>
              <Descriptions.Item label="long_query_time">{item.long_query_time || '-'}</Descriptions.Item>
              <Descriptions.Item label="slow_query_log_file">{item.slow_query_log_file || '-'}</Descriptions.Item>
            </Descriptions>
            </div>
          ))
        )}
        {currentDbtype === null && (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        )}
        <Modal
          title='新增数据库实例'
          cancelText="取消"
          okText="确定"
          maskClosable={false}
          visible={modalState.visible}
          onOk={() => addInstanceSubmit(serverid)}
          confirmLoading={modalState.loading}
          onCancel={() => dispathModal({type: 'change'})}
          afterClose={() => {addFormRef.props.form.resetFields()}}
        >
          <InstanceForm wrappedComponentRef={(form: any) => addFormRef = form} dbtype={currentDbtype}/>
        </Modal>
      </div>
  )
}

export default ServerInfo;
