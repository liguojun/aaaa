import React, { Component } from "react";
import { Modal } from 'antd';

import sssm_config from '../config/sssm.js';
import request from './request.js';


let sssm_url = sssm_config.sssm.URL;

class CheckToken extends Component {
  constructor(props){
    super(props);
  }

  //第一次加载数据
  componentDidMount() {
    const sessionToken = window.sessionStorage.getItem('sessionToken');
    let timestamp = new Date().getTime();
    let url=sssm_url+'/yycx/checkSession?sessionToken='+sessionToken+'&timestamp='+timestamp;
    request.get(url).then(data => {
      if (!data.error) {
          if(data.code==='200'){

          }else{
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
          }
      }else{
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
      }
    });

  }


  render() {

    return (
      <div />
    );
  }

}

export default CheckToken;
