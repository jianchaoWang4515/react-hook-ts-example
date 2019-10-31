import React, { useEffect, useCallback, useReducer } from 'react';
import { Divider, Descriptions, Spin } from 'antd';
import { InitState } from './state';
import { IProps, IData } from './type';
import { stateReducer } from './reducer';
import { API } from '@/api';
function SampleInfo(props: IProps) {
    const { mysql:XHR } = API.serverDetail;
    const [state, dispatchInfo] = useReducer(stateReducer, InitState);
    const { data, loading} = state
    function getInfo(id: string, data: IData | undefined) {
        if (!data) return false;
        const { checksum } = data;
        const params = {
            checksum,
            hostname_max: id,
            page: 1,
            page_size: 2
        }
        dispatchInfo({type: 'fetch'});
        XHR.slowSQLSample({params}).then((res: any) => {
            dispatchInfo({type: 'success', data: res.results});
        })
    }

    let fetch = useCallback(() => {
        getInfo(props.serverid, props.data);
    }, [props.serverid, props.data])

    useEffect(() => {
        fetch()
      }, [fetch]);

    return (
        <Spin spinning={loading}>
            {data.map((item: any,index: number) => (
                <React.Fragment key={index}>
                    <Descriptions title={item.checksum || '-'} column={2}>
                        <Descriptions.Item label='db_max'>{item.db_max || '-'}</Descriptions.Item>
                        <Descriptions.Item label='host_max'>{item.host_max || '-'}</Descriptions.Item>
                        <Descriptions.Item label='lock_time_sum'>{item.lock_time_sum || '-'}</Descriptions.Item>
                        <Descriptions.Item label='query_time_sum'>{item.query_time_sum || '-'}</Descriptions.Item>
                        <Descriptions.Item label='rows_examined_sum'>{item.rows_examined_sum || '-'}</Descriptions.Item>
                        <Descriptions.Item label='ts_min'>{item.ts_min || '-'}</Descriptions.Item>
                        <Descriptions.Item label='sample'>{item.sample || '-'}</Descriptions.Item>
                     </Descriptions>
                    <Divider />
                </React.Fragment>
            ))}
        </Spin>
    )
}

export default SampleInfo;
