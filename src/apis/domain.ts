import { COMMON_URI, request, Res } from '@/config/request';
import { LabelInValue } from '@/types';

export interface Domain {
  domain: string;
  name: string;
  comment: string;
  tp: number;
  sourceLabel: LabelInValue;
  data_base: string;
  table: string;
  affect_rows: number;
  status?: number;
  idc: string;
  source?: string;
  source_id?: string;
}

export interface DomainExpr {
  text: string;
  source: string;
  tp: number;
}

export interface DomainParams {
  page: number;
  expr: DomainExpr;
}

export interface DomainResp {
  data: Domain[];
  page: number;
}

export function getDomainList(params: DomainParams) {
  // return request.put<Res<DomainResp>>(`${COMMON_URI}/manage/domain`, params);
  //修改后端接口地址
  return request.put<Res<DomainResp>>('/api/v1/manage/domain', params);
}

export function updateDomain(tp: string, params: Domain) {
  tp === 'curd'
    // ? ((params.source_id = params.sourceLabel.value),
    //   (params.source = params.sourceLabel.label))
    // : null;
  return request.post(`${COMMON_URI}/manage/domain`, {
    domain: params,
    tp: tp,
  });
}

export function deleteDomain(id: string) {
  return request.delete(`${COMMON_URI}/manage/domain?id=${id}`);
}

export class Request {
  //   Post(tp: string, args: Domain): AxiosPromise {
  //     tp === 'curd'
  //       ? ((args.source_id = args.sourceLabel.value),
  //         (args.source = args.sourceLabel.label))
  //       : null;
  //     return request({
  //       method: 'post',
  //       url: `${COMMON_URI}/manage/task`,
  //       data: {
  //         task: args,
  //         tp: tp,
  //       },
  //     });
  //   }
  //   Delete(taskId: string): AxiosPromise {
  //     return request({
  //       method: 'delete',
  //       url: `${COMMON_URI}/manage/task`,
  //       params: {
  //         task_id: taskId,
  //       },
  //     });
  //   }
}
