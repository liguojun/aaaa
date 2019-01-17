import React, { Component } from "react";
import { Form, Button, message, Input } from 'antd';
import { BrowserRouter, Redirect} from "react-router-dom";

import "./LoginForm.css";

import sssm_config from '../config/sssm.js';
import request from '../utils/request.js';

let sssm_url = sssm_config.sssm.URL;

class LoginForm extends Component {
    constructor(props){
        super(props);
    }

    state = {
        userid: '',
        password: '',
        userSirsiID: '',
        sessionToken: '',
        userName: '',
        redirect: false,
        lock: true,
    };

    handleSubmit = (e) => {
        e.preventDefault();
        let userid = this.state.userid;
        let password = this.state.password;
        //console.log(userid);
        if(userid!=="" && password!==""){
            let timestamp = new Date().getTime();
            const paramdata = {
                userid: userid,
                password: password
            };
            let url=sssm_url+'/yycx/loginSirsiByPrivilege';
            request.post(url, paramdata).then(data => {
                //console.log(data);
                if (data!=="" && data.code==="200") {
                    //window.sessionStorage.setItem('userSirsiID', data.userID);
                    window.sessionStorage.setItem('sessionToken', data.sessionToken);
                    window.sessionStorage.setItem('userName',  data.userName);
                    this.setState({
                        userSirsiID: data.userID,
                        sessionToken: data.sessionToken,
                        userName: data.userName,
                        redirect: true
                    });

                    message.success('登录成功！');
                }else{
                    message.error('登录失败，请重试！',5);
                }
            });

        }

    };

    //将用户名大写
    handleUserNameChange = (event) =>{
        const target = event.target;
        this.setState({
            userid: target.value.toUpperCase()
        });
    };
    //监听用户名和密码两个input值得变化
    handleChange = (event) =>{
        const target = event.target;
        this.setState({
            [target.name]: target.value
        });
    };

    //第一次加载数据
    componentDidMount() {
        //store.set('mytoken', '');
        window.sessionStorage.clear();
    }


    render() {
        const { redirect } = this.state;

        if (redirect) {
            return <Redirect push to="/showholdbook" />;
        }
        return (
            <div className="login">
                <div className="header">
                </div>
                <div className="center">
                        <div className="form">
                            <Form onSubmit={this.handleSubmit} className="login-form">
                                <input type="text" placeholder="用户名" autoFocus name="userid" value={this.state.userid} onChange={this.handleUserNameChange} />
                                <input type="password" placeholder="密码" name="password" value={this.state.password} onChange={this.handleChange} />
                                <Button type="primary" htmlType="submit" onClick={this.handleSubmit}>登录</Button>
                                <p className="message">使用workflow账号登录</p>
                            </Form>
                        </div>
                </div>
                <div className="footer">
                    北京大学图书馆 ©2019<br/>
                        建议使用Firefox或者Google Chrome来浏览本网站
                </div>
            </div>
        );
    }

}

export default LoginForm;