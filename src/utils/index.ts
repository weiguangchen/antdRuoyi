/**
 * 构造树型结构数据
 * @param {*} data 数据源
 * @param {*} id id字段 默认 'id'
 * @param {*} parentId 父节点字段 默认 'parentId'
 * @param {*} children 孩子节点字段 默认 'children'
 * @param {*} rootId 根Id 默认 0
 */
// import proxy from '../../config/proxy'
const { NODE_ENV } = process.env;

export function handleTree(data: any, id: any, parentId?: any, children?: any, rootId?: any) {
  id = id || 'id';
  parentId = parentId || 'parentId';
  children = children || 'children';
  rootId = rootId || 0;
  //对源数据深度克隆
  const cloneData = JSON.parse(JSON.stringify(data)).map((m) => {
    delete m.children;
    return m;
  });
  //循环所有项
  const treeData = cloneData.filter((father: any) => {
    let branchArr = cloneData.filter((child: any) => {
      //返回每一项的子级数组
      return father[id] === child[parentId];
    });
    branchArr.length > 0 ? (father.children = branchArr) : '';
    //返回第一层
    return father[parentId] === rootId;
  });
  return treeData != '' ? treeData : data;
}

// 回显数据字典
export function selectDictLabel(datas, value) {
  var actions: any[] = [];
  Object.keys(datas).map((key) => {
    if (datas[key].dictValue == '' + value) {
      actions.push(datas[key].dictLabel);
      return false;
    }
  });
  return actions.join('');
}

// 转换字符串，undefined,null等转化为""
export function praseStrEmpty(str: string) {
  if (!str || str == 'undefined' || str == 'null') {
    return '';
  }
  return str;
}

// 转成antd tree组件所需字段
export function formatTreeData(list: any) {
  return list
    ? list.map((m) => {
        m.title = m.label;
        m.key = m.id;
        if (m.children) {
          m.children = formatTreeData(m.children);
        }
        return m;
      })
    : [];
}

// 下载excel
export function downloadExcel(response: any, name = '报表', type = '.xls') {
  var blob = new Blob([response], {
    // type:
    //   "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
  });
  var downloadElement = document.createElement('a');
  var href = window.URL.createObjectURL(blob); // 创建下载的链接
  downloadElement.href = href;
  downloadElement.download = name + type; // 下载后文件名
  document.body.appendChild(downloadElement);
  downloadElement.click(); // 点击下载
  window.URL.revokeObjectURL(href); // 释放掉blob对象
}

// 拍平数组
// 拍平数组
export function flat(arr = [], childrenKey = 'children') {
  let list: any[] = [];

  if (arr.length > 0) {
    arr.map((m) => {
      if (m?.[childrenKey]?.length) {
        list = [...list, m, ...flat(m[childrenKey])];
      } else {
        list = [...list, m];
      }
    });
  }

  return list;
}

// 通用下载方法
export function download(fileName: string) {
  window.location.href =
    (NODE_ENV === 'development' ? '/dev-api' : '/prod-api') +
    '/common/download?fileName=' +
    encodeURI(fileName) +
    '&delete=' +
    true;
}

// 转换数字为每三位加逗号格式
export function toThousands(num: any) {
  if (!num) return num;
  var result = '',
    counter = 0,
    flag = num >= 0;
  num = flag ? (num || 0).toString() : (num * -1).toString();

  for (var i = num.length - 1; i >= 0; i--) {
    counter++;
    result = num.charAt(i) + result;
    if (!(counter % 3) && i != 0) {
      result = ',' + result;
    }
  }
  return flag ? result : `-${result}`;
}
