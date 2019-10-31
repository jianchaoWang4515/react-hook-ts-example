import React, { useEffect, useMemo, useState } from "react";
import './operation-log.less';
import { Table } from 'antd';
import Moment from 'moment';
import { API } from '@/api';
const { serverDetail:XHR } = API;
const { Column} = Table;
interface IProps {
  serviceId: string,
}
function OperationLog(props: IProps) {
    const { serviceId: serviceid } = props;
    const [page, setPage] = useState(1);
    const [pageSize] = useState(10);
    const [loading, setLoading] = useState(false);
    const [total, setTotal] = useState(0);
    const [tableData, setTableData] = useState([]);
    useEffect(() => {
        getList({ serviceid, page, pageSize});
    }, [serviceid, page, pageSize]);

    function getList({ page = 1, serviceid = '', pageSize = 10 }) {
        const params = {
            page,
            page_size: pageSize,
            serviceid
        }
        setLoading(true);
        XHR.paramsLog({params}).then((res: any) => {
            setLoading(false);
            setTableData(res.results || []);
            setTotal(res.count || 0);
        }).catch(() => {
            setLoading(false);
        });
    }

    return useMemo(() => (
        <Table
          className="operation-log-table"
          size="middle"
          loading={loading}
          scroll={{y: `${document.body.clientHeight * 0.4}px`}}
          pagination={{
            total: total,
            showTotal: (total) => `总共 ${total} 条数据`,
            pageSize: pageSize,
            current: page,
            size: "default",
            onChange: (num) => setPage(num)
          }}
          rowKey={(record: any) => record.id}
          dataSource={tableData}
        >
            <Column
            title="实例IP"
            dataIndex="schemaaddr"
            key="schemaaddr"
            align="center"
          />
          <Column
            title="参数名"
            dataIndex="variable_name"
            key="variable_name"
            align="center"
          />
          <Column
            title="旧值"
            dataIndex="old_var"
            key="old_var"
            align="center"
          />
          <Column
            title="新值"
            dataIndex="new_var"
            key="new_var"
            align="center"
          />
          <Column
            title="修改人"
            dataIndex="createuser"
            key="createuser"
            align="center"
          />
          <Column
            title="修改时间"
            dataIndex="create_time"
            key="create_time"
            align="center"
            render={(text) => (
                <span>{Moment(text).format("YYYY-MM-DD HH:mm:ss")}</span>
            )}
          />
        </Table>
    ), [loading, tableData, page])
}

export default OperationLog;
