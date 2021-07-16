import React, { FC } from 'react';
import { Tree } from 'antd';
import { TreeProps } from 'antd/es/tree/index';

interface ValueProps {
    checked: string[];
    halfChecked: string[];
}

interface TreeFormProps extends TreeProps {
    value?: ValueProps;
    onChange?: (value: ValueProps) => void;
}


const getParent = (arr: any) => {
    let parentIds: Array<string> = [];
    arr.map((m: { key: string; children?: Array<any> }) => {
        if(m?.children?.length) {
            parentIds.push(m.key)
            parentIds = [...parentIds,...getParent(m.children)]
        }
    })

    return parentIds;
}

const TreeForm: FC<TreeFormProps> = props => {
    const { value, onChange, treeData, ...rest } = props;
    return (
        <Tree
            treeData={treeData}
            checkedKeys={value}
            // checkStrictly
            onCheck={(checkedKeys, { halfCheckedKeys }) => {
                const parentIds = getParent(treeData);
                console.log(parentIds)

                checkedKeys = checkedKeys.filter(m => {
                    return parentIds.indexOf(m) == -1;
                })
                if (onChange) onChange(checkedKeys);
            }}
            {...rest}
        />
    )
}

export default TreeForm