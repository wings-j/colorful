/**
 * @name Picker Component
 */

/*成员*/

/**
 * @name 取得点击事件位置相对于元素左上角位置
 * @type Function
 * @param {Object} element 元素
 * @param {Object} mousePosition {x:number,y:number} 鼠标位置
 * @return {Object} 相对位置，{x:number,y:number}
*/
const getRelativePosition=function(element,mousePosition)
{
    let position=element.getBoundingClientRect();

    let relativePosition=
    {
        x:mousePosition.x-(position.left),
        y:mousePosition.y-(position.top)
    };
    
    return relativePosition;
};
/**
 * @name 极坐标转换为直角坐标
 * @type Function
 * @param {number} module 模
 * @param {number} angle 角度
 * @return {Object} {x:number,y:number} 直角坐标向量对象,
 */
const polarToRight=function(module,angle)
{
    let x=module*Math.cos(angle);
    let y=module*Math.sin(angle);

    return {x,y};
};
/**
 * @name 直角坐标转换为极坐标
 * @type Function
 * @param {number} x 横坐标 
 * @param {number} y 纵坐标
 * @return {Object} 极坐标向量对象，角度范围0~2π
 */
const rightToPolar=function(x,y)
{
    let module=Math.sqrt(x*x + y*y);

    let angle;
    if(x==0 && y==0)
        angle=0;
    else
        angle = Math.atan(y / x);   

    if (x<0)
        angle = Math.PI + angle;
    else if(x>=0 && y<0)
        angle= Math.PI*2 + angle;

    return {module,angle};
};

/**
 * @name 色轮
 * @type Class
 */
const ColorWheel=class extends React.Component
{
/*构造*/

    constructor()
    {
        super();

        this.layout=
        {
            width:null,
            height:null,
            wheelWidth:null,
            wheelHeight:null,
            maskWidth:null,
            maskHeight:null,
            wheelRadius:null,
            wheelX:null,
            wheelY:null,
            maskX:null,
            maskY:null
        };
        this.canvas=React.createRef();
        this.context=null;
        this.temp=
        {
            colorString:null,
            wheelImage:new Image(),
            maskImage:new Image()
        };

        this.temp.wheelImage.onload=()=>{this.update();};
        this.temp.maskImage.onload=()=>{this.update();};
        this.temp.wheelImage.src='./image/ColorWheel.png';
        this.temp.maskImage.src='./image/ColorMask.png';

        this.selectColor=ThrottleLock(this.selectColor,30,this);
        this.handler_onMouseDown=this.handler_onMouseDown.bind(this);
        this.handler_onMouseMove=this.handler_onMouseMove.bind(this);
        this.handler_onMouseUp=this.handler_onMouseUp.bind(this);
    }
    render()
    {
        return <canvas className='wheel' ref={this.canvas} onMouseDown={this.handler_onMouseDown}></canvas>;
    }
    componentDidMount()
    {
        let canvas=this.canvas=this.canvas.current;

        this.layout.width=canvas.offsetHeight;        //长宽相同
        this.layout.height=canvas.offsetHeight;
        this.layout.wheelWidth=this.layout.width;
        this.layout.wheelHeight=this.layout.height;
        this.layout.wheelX=0;
        this.layout.wheelY=0;
        this.layout.maskWidth=this.layout.width/2;
        this.layout.maskHeight=this.layout.height/2;
        this.layout.maskX=(this.layout.width-this.layout.maskWidth)/2;
        this.layout.maskY=(this.layout.height-this.layout.maskHeight)/2;
        this.layout.wheelRadius=this.layout.wheelWidth/2-22;

        canvas.width=this.layout.width;       //尺寸重设定
        canvas.height=this.layout.height;
        this.context=canvas.getContext('2d');
        this.update();

        colorSelector.push(this);
    }
    shouldComponentUpdate()
    {
        return false;       //禁止通过react更新
    }

/*成员*/
    /**
     * @name 画小圆环
     * @type Function
     * @see ColorWheel
     * @param {number} 横向坐标
     * @param {number} 纵向坐标
     */
    drawCircle(x,y)
    {
        let context=this.context;

        context.beginPath();
        context.arc(x,y,8,0,Math.PI*2);
        context.strokeStyle='white';
        context.lineWidth=3;
        context.stroke();
        context.beginPath();
        context.arc(x,y,5,0,Math.PI*2);
        context.strokeStyle='grey';
        context.lineWidth=2;
        context.stroke();
    }
    /**
     * @name 选择颜色
     * @type Function
     * @see ColorWheel
     * @param {number} x 横坐标
     * @param {number} y 纵坐标 
     */
    selectColor(x,y)
    {
        if(x>=this.layout.maskX && x<= this.layout.maskX+this.layout.maskWidth && y>=this.layout.maskY && y<=this.layout.maskY+this.layout.maskHeight)        //mask
        {
            let s=(x-this.layout.maskX)/this.layout.maskWidth;
            let v=1-(y-this.layout.maskY)/this.layout.maskHeight;

            setColor(null,s,v);
        }
        else        //wheel
        {
            let polar = rightToPolar(x-this.layout.wheelWidth/2,y-this.layout.wheelHeight/2);
            if(polar.module<this.layout.wheelRadius+24 && polar.module>this.layout.wheelRadius-10)
            {
                let h=(polar.angle/(Math.PI*2)+0.25)*360%360;     //0.25：偏差修正

                setColor(h,null,null);
            }
        }

        this.update();
    }
    /**
     * @name 处理鼠标按下事件
     * @type Function
     * @see ColorWheel
     * @param {Object} ev 鼠标事件对象 
     */
    handler_onMouseDown(ev)
    {
        let position=getRelativePosition(this.canvas,{x:ev.clientX,y:ev.clientY});
        this.selectColor(position.x,position.y);

        let container=this.canvas;
        container.addEventListener('mousemove',this.handler_onMouseMove);
        container.addEventListener('mouseup',this.handler_onMouseUp);
        document.addEventListener('mouseup',this.handler_onMouseUp);
    }
    /**
     * @name 处理鼠标移动事件
     * @type Function
     * @see ColorWheel
     * @param {Object} ev 鼠标事件对象 
     */
    handler_onMouseMove(ev)
    {
        let position=getRelativePosition(this.canvas,{x:ev.clientX,y:ev.clientY});
        this.selectColor(position.x,position.y);
    }
    /**
     * @name 处理鼠标抬起事件
     * @type Function
     * @see wheel
     */
    handler_onMouseUp()
    {
        let container=this.canvas;
        container.removeEventListener('mousemove',this.handler_onMouseMove);
        container.removeEventListener('mouseup',this.handler_onMouseUp);
        document.removeEventListener('mouseup',this.handler_onMouseUp);
    }

/*接口*/

    /**
     * @name 更新
     * @type Function
     * @see ColorWheel
     */
    update()
    {
        let colorString=JSON.stringify(color);
        if(this.temp.colorString!==colorString)     //阻止重复刷新
        {
            let context=this.context;
            context.clearRect(0,0,this.layout.width,this.layout.height);
    
            context.beginPath();        //色轮和掩膜
            context.rect(this.layout.maskX+0.5,this.layout.maskY+0.5,this.layout.maskWidth-0.5,this.layout.maskHeight-0.5);     //0.5：修正 
            let hsl=color.toHSL();
            context.fillStyle=`hsl(${hsl.h},100%,50%)`;
            context.fill();
            context.drawImage(this.temp.wheelImage,this.layout.wheelX,this.layout.wheelY,this.layout.wheelWidth,this.layout.wheelHeight);
            context.drawImage(this.temp.maskImage,this.layout.maskX,this.layout.maskY,this.layout.maskWidth,this.layout.maskHeight);
    
            let x=color.s*this.layout.maskWidth+this.layout.maskX;
            let y=(1-color.v)*this.layout.maskHeight+this.layout.maskY;
            this.drawCircle(x,y);
    
            let angle=color.h/360*(Math.PI*2)-Math.PI/2;     //-Math.PI/2：偏差修正
            let right=polarToRight(this.layout.wheelRadius+4,angle);       //+4：偏差修正
            x=right.x+this.layout.wheelWidth/2;
            y=right.y+this.layout.wheelHeight/2;
    
            this.drawCircle(x,y);
        }

        this.temp.colorString=colorString;
    }
};
/**
 * @name 输入框
 * @type Class
 */
const ColorInput=class extends React.Component
{
/*构造*/

    constructor()
    {
        super();

        this.refer=
        {
            input:React.createRef()
        };

        this.value=0;       //保证小数位数正确
        this.preserveValue=null;
    }
    render()
    {
        return <div className='panel_input'>
            <label>{this.props.prop_label}</label>
            <input ref={this.refer.input} onBlur={this.handler_input_blur.bind(this)} onKeyUp={this.handler_input_enter.bind(this)} onWheel={this.handler_input_wheel.bind(this)}/>
        </div>;
    }
    shouldComponentUpdate()
    {
        return false;
    }

/*成员*/

    /**
     * @name 处理焦点失去事件
     * @type Function
     * @see ColorInput
     */
    handler_input_blur()
    {
        let input=this.refer.input.current;
        let value=parseFloat(input.value);

        if(!isNaN(value) && value>=0 && value<=this.props.prop_max)
            this.value=parseFloat(value.toFixed(this.props.prop_digit));
        
        this.displayValue(); 
        this.props.prop_activate();
    }
    /**
     * @name 处理输入回车事件
     * @type Function
     * @see ColorInput
     * @param {Object} ev 事件对象
     */
    handler_input_enter(ev)
    {
        if(ev.keyCode==13)
            ev.target.blur();
    }
        /**
     * @name 处理鼠标滚轮事件
     * @type Function
     * @see ColorInput
     * @param {Object} ev 事件对象
     */
    handler_input_wheel(ev)
    {
        let step=this.props.prop_step;
        if(ev.deltaY>0)
            this.value=Math.max(this.value-step,0);
        else if(ev.deltaY<0)
            this.value=Math.min(this.value+step,this.props.prop_max);

        this.displayValue();
        this.props.prop_activate();
    }
    /**
     * @name 显示值
     * @type Function
     * @see ColorInput
     */
    displayValue()
    {
        this.refer.input.current.value=this.value.toFixed(this.props.prop_digit);
    }
    /**
     * @name 设置值
     * @type Function
     * @see ColorInput
     * @param {Number} value 值
     */
    setValue(value)
    {
        this.value=value;
        this.displayValue();
    }
    /**
     * @name 获取值
     * @type Function
     * @see ColorInput
     * @return {Number} 值
     */
    getValue()
    {
        return this.value;
    }
};
ColorInput.propTypes=
{
    prop_label:PropTypes.string.isRequired,
    prop_max:PropTypes.number.isRequired,
    prop_digit:PropTypes.number.isRequired,
    prop_step:PropTypes.number.isRequired,
    prop_activate:PropTypes.func.isRequired
};
/**
 * @name RGB输入框组
 * @type Class
 */
const ColorInputGroup_RGB=class extends React.Component
{
/*构造*/

    constructor()
    {
        super();

        this.refer=
        {
            r:React.createRef(),
            g:React.createRef(),
            b:React.createRef()
        };
    }
    render()
    {
        return <div className='panel_inputGroup'>
            <ColorInput ref={this.refer.r} prop_label='R' prop_max={255} prop_digit={0} prop_step={1} prop_activate={this.activate.bind(this)}></ColorInput>
            <ColorInput ref={this.refer.g} prop_label='G' prop_max={255} prop_digit={0} prop_step={1} prop_activate={this.activate.bind(this)}></ColorInput>
            <ColorInput ref={this.refer.b} prop_label='B' prop_max={255} prop_digit={0} prop_step={1} prop_activate={this.activate.bind(this)}></ColorInput>
        </div>;
    }

/*接口*/

    /**
     * @name 更新
     * @type Function
     * @see ColorInputGroup_RGB
     */
    update()
    {
        let rgb=color.toRGB();

        this.refer.r.current.setValue(Math.round(rgb.r));
        this.refer.g.current.setValue(Math.round(rgb.g));
        this.refer.b.current.setValue(Math.round(rgb.b));
    }
    /**
     * @name 触发
     * @type Function
     * @see ColorInputGroup_RGB
     */
    activate()
    {
        let r=this.refer.r.current.getValue();
        let g=this.refer.g.current.getValue();
        let b=this.refer.b.current.getValue();
        let hsv=(new RGB(r,g,b)).toHSV();

        setColor(hsv.h,hsv.s,hsv.v);
    }
    /**
     * @name 取得颜色值
     * @type Function
     * @see ColorInputGroup_RGB
     * @return {Object} RGB实例。
     */
    getColorValue()
    {
        return new RGB(this.refer.r.current.getValue(),this.refer.g.current.getValue(),this.refer.b.current.getValue());
    }
};
/**
 * @name HSL输入框组
 * @type Class
 */
const ColorInputGroup_HSL=class extends React.Component
{
/*构造*/

    constructor()
    {
        super();

        this.refer=
        {
            h:React.createRef(),
            s:React.createRef(),
            l:React.createRef()
        };
    }
    render()
    {
        return <div className='panel_inputGroup'>
            <ColorInput ref={this.refer.h} prop_label='H' prop_max={360} prop_digit={0} prop_step={1} prop_activate={this.activate.bind(this)}></ColorInput>
            <ColorInput ref={this.refer.s} prop_label='S' prop_max={1} prop_digit={2} prop_step={0.1} prop_activate={this.activate.bind(this)}></ColorInput>
            <ColorInput ref={this.refer.l} prop_label='L' prop_max={1} prop_digit={2} prop_step={0.1} prop_activate={this.activate.bind(this)}></ColorInput>
        </div>;
    }

/*接口*/

    /**
     * @name 更新
     * @type Function
     * @see ColorInputGroup_HSL
     */
    update()
    {
        let hsl=color.toHSL();

        this.refer.h.current.setValue(hsl.h);
        this.refer.s.current.setValue(hsl.s);
        this.refer.l.current.setValue(hsl.l);
    }
    /**
     * @name 触发
     * @type Function
     * @see ColorInputGroup_HSL
     */
    activate()
    {
        let h=this.refer.h.current.getValue();
        let s=this.refer.s.current.getValue();
        let l=this.refer.l.current.getValue();
        let hsv=(new HSL(h,s,l)).toHSV();

        setColor(hsv.h,hsv.s,hsv.v);
    }
    /**
     * @name 取得颜色值
     * @type Function
     * @see ColorInputGroup_HSL
     * @return {Object} HSL实例
     */
    getColorValue()
    {
        return new HSL(this.refer.h.current.getValue(),this.refer.s.current.getValue(),this.refer.l.current.getValue());
    }
};
/**
 * @name HSV输入框组
 * @type Class
 */
const ColorInputGroup_HSV=class extends React.Component
{
/*构造*/
    constructor()
    {
        super();

        this.refer=
        {
            h:React.createRef(),
            s:React.createRef(),
            v:React.createRef()
        };
    }
    render()
    {
        return <div className='panel_inputGroup'>
            <ColorInput ref={this.refer.h} prop_label='H' prop_max={360} prop_digit={0} prop_step={1} prop_activate={this.activate.bind(this)}></ColorInput>
            <ColorInput ref={this.refer.s} prop_label='S' prop_max={1} prop_digit={2} prop_step={0.1} prop_activate={this.activate.bind(this)}></ColorInput>
            <ColorInput ref={this.refer.v} prop_label='V' prop_max={1} prop_digit={2} prop_step={0.1} prop_activate={this.activate.bind(this)}></ColorInput>
        </div>;
    }

/*接口*/
    /**
     * @name 更新
     * @type Function
     * @see ColorInputGroup_HSV
     */
    update()
    {
        let hsv=color;

        this.refer.h.current.setValue(hsv.h);
        this.refer.s.current.setValue(hsv.s);
        this.refer.v.current.setValue(hsv.v);
    }
    /**
     * @name 触发
     * @type Function
     * @see ColorInputGroup_HSV
     */
    activate()
    {
        let h=this.refer.h.current.getValue();
        let s=this.refer.s.current.getValue();
        let v=this.refer.v.current.getValue();

        setColor(h,s,v);
    }
    /**
     * @name 取得颜色值
     * @type Function
     * @see ColorInputGroup_HSV
     * @return {Object} HSL实例
     */
    getColorValue()
    {
        return new HSL(this.refer.h.current.getValue(),this.refer.s.current.getValue(),this.refer.l.current.getValue());
    }
};
/**
 * @name 面板
 * @type Class
 */
const Panel=class extends React.Component
{
/*构造*/
    constructor()
    {
        super();

        this.state=
        {
            exampleColor:null,
            hex:null
        };

        this.refer=
        {
            rgb:React.createRef(),
            hsl:React.createRef(),
            hsv:React.createRef()
        };
    }
    render()
    {
        return <div className='panel'>
            <div className='panel_color' style={{backgroundColor:this.state.exampleColor}}></div>
            <div className='panel_hex'>{this.state.hex}</div>
            <ColorInputGroup_RGB ref={this.refer.rgb}/>
            <ColorInputGroup_HSL ref={this.refer.hsl}/>
            <ColorInputGroup_HSV ref={this.refer.hsv}/>
        </div>;
    }
    componentDidMount()
    {
        this.update();

        colorSelector.push(this);
    }

/*接口*/
    /**
     * @name 更新
     * @type Funcion
     * @see Panel
     */
    update()
    {        
        let hsl=color.toHSL();
        let exampleColor=`hsl(${hsl.h},${hsl.s*100}%,${hsl.l*100}%)`;
        let rgb=color.toRGB();
        let hex=`#${PadCharStart(Math.round(rgb.r).toString(16),2,'0')}${PadCharStart(Math.round(rgb.g).toString(16),2,'0')}${PadCharStart(Math.round(rgb.b).toString(16),2,'0')}`;
        this.setState({exampleColor,hex});

        this.refer.rgb.current.update();
        this.refer.hsl.current.update();
        this.refer.hsv.current.update();
    }
    /**
     * 
     * @param {String} type 类型
     *      HEX: 十六进制
     *      RGB: RGB
     *      HSL: HSL
     *      HSV: HSV 
     */
    getColorValue(type)
    {
        if(type==='hex')
            return this.state.hex;
        else
            return this.refer[type].current.getColorValue();
    }
};
/**
 * @name 选择器
 * @type Class
 */
const Picker=class extends React.Component
{
/*构造*/
    constructor()
    {
        super();
    }
    render()
    {
        return <div className='picker'>
            <ColorWheel/>
            <Panel/>
        </div>;
    }
};

let color=null;
let colorSelector=[];       //保存需要刷新的组件

/*接口*/

let component=null;

/**
 * @name 设置颜色
 * @type Function
 * @param {number} h 色相分量
 * @param {number} s 饱和度分量
 * @param {number} v 明度分量
 */
let setColor=function(h=null,s=null,v=null)
{
    h!==null && (color.h=h);
    s!==null && (color.s=s);
    v!==null && (color.v=v);

    for(let el of colorSelector)
        el.update();
};

/**
 * @name 获取颜色
 * @type Function
 * @param {Object} 当前颜色。HSV实例。
 */
let getColor=function()
{
    return new HSV(color.h,color.s,color.v);
};

/*构造*/

import './Picker.less';
import React from 'react';
import PropTypes from 'prop-types';
import ThrottleLock from 'Public/ThrottleLock.js';
import PadCharStart from 'Public/PadCharStart.js';
import {RGB,HSL,HSV} from 'Public/Color.js';
import 'Resource/image/ColorWheel.png';
import 'Resource/image/ColorMask.png';

// HSV.prototype.toString=function()
// {
//     return ``;
// };

color=new HSV(0,1,1);
component=<Picker/>;

export default component;
export {setColor,getColor};