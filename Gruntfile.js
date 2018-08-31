// Generated on 2018-08-22 using generator-mendix 2.2.3 :: git+https://github.com/mendix/generator-mendix.git
/*jshint -W069*/
/*global module*/
"use strict";

// In case you seem to have trouble starting Mendix through `grunt start-mendix`, you might have to set the path to the Mendix application.
// If it works, leave MODELER_PATH at null
var MODELER_PATH = null;
var MODELER_ARGS = "/file:{path}";

/********************************************************************************
 * Do not edit anything below, unless you know what you are doing
 ********************************************************************************/

var path = require("path"),
  fs = require('fs'),
  mendixApp = require("node-mendix-modeler-path"),
  base64 = require("node-base64-image"),
  semver = require("semver"),
  xml2js = require("xml2js"),
  parser = new xml2js.Parser(),
  builder = new xml2js.Builder({
    renderOpts: { pretty: true, indent: "    ", newline: "\n" },
    xmldec: { standalone: null, encoding: "utf-8" }
  }),
  shelljs = require("shelljs"),
  pkg = require("./package.json"),
  currentFolder = shelljs.pwd().toString();
var pkgXml = require('./packageXML');
// src目录地址
var SRC_PATH = path.resolve(currentFolder, 'src');
var DIST_PATH = path.resolve(currentFolder, 'dist');
// 测试项目打包文件地址
var TEST_PATH = path.join(currentFolder, "/test/MendixWidgetsTool.mpr");
// 测试插件的目录（mpk文件会拷贝到此）
var TEST_WIDGETS_FOLDER = path.join(currentFolder, "./test/widgets");
// 测试插件的开发目录（mpk的解压文件会拷贝到此）
var TEST_WIDGETS_DEPLOYMENT_FOLDER = path.join(currentFolder, "./test/deployment/web/widgets");

//找到目录集合，生成config
var widgetPackages = fs.readdirSync(SRC_PATH);

module.exports = function (grunt) {
  grunt.initConfig({
    uglify: {
      dist: {
        files: [{
          expand: true,
          cwd: './src',
          src: ['**/*.js', '!**/*.min.js'],
          dest: './dist/'
        }],
        options: {
          mangle: true,
          compress: {
            drop_console: true
          },
          report: 'min'
        }
      }
    },
    watch: {
      
    },
    compress: {
      
    },
    copy: {
      // 复制所有插件包到dist目录
      'dist-all': {
        files: [{cwd: SRC_PATH, dest: DIST_PATH, src: ['**/*'], expand: true}]
      },
      // 复制所有插件包到dev目录
      'dev-all': {
        files: [{cwd: SRC_PATH, dest: TEST_WIDGETS_DEPLOYMENT_FOLDER, src: ['**/*'], expand: true}]
      },
      // 复制所有mpk文件
      'mpk-all': {
        files: [{cwd: DIST_PATH, dest: TEST_WIDGETS_FOLDER, src: ['*.mpk'], expand: true}]
      }
    },
    clean: {
      dist: [
        path.join(currentFolder, "dist", pkg.name, "/*")
      ],
      min: [
        path.join(currentFolder, "min", pkg.name, "/*")
      ],
    },
    cssmin: {

    },
    xmlmin: {

    },
    csslint: {
      strict: {
        options: {
          import: 2
        },
        src: ["src/" + pkg.name + "/widget/ui/*.css"]
      }
    }
  });
  // 混淆代码工具
  grunt.loadNpmTasks("grunt-contrib-uglify");
  grunt.loadNpmTasks("grunt-contrib-cssmin");
  grunt.loadNpmTasks("grunt-contrib-htmlmin");
  // 压缩文件工具
  grunt.loadNpmTasks("grunt-contrib-compress");
  // 清理文件工具
  grunt.loadNpmTasks("grunt-contrib-clean");
  // 监听文件工具
  grunt.loadNpmTasks("grunt-contrib-watch");
  // 复制文件工具
  grunt.loadNpmTasks("grunt-contrib-copy");
  // 
  grunt.loadNpmTasks("grunt-newer");
  // 
  grunt.loadNpmTasks("grunt-contrib-csslint");

  // 启动Mendix-Modeler
  grunt.registerTask("start-modeler", function () {
    var done = this.async();
    if (MODELER_PATH !== null || (mendixApp.err === null && mendixApp.output !== null && mendixApp.output.cmd && mendixApp.output.arg)) {
      grunt.util.spawn({
        cmd: MODELER_PATH || mendixApp.output.cmd,
        args: [
          (MODELER_PATH !== null ? MODELER_ARGS : mendixApp.output.arg).replace("{path}", TEST_PATH)
        ]
      }, function () {
        done();
      });
    } else {
      console.error("Cannot start Modeler, see error:");
      console.log(mendixApp.err);
      done();
    }
  });
  grunt.registerTask("start-mendix", ["start-modeler"]);
  // 构建单个插件包或多个插件包
  grunt.registerTask('build', function (packageName) {
    if (packageName) {
      grunt.task.run([
        `cls:${packageName}`, 
        `pkg:${packageName}`, 
        `cp:${packageName}`, 
        `ugl:${packageName}`, 
        `css:${packageName}`, 
        `xml:${packageName}`, 
        `zip:${packageName}`, 
        `mpk:${packageName}`
      ]);
    } else {
      grunt.task.run([
        `cls`, 
        `pkg`, 
        `cp`, 
        `ugl`, 
        `css`, 
        `xml`, 
        `zip`, 
        `mpk`
      ]);
    }
  });
  // 开发单个插件或多个插件包
  grunt.registerTask('dev', function (packageName) {
    if (packageName) {
      grunt.config.set(`watch.${packageName}`, {
        "files": [`./src/${packageName}/**/*`],
        "tasks": [`pkg:${packageName}`, `cp:${packageName}`, `pub:${packageName}`, `zip:${packageName}`, `mpk:${packageName}`],
        options: {
          debounceDelay: 250,
          livereload: true
        }
      });
      grunt.task.run(`watch:${packageName}`);
    } else {
      grunt.config.set(`watch.all`, {
        "files": [`./src/**/*`],
        "tasks": [`pkg`, `cp`, `pub`, `zip`, `mpk`],
        options: {
          debounceDelay: 250,
          livereload: true
        }
      });
      grunt.task.run(`watch:all`);
    }
  });

  grunt.registerTask(
    "default",
    "Watches for changes and automatically creates an MPK file, as well as copying the changes to your deployment folder",
    ["dev"]
  );

  // 生成插件包的配置文件
  grunt.registerTask('pkg', function (packageName) {
    var packageNames = packageName ? [packageName] : fs.readdirSync(SRC_PATH);
    pkgXml.pkg(packageNames);
  });
  // 复制插件包到dist目录
  grunt.registerTask('cp', function (packageName) {
    if (packageName) {
      grunt.config.set(`copy.dist-${packageName}`, {
        files: [
          {cwd: SRC_PATH, dest: DIST_PATH, src: [`${packageName}/*`], expand: true}
        ]
      });
      console.log(grunt.config.data);
      grunt.task.run(`copy:dist-${packageName}`);
    } else {
      grunt.task.run('copy:dist-all');
    }
  });
  // 发布插件包到dev目录
  grunt.registerTask('pub', function (packageName) {
    if (packageName) {
      grunt.config.set(`copy.dev-${packageName}`, {
        files: [
          {cwd: path.resolve(SRC_PATH, packageName), dest: TEST_WIDGETS_DEPLOYMENT_FOLDER, src: [`**/*`], expand: true}
        ]
      });
      grunt.task.run(`copy:dev-${packageName}`);
    } else {
      widgetPackages.forEach(pkgName => {
        grunt.task.run(`pub:${pkgName}`);
      });
    }
  });
  // 复制mpk文件
  grunt.registerTask('mpk', function (packageName) {
    if (packageName) {
      grunt.config.set(`copy.mpk-${packageName}`, {
        files: [
          {cwd: DIST_PATH, dest: TEST_WIDGETS_FOLDER, src: [`${packageName}.mpk`], expand: true}
        ]
      });
      grunt.task.run(`copy:mpk-${packageName}`);
    } else {
      grunt.task.run('copy:mpk-all');
    }
  });
  // 清理文件
  grunt.registerTask('cls', function (packageName) {
    if (packageName) {
      grunt.config.set(`clean.dist-${packageName}`, {
        src: [path.resolve(DIST_PATH, packageName)]
      });
      grunt.task.run(`clean:dist-${packageName}`);
    } else {
      grunt.task.run(`clean:dist`);
    }
  });
  // 压缩js文件
  grunt.registerTask('ugl', function (packageName) {
    if (packageName) {
      grunt.config.set(`uglify.dist-${packageName}`, {
        files: [{cwd: SRC_PATH, dest: DIST_PATH, src: [`${packageName}/**/*.js`, `!${packageName}/**/*.min.js`], expand: true}],
        options: {
          mangle: true,
          compress: {drop_console: true},
          report: 'min'
        }
      });
      grunt.task.run(`uglify:dist-${packageName}`);
    } else {
      grunt.task.run(`uglify:dist`);
    }
  });
  // 压缩css文件
  grunt.registerTask('css', function (packageName) {
    if (packageName) {
      grunt.config.set(`cssmin.dist-${packageName}`, {
        options: { mangle: false, report: 'min'},
        files: [{cwd: SRC_PATH, dest: DIST_PATH, src: [`${packageName}/**/*.css`, `!${packageName}/**/*.min.css`], expand: true}],
      });
      grunt.task.run(`cssmin:dist-${packageName}`);
    } else {
      widgetPackages.forEach(pkgName => {
        grunt.task.run(`css:${pkgName}`);
      });
    }
  });
  // 压缩html、xml文件
  grunt.registerTask('xml', function (packageName) {
    if (packageName) {
      grunt.config.set(`htmlmin.dist-${packageName}`, {
        options: { 
          removeComments: true, //移除注释
          removeCommentsFromCDATA: true,//移除来自字符数据的注释
          collapseWhitespace: true,//无用空格
          collapseBooleanAttributes: true,//失败的布尔属性
          removeAttributeQuotes: true,//移除属性引号      有些属性不可移走引号
          removeRedundantAttributes: true,//移除多余的属性
          useShortDoctype: true,//使用短的跟元素
          removeEmptyAttributes: true,//移除空的属性
          removeOptionalTags: true//移除可选附加标签
        },
        files: [{cwd: SRC_PATH, dest: DIST_PATH, src: [`${packageName}/**/*.html`], expand: true}],
      });
      grunt.task.run(`htmlmin:dist-${packageName}`);
    } else {
      widgetPackages.forEach(pkgName => {
        grunt.task.run(`xml:${pkgName}`);
      });
    }
  });
  // 压缩插件包
  grunt.registerTask('zip', function (packageName) {
    if (packageName) {
      grunt.config.set(`compress.dist-${packageName}`, {
        options: {
          level: 9,
          archive: path.resolve(DIST_PATH, `${packageName}.mpk`),
          mode: 'zip'
        },
        files: [{cwd: path.resolve(DIST_PATH, packageName), src: [`**/*`], store: false, date: new Date(), expand: true}]
      });
      grunt.task.run(`compress:dist-${packageName}`);
    } else {
      widgetPackages.forEach(pkgName => {
        grunt.task.run(`zip:${pkgName}`);
      });
    }
  });
};
