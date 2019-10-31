import JSONSessionStorage from '@/utils/session-storage';
import { RouteComponentProps } from 'react-router-dom';
import { IState, ISearchForm} from './type';

export const InitState: IState = {
    total: 0,
    tableData: [],
}

export function InitSearchFormData(props: RouteComponentProps): ISearchForm {
    const { search = '', servermode = '-1', servertype = '-1', page = 1 } = JSONSessionStorage.getItem('history')[props.match.path] || {};
    return {
        search,
        servermode,
        servertype,
        page,
        page_size: 10
    }
}
