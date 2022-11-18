import React from 'react';
import {ChartType} from '../../App';
import s from './TreeBars.module.css'
import moment from 'moment/moment';

type PropsType = {
    chart: ChartType
    lvl: number
    findStartDate: () => moment.Moment
}

export const TreeBars = (props: PropsType) => {
    const {id, title, sub, period_start, period_end } = props.chart
    const barPos = () => (moment(period_end).diff(period_start, 'days') + 1) * 23
    const shift = () => moment(period_start).diff(props.findStartDate(), 'days') * 23

    const pickBarColor = () => {
        if(props.lvl === 0){
            return 'blue'
        }
        if(props.lvl === 1){
            return 'yellow'
        }
        if(props.lvl === 2 || props.lvl === 3){
            return 'green'
        }
        if(props.lvl === 4){
            return 'yellow'
        }
    }

    return (
        <div key={id} className={s.wrapper} style={{
            width: 370,
            marginTop: 20,
        }}>
            <div style={{
                position: 'relative',
                left: shift()
            }}>
                <div style={{
                    position: 'relative',
                    height: 23,
                    width: barPos(),
                    backgroundColor: pickBarColor(),
                    opacity: 0.8,
                    borderRadius: 6
                }}>
                </div>
                <div className={s.title} style={{
                    left: barPos() + 20
                }}>
                    {title}
                </div>
            </div>

            {(sub ?? []).map((node: ChartType, index) => <TreeBars chart={node} lvl={props.lvl + 1} findStartDate={props.findStartDate} key={index}/>)}
        </div>
    )
};
