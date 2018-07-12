/**
 * @name 字符串首补全
 */

/*接口*/

/**
 * @name 字符串首补全
 * @type Function
 * @param {String} 字符串
 * @param {number} 总位数
 * @param {String} char 补全字符
 * @return {String} 新字符串
 */
const PadCharStart=function(string,num,char)
{
    let length=string.length;
    let newString='';
    for(let i=0,l=num-length;i<l;i++)
        newString=char+newString;

    return newString+string;
};

/*构造*/

export default PadCharStart;