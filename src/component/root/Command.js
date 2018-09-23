/**
 * @name 命令
 */

/*接口*/

const Command=
{
    /**
     * @name 生成CSS HEX语句
     * @type Function
     * @see Picker-command
     */
    hex()
    {
        let color=getColor().toRGB();
        let css=`#${PadCharStart(Math.round(color.r).toString(16),2,'0')}${PadCharStart(Math.round(color.g).toString(16),2,'0')}${PadCharStart(Math.round(color.b).toString(16),2,'0')}`;
        Clipboard.copy(css);

        return {message:'CSS # 语句已复制到剪贴板'};
    },
    /**
     * @name 生成CSS RGB语句
     * @type Function
     * @see Picker-command
     */
    rgb()
    {
        let color=getColor().toRGB();
        let css=`rgb(${color.r.toFixed(2)},${color.g.toFixed(2)},${color.b.toFixed(2)})`;
        Clipboard.copy(css);

        return {message:'CSS rgb 语句已复制到剪贴板'};
    },
    /**
     * @name 生成CSS HSL语句
     * @type Function
     * @see Picker-command
     */
    hsl()
    {
        let color=getColor().toHSL();
        let css=`hsl(${color.h.toFixed(2)},${(color.s*100).toFixed(2)}%,${(color.l*100).toFixed(2)}%)`;
        Clipboard.copy(css);

        return {message:'CSS hsl 语句已复制到剪贴板'};
    }
};

/*构造*/

import {getColor} from 'Component/picker/Picker.jsx';
import Clipboard from 'Public/Clipboard.js';
import PadCharStart from 'Public/PadCharStart.js';

export default Command;