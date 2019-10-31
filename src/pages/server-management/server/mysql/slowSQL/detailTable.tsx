import React from 'react';
import { Table } from 'antd';
const { Column } = Table;
interface IProps {
  data: any[],
  index: number
}
function DetailTable(props: IProps) {
    return (
        <Table
          size="middle"
          pagination={false}
          rowKey={(record) => `${props.index}-${record.checksum}`} 
          dataSource={props.data}
        >
           <Column
            title="最大执行时间"
            dataIndex="max_query_time"
            key="max_query_time"
            align="center"
          />
          <Column
            title="最小执行时间"
            dataIndex="min_query_time"
            key="min_query_time"
            align="center"
          />
          <Column
            title="平均锁等待时间"
            dataIndex="avg_lock_time"
            key="avg_lock_time"
            align="center"
          />
          <Column
            title="最大锁等待时间"
            dataIndex="max_lock_time"
            key="max_lock_time"
            align="center"
          />
          <Column
            title="最小锁等待时间"
            dataIndex="min_lock_time"
            key="min_lock_time"
            align="center"
          />
          <Column
            title="平均扫描行数"
            dataIndex="avg_rows_examined"
            key="avg_rows_examined"
            align="center"
          />
          <Column
            title="最大扫描行数"
            dataIndex="max_rows_examined"
            key="max_rows_examined"
            align="center"
          />
          <Column
            title="最小扫描行数"
            dataIndex="min_rows_examined"
            key="min_rows_examined"
            align="center"
          />
        </Table>
    )
}

export default DetailTable;
