define([
  'BaiduMap/lib/async'
], function (async) {
  var DEFAULT_BASE_URL = 'http://api.map.baidu.com/api';
  var DEFAULT_BASE_PARAMS = {
    v: '3.0',
  };
  var root = this;
  function NOOP() {};
  /**
   * 百度地图加载器
   * @param {*} require 
   * @param {*} onload 
   * @param {*} config 
   */
  function BaiduMapLoader(require, onload, config) {
    this.require = require;
    this.onload = onload || NOOP;
    this.baseUrl = config.url || DEFAULT_BASE_URL;
    this.async = config.async || async;
    this.params = this.normalizeParams(config);
  };
  /**
   * 加载
   */
  BaiduMapLoader.prototype.load = function () {
    if (this.isBaiduMapLoaded()) {
      this.resolveWith(this.getGlobalBaiduMap());
    }
    else {
      this.loadBaiduMap();
    }
  };
  /**
   * 加载百度地图
   */
  BaiduMapLoader.prototype.loadBaiduMap = function () {
    var self = this;
    // 异步加载百度地图的函数
    var onAsyncLoad = function () {
      self.resolveWithBaiduMap(self);
    };
    onAsyncLoad.onerror = this.onload.onerror;
    this.async.load(this.getBaiduUrl(), this.require, onAsyncLoad, {});
  };
  /**
   * 获取百度地图api地址
   */
  BaiduMapLoader.prototype.getBaiduUrl = function () {
    return this.baseUrl + '?' + this.serializeParams();
  };
  /**
   * 通过已经加载的百度地图重新委托加载
   */
  BaiduMapLoader.prototype.resolveWithBaiduMap = function () {
    // if (!this.isBaiduMapLoaded()) {
    //   this.reject();
    //   return;
    // }
    this.resolveWith(this.getGlobalBaiduMap());
  };
  /**
   * 参数序列化
   */
  BaiduMapLoader.prototype.serializeParams = function () {
    var encodedParams = [];
    for (var key in this.params) {
      if (this.params.hasOwnProperty(key)) {
        var value = this.params[key];
        var isObject = (typeof value === 'object');
        var encodedParam = encodeURIComponent(key) + "=" + encodeURIComponent(value);
        var serializedValue = isObject ? this.serializeParams(value, key) : encodedParam;

        encodedParams.push(serializedValue);
      }
    }
    return encodedParams.join("&");
  };

  /**
   * 参数标准化
   * @param {*} params - 参数
   */
  BaiduMapLoader.prototype.normalizeParams = function (params) {
    params || (params = {});
    params.v = (params.v == void 0) ? DEFAULT_BASE_PARAMS.v : params.v;
    return params;
  };
  /**
   * 判断百度地图是否已经加载
   */
  BaiduMapLoader.prototype.isBaiduMapLoaded = function () {
    return root.BMap && root.BMap.Map;
  };
  /**
   * 获取全局的百度地图对象
   */
  BaiduMapLoader.prototype.getGlobalBaiduMap = function () {
    return root.BMap ? root.BMap : undefined;
  };
  /**
   * 委托加载
   * @param {*} var_args 委托对象
   */
  BaiduMapLoader.prototype.resolveWith = function (var_args) {
    this.onload.apply(root, var_args);
  };
  /**
   * 拒绝加载
   * @param {*} opt_error - 异常信息
   */
  BaiduMapLoader.prototype.reject = function (opt_error) {
    var error = opt_error || new Error('加载百度地图错误');
    if (this.onload.onerror) {
      this.onload.onerror.call(root, error);
    }
    else {
      throw error;
    }
  };
  return {
    load: function (name, parentRequire, onload, config) {
      var config = config || {};
      if (config.isBuild) {
        console.error('已经加载过，无需重新加载： BaiduMapLoader.js #load');
        onload(null);
        return;
      }
      var baiduMapLoader = new BaiduMapLoader(parentRequire, onload, config);
      baiduMapLoader.load();
    }
  };
});