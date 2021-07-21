// import type { FC} from 'react';
// import React, { useMemo } from 'react';
// import { Tree } from 'antd';
// import type { TreeProps } from 'antd/es/tree/index';
// import _ from 'lodash';

// interface ValueProps {
//     checked: string[];
//     halfChecked: string[];
// }

// interface MyTreeProps extends TreeProps {
//     value?: any;
//     onChange?: (value: ValueProps) => void;
// }

// interface TreeDataProps {
//     title: any;
//     key: number;
//     children?: TreeDataProps[];
//     parentId?: number;
// }


// // // 将树形结构每层增加parentId字段，方便后续操作
// const setParentId = (arr: TreeDataProps[], parentId = 0) => {
//     for (let i = 0; i < arr.length; i++) {
//         const item = arr[i];
//         item.parentId = parentId;
//         if (item?.children) {
//             setParentId(item.children, item.key)
//         }
//     }
//     return arr;
// }

// // 获取所有父node
// const getParent = (arr: any, node) => {
//     let list: any[] = [];
//     if (node.parentId == 0) {
//         return list;
//     } 
//         const parent = arr.find(m => m.key == node.parentId);
//         if (parent && parent.parentId != 0) {
//             list = [...list, parent.key, ...getParent(arr, parent)]
//         } else {
//             list = [...list, parent.key]
//         }

//     return list;
// }


// // 获取所有子孙
// const getChildren = (arr, key) => {
//     let flag = false; let children: any[] = [];
//     for (let i = 0; i < arr.length; i++) {
//         const item = arr[i];
//         if (item.key == key) {
//             flag = true;
//             children = item?.children?.length ? item.children : [];
//             break;
//         } else if (item?.children?.length) {
//             const { flag: f, children: c } = getChildren(item.children, key);
//             if (f) {
//                 flag = true;
//                 children = c;
//                 break;
//             }
//         }
//     }
//     return {
//         flag,
//         children
//     }
// }

// // 拍平数组
// const flat = (arr) => {
//     let list: any[] = [];
//     arr.map(m => {
//         if (m?.children?.length) {
//             list = [...list, m, ...flat(m.children)]
//         } else {
//             list = [...list, m]
//         }
//     })

//     return list;
// }

// const MyTree: FC<MyTreeProps> = props => {
//     const { value = [], onChange, treeData = [], ...rest } = props;
//     // console.log('value')
//     // console.log(value)

//     // 拍平树,方便循环操作
//     const flatValue = useMemo(() => flat(treeData), [treeData])
//     const newTreeData = useMemo(() => setParentId(treeData),[treeData])

//     // console.log('flatValue')
//     // console.log(flatValue)


//     const tempChecked = []; const tempHalfChecked = [];
//     for (let i = 0; i < value.length; i++) {
//         const key = value[i];
//         const { flag, children } = getChildren(newTreeData, key);
//         const childrenList = flat(children);
//         const keys = childrenList.map(m => m.key);
//         if (flag) {
//             if (keys.every(m => value.indexOf(m) >= 0)) {
//                 tempChecked.push(key)
//             } else if (keys.some(m => value.indexOf(m) >= 0)) {
//                 tempHalfChecked.push(key)
//             }
//         }
//     }

//     const checkedKeys = {
//         checked: tempChecked,
//         halfChecked: tempHalfChecked
//     }

//     // console.log('checkedKeys')
//     // console.log(checkedKeys)

//     return (
//         <Tree
//             treeData={newTreeData}
//             checkedKeys={checkedKeys}
//             checkStrictly
//             onCheck={(checkedKeys, { checked: c, node }) => {
//                 // console.log('onCheck')
//                 console.log('checkedKeys')
//                 console.log(checkedKeys)
//                 console.log('node')
//                 console.log(node)
//                 // console.log('treeData')
//                 // console.log(treeData)

//                 const { checked, halfChecked } = checkedKeys;
//                 const allChecked = [...checked, ...halfChecked];
//                 // 获取当前选择node下所有子孙node，判断当前节点是全选还是半选
//                 const { flag, children } = getChildren(newTreeData, node.key);
//                 const childrenList = flat(children);
//                 const keys = childrenList.map(m => m.key)
//                 // 获取当前node所有父级node，判断该父级node是全选还是半选
//                 const parents = getParent(flatValue, node)
//                 // console.log('parents')
//                 // console.log(parents)
//                 let value: any[] = [];
//                 // 选中
//                 if (c) {
//                     value = _.union(keys, allChecked, parents)
//                 } else {
//                     value = allChecked.filter(m => keys.indexOf(m) == -1)
//                 }
//                 console.log('value')
//                 console.log(value)
//                 if (onChange) onChange(value);

//             }}
//             {...rest}
//         />
//     )
// }

// export default MyTree



import React, { useEffect, useMemo, useState } from 'react';
import { Tree } from 'antd';
import type { TreeProps } from 'antd/es/tree/index';
import _ from 'lodash';

// interface ValueProps {
//     checked: string[];
//     halfChecked: string[];
// }

interface MyTreeProps extends TreeProps {
    treeData: TreeDataProps[];
    value?: number[];
    onChange?: (value: number[]) => void;
}

interface TreeDataProps {
    title: any;
    key: number;
    children?: TreeDataProps[];
    parentId: number;
}

// 将树形结构每层增加parentId字段，方便后续操作
const setParentId = (arr: TreeDataProps[], parentId = 0) => {
    for (let i = 0; i < arr.length; i++) {
        const item = arr[i];
        item.parentId = parentId;
        if (item?.children) {
            setParentId(item.children, item.key)
        }
    }
    return arr;
}




// 获取所有子孙node
const getChildren = (arr, node) => {
    let list = [];
    for (let i = 0; i < arr.length; i++) {
        const item = arr[i];
        if (item.key == node.key) {
            list = item?.children ?? [];
            break;
        } else if (item?.children) {
            list = getChildren(item.children, node)
        }
    }
    return list;
}
// 获取所有祖先节点(根据node的parentId一层层向上找)
const getParent = (arr, node) => {
    const list = []; let flag = false; let parent: any;
    if(node?.parentId !== 0) {
        while (!flag) {
            // eslint-disable-next-line @typescript-eslint/no-loop-func
            parent = arr.find(m => {
                const k = parent?.parentId ?? node.parentId;
                return m.key === k
            });
            if(parent) {
                list.push(parent);
                if (parent.parentId === 0) flag = true;
            }
        }
    }
    return list;
}

// 拍平数组
const flat = (arr) => {
    let list: any[] = [];
    arr.map(m => {
        if (m?.children) {
            list = [...list, m, ...flat(m.children)]
        } else {
            list = [...list, m]
        }
    })

    return list;
}


const MyTree: React.FC<MyTreeProps> = props => {
    const { value = [], onChange, treeData = [], ...rest } = props;
    console.log('value', value)

    // 拍平树,方便循环操作
    const flatValue = useMemo(() => flat(treeData), [treeData])
    console.log('flatValue',flatValue)
    const newTreeData = useMemo(() => setParentId(treeData), [treeData])
    console.log('newTreeData',newTreeData)

    const [checkedKeys, setCheckedKeys] = useState({ checked: [], halfChecked: [] })
    useEffect(() => {
        const tempChecked: number[] = []; const tempHalfChecked: number[] = [];
        for (let i = 0; i < value.length; i++) {
            const key = value[i];
            const keys = flat(getChildren(treeData, { key })).map(m => m.key);
            if (keys.every(m => value.indexOf(m) >= 0)) {
                tempChecked.push(key)
            } else if (keys.some(m => value.indexOf(m) >= 0)) {
                tempHalfChecked.push(key)
            }
        }

        const checkedValue = {
            checked: tempChecked,
            halfChecked: tempHalfChecked
        }
        setCheckedKeys(checkedValue)
    }, [value])



    // console.log('checkedKeys1')
    // console.log(checkedKeys)

    return (
        <Tree
            treeData={newTreeData}
            checkedKeys={checkedKeys}
            checkStrictly
            onCheck={(checkedKeys, { checked: c, node }) => {
                // console.log('onCheck')
                // console.log('checkedKeys2')
                // console.log(checkedKeys)
                // console.log('node')
                // console.log(node)
                // console.log('c')
                // console.log(c)
                // console.log('treeData')
                // console.log(treeData)

                const { checked, halfChecked } = checkedKeys;
                let allChecked = [...checked, ...halfChecked];

                // 获取所有子孙节点key
                const childrenKeys = flat(getChildren(treeData, node)).map(m => m.key);
                // console.log('childrenKeys', childrenKeys);
                if (c) {
                    // 选中节点，将所有子孙节点选中
                    childrenKeys.map(m => {
                        if (!allChecked.includes(m)) allChecked.push(m)
                        return m;
                    })
                } else {
                    // 取消选中节点，将所有子孙节点清除掉
                    allChecked = allChecked.filter(m => !childrenKeys.includes(m));

                }
                // 获取所有祖先节点
                const parents = getParent(flatValue, node)
                // console.log('parents', parents)
                // 判断父节点下所有所有节点状态，判断是全选还是半选还是不选
                parents.map(parent => {
                    const childKeys = flat(getChildren(treeData, parent)).map(m => m.key);
                    // 判断当前父节点下是否还有子节点
                    const hasChild = childKeys.some(m => allChecked.includes(m));
                    if (!hasChild) {
                        allChecked = allChecked.filter(m => m !== parent.key);
                    } else if (allChecked.indexOf(parent.key) === -1) {
                        allChecked.push(parent.key)
                    }
                    return parent;
                })
                // console.log('allChecked')
                // console.log(allChecked)
                if (onChange) onChange(allChecked);

            }}
            {...rest}
        />
    )
}

export default MyTree