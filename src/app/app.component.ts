import { Component } from '@angular/core';

/**
 * 组件的必备元素:
 * (1)装饰器(@Component)
 * (2)模板(Template)
 * (3)控制器(Controller): 控制器就是一个普通的TypeScript类, 控制器包含了组件的所有属性和方法, 控制器通过数据绑定与模板进行通信.
 */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
}
