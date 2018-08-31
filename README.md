## 如何使用

```shell
# 开发单插件
grunt dev:widgetPackageName
# 开发多插件
grunt dev

# 构建单插件
grunt build:widgetPackageName
# 构建全部插件
grunt build
```

## 发生了什么

### dev开发

在`dev`开发模式下，我们需要保证开发出来的插件直接渲染到页面的案例中去，因此，该模式下做了如下的监听工作流：

1.  生成了每个插件包的`package.xml`文件；
2.  复制`src`下的插件包文件到`dist`目录中；
3.  发布`dist`文件夹下的插件包到`deployment`的插件文件夹下；
4.  生成插件包的压缩文件，以Mendix规定的`mpk`为后缀；
5.  复制`mpk`文件到`widgets`文件夹下；

整个过程是在插件包被监听的模式下进行的，只要插件包里的代码发生了变化，都会触发此工作流的运行。流程执行到`步骤3`的时候，可以通过清空浏览器缓存后强制刷新，以此来看到更新的结果。流程执行到`步骤5`的时候，可以通过刷新Mendix（`F4`）来更新所有插件配置。整个过程不会对开发的插件包进行打包处理，如果希望打包，参看后面的内容。

### build构建

如果插件包已经开发完成，可以执行`grunt build`将所有的插件包进行打包处理，该过程也是一个工作流，执行了如下的过程：

1.  清空`dist`目录；
2.  生成了每个插件包的`package.xml`文件；
3.  复制`src`下的插件包文件到`dist`目录中；
4.  压缩源代码，包括`js`、`css`、`html`，并导出到dist目录中；
5.  生成插件包的压缩文件，以Mendix规定的`mpk`为后缀；
6.  复制`mpk`文件到`widgets`文件夹下；

这个过程和`dev`开发模式非常相似，仅仅是多了一个代码的压缩处理。这个环节一定是出现在插件包的开发最终阶段，一定要经历过测试之后再执行。因为`build`构建过程并不会将源代码发布到`deployment`目录中，也就是说它不保证前端代码的更新。

### start-mendix测试项目

使用`start-mendix`后，会调用本地的mendix打开该工程包的一个测试项目，该项目已经进行过手工重置，并且与你所开发的插件包是同步的，可以直接在mendix工具中引入你所开发的插件进行测试。

## 为什么这样做

本套工作流解决两个问题：

1. 手工配置`package.xml`的问题；
2. 多插件包、多插件的同步开发问题；

按照官方给的方案，一次只能开发一个插件包，虽然每个插件包里可以开发多个插件，但是在开发多个插件包的时候，需要打开多个项目（多个代码编辑器和多个Mendix）。例如：

```shell
src
	packageA
		widgetA1
			widgetA.xml
		widgetA2
			widgetB.xml
		widgetA3
			widgetC.xml
		package.xml
```

现在，我们按照新的方式去构建多插件包：

```shell
src
	packageA
		widgetA1
			widgetA1.xml
		widgetA2
			widgetA2.xml
		widgetA3
			widgetA3.xml
	packageB
		widgetB1
			widgetB1.xml
		widgetB2
			widgetB2.xml
	packageC
		widgetC1
			widgetC1.xml
		widgetC2
			widgetC2.xml
```

并且我们简化了开发者去维护`package.xml`的过程，因为`package.xml`就是配置包和插件之间的关系的，和目录结构是一一对应的，因此我们可以通过程序的方式自动解决。增加一个插件的格式应该遵循如下格式：

```shell
packageName
	packageName.xml
```

增加后，在`dev`和`build`模式下，都会重新读取插件目录并且生成对应的`package.xml`文件 。并且多个插件包可以在同一个项目中测试，我们也只需要开启一个服务即可。

> 插件包（`package`）和插件（widget）之间的关系：一个包可以包含多个插件，这多个插件最终会打成一个包，例如封装图表的时候，图表可以是一个包，里面有点图、线图、柱图等插件。一个开发项目可以同时开发多个包，构建的时候也是分包打包。每个包里的插件可以共用一套代码，如果多个包里有公共代码，目前无法做到共享，这需要做更强大的工作流来实现，现在需要一点点的复制粘贴即可。