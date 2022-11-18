import React, {useEffect, useState} from 'react';
import './App.css';
import moment from 'moment/moment';
import {TreeTasks} from './components/TreeTasks/TreeTasks';
import {TreeBars} from './components/TreeBars/TreeBars';
import axios from 'axios';

type DataType = {
    project?: string
    period?: string
    chart: ChartType
}

export type ChartType = {
    id: number
    title: string
    period_start: string
    period_end: string
    sub?: Array<ChartType>
}


const axiosInstance = axios.create({
    baseURL: 'https://cors-anywhere.herokuapp.com/http://82.202.204.94/tmp/test.php',
})


function App() {
    const [data, setData] = useState<DataType>({
        project: undefined,
        period: undefined,
        chart: {}
    } as DataType)

    const weekendStyle = (index: number) => index > 4 ? {color: 'gray'} : {}

    useEffect(() => {
        let res = axiosInstance.get('')
        res.then((res) => {
            setData(res.data)
        })
    }, [])

    const findStartDate = () => {
        let res = moment(data.chart.period_start);
        let queue = data.chart.sub && [...data.chart.sub]
        if (queue) {
            while (queue.length) {
                let currTree = queue.pop()
                let currTime = moment(currTree!.period_start)

                if (res.diff(currTime, 'days') > 0) {
                    res = currTime
                }
                if (currTree!.sub && currTree!.sub.length) {
                    currTree!.sub.forEach(el => queue!.push(el))
                }
            }
        }
        return res
    }

    const chartStartMonth = findStartDate().get('month')
    const getStartPos = () => (findStartDate().get('date') - 1) * 23

    const createCellsDateArray = () => {
        let res = [];
        for (let i = 0; i < 7; i++) {
            res.push({
                startDate: (7 * i + 1) / 31 > 1 ? (7 * i + 1) % 31 : 7 * i + 1,
                endDate: (7 * i + 7) / 31 > 1 ? (7 * i + 7) % 31 : 7 * i + 7,
                startMonth: (7 * i + 1) / 31 > 1 ? chartStartMonth + 1 : chartStartMonth,
                endMonth: (7 * i + 1 + 6) / 31 > 1 ? chartStartMonth + 1 : chartStartMonth,
            })
        }
        return res
    }
    const createDateArray = (start: number, end: number) => {
        let res = [];
        let finishDate = start < end ? end : start + 6
        for (let i = start; i <= finishDate; i++) {
            i / 31 > 1 ? res.push(i % 31) : res.push(i)
        }
        return res
    }

    return (
        <div className="App">
            <div className={'title'}>
                {data.project} {data.period}
            </div>
            <div className={'table'}>
                <div className={'items'}>
                    <div className={'header'}>
                        <p>Work item</p>
                    </div>
                    <div className={'cells_wrapper'}>
                        <TreeTasks {...data.chart}/>
                    </div>
                </div>
                <div className={'chart'}>
                    <div className={'chart_period_wrapper'}>
                        {createCellsDateArray().map((el, i) => {
                            return (
                                <div key={i}>
                                    <div className={'chart_period'}>
                                        <span>{el.startDate} {moment().month(el.startMonth).format('MMM')} -</span>
                                        <span> {el.endDate} {moment().month(el.endMonth).format('MMM')}</span>
                                    </div>
                                    <div className={'chart_dates'}>
                                        {createDateArray(el.startDate, el.endDate).map((num, index) => {
                                            return (
                                                <p style={weekendStyle(index)} key={index}>
                                                    {num}
                                                </p>
                                            )
                                        })}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                    <div className={'chart_col_wrapper'}>
                        {[...new Array(63)].map((el, index) => {
                            return (
                                <div className={'chart_col'} key={index}>
                                </div>
                            )
                        })}
                    </div>
                    <div className={'bars_wrapper'} style={{left: getStartPos()}}>
                        <TreeBars chart={data.chart} findStartDate={findStartDate} lvl={0}/>
                    </div>
                </div>
            </div>
        </div>
    )

}


export default App;
