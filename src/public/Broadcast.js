/**
 * @name 广播
 */

/*接口*/

/**
 * @name 广播
 * @type Class
 */
const Broadcast=class
{
/*构造*/

    /**
     * @name 构造方法
     * @type Function
     * @see Broadcast
     * @param {Array} keys [String] 事件名数组 
     */
    constructor(keys=null)
    {
        this.listenerList={};
        if(keys)
            for(let el of keys)
                this.listenerList[el]=[];
    }
    
/*接口*/

    /**
     * @name 添加监听者
     * @type Function
     * @see Broadcast
     * @param {String} key 事件名 
     * @param {Function} callback (Object)=>{} 回调函数
     * @exception Event not existed 事件不存在
     */
    addListener(key,callback)
    {
        let methods=this.listenerList[key];
        if(methods)
            methods.push(callback);
        else
            throw new Error('Event not existed');
    }
    /**
     * @name 去除监听者
     * @type Function
     * @see Broadcast
     * @param {String} key 事件名 
     * @param {Function} callback (Object)=>{} 回调函数 
     * @exception Event not existed 事件不存在
     */   
    removeListener(key,callback)
    {
        let methods=this.listenerList[key];
        if(methods)
            for(let i=0;i<methods.length;i++)
                if(methods[i]===callback)
                {
                    methods.splice(i,1);

                    break;
                }
        else
            throw new Error('Event not existed');
    }
    /**
     * @name 触发
     * @type Function
     * @see Broadcast
     * @param {String} key 事件名 
     * @param {Object} event 事件数据对象 
     * @exception Event not existed 事件不存在
     */
    trigger(key,event)
    {
        let methods=this.listenerList[key];
        if(methods)
            for(let i=0;i<methods.length;i++)
                methods[i](event);
        else
            throw new Error('Event not existed');
    }
    /**
     * @name 添加事件
     * @type Function
     * @see Broadcast
     * @param {String} key 事件名
     * @exception Event existed 事件已存在
     */
    addEvent(key)
    {
        if(this.listenerList[key])
            throw new Error('Event existed');
        else
            this.listenerList[key]=[];
    }
    /**
     * @name 去除事件
     * @type Function
     * @see Broadcast
     * @param {String} key 事件名
     * @exception Event not existed 事件不存在
     */
    removeEvent(key)
    {
        if(this.listenerList[key])
            delete this.listenerList[key];
        else
            throw new Error('Event not existed');
    }
};

/*构造*/

export default Broadcast;
