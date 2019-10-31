import React, { useEffect, useState } from 'react';
import './index.less';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { PageTitle } from '@/components';
import { PieEcharts, IPieEchartsData } from './components/pie-echarts';
import { CustomBarEcharts } from '@/components/customBarEchart';
import { useAddBreadcrumb } from '@/hook';
import { API } from '@/api';

function Home(props: RouteComponentProps) {
  useAddBreadcrumb(props)
  const { home:XHR } = API;
  let [serviceTotal, setServiceTotal] = useState<any>({});
  let [serviceList, setServiceList] = useState<any[]>([]);
  let [userEcharts, setUserEcharts] = useState<IPieEchartsData>({});
  let [dbEcharts, setDbEcharts] = useState<IPieEchartsData>({});
  let [frameworkEcharts, setFrameworkEcharts] = useState<CustomBarEcharts.IPropsData>({});
  useEffect(() => {
    // getData()
    return () => {
      XHR.fetch.cancel()
    }
  }, [])

  function getData() {
    XHR.fetch.send().then((res: any) => {
      const { service_count = 0, datasize_count = 0, schema_count = 0, dbtype = '总数', service_data = [], framework_data = []} = res || {};
      setServiceTotal({
        service_count,
        datasize_count,
        schema_count,
        dbtype
      });
      setServiceList([ ...service_data ]);
      setUserEcharts({
        titleText: '用户',
        data: service_data.map((item: any) => { return {name: item.dbtype, value: item.user} })
      })
      setDbEcharts({
        titleText: '数据库',
        data: service_data.map((item: any) => { return {name: item.dbtype, value: item.database} })
      })
      let frameworkData = transformFramework(framework_data);
      setFrameworkEcharts(frameworkData);
    });
  }

  function transformFramework(data: any[]): IAnyObj {
    let obj: IAnyObj = {};
    data.forEach(item => {
      const { typename, framework_name, coun} = item;
      if (!obj[typename]) obj[typename] = {[framework_name]: coun};
      else {
        obj[typename][framework_name] = coun
      }
    });
    return obj;
  }

  return (
      <div className="app-page home-page">
        <PageTitle title="首页"></PageTitle>
        <div className="header app-flex">
          <div className="header-total">
            <ul className="data-box app-flex app-flex-1">
              <li className="data-box__item">
                <div className="data-box__item-top">
                  <div className="title">{serviceTotal.dbtype || '未知'}</div>
                  <div className="num">{serviceTotal.service_count || 0}</div>
                </div>
                <div className="data-box__item-footer clear-box">
                  <span className="schema" title="实例数">{serviceTotal.schema_count || 0}</span>
                  <span className="data-size" title="数据量">{serviceTotal.datasize_count || 0}</span>
                </div>
              </li>
            </ul>
          </div>
          <ul className="data-box app-flex app-flex-1">
            {serviceList.map((item, index) => (
              <li className="data-box__item" key={index}>
                <div className="data-box__item-top">
                  <div className="title">{item.dbtype || '未知'}</div>
                  <div className="num">{item.service || 0}</div>
                </div>
                <div className="data-box__item-footer clear-box">
                  <span className="schema" title="实例数">{item.schema || 0}</span>
                  <span className="data-size" title="数据量">{item.datasize || 0}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="main">
          <div className="main-item">
            <PieEcharts el="user" data={[userEcharts, dbEcharts]}/>
          </div>
          <div className="main-item">
            <CustomBarEcharts titleText="架构类型" data={frameworkEcharts}/>
          </div>
        </div>
      </div>
  )
}

export default withRouter(Home);
