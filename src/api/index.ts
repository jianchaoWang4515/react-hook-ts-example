import axios from '@/plugin/xhr';
import { cancelAxios } from './util';
import { IApi } from './api';

export const API: any = {
    global: {
        session() {
            return axios.get('/api/user/basedata/');
        }
    },
    login: {
        submit(params: IApi.ILogin) {
            return axios.post('/api/api/v1/login/', params);
        }
    },
    home: {
        fetch: {
            url: '/api/index',
            send() {
                return axios.get(this.url);
            },
            cancel() {
                return cancelAxios({url: this.url});
            }
        }
    },
    /**
     * 主机管理
     */
    host: {
        list: {
            url: '/api/host/hostinfo/',
            send(params: IApi.host.list) {
                return axios.get(this.url, params);
            },
            cancel() {
                return cancelAxios({url: this.url});
            }
        },
        delete(id: string) {
            return axios.delete(`/api/host/hostinfodetail/${id}/`);
        },
        sync() {
            return axios.get('/api/host/hostinfo/?action=synchost');
        },
        detail: {
            info(id: string, params: IApi.host.detailInfo) {
                return axios.get(`/api//host/hostinfodetail/${id}/`, params);
            },
            baseInfo(id: string, params: IApi.host.detailInfo) {
                return axios.get(`/api/host/hostdetail/${id}/`, params);
            }
        }
    },
    server: {
        list: {
            url: '/api/service/serviceinfo/',
            method: 'get',
            send(params: any) {
                return axios.get(this.url, params);
            },
            cancel() {
                return cancelAxios({url: this.url});
            }
        },
        delete(id: string) {
            return axios.delete(`/api/service/serviceinfodetail/${id}/`);
        },
        create(params: any) {
            return axios.post(`/api/service/serviceinfoadd/`, params);
        },
        /**
         * 架构类型
         */
        framework(params: any) {
            return axios.get(`/api/service/framework/`, params);
        }
    },
    serverDetail: {
        info: {
            url: '/api/service/serviceinfodetail/${serviceid}/',
            send(serviceid: string) {
                const url = `/api/service/serviceinfodetail/${serviceid}/`;
                this.url = url;
                return axios.get(url);
            },
            cancel() {
                return cancelAxios({url: this.url});
            }
        },
        /**
         * 参数管理列表
         */
        params: {
            url: '/api/dbadmin/parameter/',
            send(params: any) {
                return axios.get(this.url, params);
            },
            cancel() {
                return cancelAxios({url: this.url});
            }
        },
        /**
         * 修改参数
         */
        editParams(id: string, params: any) {
            return axios.put(`/api/dbadmin/setparameter/${id}/`, params);
        },
        /**
         * 参数操作日志
         */
        paramsLog(params: any) {
            return axios.get(`/api/dbadmin/parameterhistory/`, params);
        },
        /**
         * 数据库实例
         *  */
        schema: {
            url: '/api/schema/schemainfo/',
            send(params: any) {
                return axios.get(this.url, params);
            },
            cancel() {
                return cancelAxios({url: this.url});
            }
        },
        /**
         * 新增实例
         */
        addSchema(params: any) {
            return axios.post('/api/schema/schemainfo/', params);
        },
        /**
         * 删除实例
         */
        delSchema(id: string) {
            return axios.delete(`/api/schema/schemadetail/${id}/`);
        },
        // 刷新数据库实例
        schemaDetail(id: string) {
            return axios.get(`/api/schema/schemadetail/${id}/?action=refresh`);
        },
        edit(serviceid: string, params: any) {
            return axios.put(`/api/service/serviceinfodetail/${serviceid}/`, params);
        },
        oracle: {
            /**
             * 数据库链接列表
             */
            space: {
                url: '/api/dbadmin/oracleadmin/${serviceid}/',
                send(serviceid: string, params: any) {
                    const url = `/api/dbadmin/oracleadmin/${serviceid}/`;
                    this.url = url;
                    return axios.get(url, params);
                },
                cancel() {
                    return cancelAxios({url: this.url});
                }
            },
            /**
             * 增加表空间或增加数据文件
             */
            add(serviceid: string, action: any, params: any) {
                return axios.put(`/api/dbadmin/oracleadmin/${serviceid}/?action=${action}`, params);
            },
            /**
             * 数据库用户列表
             */
            dbUserList: {
                url: '/api/serviceuser/serviceuserinfo/',
                send(params: any) {
                    return axios.get(this.url, params);
                },
                cancel() {
                    return cancelAxios({url: this.url});
                }
            },
            /**
             * 同步Oracle数据库用户
             */
            syncDbUser(serviceid: string) {
                return axios.get(`/api/dbadmin/oracleadmin/${serviceid}/?action=sync_user`);
            },
            createDbUser(params: any) {
                return axios.post('/api/serviceuser/serviceuserinfo/', params);
            },
            /**
             * 修改用户
             */
            editUser(userId: string, params: any) {
                return axios.put(`/api/serviceuser/serviceuserdetail/${userId}/`, params);
            },
            resetPwd(id: string, params: any) {
                return axios.put(`/api/serviceuser/serviceuserdetail/${id}/?action=change_password`, params);
            },
            /**
             * 获取owner
             */
            owners(serviceid: string) {
                return axios.get(`/api/dbadmin/oracleadmin/${serviceid}/?action=owners`);
            },
            /**
             * 获取owner所有表名
             */
            ownersTables(serviceid: string, owner: any) {
                return axios.get(`/api/dbadmin/oracleadmin/${serviceid}/?action=owner_tables&owner=${owner}`);
            },
            deleteUser(userId: string, params: any) {
                return axios.put(`/api/serviceuser/serviceuserdetail/${userId}/?action=delete`, params);
            },
            /**
             * 获取锁等待列表
             */
            slowWait: {
                url: '/api/dbadmin/oracleadmin/${serviceid}/?action=locked',
                send(serviceid: string) {
                    const url = `/api/dbadmin/oracleadmin/${serviceid}/?action=locked`;
                    this.url = url;
                    return axios.get(url);
                },
                cancel() {
                    return cancelAxios({url: this.url});
                }
            },
            // slowWait(serviceid) {
            //     return axios.get(`/api/dbadmin/oracleadmin/${serviceid}/?action=locked`);
            // },
            killSlowWait(serviceid: string, sid: string | number, serial: string, inst_id: string | number) {
                return axios.get(`/api/dbadmin/oracleadmin/${serviceid}/?action=killsession&sid=${sid}&serial=${serial}&inst_id=${inst_id}`);
            },
            /**
             * 巡检报告
             */
            report: {
                url: '/api/dbadmin/oraclereport/',
                send(params: any) {
                    return axios.get(this.url, params);
                },
                cancel() {
                    return cancelAxios({url: this.url});
                }
            }
        },
        mysql: {
            db(params: any) {
                return axios.get('/api/servicedatabase/servicedatabaseinfo/', params);
            },
            create(params: any) {
                return axios.post(`/api/servicedatabase/servicedatabaseinfo/`, params);
            },
            /**
             * 删除数据库
             * @param {string} id 数据库id
             */
            delete(id: string) {
                return axios.delete(`/api/servicedatabase/servicedatabasedetial/${id}/`);
            },
            syncDB(serviceid: string) {
                return axios.get(`/api/dbadmin/mysqladmin/${serviceid}/?action=sync_database`);
            },
            /**
             * 同步Mysql数据库用户
             */
            syncDbUser(serviceid: string) {
                return axios.get(`/api/dbadmin/mysqladmin/${serviceid}/?action=sync_user`);
            },
            /**
             * 数据库链接列表
             */
            dbLink: {
                url: '/api/dbadmin/mysqladmin/${serviceid}/?action=full_processlist',
                send(serviceid: string) {
                    const url = `/api/dbadmin/mysqladmin/${serviceid}/?action=full_processlist`;
                    this.url = url;
                    return axios.get(url);
                },
                cancel() {
                    return cancelAxios({url: this.url});
                }
            },
            /**
             * kill数据库结进程
             * @param {string} serviceid 服务id
             * @param {string} pid 进程id
             */
            killDbLink(serviceid: string, pid: string) {
                return axios.get(`/api/dbadmin/mysqladmin/${serviceid}/?action=killsession&pid=${pid}`);
            },
            /**
             * 慢日志列表
             */
            slowSQLList: { 
                url: '/api/dbadmin/mysqlslowlog',
                method: 'get',
                send(params: any) {
                    return axios.get(this.url, params);
                },
                cancel() {
                    return cancelAxios({url: this.url});
                }
            },
            /**
             * 慢日志样例
             */
            slowSQLSample(params: any) {
                return axios.get('/api/dbadmin/mysqlslowloghistory/', params);
            },
            /**
             * 慢日志优化
             */
            slowSQLOptimize(checksum: string, serviceid: string) {
                return axios.get(`/api/dbadmin/mysqlslowlogoptimize/${checksum}/?serviceid=${serviceid}`);
            }
        }
    },
    paramsTemplate: {
        list: {
            url: '/api/dbadmin/parametertemplate/',
            send(params: any) {
                return axios.get(this.url, params);
            },
            cancel() {
                return cancelAxios({url: this.url});
            }
        },
        add(params: any) {
            return axios.post('/api/dbadmin/parametertemplate/', params);
        },
        edit(id: string, params: any) {
            return axios.put(`/api/dbadmin/parametertemplatedetail/${id}/`, params);
        },
        delete(id: string) {
            return axios.delete(`/api/dbadmin/parametertemplatedetail/${id}/`);
        }
    },
    // // 定时任务
    // timedTask: {
    //     list: {
    //         get: {
    //             url: '/api/periodictask/periodictask/',
    //             method: 'get',
    //             send(params) {
    //                 return axios[this.method](this.url, params);
    //             },
    //             cancel() {
    //                 return cancelAxios({url: this.url});
    //             }
    //         },
    //         post(params) {
    //             return axios.post(this.get.url, params);
    //         },
    //         put(id, params) {
    //             return axios.put(`/api/periodictask/periodictaskdetail/${id}/`, params);
    //         },
    //         delete(id) {
    //             return axios.delete(`/api/periodictask/periodictaskdetail/${id}/`);
    //         },
    //         getDetail(id) {
    //             return axios.get(`/api/periodictask/periodictaskdetail/${id}/`);
    //         }
    //     },
    //     cycle: {
    //         get: {
    //             url: '/api/periodictask/intervalschedule/',
    //             method: 'get',
    //             send(params) {
    //                 return axios[this.method](this.url, params);
    //             },
    //             cancel() {
    //                 return cancelAxios({url: this.url});
    //             }
    //         },
    //         post(params) {
    //             return axios.post(this.get.url, params);
    //         },
    //         put(id, params) {
    //             return axios.put(`/api/periodictask/intervalscheduledetail/${id}/`, params);
    //         },
    //         delete(id) {
    //             return axios.delete(`/api/periodictask/intervalscheduledetail/${id}/`);
    //         },
    //         getDetail(id) {
    //             return axios.get(`/api/periodictask/intervalscheduledetail/${id}/`);
    //         }
    //     },
    //     task: {
    //         get: {
    //             url: '/api/periodictask/crontabschedule/',
    //             method: 'get',
    //             send(params) {
    //                 return axios[this.method](this.url, params);
    //             },
    //             cancel() {
    //                 return cancelAxios({url: this.url});
    //             }
    //         },
    //         post(params) {
    //             return axios.post(this.get.url, params);
    //         },
    //         put(id, params) {
    //             return axios.put(`/api/periodictask/crontabscheduledetail/${id}/`, params);
    //         },
    //         delete(id) {
    //             return axios.delete(`/api/periodictask/crontabscheduledetail/${id}/`);
    //         },
    //         getDetail(id) {
    //             return axios.get(`/api/periodictask/crontabscheduledetail/${id}/`);
    //         }
    //     }
    // },
    // // 定时巡检
    // timedInspection: {
    //     get: {
    //         url: '/api/sqlaudit/dbcheckedorder/',
    //         method: 'get',
    //         send(params) {
    //             return axios[this.method](this.url, params);
    //         },
    //         cancel() {
    //             return cancelAxios({url: this.url});
    //         }
    //     },
    //     post(params) {
    //         return axios.post(this.get.url, params);
    //     }
    // },
    userMgt: {
        user: {
            list: {
                url: '/api/user/usersinfo/',
                send(params: any) {
                    return axios.get(this.url, params);
                },
                cancel() {
                    return cancelAxios({url: this.url});
                }
            },
            add(params: any) {
                return axios.post(this.list.url, params);
            },
            edit(id: string, params: any) {
                return axios.put(`/api/user/usersdetail/${id}/`, params);
            },
            delete(id: string) {
                return axios.delete(`api/user/usersdetail/${id}/`);
            }
        },
        group: {
            list: {
                url: '/api/user/usersgroup/',
                send(params: any) {
                    return axios.get(this.url, params);
                },
                cancel() {
                    return cancelAxios({url: this.url});
                }
            },
            add(params: any) {
                return axios.post(this.list.url, params);
            },
            edit(id: string, params: any) {
                return axios.put(`/api/user/usersgroupdetail/${id}/`, params);
            },
            delete(id: string) {
                return axios.delete(`/api/user/usersgroupdetail/${id}/`);
            }
        }
    }
}
