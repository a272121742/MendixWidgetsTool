/* 全局日志 */
/*
  BaiduMap.widget.BaiduMap
  ========================
  @file      : BaiduMap.js
  @version   : 1.0.0
  @author    : loong
  @date      : 2018-8-21
  @copyright : HC System
  @license   : MIT

  文档注释
  ========================
  将有关本文档的描述写在这里
*/
define([
  "dojo/_base/declare",
  "mxui/widget/_WidgetBase",
  "dijit/_TemplatedMixin",
  'dojo/dom-style',

  "dojo/text!ECharts/widget/template/Container.html", // 异步加载模板
  "ECharts/lib/echarts.min",  // 异步加载ECharts
  'ECharts/lib/ramda.min'     // 异步加载Ramda
], function (declare, _WidgetBase, _TemplatedMixin, domStyle, Container, echarts, R) {
  "use strict";
  var convertTo = function (defaultValue) {
    return function (text) {
      var ret = defaultValue;
      try {
        ret = JSON.parse(text);
      } finally {
        return ret;
      }
    }
  }
  var toJSON1 = convertTo({});
  var toJSON2 = function (text) {
    var ret = {};
    try {
      ret = eval('(' + text + ')');
    } finally {
      return ret;
    }
  }

  // 定义组件
  declare("ECharts.widget.ECharts", [_WidgetBase, _TemplatedMixin], {
    // @Require 组件所在模板
    templateString: Container,
    _chartInstance: null,
    _dataSource: null,
    /**
     * 构造函数
     * @param {*} params - 从Mendix配置中传入的参数
     * @param {Element} srcNodeRef - 生成的临时div元素
     */
    constructor: function (params, srcNodeRef) {
    },
    // created
    postCreate: function () {
    },
    // mounted
    startup: function () {
      var chart = this;
      mx.data.get({
        xpath: '//' + chart.entity,
        callback: function (objs) {
          var attributes = objs[0].getAttributes();
          chart._dataSource = R.pipe(
            R.map(
              R.pipe(
                R.path(['jsonData', 'attributes']),
                R.map(R.prop('value')),
                R.props(attributes)
              )
            ),
            R.insert(0, attributes)
          )(objs);
          chart._loadChart();
        }
      });
    },
    /**
     * 更新函数
     * @param {*} obj - @TODO: 未知
     * @param {Function} callback - @TODO: 未知
     */
    update: function (obj, callback) {
      this._data = obj;
      console.log('obj',obj);
      callback();
    },
    resize: function () {
      console.log('resize', this._data);
    },
    // 析构函数
    uninitialize: function () {
    },
    // 初始化容器
    _initContainer: function () {
      domStyle.set(this.chartContainer, {
        height: this.chartHeight + 'px',
        width: this.chartWidth + 'px'
      });
    },
    // 加载地图
    _loadChart: function () {
      this._initContainer();
      this._chartInstance = echarts.init(this.chartContainer);
      var chart = this;
      var option = toJSON2(chart.option);
      option.dataset = {
        source: chart._dataSource
      };
      this._chartInstance.setOption(option);
    },
    // 追加监听
    _setupEvents: function () {

    }
  });
});

