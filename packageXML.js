// 参考 https://github.com/oozcitak/xmlbuilder-js
var path = require("path");
var fs = require('fs');
var shelljs = require("shelljs");
var builder = require('xmlbuilder');
var currentFolder = shelljs.pwd().toString();
var srcFolder = path.resolve(currentFolder, 'src');

function createPkgXml (pkgName) {
  var pkgFolderPath = path.resolve(srcFolder, pkgName);
  var package = builder.create({
    package: {
      '@xmlns': 'http://www.mendix.com/package/1.0/'
    }
  }, {encoding: 'utf-8'});
  var clientModule = package.ele({
    clientModule: {
      '@name': pkgName,
      '@version': '1.0.0',
      '@xmlns': 'http://www.mendix.com/clientModule/1.0/'
    }
  });
  var widgetFiles = clientModule.ele({
    widgetFiles: {}
  });
  var files = clientModule.ele({
    files: {}
  });
  fs.readdirSync(pkgFolderPath).forEach(name => {
    if (name !== 'package.xml') {
      widgetFiles.ele({
        widgetFile: {
          '@path': `${name}/${name}.xml`
        }
      });
      files.ele({
        file: {
          '@path': `${name}/widget/`
        }
      });
    }
  });
  return files.end();
}


function singlePkg (pkgName) {
  var pkgFolderPath = path.resolve(srcFolder, pkgName);
  var pkgFilePath = path.resolve(pkgFolderPath, 'package.xml');
  var pkgXml = createPkgXml(pkgName);
  fs.writeFileSync(pkgFilePath, pkgXml, {encoding: 'utf8', flag: 'w'});
}

module.exports.pkg = function (pkgNames) {
  console.log(`生在生成${pkgNames}的package.xml文件`);
  pkgNames.forEach(singlePkg);
}

