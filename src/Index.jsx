/**
 * @name Webpack入口
 */

/*成员*/

const Css=
`
    html
    {
        font-family:'Microsoft JhangHei','Microsoft YaHei',serif;
        color:#666666;
        font-size:10px;
        line-height:1;
    }
    body
    {
        overflow: hidden;
        width:100vw;
        height:100vh;
        padding:0;
        margin:0;
        background-color:white;
    }
    a:link,a:visited,a:hover,a:focus
    {
        color:currentColor;
        text-decoration:none;
    }
`;

/*构造*/

import React from 'react';
import ReactDOM from 'react-dom';
import Root from 'Component/root/Root.jsx';

document.addEventListener('DOMContentLoaded',function handler_document_DOMContentLoaded()
{
    let style=document.createElement('style');
    style.innerHTML=Css;
    document.head.appendChild(style);

    ReactDOM.render(Root,document.getElementById('container'));
});
