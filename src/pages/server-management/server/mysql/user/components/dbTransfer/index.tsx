import React from 'react';
import { Icon, Checkbox, Radio, Card } from 'antd';
import './index.less';
import IProps, { IState } from './type';
class DbTransfer extends React.Component<IProps<any>, IState> {
    constructor(props: IProps<any>) {
        super(props);
        this.state = {
            data: []
        }
    }

    shouldComponentUpdate(nextProps: IProps<any>) {
        const { dataSource, sellectedAll, keyname } = nextProps;
        // 数据源更新时重新计算勾选状态
        if (nextProps.dataSource !== this.props.dataSource || nextProps.sellectedAll !== this.props.sellectedAll) {
            this.setState({data: this.initData(dataSource, sellectedAll, keyname)});
            return false;
        }
        return true;
    }
    /**
     * 根据已选计算列表勾选状态
     * @param {*} dataSource 列表
     * @param {*} sellectedAll 已选列表
     * @param {*} key 数据匹配所需的key值
     */
    initData(dataSource: any[] = [], sellectedAll: any[] = [], key: string = 'key') {
        let result = JSON.parse(JSON.stringify(dataSource));
        const selectsByKeys = sellectedAll ? sellectedAll.map((item) => {
            return item[key]
        }) : []
        result.forEach((ele: any) => {
            ele.checked = selectsByKeys.includes(ele[key]);
        });
        return result;
    }

    render () {
        const { keyname = 'key', title = 'title', sellectedAll, onSelect, onDel, onAuthChange, listStyle = {} } = this.props;
        return (
            <div className="db-transfer">
                <article className="db-transfer-list" style={listStyle}>
                    <header className="db-transfer-list-header">{this.state.data.length}项</header>
                    <main className="db-transfer-list-body">
                        <ul className="db-transfer-list-content">
                            {this.state.data && this.state.data.map((item: any) => (
                                <li key={item[keyname]} className="db-transfer-list-content-item" title="CheckboxCheckboxCheckboxCheckboxCheckbox">
                                    <Checkbox checked={item.checked} onChange={(e) => { if (onSelect) onSelect(e, item) }}>{item[title]}</Checkbox>
                                </li>
                            ))}
                        </ul>
                    </main>
                </article>
                <div className="db-transfer-connector">
                    <Icon type="swap" />
                </div>
                <article className="db-transfer-list" style={listStyle}>
                    <header className="db-transfer-list-header">已选{sellectedAll ? sellectedAll.length : 0}项</header>
                    <main className="db-transfer-list-body db-transfer-list-body-checked">
                        {sellectedAll && sellectedAll.map((item: any) => (
                            <Card size="small" key={item[keyname]} title={item[title]} extra={<Icon onClick={() =>{ if (onDel) onDel(item)} } type="close-circle" />}>
                                <Radio.Group defaultValue={item.privilege} onChange={(e) => { if (onAuthChange) onAuthChange(e, item) }}>
                                    <Radio value="ALL">All</Radio>
                                    <Radio value="RW">读写</Radio>
                                    <Radio value="RR">只读</Radio>
                                </Radio.Group>
                            </Card>
                        ))}
                    </main>
                </article>
            </div>
        )
    }
}

export default React.memo(DbTransfer);