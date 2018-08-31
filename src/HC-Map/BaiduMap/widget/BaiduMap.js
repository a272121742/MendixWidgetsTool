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
  将有关本文档的描述写在这
*/
define([
  "dojo/_base/declare",
  "mxui/widget/_WidgetBase",
  "dijit/_TemplatedMixin",
  'dojo/dom-style',

  "dojo/text!BaiduMap/widget/template/Container.html", // 异步加载模板
  "BaiduMap/lib/BaiduMapLoader", // 异步加载百度地图
], function (declare, _WidgetBase, _TemplatedMixin, domStyle, Container, BaiduMapLoader) {
  "use strict";

  // 定义组件
  declare("BaiduMap.widget.BaiduMap", [_WidgetBase, _TemplatedMixin], {
    // @Require 组件所在模板
    templateString: Container,
    _baiduMap: null,
    /**
     * 构造函数
     * @param {*} params - 从Mendix配置中传入的参数
     * @param {Element} srcNodeRef - 生成的临时div元素
     */
    constructor: function (params, srcNodeRef) {
    },
    // created
    postCreate: function () {
      var self = this;
      if (!window.BMap) {
        BaiduMapLoader.load('baidumap', require, function () {
          self._loadMap();
        }, {
          ak: self.ak,
          // isBuild: true
        });
      } else {
        this._loadMap();
      }
    },
    // mounted
    startup: function () {
    },
    /**
     * 更新函数
     * @param {*} obj - @TODO: 未知
     * @param {Function} callback - @TODO: 未知
     */
    update: function (obj, callback) {
      callback();
      
    },
    // 析构函数
    uninitialize: function () {
    },
    // 初始化容器
    _initContainer: function () {
      domStyle.set(this.mapContainer, {
        height: this.mapHeight + 'px',
        width: this.mapWidth + 'px'
      });
    },
    // 加载地图
    _loadMap: function () {
      this._initContainer();
      this._baiduMap = new BMap.Map(this.mapContainer);
      var point = new BMap.Point(116.404, 39.915);
      this._baiduMap.centerAndZoom(point, 15);
    },
    // 追加监听
    _setupEvents: function () {

    }
  });
});

