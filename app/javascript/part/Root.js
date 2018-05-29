import '../../stylesheet/Root.less';
import React from 'react';
import {Picker} from './Picker.js';
import {Saver} from './Saver.js';

/**
 * @name 根容器
 * @type Class 
 */
class Root extends React.Component
{
/*构造*/
    constructor()
    {
        super();

        this.childInterface=
        {
            load:this.load.bind(this)
        };
    }
    render()
    {
        return <div className='root'>
            <div className='links'>
                <a href='https://gitee.com/skywingjiang/Colorful.git' target='_blank'>源码</a>
            </div>
            <Picker ref='picker'/>
            <div ref='saveButton' className='saveButton'>
                <svg viewBox="0 0 1035 1024"><defs><style type="text/css"></style></defs><path d="M6.79066 259.237229 6.79066 397.009036 472.658993 862.546841 553.098024 862.546841 1018.84049 397.009036 1018.84049 259.237229 994.376309 259.549338 529.364483 747.765655 498.876098 747.710396 34.920324 259.237229Z"></path></svg>
                <span>暂存</span>
            </div>
            <Saver ref='saver' parent={this.childInterface}/>
        </div>;
    }
    componentDidMount()
    {
        this.refs.saveButton.addEventListener('click',this.saveButton_onclick.bind(this));
    }

/*成员*/
    /**
     * @name 处理保存按钮点击事件
     * @type Function
     * @see Root
     */
    saveButton_onclick()
    {
        this.refs.saver.add(this.refs.picker.getColor());
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
        this.refs.picker.setColor(hsv.h,hsv.s,hsv.v);
    }
}

export {Root};