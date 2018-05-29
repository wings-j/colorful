/**
 * @name RGB构造函数
 * @param {int} r 红色分量，0~255
 * @param {int} g 绿色分量，0~255
 * @param {int} b 蓝色分量，0~255
*/
function RGB(r,g,b)
{
    this.r = r;
    this.g = g;
    this.b = b;
}
RGB.prototype=
{
    constructor: RGB,

/*接口*/
    /**
     * @name 转换为HSL对象
     * @return {Object} HSL对象
    */
    toHSL:function()
    {
        var r = this.r / 255, g = this.g / 255, b = this.b / 255;
        if (r < 0 || r > 1 || g < 0 || g > 1 || b < 0 || b > 1)
            return null;

        var max = r;
        if (g > max)
            max = g;
        if (b > max)
            max = b;
        var min = r;
        if (g < min)
            min = g;
        if (b < min)
            min = b;

        var h, s, l;

        if (max == min)
            h = 0;
        else if (max == r && g >= b)
            h = 60 * (g - b) / (max - min) + 0;
        else if (max == r && g < b)
            h = 60 * (g - b) / (max - min) + 360;
        else if (max == g)
            h = 60 * (b - r) / (max - min) + 120;
        else if (max == b)
            h = 60 * (r - g) / (max - min) + 240;

        l = (max + min) / 2;

        if (l == 0 || max == min)
            s = 0;
        else if (l > 0 && l <= 0.5)
            s = (max - min) / (2 * l);
        else if (l > 0.5)
            s = (max - min) / (2 - 2 * l);

        return new HSL( h, s, l);
    },

/**
 * @name 转换为HSV对象
 * @return {Object} HSV对象
*/
    toHSV:function()
    {
        var r = this.r / 255, g = this.g / 255, b = this.b / 255;
        if (r < 0 || r > 1 || g < 0 || g > 1 || b < 0 || b > 1)
            return null;

        var max = r;
        if (g > max)
            max = g;
        if (b > max)
            max = b;
        var min = r;
        if (g < min)
            min = g;
        if (b < min)
            min = b;

        var h, s, v;

        if (max == min)
            h = 0;
        else if (max == r && g >= b)
            h = 60 * (g - b) / (max - min) + 0;
        else if (max == r && g < b)
            h = 60 * (g - b) / (max - min) + 360;
        else if (max == g)
            h = 60 * (b - r) / (max - min) + 120;
        else if (max == b)
            h = 60 * (r - g) / (max - min) + 240;

        if (max == 0)
            s = 0;
        else
            s = 1 - min / max;

        v = max;

        return new HSV(h,s,v);
    },
}

/**
 * @name HSL构造函数
 * @param {float} h 色相分量，0~360
 * @param {float} s 饱和度分量，0~1
 * @param {float} l 亮度分量，0~1
*/
function HSL(h,s,l)
{
    this.h = h;
    this.s = s;
    this.l = l;
}
HSL.prototype=
{
    constructor: HSL,

    /**
     * @name 转换为RGB对象
     * @return {Object} RGB对象
    */
    toRGB:function()
    {
        if (this.h < 0 || this.h >= 360 || this.s < 0 || this.s > 1 || this.l < 0 || this.l > 1)
            return null;

        var temp1;
        if (this.l < 0.5)
            temp1 = this.l * (1 + this.s);
        else
            temp1 = this.l + this.s - (this.l * this.s);
        var temp2 = 2 * this.l - temp1;
        var hNormlized = this.h / 360;
        var tempRgb = new Array(3);
        tempRgb[0] = hNormlized + 1 / 3;
        tempRgb[1] = hNormlized;
        tempRgb[2] = hNormlized - 1 / 3;

        for (var i = 0; i < 3; i++)
        {
            if (tempRgb[i] < 0)
                tempRgb[i] += 1;
            else if (tempRgb[i] > 1)
                tempRgb[i] -= 1;
        }

        var rgb = new Array(3);
        for (var i = 0; i < 3; i++)
        {
            if (tempRgb[i] < 1 / 6)
                rgb[i] = temp2 + ((temp1 - temp2) * 6 * tempRgb[i]);
            else if (tempRgb[i] >= 1 / 6 && tempRgb[i] < 1 / 2)
                rgb[i] = temp1;
            else if (tempRgb[i] >= 1 / 2 && tempRgb[i] < 2 / 3)
                rgb[i] = temp2 + ((temp1 - temp2) * 6 * (2 / 3 - tempRgb[i]));
            else
                rgb[i] = temp2;
        }

        return new RGB(rgb[0]*255,rgb[1]*255,rgb[2]*255);
        
    },

    /**
     * @name 转换为HSV对象
     * @return {Object} HSV对象
    */
    toHSV:function()
    {
        if (this.h < 0 || this.h >= 360 || this.s < 0 || this.s > 1 || this.l < 0 || this.l > 1)
            return null;

        var hHsv, sHsv, v;

        hHsv = this.h;

        if (this.l == 0)
        {
            sHsv = 0;
            v = 0;
        }
        else if (this.l > 0 && this.l <= 0.5)
        {
            sHsv = 2 * this.s / (1 + this.s);
            v = this.l * (1 + this.s);
        }
        else
        {
            sHsv = (2 * this.s - 2 * this.s * this.l) / (this.s - this.s * this.l + this.l);
            v = this.s - this.s * this.l + this.l;
        }

        return new HSV(hHsv,sHsv,v);
    }
}

/**
 * @name HSV构造函数
 * @param {float} h 色相分量，0~360
 * @param {float} s 饱和度分量，0~1
 * @param {float} v 明度分量，0~1
*/
function HSV(h,s,v)
{
    this.h = h;
    this.s = s;
    this.v = v;
}
HSV.prototype=
{
    constructor: HSV,

    /**
     * @name 转换为RGB对象
     * @return {Object} RGB对象
    */
    toRGB:function()
    {
        if (this.h < 0 || this.h >= 360 || this.s < 0 || this.s > 1 || this.v < 0 || this.v > 1)
            return null;

        var tempH = Math.floor(this.h / 60);
        var temp1 = this.h / 60 - tempH;
        var temp2 = this.v * (1 - this.s);
        var temp3 = this.v * (1 - temp1 * this.s);
        var temp4 = this.v * (1 - (1 - temp1) * this.s);

        var rgb;
        switch (tempH)
        {
            case 0:
                rgb = { r: this.v, g: temp4, b: temp2 };
                break;
            case 1:
                rgb = { r: temp3, g: this.v, b: temp2 };
                break;
            case 2:
                rgb = { r: temp2, g: this.v, b: temp4 };
                break;
            case 3:
                rgb = { r: temp2, g: temp3, b: this.v };
                break;
            case 4:
                rgb = { r: temp4, g: temp2, b: this.v };
                break;
            case 5:
                rgb = { r: this.v, g: temp2, b: temp3 };
                break;
        }

        return new RGB(rgb.r * 255,rgb.g * 255,rgb.b * 255);
        
    },

    /**
     * @name 转换为HSL对象
     * @return {Object} HSL对象
    */
    toHSL:function()
    {
        if (this.h < 0 || this.h >= 360 || this.s < 0 || this.s > 1 || this.v < 0 || this.v > 1)
            return null;

        var hHsl, sHsl, l;

        hHsl = this.h;

        if (this.v == 0)
        {
            sHsl = 0;
            l = 0;
        }
        else if (this.v <= 1 / (2 - this.s))
        {
            sHsl = this.s / (2 - this.s);
            l = (2 * this.v - this.v * this.s) / 2;
        }
        else if (this.s == 0 && this.v == 1)
        {
            sHsl = 1;
            l = 1;
        }
        else
        {
            sHsl = this.v * this.s / (2 - 2 * this.v + this.v * this.s);
            l = (2 * this.v - this.v * this.s) / 2;
        }

        return new HSL(hHsl,sHsl,l);
    }
}

export {RGB,HSL,HSV};