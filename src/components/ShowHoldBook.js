import React, { Component } from "react";
import { Table, Input, Select, Modal, message, Tag, Card, Button } from 'antd';
import request from "../utils/request";
import sssm_config from '../config/sssm.js';
import CheckToken from '../utils/CheckToken';
import './ShowHoldBook.css';
import BookDetails from "./BookDetails";

let sssm_url = sssm_config.sssm.URL;


class ShowHoldBook extends Component {
    constructor(props){
        super(props);		
        this.state = {
            booklist: [],
			holdbooklist:[],
            detailsmodel_visible: false,
            book: '',
            title: '',
            searchValue: '',
            loading: false,
            autoFocus: true,
            emptyText: '请输入学工号进行检索',
            displayName: '',//工作人员的姓名
            userID: '',
            userName: '',
            numberOfHolds: '',
            numberOfAvailableHolds: '',			
			searchtime: ''
        }
    }

    //第一次加载数据
    componentDidMount() {
        let curwwwurl=window.location.href;
        let pathname=window.location.pathname;
		let time = new Date().toString();
        this.setState({
            displayName: window.sessionStorage.getItem('userName'),
			searchtime: time
        })
    }

    handleDetailsModelOk = (e) => {
        //console.log(e);
        this.setState({
            detailsmodel_visible: false,
        });
    };
    handleDetailsModelCancel = (e) => {
        //console.log(e);
        this.setState({
            detailsmodel_visible: false,
        });
    };

    handleSearchChange = (e) =>{
        this.setState({
            searchValue: e.target.value
        });
    };

    //点击搜索按钮
    handleSearchClick(keywords, e) {
        const sessionToken = window.sessionStorage.getItem('sessionToken');
        if(sessionToken===undefined || sessionToken===null){
            Modal.error({
                title: '提示',
                content: (
                    <div>
                        <p>您的登录已经失效，请重新登录！</p>
                    </div>
                ),
                onOk() {
                    let curwwwurl=window.location.href;
                    let pathname=window.location.pathname;
                    let pos=curwwwurl.indexOf(pathname);
                    window.location.href=curwwwurl.substring(0,pos);
                },
            });
        }else{
            this.setState({ loading: true });
            let timestamp = new Date().getTime();
			let time = new Date().toString();
            let url=sssm_url+'/yycx/lookupUserInfoByID?keyword='+keywords+'&sessionToken='+sessionToken+'&displayName='+this.state.displayName+'&timestamp='+timestamp;
            request.get(url).then(data => {
                //console.log(data.holdbooklist);
                if (!data.error) {
                    this.setState({
                        userID: data.userID,
                        userName: data.userName,
                        numberOfHolds: data.numberOfHolds,
                        numberOfAvailableHolds: data.numberOfAvailableHolds,
                        booklist: data.patronHoldInfo,
						holdbooklist: data.holdbooklist,
                        loading: false,
                        emptyText: '检索结果为空',
                        autoFocus: true,
                        searchValue: '',						
						searchtime: time
                    });
                    if(data.code==='201'){
                        message.error('该用户ID：'+keywords+' 不存在！');
                        this.setState({
                            emptyText: '该用户ID：'+keywords+' 不存在',
                            autoFocus: true,
                            searchValue: '',							
							searchtime: time
                        });
                    }else if(data.code==='202'){
                        message.error('登录会话失效，请重新登录！');
                        let curwwwurl=window.location.href;
                        let pathname=window.location.pathname;
                        let pos=curwwwurl.indexOf(pathname);
                        window.location.href=curwwwurl.substring(0,pos);
                    }

                }else{
                    this.setState({
                        booklist: data.patronHoldInfo,
						holdbooklist:data.holdbooklist,
                        loading: false,
                        emptyText: '检索结果为空',
                        autoFocus: true,
                        searchValue: '',						
						searchtime: time
                    });
                }
            });
        }
    }

    //打印预约到书
    handlePrintHoldBook = () => {
        let timestamp = new Date().getTime();
        let keywords=1, sessionToken=2;
        
		let printhtml = timestamp;
		let bdhtml=window.document.body.innerHTML;
		
		//window.document.body.innerHTML=printhtml;  
		window.print();  
		
		//window.document.body.innerHTML = bdhtml;
		
		//this.props.history.push('/showholdbook');

    };	
	

    render() {

        const InputGroup = Input.Group;
        const Search = Input.Search;        

        return (
            <div className="bookSearch">
                <CheckToken />
                <div style={{float:'right'}} className="noprint">欢迎，<b>{this.state.displayName}</b>&nbsp;&nbsp;&nbsp;&nbsp;<a href='/'>退出</a></div>
				<h2>&nbsp;&nbsp;&nbsp;&nbsp;预约到书打印</h2>
                <div className="noprint">
                    <InputGroup compact size="large">
                        <Search addonBefore="学工号：" placeholder="请输入学工号" autoFocus={this.state.autoFocus} value={this.state.searchValue} onChange={this.handleSearchChange} enterButton="Search"  size="large" onSearch={(value,e) => {this.handleSearchClick(value,e)}}  />
                    </InputGroup>				
					<br/>    
				</div>                
				<div>
					<div style={{textAlign:'left',width:'80%',float:'left'}}>
                        &nbsp;&nbsp;&nbsp;&nbsp;学工号：<span style={{fontSize:'16px', fontWeight:'bold'}}>{this.state.userID}</span>
							&nbsp;&nbsp;姓名：<span style={{fontSize:'16px', fontWeight:'bold'}}>{this.state.userName}</span>
							&nbsp;&nbsp;数量：<span style={{fontSize:'20px', fontWeight:'bold'}}>{this.state.numberOfAvailableHolds}</span>						
					</div>
					<div style={{textAlign:'right',width:'20%',float:'right'}} className="noprint">
						<Button type="primary" onClick={this.handlePrintHoldBook}>打印预约到书</Button>
					</div>
				</div>				
				<br/>
				<div style={{marginTop:'15px'}}>
                    <div>&nbsp;&nbsp;&nbsp;&nbsp;序号&nbsp;&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;&nbsp;索书号&nbsp;&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;&nbsp;条码号&nbsp;&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;&nbsp;可用日期&nbsp;&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;&nbsp;题名</div>
					{(this.state.holdbooklist || []).map((item, index) => (
					    <div key={index}>
                            {index===0&&item.itemlocation.substring(0,2)==='昌平'?<div><hr/>&nbsp;&nbsp;&nbsp;&nbsp;{item.itemlocation}</div>:''}
                            {index===0&&item.itemlocation.substring(0,2)!=='昌平'?<div><hr/>&nbsp;&nbsp;&nbsp;&nbsp;{item.itemlibraryid}</div>:''}
                            {index!==0&&item.itemlocation.substring(0,2)==='昌平'&&item.itemlocation!==this.state.holdbooklist[index-1].itemlocation?<div><hr/>&nbsp;&nbsp;&nbsp;&nbsp;{item.itemlocation}</div>:''}
                            {index!==0&&item.itemlocation.substring(0,2)!=='昌平'&&item.itemlibraryid!==this.state.holdbooklist[index-1].itemlibraryid?<div><hr/>&nbsp;&nbsp;&nbsp;&nbsp;{item.itemlibraryid}</div>:''}
                            {index!==0&&item.itemlocation.substring(0,2)!=='昌平'&&item.itemlibraryid===this.state.holdbooklist[index-1].itemlibraryid&&this.state.holdbooklist[index-1].itemlocation.substring(0,2)==='昌平'?<div><hr/>&nbsp;&nbsp;&nbsp;&nbsp;{item.itemlibraryid}</div>:''}
                            <div><hr/>&nbsp;&nbsp;&nbsp;&nbsp;{index+1} | <b>{item.callnumber}</b> | {item.itemID} | {item.availableDate.substring(0,10)}<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| {item.title}</div>
                        </div>
                    ))}
				</div>
                <hr/>
				<div>&nbsp;&nbsp;&nbsp;&nbsp;{this.state.searchtime}</div>
                <div style={{marginTop:'10px'}}>&nbsp;&nbsp;&nbsp;&nbsp;北京大学图书馆 ©2019
                    <span className="noprint"><br/>建议使用Firefox或者Google Chrome来浏览本网站</span></div>

            </div>
        );
    }
}

export default ShowHoldBook;