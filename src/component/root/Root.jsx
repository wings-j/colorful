/**
 * @name Root Component
 */

/*成员*/

/**
 * @name 菜单
 * @type Class
 */
const Menu=class extends React.Component
{
/*构造*/

    constructor()
    {
        super();
    }
    render()
    {
        return <div className='menu'>
            <div className='menu_item'>
                <span>CSS</span>
                <div>
                    <div className='link' data-name='hex' onClick={this.handler_link_click.bind(this)}>#</div>
                    <div className='link' data-name='rgb' onClick={this.handler_link_click.bind(this)}>RGB</div>
                    <div className='link' data-name='hsl' onClick={this.handler_link_click.bind(this)}>HSL</div>
                </div>
            </div>
        </div>;
    }

/*成员*/

    /**
     * @name 处理鼠标点击事件
     * @type Function
     * @see Menu
     * @param {Object} ev 事件对象
     */
    handler_link_click(ev)
    {
        this.runCommand(ev.target.dataset.name);
    }
    /**
     * @name 运行命令
     * @type Function
     * @see Menu
     * @param {String} name 命令 
     * @param {Object} data 数据对象 
     */
    runCommand(name,data)
    {
        let result=Command[name](data);
        message.current.display(result.message);
    }
};
/**
 * @name 消息
 * @type Class
 */
const Message=class extends React.Component
{
/*构造*/

    constructor()
    {
        super();

        this.state=
        {
            text:'',
            opacity:0
        };

        this.timer=null;
    }
    render()
    {
        return <div style={{opacity:this.state.opacity}} className='message'>
            <span ref='text'>{this.state.text}</span>
        </div>;
    }

/*接口*/
    /**
     * @name 显示
     * @type Function
     * @see Message
     * @param {String} text 文本 
     */
    display(text)
    {
        this.setState({text,opacity:1});
        clearTimeout(this.timer);
        this.timer=setTimeout(()=>{this.setState({text:'',opacity:0});},4000);
    }
};
/**
 * @name 根容器
 * @type Class 
 */
const Root=class extends React.Component
{
/*构造*/

    constructor()
    {
        super();

        this.childInterface=
        {
            load:this.load.bind(this)
        };

        this.refer=
        {
            picker:React.createRef(),
            saver:React.createRef()
        };
    }
    render()
    {
        return <div className='root'>
            <div className='links'>
                <a href='https://github.com/WingsJ0/Colorful.git' target='_blank'>源码</a>
            </div>
            <Menu/>
            <Message ref={message}/>
            {Picker}
            <div className='saveButton' onClick={this.handler_saveButton_click.bind(this)}>
                <svg viewBox="0 0 1035 1024"><defs><style type="text/css"></style></defs><path d="M6.79066 259.237229 6.79066 397.009036 472.658993 862.546841 553.098024 862.546841 1018.84049 397.009036 1018.84049 259.237229 994.376309 259.549338 529.364483 747.765655 498.876098 747.710396 34.920324 259.237229Z"></path></svg>
                <span>暂存</span>
            </div>
            {Saver}
        </div>;
    }

/*成员*/

    /**
     * @name 处理保存按钮点击事件
     * @type Function
     * @see Root
     */
    handler_saveButton_click()
    {
        storeColor(getColor());
    }

/*接口*/

    /**
     * @name 载入
     * @type Function
     * @see Root
     * @param {Object} hsv 颜色对象
     */
    load(hsv)
    {
        this.refer.picker.current.setColor(hsv.h,hsv.s,hsv.v);
    }
};

let message=null;

/**
 * @name 广播_接收加载颜色
 * @type Function
 * @param {Object} data 数据
 */
let broadcast_loadColor=function({color})
{
    setColor(color.h,color.s,color.v);
};

/*接口*/

let component;
let broadcast=null;

/*构造*/

import './Root.less';
import Command from './Command.js';
import React from 'react';
import Broadcast from 'Public/Broadcast.js';
import Picker,{setColor,getColor} from 'Component/picker/Picker.jsx';
import Saver,{storeColor} from 'Component/saver/Saver.jsx';

message=React.createRef();
component=<Root/>;
broadcast=new Broadcast(['LoadColor','displayMessage']);

broadcast.addListener('LoadColor',broadcast_loadColor);

export default component;
export {broadcast};