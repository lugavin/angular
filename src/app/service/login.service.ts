import { Injectable } from '@angular/core';

/**
 * 只有被@Injectable()装饰器修饰的类才能进行依赖注入(@Component()装饰器是@Injectable()的子类).
 */
@Injectable()
export class LoginService {

  constructor() { }

}
