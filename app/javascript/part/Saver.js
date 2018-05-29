import '../../stylesheet/Saver.less';
import React from 'react';
import ReactDOM from 'react-dom';
import {HSV} from '../algrithm/Color.js';

/*成员*/
/**
 * @name 颜色块
 * @type Class
 */
class ColorBlock extends React.Component
{
/*构造*/
    /**
     * @name 构造方法
     * @type Function
     * @see ColorBlock
     * @param {Object} hsl 颜色对象,HSL 
     */
    constructor(props)
    {
        super(props);

        this.parent=props.parent;
        this.hsl=props.hsl;
    }
    render()
    {
        return <div ref='container' className='colorBlock' style={{background:`hsl(${this.hsl.h},${this.hsl.s*100}%,${this.hsl.l*100}%)`}}>
            <svg ref='deleteButton' viewBox="0 0 1024 1024"><defs></defs><path d="M512 32C246.4 32 32 246.4 32 512s214.4 480 480 480 480-214.4 480-480S777.6 32 512 32m201.6 681.6c-12.8 12.8-35.2 12.8-48 0L512 560l-153.6 153.6c-12.8 12.8-35.2 12.8-48 0-12.8-12.8-12.8-35.2 0-48l153.6-153.6-153.6-153.6c-12.8-12.8-12.8-35.2 0-48 12.8-12.8 35.2-12.8 48 0l153.6 153.6 153.6-153.6c12.8-12.8 35.2-12.8 48 0 12.8 12.8 12.8 35.2 0 48L560 512l153.6 153.6c16 12.8 16 35.2 0 48m0 0z"></path></svg>
        </div>
    }
    componentDidMount()
    {
        var container=this.refs.container;
        container.style.width=container.offsetHeight+'px';      //宽等于高
        container.addEventListener('click',this.onClick.bind(this));
        if(this.hsl.selected)
            container.classList.add('selected');

        this.refs.deleteButton.addEventListener('click',this.deleteButton_onClick.bind(this));
    }

/*成员*/
    /**
     * @name 处理点击事件
     * @type Function
     * @see ColorBlock
     */
    onClick()
    {
        var hsv=this.hsl.toHSV();
        this.parent.load(hsv);

        this.parent.sweepSelected(this.hsl);
        this.parent.update();
    }
    /**
     * @name 处理删除按钮点击事件
     * @type Function
     * @see ColorBlock
     * @param {Object} e 事件对象
     */
    deleteButton_onClick(e)
    {
        e.stopPropagation();

        this.parent.del(this.hsl);
    }
};

/*接口*/
/**
 * @name 保存器
 * @type Class
 */
class Saver extends React.Component
{
/*构造*/
    constructor(props)
    {
        super(props);

        this.parent=props.parent;
        this.childInterface=
        {
            del:this.del.bind(this),
            sweepSelected:this.sweepSelected.bind(this),
            update:this.update.bind(this),
            load:this.parent.load,
        };
        this.list=[];
        this.width=null;
        this.contentWidth=null;
        this.slideRightEdge=null;
        this.slideer=null;
        this.slideRate=0;
    }
    render()
    {
        return <div ref='container' className='saver'>
            <div ref='group' className='group'></div>
            <div ref='slideBar' className='slideBar'>
                <div ref='slideBar_slider' className='slideBar_slider'></div>
            </div>    
        </div>;
    }
    componentDidMount()
    {
        this.width=this.refs.container.offsetWidth;
        this.contentWidth=this.refs.container.offsetWidth*0.94-2;       //padding:3%*2,border:1px*2
        this.slideRightEdge=this.refs.container.offsetWidth-this.refs.slideBar_slider.offsetWidth;
        this.slider=this.refs.slideBar_slider;
        this.bindMouseEvent(this.refs.slideBar_slider);
    }

/*成员*/
    /**
     * @name 扫描选择性
     * @type Function
     * @see Saver
     * @param {Object} hsl 颜色对象
     */
    sweepSelected(hsl)
    {
        var list=this.list;
        for(var i=0,l=list.length;i<l;i++)
        {
            if(list[i]!==hsl)
                list[i].selected=false;
            else
                list[i].selected=true;
        }
    }
    /**
     * @name 更新
     * @type Function
     * @see Saver
     */
    update()
    {
        ReactDOM.unmountComponentAtNode(this.refs.group);       //清空
        var colorBlocks=[];
        for(var i=0,l=this.list.length;i<l;i++)
            colorBlocks.push(<ColorBlock key={i} parent={this.childInterface} hsl={this.list[i]}></ColorBlock>);
        ReactDOM.render(colorBlocks,this.refs.group);
    }
    /**
     * @name 调整内容
     * @type Function
     * @see Saver
     * @param {int} option 选项 
     */
    adjustContent(option)
    {
        this.refs.group.style.width=this.list.length*80+'px';
        switch(option)
        {
            case 0:     //移动至内容尾
            {
                this.slide(1);
            }
            case 1:     //内容匹配滑块
            {
                this.slide();
            }
        }
    }
    /**
     * @name 滑动
     * @type Function
     * @see Saver
     * @param {float} rate 比例，可选
     */
    slide(rate=null)
    {
        if(rate===null)
            var rate=this.slideRate;
        else
            this.slideRate=rate;
        this.slider.style.left=`${rate*this.slideRightEdge}px`;     //调整滑块

        var deltaWidth=this.contentWidth-this.refs.group.offsetWidth;       //调整内容

        if(deltaWidth<0)
        {
            this.refs.group.style.left=`${deltaWidth*rate}px`;
            this.refs.slideBar.classList.add('display');
        }
        else
            this.refs.slideBar.classList.remove('display');
    }
    /**
     * @name 绑定鼠标拖动属性
     * @type Function
     * @see Saver
     * @description 鼠标变量+元素原位置
     * @param element 目标元素
     */
    bindMouseEvent(element)
    {
        var that=this;
        var rightEdge=this.slideRightEdge;

        var mouseMoveHandler=function(e)
        {
            var x=element.offsetLeft+e.clientX-mouseX;
            if(x<0)
                x=0;
            else if(x>rightEdge)
                x=rightEdge;

            that.slide(x/rightEdge);

            mouseX=e.clientX;
        };
        var mouseUpHandler=function()
        {
            document.removeEventListener("mousemove",mouseMoveHandler);
            document.removeEventListener("mouseup",mouseUpHandler);
        }

        var mouseX;
        var mouseY;

        element.addEventListener("mousedown",function (e)
        {
            mouseX=e.clientX;

            document.addEventListener("mousemove",mouseMoveHandler);
            document.addEventListener("mouseup",mouseUpHandler);

            return false;       //阻止浏览器默认行为
        });
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
        var hsl=hsv.toHSL();
        hsl.selected=true;      //属性注入
        this.list.push(hsl);
        this.sweepSelected(hsl);

        this.update();
        this.adjustContent(0);
    }
    /**
     * @name 删除
     * @type Function
     * @see Saver
     * @param {Object} hsl 颜色对象
     */
    del(hsl)
    {
        var index=this.list.indexOf(hsl);
        this.list.splice(index,1);
        
        this.update();
        this.adjustContent(1);
    }
};

export {Saver};