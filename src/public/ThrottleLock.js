/**
 * @name 函数节流锁定
 */

/*接口*/

/**
 * @name 函数节流锁定
 * @type Function
 * @description 使得函数在调用一次后锁定，time时间才能再次被调用
 * @param {Function} method 函数
 * @param {Number} time 锁定时间，单位ms
 * @param {Object} context 运行上下文
 * @return {Function} 节流函数
 */
const ThrottleLock=function(method,time,context=null)
{
    method.enable=true;

    return function()
    {
        if(method.enable)
        {
            method.enable=false;
            setTimeout(()=>
            {
                method.enable=true;
            },time);

            return method.apply(context || this,arguments);
        }
    };
};

/*构造*/

export default ThrottleLock;