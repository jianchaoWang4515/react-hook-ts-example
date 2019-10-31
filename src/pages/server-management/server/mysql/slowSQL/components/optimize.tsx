import React, { useEffect, useCallback, useReducer } from 'react';
import { Divider, Descriptions, Spin, Table, List, Card } from 'antd';
import { InitState } from './state';
import { IProps, IData } from './type';
import { stateReducer } from './reducer';
import { API } from '@/api';
const { Column } = Table;

function OptimizeInfo(props: IProps) {
    const { mysql:XHR } = API.serverDetail;
    const [state, dispatchInfo] = useReducer(stateReducer, InitState);
    const { data, loading} = state
    function getInfo(id: string, data: IData | undefined) {
        if (!data) return false;
        const { checksum } = data;
        // dispatchInfo({type: 'fetch'});
        XHR.slowSQLOptimize(checksum, id).then((res: any) => {
            let data = res || {};
            const {sql_explain = [], sqladvisor = []} = data
            // 为数据增加一个唯一值
            sql_explain.forEach((element: any,index: number) => {
                element._index = index;
            });
            // 利用时间格式拆分成数组  由于正则写法问题需在最后增加一个日期 正则待优化
            data.suggest = `${sqladvisor[1]}0000-00-00`.match(/\d{4}\-\d{1,2}\-\d{1,2}[\S\s]*?(?=\d{4}\-\d{1,2}\-\d{1,2})/gim);
            dispatchInfo({type: 'success', data});
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
            <Descriptions title={data.db}>
                <Descriptions.Item label="sql">{data.sql || '-'}</Descriptions.Item>
            </Descriptions>
            <Divider />
            <Table
                className="m-t-24"
                bordered
                size="middle"
                pagination={false}
                rowKey={(record: any) => record._index}
                dataSource={data.sql_explain}
                >
                <Column
                    title="id"
                    dataIndex="id"
                    key="id"
                    align="center"
                />
                <Column
                    title="select_type"
                    dataIndex="select_type"
                    key="select_type"
                    align="center"
                />
                <Column
                    title="table"
                    dataIndex="table"
                    key="table"
                    align="center"
                />
                <Column
                    title="partitions"
                    dataIndex="partitions"
                    key="partitions"
                    align="center"
                    width="150px"
                />
                <Column
                    title="type"
                    dataIndex="type"
                    key="type"
                    align="center"
                    width="150px"
                />
                <Column
                    title="possible_keys"
                    dataIndex="possible_keys"
                    key="possible_keys"
                    align="center"
                />
                <Column
                    title="key"
                    dataIndex="key"
                    key="key"
                    align="center"
                />
                <Column
                    title="key_len"
                    dataIndex="key_len"
                    key="key_len"
                    align="center"
                />
                <Column
                    title="ref"
                    dataIndex="ref"
                    key="ref"
                    align="center"
                />
                <Column
                    title="rows"
                    dataIndex="rows"
                    key="rows"
                    align="center"
                />
                <Column
                    title="filtered"
                    dataIndex="filtered"
                    key="filtered"
                    align="center"
                />
                <Column
                    title="Extra"
                    dataIndex="Extra"
                    key="Extra"
                    align="center"
                />
            </Table>
            <Divider />
            <Card
                title="优化建议"
                className="m-t-24"
            >
                {data.suggest && data.suggest.map((item: any,index: number) => (
                    <p key={index}>{`${index + 1}、${item}`}</p>
                ))}
            </Card>
        </Spin>
    )
}

export default OptimizeInfo;
