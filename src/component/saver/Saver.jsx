/**
 * @name Saver Component
 */

/*成员*/

/**
 * @name 颜色块
 * @type Class
 */
const ColorBlock=class extends React.Component
{
/*构造*/

    constructor()
    {
        super();

        this.refer=
        {
            container:React.createRef()
        };
    }
    render()
    {
        let hsl=this.props.prop_hsv.toHSL();

        return <div ref={this.refer.container} className='colorBlock' style={{background:`hsl(${hsl.h},${hsl.s*100}%,${hsl.l*100}%)`}} onClick={this.handler_click.bind(this)}>
            <svg onClick={this.handler_deleteButton_click.bind(this)} viewBox='0 0 1024 1024'><path d='M512 32C246.4 32 32 246.4 32 512s214.4 480 480 480 480-214.4 480-480S777.6 32 512 32m201.6 681.6c-12.8 12.8-35.2 12.8-48 0L512 560l-153.6 153.6c-12.8 12.8-35.2 12.8-48 0-12.8-12.8-12.8-35.2 0-48l153.6-153.6-153.6-153.6c-12.8-12.8-12.8-35.2 0-48 12.8-12.8 35.2-12.8 48 0l153.6 153.6 153.6-153.6c12.8-12.8 35.2-12.8 48 0 12.8 12.8 12.8 35.2 0 48L560 512l153.6 153.6c16 12.8 16 35.2 0 48m0 0z'></path></svg>
        </div>;
    }
    componentDidMount()
    {
        let container=this.refer.container.current;
        container.style.width=`${container.offsetHeight}px`;      //宽等于高
    }

/*成员*/
    /**
     * @name 处理点击事件
     * @type Function
     * @see ColorBlock
     */
    handler_click()
    {
        broadcast.trigger('LoadColor',{color:this.props.prop_hsv});
    }
    /**
     * @name 处理删除按钮点击事件
     * @type Function
     * @see ColorBlock
     * @param {Object} ev 事件对象
     */
    handler_deleteButton_click(ev)
    {
        ev.stopPropagation();
        this.props.prop_removeInterface(this.props.prop_hsv);
    }
};
ColorBlock.propTypes=
{
    prop_hsv:PropTypes.object.isRequired,
    prop_removeInterface:PropTypes.func.isRequired
};
/**
 * @name 保存器
 * @type Class
 */
const Saver=class extends React.Component
{
/*构造*/

    constructor()
    {
        super();

        this.state=
        {
            groupLeft:0,
            list:[]
        };

        this.refer=
        {
            container:React.createRef(),
            group:React.createRef()
        };
        this.layout=
        {
            contentWidth:null,
            groupWidth:null
        };
    }
    render()
    {
        let i=0;

        return <div ref={this.refer.container} className='saver'>
            <div ref={this.refer.group} className='group' style={{left:`${this.state.groupLeft+20}px`}} onWheel={this.handler_group_wheel.bind(this)}>
                {this.state.list.map((el)=>
                {
                    return <ColorBlock key={i++} prop_hsv={el} prop_removeInterface={this.remove.bind(this)}/>;
                })}
            </div>
        </div>;
    }
    componentDidMount()
    {
        this.layout.contentWidth=this.refer.container.current.offsetWidth*0.94-2;       //padding:3%*2,border:1px*2
        this.layout.groupWidth=this.refer.group.current.offsetWidth;
    }
    componentDidUpdate()
    {
        this.layout.groupWidth=this.refer.group.current.offsetWidth;
    }

/*成员*/

    /**
     * @name 事件处理_group_wheel
     * @type Function
     * @see Saver
     * @param {Object} ev 事件对象
     */
    handler_group_wheel(ev)
    {
        const step=50;

        let groupLeft;
        if(ev.deltaY>0)
            groupLeft=Math.max(this.state.groupLeft-step,Math.min(this.layout.contentWidth-this.layout.groupWidth,0));
        else if(ev.deltaY<0)
            groupLeft=Math.min(this.state.groupLeft+step,0);

        this.setState({groupLeft});
    }

/*接口*/

    /**
     * @name 添加
     * @type Function
     * @see Saver
     * @param {Object} hsv 颜色对象
     */
    add(hsv)
    {
        let list=this.state.list;
        list.push(hsv);
        this.setState({list});
    }
    /**
     * @name 去除
     * @type Function
     * @see Saver
     * @param {Object} hsv 颜色对象
     */
    remove(hsv)
    {
        let list=this.state.list;
        let index=list.indexOf(hsv);
        if(index!==-1)
        {
            list.splice(index,1);
            this.setState({list});
        }
    }
};

/*接口*/

let component;
let refer;

/**
 * @name 添加
 * @type Function
 * @param {Object} hsv HSV实例
 */
let storeColor=function(hsv)
{
    refer.current.add(hsv);
};

/*构造*/

import './Saver.less';
import React from 'react';
import PropTypes from 'prop-types';
import {broadcast} from 'Component/root/Root.jsx';

refer=React.createRef();
component=<Saver ref={refer}/>;

export default component;
export {storeColor};
