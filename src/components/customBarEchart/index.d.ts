declare namespace CustomBarEcharts {
    // key 所属数据库的模式类型
    interface IPropsDataItem {
        [key: string]: number
    }

    // key 对应X轴数据库名称
    interface IPropsData {
        [key: string]: IPropsDataItem
    }

    interface IProps {
        titleText: string,
        data: IPropsData
    }
}