import React, { useState, useEffect } from 'react';
import { Button, Descriptions, Table, message } from 'antd';
import { RouteComponentProps } from 'react-router-dom';
import { useAddBreadcrumb } from '@/hook';
import { PageTitle } from '@/components';
import { API } from '@/api';
import { InitState } from './state';
import { IHostInfo, IHostBaseInfo } from './type';
import Moment from 'moment';
const { Column } = Table;

function HostDetail(props: RouteComponentProps) {
    const { detail:XHR } = API.host;
    useAddBreadcrumb(props);

    const [hostInfo, setHostInfo] = useState<IHostInfo>(InitState.hostInfo);
    const [hostBaseInfo, setHostBaseInfo] = useState<IHostBaseInfo>(InitState.hostBaseInfo);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        getInfo({});
        getBaseInfo({});
    }, []);

    /**
     * 获取主机基本信息
     * @param {Object} refresh 是否刷新基础配置信息
     */
    function getBaseInfo({ refresh = false }) {
        const { id }: IAnyObj = props.match.params;
        const params = { params: { refresh } };
        XHR.baseInfo(id, params).then((res: any) => {
          // json字符串数据不规范
            const detail = res.detail ? JSON.parse(res.detail.replace(/'([^']*)'/g, '"$1"')
                                                .replace(/True/g, true)
                                                .replace(/False/g, false)
                                                .replace(/"None"/g, 'None')
                                                .replace(/None/g, '"none"')) : {};
            const { ansible_uptime_seconds = null, ansible_all_ipv4_addresses = '', ansible_processor_count = '', ansible_processor = '', ansible_mounts = [], ansible_devices = [] } = detail;
            setHostBaseInfo({
              ...hostBaseInfo,
              ipv4Addresses: ansible_all_ipv4_addresses.join(','),
              ansible_uptime_seconds,
              ansible_processor_count,
              ansible_processor,
              ansible_mounts: transformMounts(ansible_mounts),
              ansible_devices: transformDevices(ansible_devices)
            })
        }).catch((err: any) => {
            console.log(err);
        })
    }
    /**
     * 组装磁盘挂载
     */
    function transformMounts(mounts: any[]) {
      return mounts.map((item => {
        item.free = item.size_total - item.size_available;
        return item;
      }));
    }
    /**
     * 组装磁盘信息
     */
    function transformDevices(devices: any[]) {
      let arr = [];
      for (const key in devices) {
        const item = devices[key];
        if (item.scheduler_mode) {
          item.device = key;
          arr.push(item);
        }
      }
      return arr;
    }
    /**
     * 获取主机详情
     */
    function getInfo({ refresh = false }) {
      const { id }: IAnyObj = props.match.params;
      const params = { params: { refresh } };
      if (refresh) setLoading(true);
        XHR.info(id, params).then((res: any) => {
          const { ip, admin_user, port} = res;
          const hostConf: any = res.host_configuration ? JSON.parse(res.host_configuration.replace(/'([^']*)'/g, '"$1"')) : {};
          const { hostname, os_cpu, os_mem, os_kernel, os_version } = hostConf;
          setHostInfo({
            ...hostInfo,
              hostname,
              admin_user,
              ip,
              os_version,
              port,
              os_cpu: os_cpu ? `${os_cpu}C` : '',
              os_mem: os_mem ? `${Math.ceil(os_mem / 1024)}G` : '',
              os_kernel
          });
          if (refresh) message.success('刷新成功');
        }).catch((err: any) => {
            console.log(err);
        }).finally(() => {
          setLoading(false);
        })
    }

    return (
        <div className="app-page">
            <PageTitle title="主机详情">
                <Button type="primary" loading={loading} size="small" icon="redo" style={{float: 'right', padding: '0 18px'}} onClick={() => { getBaseInfo({ refresh: true});getInfo({ refresh: true}) } }>刷新</Button>
            </PageTitle>
            <Descriptions className="host-detail p-16" column={{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }}>
                <Descriptions.Item label="主机名">{hostInfo.hostname || '-'}</Descriptions.Item>
                <Descriptions.Item label="主机IP">{hostInfo.ip || '-'}</Descriptions.Item>
                <Descriptions.Item label="管理用户">{hostInfo.admin_user || '-'}</Descriptions.Item>
                <Descriptions.Item label="管理端口">{hostInfo.port || '-'}</Descriptions.Item>
                <Descriptions.Item label="密码">{hostInfo.admin_password || '-'}</Descriptions.Item>
                <Descriptions.Item label="操作系统">{hostInfo.os_version || '-'}</Descriptions.Item>
                <Descriptions.Item label="内核">{hostInfo.os_kernel || '-'}</Descriptions.Item>
                <Descriptions.Item label="CPU">{hostInfo.os_cpu || '-'}</Descriptions.Item>
                <Descriptions.Item label="内存">{hostInfo.os_mem || '-'}</Descriptions.Item>
            </Descriptions>
            <PageTitle title="系统基本信息" isIcon={false}/>
            <Descriptions className="host-detail p-16" column={{ xxl: 3, xl: 2, lg: 3, md: 3, sm: 2, xs: 1 }}>
                <Descriptions.Item label="运行时间">
                    {hostBaseInfo.ansible_uptime_seconds ? Moment(hostBaseInfo.ansible_uptime_seconds * 1000).format('YYYY-MM-DD HH:mm:ss') : '-'}
                </Descriptions.Item>
                <Descriptions.Item label="IPV4地址">{hostBaseInfo.ipv4Addresses || '-'}</Descriptions.Item>
                <Descriptions.Item label="CPU个数">{hostBaseInfo.ansible_processor_count|| '-'}</Descriptions.Item>
                <Descriptions.Item label="CPU型号">{hostBaseInfo.ansible_processor ? hostBaseInfo.ansible_processor[2] : '-'}</Descriptions.Item>
            </Descriptions>
            <PageTitle title="磁盘挂载" isIcon={false}/>
            <Table
                dataSource={hostBaseInfo.ansible_mounts}
                rowKey={(record) => record.mount} 
                bordered
                size="small"
                style={{marginBottom: '50px'}}
                pagination={false}
            >
                <Column
                    title="mount"
                    dataIndex="mount"
                    key="mount"
                    align="center"
                  />
                  <Column
                    title="device"
                    dataIndex="device"
                    key="device"
                    align="center"
                  />
                  <Column
                    title="fstype"
                    dataIndex="fstype"
                    key="fstype"
                    align="center"
                  />
                  <Column
                    title="options"
                    dataIndex="options"
                    key="options"
                    align="center"
                    className="word-wrap"
                  />
                  <Column
                    title="size_total"
                    dataIndex="size_total"
                    key="size_total"
                    align="center"
                    render={(text) => (
                      <span>{(text / 1024 / 1024 / 1024).toFixed(2)}G</span>
                    )}
                  />
                  <Column
                    title="size_available"
                    dataIndex="size_available"
                    key="size_available"
                    align="center"
                    render={(text) => (
                      <span>{(text / 1024 / 1024 / 1024).toFixed(2)}G</span>
                    )}
                  />
                  <Column
                    title="Free"
                    dataIndex="free"
                    key="free"
                    align="center"
                    render={(text) => (
                      <span>{(text / 1024 / 1024 / 1024).toFixed(2)}G</span>
                    )}
                  />
            </Table>
            <PageTitle title="磁盘信息" isIcon={false}/>
            <Table
                dataSource={hostBaseInfo.ansible_devices}
                rowKey={(record) => record.device} 
                bordered
                size="small"
                pagination={false}
            >
                <Column
                    title="device"
                    dataIndex="device"
                    key="device"
                    align="center"
                  />
                  <Column
                    title="size"
                    dataIndex="size"
                    key="size"
                    align="center"
                  />
                  <Column
                    title="vendor"
                    dataIndex="vendor"
                    key="vendor"
                    align="center"
                  />
                  <Column
                    title="model"
                    dataIndex="model"
                    key="model"
                    align="center"
                    width="200px"
                  />
                  />
            </Table>
        </div>
    )
}

export default HostDetail;
