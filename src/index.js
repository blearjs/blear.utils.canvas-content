/**
 * blear.utils.canvas-content
 * @author ydr.me
 * @create 2016年08月20日10:46:33
 */

'use strict';

var object =       require('blear.utils.object');
var typeis =       require('blear.utils.typeis');
var access =       require('blear.utils.access');
var modification = require('blear.core.modification');
var event =        require('blear.core.event');

var supportToBlob = window.HTMLCanvasElement && 'toBlob' in HTMLCanvasElement.prototype;
var defaults = {
    type: 'image/png',
    quality: 1
};


/**
 * base64 转换为 Blob 实例
 * @ref http://stackoverflow.com/q/18253378
 * @param base64 {String} base64 编码
 * @returns {Blob}
 */
var base64toBlob = function (base64) {
    var i = 0;
    var byteString = atob(base64.split(',')[1]);
    var mimeString = base64.split(',')[0].split(':')[1].split(';')[0];
    var ab = new ArrayBuffer(byteString.length);
    var ua = new Uint8Array(ab);

    for (; i < byteString.length; i++) {
        ua[i] = byteString.charCodeAt(i);
    }

    return new Blob([ab], {
        type: mimeString
    });
};


/**
 * canvas 画布转换成 base64
 * @param canvasEl {Object} 画布
 * @param [options] {Object} 配置
 * @param [options.type] {Object} 类型
 * @param [options.quality] {Object} 质量
 * @returns {string}
 */
var toBase64 = exports.toBase64 = function (canvasEl, options) {
    options = object.assign({}, defaults, options);

    return canvasEl.toDataURL(options.type, options.quality);
};


/**
 * canvas 画布转换成 blob
 * @param canvasEl {Object} 画布
 * @param [options] {Object} 配置
 * @param [options.type] {Object} 类型
 * @param [options.quality] {Object} 质量
 * @param callback {Function}
 * @returns {string}
 */
exports.toBlob = function (canvasEl, options, callback) {
    var args = access.args(arguments);

    if (typeis.Function(args[1])) {
        callback = args[1];
        options = {};
    }

    options = object.assign({}, defaults, options);

    // moz
    if (supportToBlob) {
        return canvasEl.toBlob(callback, options.type, options.quality);
    } else {
        var base64 = toBase64(canvasEl, options);
        callback(base64toBlob(base64));
    }
};


/**
 * 保存二进制对象
 * @param canvasEl {Object} 画布
 * @param name {String} 文件名称
 * @param [options] {Object} 参数
 * @param [options.type='image/png'] {String} 图片类型
 * @param [options.quality=1] {Number} 图片质量
 */
exports.saveAs = function (canvasEl, name, options) {
    options = object.assign({}, defaults, options);

    var base64 = canvasEl.toDataURL(options.type, options.quality);
    var linkEl = modification.create('a', {
        href: base64,
        download: name
    });

    event.emit(linkEl, 'click');
};


exports.supportToBlob = supportToBlob;