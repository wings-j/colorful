import '../../stylesheet/Picker.less';
import $ from 'jquery';
import React from 'react';
import {RGB,HSL,HSV} from '../algrithm/Color.js';
import '../../image/Wheel.png';
import '../../image/Mask.png';

/*成员*/
/**
 * @name 色轮
 * @type Class
 */
class Wheel extends React.Component
{
/*构造*/
    constructor(props)
    {
        super(props);

        this.parent=props.parent;
        this.width=null;
        this.height=null;
        this.wheelWidth=null;
        this.wheelHeight=null;
        this.wheelX=0;
        this.wheelY=0;
        this.maskWidth=null;
        this.maskHeight=null;
        this.maskX=null;
        this.maskY=null;
        this.wheelRadius=null;
        this.wheelImage=new Image();
        this.maskImage=new Image();

        this.wheelImage.onload=()=>{this.update();};
        this.maskImage.onload=()=>{this.update();};
        this.wheelImage.src='./image/Wheel.png';
        this.maskImage.src='./image/Mask.png';

        this.handlerSelect=throttleLock(this.handlerSelect,30,this);
        this.onMouseDown=this.onMouseDown.bind(this);
        this.onMouseMove=this.onMouseMove.bind(this);
        this.onMouseUp=this.onMouseUp.bind(this);
    }
    render()
    {
        return <canvas className='wheel' ref='container' className='wheel' onMouseDown={this.onMouseDown}></canvas>;
    }
    componentDidMount()
    {
        let canvas=this.refs.container;

        this.width=canvas.offsetHeight;
        this.height=canvas.offsetHeight;
        this.wheelWidth=this.width;
        this.wheelHeight=this.height;
        this.wheelX=0;
        this.wheelY=0;
        this.maskWidth=this.width/2;
        this.maskHeight=this.height/2;
        this.maskX=(this.width-this.maskWidth)/2;
        this.maskY=(this.height-this.maskHeight)/2;
        this.wheelRadius=this.wheelWidth/2-22;

        canvas.width=this.width;
        canvas.height=this.height;
        this.context=canvas.getContext('2d');
        this.update();
    }

/*成员*/
    /**
     * @name 画小圆环
     * @type Function
     * @see Wheel
     * @param {float} 横向坐标
     * @param {float} 纵向坐标
     */
    draw_circle(x,y)
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
     * @name 处理颜色选择
     * @type Function
     * @see Wheel
     * @param {Object} e 鼠标事件对象
     */
    handlerSelect(e)
    {
        let position=getRelativePosition(e.target,{x:e.clientX,y:e.clientY});
        let x=position.x,y=position.y;
        if(x>=this.maskX && x<= this.maskX+this.maskWidth && y>=this.maskY && y<=this.maskY+this.maskHeight)
        {
            let s=(x-this.maskX)/this.maskWidth;
            let v=1-(y-this.maskY)/this.maskHeight;

            this.parent.setColor(null,s,v);
        }
        else
        {
            let polar = rightToPolar(x-this.wheelWidth/2,y-this.wheelHeight/2);
            if(polar.module<this.wheelRadius+24 && polar.module>this.wheelRadius-10)
            {
                let h=(polar.angle/(Math.PI*2)+0.25)*360%360;     //0.25：偏差修正
                this.parent.setColor(h,null,null);
            }
        }
    }
    /**
     * @name 处理鼠标按下事件
     * @type Function
     * @see Wheel
     * @param {Object} e 鼠标事件对象 
     */
    onMouseDown(e)
    {
        this.handlerSelect(e);

        this.refs.container.addEventListener('mousemove',this.onMouseMove);
        this.refs.container.addEventListener('mouseup',this.onMouseUp);
        document.addEventListener('mouseup',this.onMouseUp);
    }
    /**
     * @name 处理鼠标移动事件
     * @type Function
     * @see Wheel
     * @param {Object} e 鼠标事件对象 
     */
    onMouseMove(e)
    {
        this.handlerSelect(e);
    }
    /**
     * @name 处理鼠标抬起事件
     * @type Function
     * @see wheel
     * @param {Object} e 鼠标事件对象 
     */
    onMouseUp()
    {
        this.refs.container.removeEventListener('mousemove',this.onMouseMove);
        this.refs.container.removeEventListener('mouseup',this.onMouseUp);
        document.removeEventListener('mouseup',this.onMouseUp);
    }

/*接口*/
    /**
     * @name 更新
     * @type Function
     * @see Wheel
     */
    update()
    {
        let context=this.context;
        context.clearRect(0,0,this.width,this.height);
        let currentColor=this.parent.getColor();

        context.beginPath();        //色轮和掩膜
        context.rect(this.maskX+0.5,this.maskY+0.5,this.maskWidth-0.5,this.maskHeight-0.5);     //0.5：修正 
        let hsl=currentColor.toHSL();
        context.fillStyle=`hsl(${hsl.h},100%,50%)`;
        context.fill();
        context.drawImage(this.wheelImage,this.wheelX,this.wheelX,this.wheelWidth,this.wheelHeight);
        context.drawImage(this.maskImage,this.maskX,this.maskY,this.maskWidth,this.maskHeight);

        let x=currentColor.s*this.maskWidth+this.maskX;
        let y=(1-currentColor.v)*this.maskHeight+this.maskY;
        this.draw_circle(x,y);

        let angle=currentColor.h/360*(Math.PI*2)-Math.PI/2;     //-Math.PI/2：偏差修正
        let right=polarToRight(this.wheelRadius+4,angle);       //+4：偏差修正
        x=right.x+this.wheelWidth/2;
        y=right.y+this.wheelHeight/2;

        this.draw_circle(x,y);
    }
}
/**
 * @name 面板输入框
 * @type Class
 */
class Panel_Input extends React.Component
{
/*构造*/
    constructor(props)
    {
        super(props);

        this.parent=props.parent;
        this.preserveValue=null;
    }
    render()
    {
        return <div className='panel_input'><label>{this.props.title}</label><input ref='input'/></div>;
    }
    componentDidMount()
    {
        let input=this.refs.input;

        input.addEventListener('focus',this.onFocus.bind(this));
        input.addEventListener('blur',this.onBlur.bind(this));
        input.addEventListener('keypress',this.onEnter.bind(this));
        $(input).on('mousewheel DOMMouseScroll',this.onScroll.bind(this));
    }

/*抽象*/
    check(){}
    adjust(){}

/*成员*/
    /**
     * @name 处理焦点获得事件
     * @type Function
     * @see Panel_Input
     */
    onFocus()
    {
        this.preserveValue=this.refs.input.value;
    }
    /**
     * @name 处理焦点失去事件
     * @type Function
     * @see Panel_Input
     */
    onBlur()
    {
        this.activate();
    }
    /**
     * @name 处理输入回车事件
     * @type Function
     * @see Panel_Input
     * @param {Object} e 事件对象
     */
    onEnter(e)
    {
        if(e.keyCode==13)
            this.refs.input.blur();
    }
    /**
     * @name 处理鼠标滚轮事件
     * @type Function
     * @see Panel_Input
     * @param {Object} 事件对象
     */
    onScroll(e)
    {
        let delta = (e.originalEvent.wheelDelta && (e.originalEvent.wheelDelta > 0 ? 1 : -1)) || (e.originalEvent.detail && (e.originalEvent.detail > 0 ? -1 : 1));              // firefox
        if (delta > 0)
            this.adjust(true);
        else if (delta < 0)
            this.adjust(false);

        this.activate();
    }
    /**
     * @name 激活
     * @type Function
     * @see Panel_Input
     */
    activate()
    {
        let value=this.refs.input.value;
        if(value==this.preserveValue)
            return;
        value=this.check();
        if(value===null)
            this.restore();
        else
            this.parent.activate();
    }
    /**
     * @name 恢复
     * @type Function
     * @see Panel_Input
     */
    restore()
    {
        this.refs.input.value=this.preserveValue;
    }

/*接口*/
    /**
     * @name 设置数值
     * @type Function
     * @see Panel_Input
     * @param {float} value 值
     */
    setValue(value)
    {
        this.refs.input.value=value;
    }
    /**
     * @name 取得数值
     * @type Function
     * @see Panel_Input
     * @return {float} 值
     */
    getValue()
    {
        return parseFloat(this.refs.input.value);
    }
}
/**
 * @name 255类型面板输入框
 * @type Class
 */
class Panel_Input_255 extends Panel_Input
{
/*成员*/
    /**
     * @name 检验
     * @type Function
     * @see Panel_Input_255
     * @return {float|null}检验结果
     *      {float}:值符合要求
     *      null:值不符合要求
     */
    check()
    {
        let value=Math.round(parseFloat(this.refs.input.value));
        if(value>=0 && value <=255)
            return value;
        else
            return null;
    }
    /**
     * @name 微调
     * @type Function
     * @see Panel_Input_255
     * @param {bool} 方向
     *      true:增大
     *      false:降低
     */
    adjust(delta)
    {
        let value=parseFloat(this.refs.input.value);
        if(delta===true)
        {
            value+=1;
            if(value>255)
                value=255;
        }   
        else
        {
            value-=1;
            if(value<0)
                value=0;
        }
        this.refs.input.value=value;
    }
}
/**
 * @name 360类型面板输入框
 * @type Class
 */
class Panel_Input_360 extends Panel_Input
{
/*成员*/
    /**
     * @name 检验
     * @type Function
     * @see Panel_Input_360
     * @return {float|null}检验结果
     *      {float}:值符合要求
     *      null:值不符合要求
     */
    check()
    {
        let value=parseFloat(this.refs.input.value);
        if(value>=0 && value <=360)
            return value;
        else
            return null;
    }
        /**
     * @name 微调
     * @type Function
     * @see Panel_Input_360
     * @param {bool} 方向
     *      true:增大
     *      false:降低
     */
    adjust(delta)
    {
        let value=parseFloat(this.refs.input.value);
        if(delta===true)
        {
            value+=1;
            if(value>360)
                value=360;
        }   
        else
        {
            value-=1;
            if(value<0)
                value=0;
        }
        this.refs.input.value=value;
    }
}
/**
 * @name 1类型面板输入框
 * @type Class
 */
class Panel_Input_1 extends Panel_Input
{
/*成员*/
    /**
     * @name 检验
     * @type Function
     * @see Panel_Input_1
     * @return {float|null}检验结果
     *      {float}:值符合要求
     *      null:值不符合要求
     */
    check()
    {
        let value=parseFloat(this.refs.input.value);
        if(value>=0 && value <=1)
            return value;
        else
            return null;
    }
        /**
     * @name 微调
     * @type Function
     * @see Panel_Input_1
     * @param {bool} 方向
     *      true:增大
     *      false:降低
     */
    adjust(delta)
    {
        let value=parseFloat(this.refs.input.value);
        if(delta===true)
        {
            value+=0.01;
            if(value>1)
                value=1;
        }   
        else
        {
            value-=0.01;
            if(value<0)
                value=0;
        }
        this.refs.input.value=value.toFixed(2);
    }
}
/**
 * @name RGB输入框组
 * @type Class
 */
class Panel_InputGroup_RGB extends React.Component
{
/*构造*/
    constructor(props)
    {
        super(props);

        this.parent=props.parent;
        this.childInterface=
        {
            activate:this.activate.bind(this)
        };
    }
    render()
    {
        return(
        <div className='panel_inputGroup'>
            <Panel_Input_255 ref='r' title='R' parent={this.childInterface}></Panel_Input_255>
            <Panel_Input_255 ref='g' title='G' parent={this.childInterface}></Panel_Input_255>
            <Panel_Input_255 ref='b' title='B' parent={this.childInterface}></Panel_Input_255>
        </div>);
    }

/*接口*/
    /**
     * @name 更新
     * @type Function
     * @see Panel_InputGroup_RGB
     */
    update()
    {
        let currentColor=this.parent.getColor();
        let rgb=currentColor.toRGB();

        this.refs.r.setValue(Math.round(rgb.r));
        this.refs.g.setValue(Math.round(rgb.g));
        this.refs.b.setValue(Math.round(rgb.b));
    }
    /**
     * @name 触发
     * @type Function
     * @see Panel_InputGroup_RGB
     */
    activate()
    {
        let r=this.refs.r.getValue();
        let g=this.refs.g.getValue();
        let b=this.refs.b.getValue();
        let hsv=(new RGB(r,g,b)).toHSV();

        this.parent.setColor(hsv.h,hsv.s,hsv.v);
    }
    /**
     * @name 取得颜色值
     * @type Function
     * @see Panel_InputGroup_RGB
     * @return {Object} {R,G,B}颜色分量
     */
    getColorValue()
    {
        return {r:this.refs.r.getValue(),g:this.refs.g.getValue(),b:this.refs.b.getValue()};
    }
}
/**
 * @name HSL输入框组
 * @type Class
 */
class Panel_InputGroup_HSL extends React.Component
{
/*构造*/
    constructor(props)
    {
        super(props);

        this.parent=props.parent;
        this.childInterface=
        {
            activate:this.activate.bind(this)
        };
    }
    render()
    {
        return(
        <div className='panel_inputGroup'>
            <Panel_Input_360 ref='h' title='H' parent={this.childInterface}></Panel_Input_360>
            <Panel_Input_1 ref='s' title='S' parent={this.childInterface}></Panel_Input_1>
            <Panel_Input_1 ref='l' title='L' parent={this.childInterface}></Panel_Input_1>
        </div>);
    }

/*接口*/
    /**
     * @name 更新
     * @type Function
     * @see Panel_InputGroup_HSL
     */
    update()
    {
        let currentColor=this.parent.getColor();
        let hsl=currentColor.toHSL();

        this.refs.h.setValue(hsl.h.toFixed(2));
        this.refs.s.setValue(hsl.s.toFixed(2));
        this.refs.l.setValue(hsl.l.toFixed(2));
    }
    /**
     * @name 触发
     * @type Function
     * @see Panel_InputGroup_HSL
     */
    activate()
    {
        let h=this.refs.h.getValue();
        let s=this.refs.s.getValue();
        let l=this.refs.l.getValue();
        let hsv=(new HSL(h,s,l)).toHSV();

        this.parent.setColor(hsv.h,hsv.s,hsv.v);
    }
    /**
     * @name 取得颜色值
     * @type Function
     * @see Panel_InputGroup_HSL
     * @return {Object} {h,s,l}颜色分量
     */
    getColorValue()
    {
        return {h:this.refs.h.getValue(),s:this.refs.s.getValue(),l:this.refs.l.getValue()};
    }
}
/**
 * @name HSV输入框组
 * @type Class
 */
class Panel_InputGroup_HSV extends React.Component
{
/*构造*/
    constructor(props)
    {
        super(props);

        this.parent=props.parent;
        this.childInterface=
        {
            activate:this.activate.bind(this)
        };
    }
    render()
    {
        return(
        <div className='panel_inputGroup'>
            <Panel_Input_360 ref='h' title='H' parent={this.childInterface}></Panel_Input_360>
            <Panel_Input_1 ref='s' title='S' parent={this.childInterface}></Panel_Input_1>
            <Panel_Input_1 ref='v' title='V' parent={this.childInterface}></Panel_Input_1>
        </div>);
    }

/*接口*/
    /**
     * @name 更新
     * @type Function
     * @see Panel_InputGroup_HSV
     */
    update()
    {
        let currentColor=this.parent.getColor();
        let hsv=currentColor;

        this.refs.h.setValue(hsv.h.toFixed(2));
        this.refs.s.setValue(hsv.s.toFixed(2));
        this.refs.v.setValue(hsv.v.toFixed(2));
    }
    /**
     * @name 触发
     * @type Function
     * @see Panel_InputGroup_HSV
     */
    activate()
    {
        let h=this.refs.h.getValue();
        let s=this.refs.s.getValue();
        let v=this.refs.v.getValue();

        this.parent.setColor(h,s,v);
    }
    /**
     * @name 取得颜色值
     * @type Function
     * @see Panel_InputGroup_HSV
     * @return {Object} {h,s,v}颜色分量
     */
    getColorValue()
    {
        return {h:this.refs.h.getValue(),s:this.refs.s.getValue(),v:this.refs.v.getValue()};
    }
}
/**
 * @name 面板
 * @type Class
 */
class Panel extends React.Component
{
/*构造*/
    constructor(props)
    {
        super(props);

        this.parent=props.parent;
        this.childInterface=
        {
            getColor:props.parent.getColor,
            setColor:props.parent.setColor
        };
    }
    render()
    {
        return(
        <div className='panel'>
            <div className='panel_color' ref='color'></div>
            <div className='panel_hex' ref='hex'></div>
            <Panel_InputGroup_RGB ref='rgb' parent={this.childInterface}/>
            <Panel_InputGroup_HSL ref='hsl' parent={this.childInterface}/>
            <Panel_InputGroup_HSV ref='hsv' parent={this.childInterface}/>
        </div>);
    }
    componentDidMount()
    {
        this.update();
    }

/*接口*/
    /**
     * @name 更新
     * @type Funcion
     * @see Panel
     */
    update()
    {
        let currentColor=this.parent.getColor();
        
        let hsl=currentColor.toHSL();
        this.refs.color.style.background=`hsl(${hsl.h},${hsl.s*100}%,${hsl.l*100}%)`;

        let rgb=currentColor.toRGB();
        this.refs.hex.innerHTML=`#${padCharStart(Math.round(rgb.r).toString(16),2,'0')}${padCharStart(Math.round(rgb.g).toString(16),2,'0')}${padCharStart(Math.round(rgb.b).toString(16),2,'0')}`;

        this.refs.rgb.update();
        this.refs.hsl.update();
        this.refs.hsv.update();
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
            return this.refs.hex.innerHTML;
        else
            return this.refs[type].getColorValue();
    }
}
/**
 * @name 菜单
 * @type Class
 */
class Menu extends React.Component
{
/*构造*/
    constructor(props)
    {
        super(props);
        this.parent=props.parent;
    }
    render()
    {
        return <div className='menu'>
            <div className='menu_item'>
                <span>CSS</span>
                <div>
                    <div className='link' data-name='hex' ref='hex'>#</div>
                    <div className='link' data-name='rgb' ref='rgb'>RGB</div>
                    <div className='link' data-name='hsl' ref='hsl'>HSL</div>
                </div>
            </div>
        </div>;
    }
    componentDidMount()
    {
        this.refs.hex.addEventListener('click',this.onClick.bind(this));
        this.refs.rgb.addEventListener('click',this.onClick.bind(this));
        this.refs.hsl.addEventListener('click',this.onClick.bind(this));
    }

/*成员*/
    /**
     * @name 处理鼠标点击事件
     * @type Function
     * @see Menu
     * @param {Object} ev 事件对象
     */
    onClick(ev)
    {
        this.parent.runCommand(ev.target.dataset.name);
    }
}
/**
 * @name 消息
 * @type Class
 */
class Message extends React.Component
{
/*构造*/
    constructor()
    {
        super();

        this.timer=null;
    }
    render()
    {
        return <div ref='container' className='message'>
            <span ref='text'></span>
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
        this.refs.text.innerHTML=text;
        this.refs.container.style.opacity=1;
        clearTimeout(this.timer);
        this.timer=setTimeout(()=>{this.refs.container.style.opacity=0;},4000);
    }
}
/**
 * @name 取得点击事件位置相对于元素左上角位置
 * @type Function
 * @param {Object} element 元素
 * @param {Object} mousePosition 鼠标位置，{x:float,y:float}
 * @return {Object} 相对位置，{x:float,y:float}
*/
function getRelativePosition(element,mousePosition)
{
    let position=element.getBoundingClientRect();

    let relativePosition=
    {
        x:mousePosition.x-(position.left),
        y:mousePosition.y-(position.top)
    };
    return relativePosition;
}
/**
 * @name 直角坐标转换为极坐标
 * @type Function
 * @param {float} x 横坐标 
 * @param {float} y 纵坐标
 * @return {Object} 极坐标向量对象，角度范围0~2π
 */
function rightToPolar(x,y)
{
    let module=Math.sqrt(x*x + y*y);

    let angle;
    if(x==0 && y==0)
        angle=0;
    else
        angle = Math.atan(y / x);   

    if (x<0)
        angle = Math.PI + angle;
    else if(x >= 0 && y<0)
        angle= Math.PI*2 + angle;

    return {module,angle};
}
/**
 * @name 极坐标转换为直角坐标
 * @type Function
 * @param {float} module 模
 * @param {float} angle 角度
 * @return {Object} 直角坐标向量对象,{x,y}
 */
function polarToRight(module,angle)
{
    let x=module*Math.cos(angle);
    let y=module*Math.sin(angle);

    return {x,y};
}
/**
 * @name 函数节流锁定
 * @type Function
 * @description 使得函数在调用一次后锁定，time时间才能再次被调用
 * @param {Function} method 函数
 * @param {int} time 锁定时间，单位ms
 * @param {Object} context 运行上下文
 * @return {Function} 节流函数
 */
function throttleLock(method,time,context=null)
{
    let enable=true;

    return function()
    {
        if(enable)
        {
            enable=false;

            setTimeout(function()
            {
                enable=true;
            },time);

            if(context==null)
                return method.apply(this,arguments);
            else
                return method.apply(context,arguments);
        }
    };
}
/**
 * @name 字符串首补全
 * @type Function
 * @param {String} 字符串
 * @param {int} 总位数
 * @param {String} char 补全字符
 * @return {String} 新字符串
 */
function padCharStart(string,num,char)
{
    let length=string.length;
    let newString='';
    for(let i=0,l=num-length;i<l;i++)
        newString=char+newString;

    return newString+string;
}
/**
 * @name 剪贴板
 * @type Object
 */
let clipboard=(function()
{
/*成员*/
    let copyDummy;
    /**
     * @name 初始化
     * @type Function
     * @see clipboard
     */
    let initiate=function()
    {
        let statement=
        `
            <textarea class='copyDummy' style='position:absolute; width:0; height:0; opacity:0;' value=''></textarea>
        `;
        copyDummy=$(statement)[0];
        document.body.appendChild(copyDummy);
    };

/*接口*/
    /**
     * @name 复制
     * @type Function
     * @see clipboard
     * @param {String} value 内容
     */
    let copy=function(value)
    {
        copyDummy.value=value;
        copyDummy.select();
        document.execCommand('Copy');
    };

/*构造*/
    window.addEventListener('load',function()
    {
        initiate();
    });

    return {copy};
})();

/*接口*/
/**
 * @name 选择器
 * @type Class
 */
class Picker extends React.Component
{
/*构造*/
    constructor()
    {
        super();

        this.color=new HSV(0,1,1);
        let that=this;
        this.command=
        {
            /**
             * @name 生成CSS HEX语句
             * @type Function
             * @see Picker-command
             */
            hex()
            {
                let colorValue=that.refs.panel.getColorValue('hex');
                let css=colorValue;
                clipboard.copy(css);
                that.refs.message.display('CSS # 语句已复制到剪贴板');
            },
            /**
             * @name 生成CSS RGB语句
             * @type Function
             * @see Picker-command
             */
            rgb()
            {
                let colorValue=that.refs.panel.getColorValue('rgb');
                let css=`rgb(${colorValue.r},${colorValue.g},${colorValue.b})`;
                clipboard.copy(css);
                that.refs.message.display('CSS rgb 语句已复制到剪贴板');
            },
            /**
             * @name 生成CSS HSL语句
             * @type Function
             * @see Picker-command
             */
            hsl()
            {
                let colorValue=that.refs.panel.getColorValue('hsl');
                let css=`hsl(${colorValue.h},${colorValue.s*100}%,${colorValue.l*100}%)`;
                clipboard.copy(css);
                that.refs.message.display('CSS hsl 语句已复制到剪贴板');
            }
        };
        this.parent=        //接口
        {
            getColor:this.getColor.bind(this),
            setColor:this.setColor.bind(this),
            runCommand:this.runCommand.bind(this)
        };
    }
    render()
    {
        return(
        <div className='picker'>
            <Wheel ref='wheel' parent={this.parent}/>
            <Panel ref='panel' parent={this.parent}/>
            <Menu parent={this.parent}/>
            <Message ref='message'/>
        </div>);
    }

/*接口*/
    /**
     * @name 取得颜色
     * @type Function
     * @see Picker
     * @return {Object} HSV颜色对象
     */
    getColor()
    {
        return new HSV(this.color.h,this.color.s,this.color.v);
    }
    /**
     * @name 设置颜色
     * @type Function
     * @see Picker
     * @param {float} h 色相分量
     * @param {float} s 饱和度分量
     * @param {float} v 明度分量
     */
    setColor(h=null,s=null,v=null)
    {
        if(h!==null)
            this.color.h=h;
        if(s!==null)
            this.color.s=s;
        if(v!==null)
            this.color.v=v;

        this.refs.wheel.update();
        this.refs.panel.update();
    }  
    /**
     * @name 运行命令
     * @type Function
     * @see Picker
     * @param {String} command 命令 
     * @param {Object} data 数据对象 
     */
    runCommand(command,data)
    {
        this.command[command](data);
    }
}

export {Picker};