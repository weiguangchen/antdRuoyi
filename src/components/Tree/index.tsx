import React, { FC, useMemo } from 'react';
import { Tree } from 'antd';
import { TreeProps } from 'antd/es/tree/index';
import _ from 'lodash';

interface ValueProps {
    checked: string[];
    halfChecked: string[];
}

interface MyTreeProps extends TreeProps {
    value?: any;
    onChange?: (value: ValueProps) => void;
}

// 获取所有父node
const getParent = (arr: any, node) => {
    let list: any[] = [];
    if (node.parentId == 0) {
        return list;
    } else {
        const parent = arr.find(m => m.key == node.parentId);
        if (parent && parent.parentId != 0) {
            list = [...list, parent.key, ...getParent(arr, parent)]
        } else {
            list = [...list, parent.key]
        }
    }
    return list;
}


// 获取所有子孙
const getChildren = (arr, key) => {
    let flag = false, children: any[] = [];
    for (let i = 0; i < arr.length; i++) {
        const item = arr[i];
        if (item.key == key) {
            flag = true;
            children = item?.children?.length ? item.children : [];
            break;
        } else if (item?.children?.length) {
            const { flag: f, children: c } = getChildren(item.children, key);
            if (f) {
                flag = true;
                children = c;
                break;
            }
        }
    }
    return {
        flag,
        children
    }
}

// 拍平数组
const flat = (arr) => {
    let list: any[] = [];
    arr.map(m => {
        if (m?.children?.length) {
            list = [...list, m, ...flat(m.children)]
        } else {
            list = [...list, m]
        }
    })

    return list;
}

const MyTree: FC<MyTreeProps> = props => {
    const { value = [], onChange, treeData = [], ...rest } = props;
    // console.log('value')
    // console.log(value)

    // 拍平树,方便循环操作
    const flatValue = useMemo(() => {
        return flat(treeData)
    }, [treeData])

    // console.log('flatValue')
    // console.log(flatValue)


    const tempChecked = [], tempHalfChecked = [];
    for (let i = 0; i < value.length; i++) {
        const key = value[i];
        const { flag, children } = getChildren(treeData, key);
        const childrenList = flat(children);
        const keys = childrenList.map(m => m.key);
        if (flag) {
            if (keys.every(m => value.indexOf(m) >= 0)) {
                tempChecked.push(key)
            } else if (keys.some(m => value.indexOf(m) >= 0)) {
                tempHalfChecked.push(key)
            }
        }
    }

    const checkedKeys = {
        checked: tempChecked,
        halfChecked: tempHalfChecked
    }

    // console.log('checkedKeys')
    // console.log(checkedKeys)

    return (
        <Tree
            treeData={treeData}
            checkedKeys={checkedKeys}
            checkStrictly
            onCheck={(checkedKeys, { checked: c, node }) => {
                // console.log('onCheck')
                console.log('checkedKeys')
                console.log(checkedKeys)
                console.log('node')
                console.log(node)
                // console.log('treeData')
                // console.log(treeData)

                const { checked, halfChecked } = checkedKeys;
                const allChecked = [...checked, ...halfChecked];
                // 获取当前选择node下所有子孙node，判断当前节点是全选还是半选
                const { flag, children } = getChildren(treeData, node.key);
                const childrenList = flat(children);
                const keys = childrenList.map(m => m.key)
                // 获取当前node所有父级node，判断该父级node是全选还是半选
                const parents = getParent(flatValue, node)
                // console.log('parents')
                // console.log(parents)
                let value: any[] = [];
                // 选中
                if (c) {
                    value = _.union(keys, allChecked, parents)
                } else {
                    value = allChecked.filter(m => keys.indexOf(m) == -1)
                }
                console.log('value')
                console.log(value)
                if (onChange) onChange(value);

            }}
            {...rest}
        />
    )
}

export default MyTree