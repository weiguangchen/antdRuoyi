export type TableListItem = {
  ancestors: string;
  children: any[]
  createBy: string;
  createTime: string;
  delFlag: string;
  deptId: number;
  deptName: string;
  email: string;
  leader: string;
  orderNum: string;
  params: any;
  parentId: number;
  parentName: string;
  phone: string;
  remark: string;
  searchValue: any;
  status: string;
  updateBy: string;
  updateTime: string;
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

export type TableListParams = {
  status?: string;
  name?: string;
  desc?: string;
  key?: number;
  pageSize?: number;
  currentPage?: number;
  filter?: Record<string, any[]>;
  sorter?: Record<string, any>;
}
