import React from 'react';
import { Table } from 'antd';
const { Column } = Table;
interface IProps {
  data: any[]
}
function FileTable(props: IProps) {
    return (
        <Table
          size="middle"
          pagination={false}
          rowKey={(record) => record.FILE_ID} 
          dataSource={props.data}
        >
          <Column
            title="文件名称"
            dataIndex="FILE_NAME"
            key="FILE_NAME"
            width="130px"
            align="center"
          />
          <Column
            title="已用大小"
            dataIndex="USED_BYTES"
            key="USED_BYTES"
            width="130px"
            align="center"
            render={(text) => (
              <span>{Number(text / 1024 / 1024 / 1024).toFixed(4)}G</span>
            )}
          />
          <Column
            title="剩余大小"
            dataIndex="FREE_BYTES"
            key="FREE_BYTES"
            width="130px"
            align="center"
            render={(text) => (
                <span>{Number(text / 1024 / 1024 / 1024).toFixed(4)}G</span>
            )}
          />
          <Column
            title="使用率"
            dataIndex="USED_PERCEN"
            key="USED_PERCEN"
            width="130px"
            align="center"
            render={(text) => (
                <span>{Number(text).toFixed(2)}%</span>
            )}
          />
        </Table>
    )
}

export default FileTable
