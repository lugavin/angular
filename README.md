## Angular简介
- AngularJS是一个非常强大的JavaScript框架，用于构建SPA(Single Page Application)项目，它通过添加一些额外的属性来扩展HTML DOM并使其更加快速响应用户操作。    
- AngularJS最显著的特点是用静态的HTML文档就可以生成具有动态行为的页面。  
- Angular其实本质上是将后端的开发模型引入到前端。  

## Angular核心功能
- Data Binding - 自动同步model和view组件之间的数据，ng-model指令用于数据绑定。
- Scope − 和model关联的对象，充当controller和view之间的粘合剂。
- Controller − 绑定到特定scope的JavaScript函数。
- Services − AngularJS内置了一些服务，例如可用于Ajax请求的$https服务，服务是单例对象，仅在应用程序中实例化一次。
- Filters − 过滤器用于根据定义的条件从项目列表中显示过滤的项目。
- Directives − 指令是DOM元素的标记(如元素、属性、CSS等等)，可用于创建自定义的HTML标记作为新的定制小部件，AngularJS内置了一些指令(ngApp、ngModel、ngBind...)
- Templates − 由controller和model提供信息的呈现视图，可以是单个文件或在一个页面中使用partial的多个视图。
- Routing − 即切换视图，控制器根据业务逻辑决定要渲染哪一个视图。
- Model View Whatever − MVC是将应用程序划分为不同部分(Model & View & Controller)的设计模式，每个部分都有不同的职责。在传统意义上，AngularJS并没有实现MVC，而是更接近MVVM(Model-View-ViewModel)。
- Deep Linking − 深度链接使你可以编码URL中的应用程序状态，以便可以将其加入书签，然后应用程序可以从URL恢复到相同的状态。
- Dependency Injection − AngularJS有一个内置的依赖注入子系统，以用来帮助开发人员开发、理解和测试变得更加容易。  

![Angular核心功能](https://www.tutorialspoint.com/angularjs/images/angularjs_concepts.jpg)

## AngularJS核心组件
AngularJS框架可以分为以下三个主要部分：  
- ng-app − ng-app指令用于定义一个AngularJS应用程序
- ng-model − ng-model指令把元素值(比如输入域的值)绑定到应用程序(双向绑定：$scope<=>view)
- ng-bind − ng-bind指令把应用程序数据绑定到HTML视图(单向绑定：$scope=>view)

## MVC架构
MVC是受欢迎的，因为它将应用程序逻辑与用户界面层隔离开来，并支持关注点的分离。  
**控制器接收应用程序的所有请求，然后与模型一起准备视图所需的任何数据，然后，该视图使用由控制器准备的数据来生成最终可呈现的响应。**   

![MVC架构](https://www.tutorialspoint.com/angularjs/images/angularjs_mvc.jpg)

## Directives
## Expressions
## Controllers
## Filters
## Tables
## HTML DOM
## Modules
## Forms
## Includes
## Ajax
## Views
## Scopes
## Services
## Dependency Injection
## Custom Directives

<!--
## [Angular编程规范](https://github.com/mgechev/angularjs-style-guide/blob/master/README-zh-cn.md)
-->
