import React, {Component} from "react";
import {DatePicker, Select, Tabs} from 'antd';
import ReactEcharts from 'echarts-for-react';
import "./Statistics.css";
// 默认语言为 en-US，如果你需要设置其他语言，推荐在入口文件全局设置 locale
import moment from 'moment';
import 'moment/locale/zh-cn';
import request from "../utils/request";
import sssm_config from "../config/sssm";

moment.locale('zh-cn');

let sssm_url = sssm_config.sssm.URL;
const TabPane = Tabs.TabPane;
const Option = Select.Option;
const { MonthPicker, RangePicker, WeekPicker } = DatePicker;

class Statistics extends Component {
    constructor(props){
        super(props);
        this.state = {
            currentDate: '',
            previousMonth: '',
            x_data: [],
            y_data: [],
        }
    }
    //之前加载
    componentWillMount() {
        //默认日期为当前一个月
        let now=new Date();
        let month = now.getMonth()+1;
        let month2 = month;
        if (month < 10) {
            month2 = '0' + month;
        }
        let day = now.getDate();
        let day2 = day;
        if (day < 10) {
            day2 = '0' + day;
        }
        let currentDate = now.getFullYear()+"-"+month2+"-"+day2;
        console.log(currentDate);
        let previousMonth = this.getPreMonth(currentDate);
        console.log(previousMonth);

        this.setState({
            currentDate: currentDate,
            previousMonth: previousMonth,
        });
    }
    //第一次加载数据
    componentDidMount() {
        let timestamp = new Date().getTime();
        let url=sssm_url+'/yycx/getCoutBookByDay?start='+this.state.previousMonth+'&end='+this.state.currentDate+'&timestamp='+timestamp;
        request.get(url).then(data => {
            //console.log(data.holdbooklist);
            if (!data.error) {
                if (data.code === '200') {
                    this.setState({
                        x_data: data.x_data,
                        y_data: data.y_data,
                    });
                }
            }
        });
    }
    //选择日期
    onDatePickerChange = (date, dateString) => {
        console.log(date, dateString);
    };
    getOption = function(){
        return {
            title: {
                text: '每天读者取预约书的使用量统计',
                subtext: '纯属虚构'
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data:['取书数量','读者数量']
            },
            toolbox: {
                show: true,
                feature: {
                    dataZoom: {
                        yAxisIndex: 'none'
                    },
                    dataView: {readOnly: false},
                    magicType: {type: ['line', 'bar']},

                }
            },
            xAxis:  {
                type: 'category',
                boundaryGap: true,
                data: this.state.x_data
            },
            yAxis: {
                type: 'value',
                axisLabel: {
                    formatter: '{value}'
                }
            },
            series: [
                {
                    name:'取书数量',
                    type:'bar',
                    data:this.state.y_data,
                    barWidth: 30,
                    markPoint: {
                        data: [
                            {type: 'max', name: '最大值'},
                            {type: 'min', name: '最小值'}
                        ]
                    },
                    markLine: {
                        data: [
                            {type: 'average', name: '平均值'}
                        ]
                    }
                },
                {
                    name:'读者数量',
                    type:'bar',
                    data:[1, -2, 2, 5, 3, 2, 0],
                    barWidth: 30,
                    markPoint: {
                        data: [
                            {type: 'max', name: '最大值'},
                            {type: 'min', name: '最小值'}
                        ]
                    },
                    markLine: {
                        data: [
                            {type: 'average', name: '平均值'},
                            [{
                                symbol: 'none',
                                x: '90%',
                                yAxis: 'max'
                            }, {
                                symbol: 'circle',
                                label: {
                                    normal: {
                                        position: 'start',
                                        formatter: '最大值'
                                    }
                                },
                                type: 'max',
                                name: '最高点'
                            }]
                        ]
                    }
                }
            ]
        }
    };

    /**
     * 获取上一个月     *
     * @date 格式为yyyy-mm-dd的日期，如：2014-01-25
     */
    getPreMonth = function (date) {
        let arr = date.split('-');
        let year = arr[0]; //获取当前日期的年份
        let month = arr[1]; //获取当前日期的月份
        let day = arr[2]; //获取当前日期的日
        let days = new Date(year, month, 0);
        days = days.getDate(); //获取当前日期中月的天数
        let year2 = year;
        let month2 = parseInt(month) - 1;
        if (month2 === 0) {
            year2 = parseInt(year2) - 1;
            month2 = 12;
        }
        let day2 = day;
        let days2 = new Date(year2, month2, 0);
        days2 = days2.getDate();
        if (day2 > days2) {
            day2 = days2;
        }
        if (month2 < 10) {
            month2 = '0' + month2;
        }
        return year2 + '-' + month2 + '-' + day2;
    };



    render() {
        return (
            <div className="statistics">
                <div className="header2">预约到书统计<br/><br/>
                    <RangePicker onChange={this.onDatePickerChange}
                                 defaultValue={[moment(`${this.state.currentDate}`,'YYYY-MM-DD'), moment(`${this.state.previousMonth}`,'YYYY-MM-DD')]}

                                 placeholder={['开始日期', '结束日期']}
                    />
                </div>
                <div>
                    <Tabs tabPosition="left">
                        <TabPane tab="使用量统计" key="1">
                            <br/>
                            <ReactEcharts
                                option={this.getOption()}
                                notMerge={true}
                                lazyUpdate={true}


                                />

                        </TabPane>
                        <TabPane tab="读者统计" key="2">Content of Tab 2</TabPane>
                        <TabPane tab="院系统计" key="3">Content of Tab 3</TabPane>
                    </Tabs>
                </div>


            </div>
        );
    }
}

export default Statistics;
