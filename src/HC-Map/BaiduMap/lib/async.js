/** 
 * 异步代码加载器，兼容JSONP
 */
define(function () {
  /**
   * JSONP回调函数的键值
   */
  var JSONP_CALLBACK_NAME = 'callback';
  /**
   * JSON回调函数名称的前缀
   */
  var JSONP_CALLBACK_PREFIX = '__async_req_';
  /**
   * JSON回调函数名称的后缀
   */
  var JSONP_CALLBACK_SUFFIX = '__';
  /**
   * 注入外部脚本
   * @param {*} src - 外部脚本地址
   */
  function injectScript(src) {
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.charset = 'utf-8';
    script.src = src;
    var headEl = document.getElementsByTagName('head');
    var scriptParent = headEl.length ? headEl[0] : document.documentElement;
    scriptParent.appendChild(script);
    return script;
  }
  /**
   * 注入JSONP所需要的callback参数
   * 处理`require('com.module.widget!text')`这种类型时，过滤掉text
   * @param {*} path - 路径名称
   * @param {*} callbackName JSONP回调函数名称
   */
  function injectCallbackQuery(path, callbackName) {
    /**
     * 匹配`参数`的正则；
     * 例如： `com.module.widget!text`匹配`!text`；
     */
    var paramRegex = /!(.+)/;
    /**
     * 匹配`命名空间`的正则；
     * 例如：`com.module.widget!text`匹配`com.module.widget!`；
     */
    var namespaceRegex = /.+!/;
    var url = path.replace(paramRegex, '');
    var param = paramRegex.test(path) ? path.replace(namespaceRegex, '') : JSONP_CALLBACK_NAME;
    url += !~url.indexOf('?') ? '?' : '&';
    return url + param + '=' + callbackName; 
  }

  /**
   * 获取JSONP所需的回调函数名称
   */
  var getCallbackName = (function () {
    var _uid = 0;
    return function () {
      return [ JSONP_CALLBACK_PREFIX, ++_uid, JSONP_CALLBACK_SUFFIX].join('');
    }
  })();

  return {
    load: function (path, req, onload, config) {
      // 如果已经构建，则什么都不做
      if (config.isBuild) {
        console.error('已经加载过，无需重新加载： async.js #load');
        onload(null);
      } else {
        var callbackName = getCallbackName();
        var src = injectCallbackQuery(path, callbackName);
        window[callbackName] = onload;
        injectScript(src);
      }
    }
  };
});
