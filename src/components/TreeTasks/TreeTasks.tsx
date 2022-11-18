import React, {useCallback, useState} from 'react';
import {ChartType} from '../../App';
import s from './TreeTasks.module.css'

export const TreeTasks = ({id, title, sub}: ChartType) => {

    const [showChildren, setShowChildren] = useState<boolean>(true);
    const handleClick = useCallback(() => {
        setShowChildren(!showChildren);
    }, [showChildren, setShowChildren])



    return (
        <div key={id} className={s.wrapper}>
            <div onClick={handleClick} style={{cursor: 'pointer'}}>
                {sub?.length && (showChildren ? <span>-</span> : <span>+</span>)}
                <h4 className={s.item}>{title} - {sub?.length || 0}</h4>
            </div>
            <div>
                {showChildren && (sub ?? []).map((node: ChartType, index) => <TreeTasks {...node} key={index}/>)}
            </div>
        </div>
    )
}