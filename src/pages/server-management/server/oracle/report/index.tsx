import React, {useEffect,useReducer,useState, useCallback} from 'react';
import { useAddBreadcrumb } from '@/hook';
import { Table, Button } from 'antd';
import { RouteComponentProps } from 'react-router-dom';
import { PageTitle } from '@/components';
import { ResetDbMode } from '@/pages/server-management/server/util';
import { parse } from '@/utils';
import { InitTableState, InitSearchData } from './state';
import { tableReducer } from './reducer';
import { API } from '@/api';
import Moment from "moment";
const { Column } = Table;
function Report(props: RouteComponentProps) {
    useAddBreadcrumb(props);
    const serverid = parse(props.location.search, 'serviceid');
    const { oracle:XHR } = API.serverDetail;

    const [tableState, dispathTable] = useReducer(tableReducer, InitTableState);
    const { data, loading } = tableState;
    const [searchData, setSearchData] = useState(InitSearchData);
    const { page, page_size } = searchData;

    const fetch = useCallback(() => {
        // getData(serverid, {page, page_size})
    }, [serverid, page, page_size])

    useEffect(() => {
        ResetDbMode(props).then(() => {
            // fetch();
        });
        return () => {
            XHR.report.cancel();
        };
      }, [fetch]);

    function getData(id: string, { page = 1, page_size = 20}) {
        const params = {
            serviceid: id,
            page,
            page_size
        }
        dispathTable({ type: 'fetch'});
        XHR.report.send({params}).then((res: any) => {
            let data = res.results || [];
            dispathTable({ type: 'success', data});
        }).catch(() => {
            dispathTable({ type: 'error'});
        });
    };

    function changePage(num: number) {
        setSearchData({
            ...searchData,
            page: num
        })
    }
    function goTo(text: string) {
        let newWindow = window.open('about:blank');
        if (newWindow) newWindow.location.href = `http://10.186.177.21:8001/${text}`;
    }
    return (
        <div className="app-page">
            <PageTitle title={`巡检报告-Oracle-${props.location.state.servicename ? props.location.state.servicename : '未知'}`}></PageTitle>
            <Table
                className="m-t-24"
                size="middle"
                loading={loading}
                pagination={{
                    pageSize: page_size,
                    current: page,
                    size: "default",
                    onChange: changePage
                }}
                rowKey={(record: any) => record.id}
                dataSource={data}
                >
                <Column
                    title=""
                    key="index"
                    align="center"
                    width="50px"
                    render={(text, record, index) => (
                        <span>{index + 1}</span>
                    )}
                />
                <Column
                    title="报告生成时间"
                    dataIndex="createtime"
                    key="createtime"
                    align="center"
                    render={(text) => (
                        <span>{Moment(text).format('YYYY-MM-DD HH:mm:ss')}</span>
                    )}
                />
                <Column
                    title="巡检报告"
                    dataIndex="reporturl"
                    key="reporturl"
                    align="center"
                    render={(text) => (
                        <Button type="link" onClick={() => goTo(text)}>链接地址</Button>
                    )}
                />
        </Table>
        </div>
    )
}

export default Report;
