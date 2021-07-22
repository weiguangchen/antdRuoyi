import type { TableListItem as DeptTableListItem } from '../dept/data.d';

export interface TableListItem {
  admin: boolean;
  avatar: string;
  createBy: string;
  createTime: string;
  delFlag: string;
  dept: DeptTableListItem;
  deptId: number;
  email: string;
  loginDate: string;
  loginIp: string;
  nickName: string;
  params: any;
  phonenumber: string;
  postIds: number;
  remark: string;
  roleId: number
  roleIds: any
  roles: any;
  salt: any;
  searchValue: any;
  sex: string;
  status: string;
  updateBy: string;
  updateTime: string;
  userId: number;
  userName: string;
}

export interface TableListPagination {
  total: number;
  pageSize: number;
  current: number;
}

export interface TableListData {
  list: TableListItem[];
  pagination: Partial<TableListPagination>;
}

export interface TableListParams {
  status?: string;
  name?: string;
  desc?: string;
  key?: number;
  pageSize?: number;
  currentPage?: number;
  filter?: Record<string, any[]>;
  sorter?: Record<string, any>;
}
