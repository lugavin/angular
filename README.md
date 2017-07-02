## Angular简介
- AngularJS是一个非常强大的JavaScript框架，用于构建SPA(Single Page Application)项目，它通过添加一些额外的属性来扩展HTML DOM并使其更加快速响应用户操作。    
- AngularJS最显著的特点是用静态的HTML文档就可以生成具有动态行为的页面。  
- Angular其实本质上是将后端的开发模型引入到前端。  

## Angular核心功能
- Data Binding - 自动同步model和view组件之间的数据，ng-model指令用于数据绑定。
- Scope − 和model关联的对象，充当controller和view之间的纽带。
- Controller − 绑定到特定scope的JavaScript函数(controller中可以注入scope)。
- Services − AngularJS内置了一些服务，例如可用于Ajax请求的$https服务，服务是单例对象，仅在应用程序中实例化一次(service中可以注入其他service但不能注入scope)。
- Filters − 过滤器用于根据定义的条件从项目列表中显示过滤的项目。
- Directives − 指令是DOM元素的标记(如元素、属性、CSS等等)，可用于创建自定义的HTML标记作为新的定制小部件，AngularJS内置了一些指令(ngApp、ngModel、ngBind...)
- Templates − 由controller和model提供信息的呈现视图，可以是单个文件或在一个页面中使用partial的多个视图。
- Routing − 即切换视图，控制器根据业务逻辑决定要渲染哪一个视图。
- Dependency Injection − AngularJS有一个内置的依赖注入子系统，以用来帮助开发人员开发、理解和测试变得更加容易。  

![Angular核心功能](https://www.tutorialspoint.com/angularjs/images/angularjs_concepts.jpg)

## MVC架构
**Controller接收应用程序的所有请求，并与Model一起准备View所需的任何数据，然后，View使用由Controller准备的数据来生成最终可呈现的响应。**   

![MVC架构](https://www.tutorialspoint.com/angularjs/images/angularjs_mvc.jpg)

## Directives
AngularJS指令是扩展的HTML特殊属性(带有前缀ng-)：
- ng-app − ng-app指令定义了AngularJS应用程序的根元素
- ng-model − ng-model指令将表单元素的值绑定到应用程序，支持双向绑定(双向绑定：$scope<=>view)，对普通元素无效
- ng-bind − ng-bind指令将应用程序数据绑定(单向绑定：$scope=>view)到HTML视图，用于普通元素，不能用于表单元素(当ng-bind和{{}}同时使用时，ng-bind绑定的值覆盖该元素的内容)

## Expressions
- AngularJS通过指令扩展了HTML，且通过表达式绑定数据到HTML
- AngularJS应用程序表达式是纯JavaScript表达式
- AngularJS表达式写在双大括号{{expression}}内，AngularJS将在表达式书写的位置输出数据
- AngularJS表达式通常用于将应用程序数据绑定(单向绑定：$scope=>view)到HTML视图，这与ng-bind指令有异曲同工之妙

## Modules
AngularJS支持模块化，模块通常用于划分逻辑层次(如controllers、services、application等等)，并保持代码的简洁。
- Application Module − 通用用于初始化应用
- Service Module − 负责只做具体的任务
- Controller Module − 通常用于定义控制器

*说明：JavaScript中应避免使用全局函数，因为它们很容易被其他脚本文件覆盖；AngularJS模块让所有函数的作用域在该模块下，避免了该问题。*

## Controllers
- AngularJS应用程序主要依靠控制器来控制应用程序中的数据
- 每个控制器接收一个$scope参数，$scope包含了模型数据，在控制器中可通过$scope对象访问模型数据

## Scopes
*Scope是应用在HTML(视图)和Controller(控制器)之间的纽带，Scope包含了模型数据，在控制器中，通过$scope对象访问模型数据。*

## Services
- AngularJS提供许多内置服务(例如$https、$route、$window、$location等)，每个服务负责一个特定的任务(例如$https用于进行ajax调用以获取服务器数据，$route用于定义路由信息等等)，内置服务始终以$符号为前缀
- AngularJS内置了30多个服务，很多服务在DOM中有对应的对象
- AngularJS服务是一个javascript函数，负责只做具体的任务，这使它们变得可维护和可测试

### 创建服务的两种方式

#### factory
``` js
var myApp = angular.module('myApp', []);
myApp.factory('myService', function() {
  return {
    multiply: function(a, b) {
      return a * b
    }
  };
});
```

#### service
``` js
var myApp = angular.module('myApp', []);
myApp.service('myService', function(){
   this.multiply = function(a, b) {
      return a * b
    };
});
```

## Views

## Filters
*过滤器用于更改数据，可以使用一个管道字符(|)添加到表达式和指令中。*

## Includes
**在HTML中，目前还不支持包含HTML文件的功能，为了实现这一功能，通常我们使用AJAX请求从服务端获取数据，然后将返回的数据和JS模板相结合通过使用innerHTML写入到HTML元素中；而使用AngularJS，我们可以使用ng-include指令在HTML页面中嵌入HTML页面。**  

## Routes
AngularJS路由允许我们通过不同的URL访问不同的内容，通过AngularJS可以实现多视图的单页Web应用。  
通常我们的URL形式为 http://www.example.com/first，但在单页Web应用中，AngularJS通过 **# + 标记** 实现，例如：  
http://www.example.com/#/first  
http://www.example.com/#/second  
http://www.example.com/#/third  
当我们点击以上的任意一个链接时，向服务端请的地址都是一样的 (http://www.example.com/)。 因为 # 号之后的内容在向服务端请求时会被浏览器忽略掉。 所以我们就需要在客户端实现 # 号后面内容的功能实现。 AngularJS路由就通过 **# + 标记** 帮助我们区分不同的逻辑页面并将不同的页面绑定到对应的控制器上。

## [Angular编程规范](https://github.com/mgechev/angularjs-style-guide/blob/master/README-zh-cn.md)
