---
title: 重学 es6 中的 class
date: 2019-09-06 18:55:28
tags:
---

```js
class Point {
    constructor (x, y) {
        this.x = x;
        this.y = y;
    }

    getPoint () {
        return '(' + this.x + ', ' + this.y + ')';
    }
}
// 类本身指向构造函数
console.log('Point === Point.prototype.constructor: ', Point === Point.prototype.constructor);

let point = new Point(1, 2);
console.log('point: ', point);
// 对象解构可以解构出原型上的属性
const { getPoint } = point;
console.log('getPoint: ', getPoint)
// 类的实例方法其实都是原型上的方法
// 实例的 constructor 就是原型上的 constructor 方法
console.log('point.constructor === Point.prototype.constructor: ', point.constructor === Point.prototype.constructor)

// 类的原型对象上的 constructor 属性指向类本身
console.log('Point === Point.prototype.constructor: ', Point === Point.prototype.constructor)

// 类内部所有定义的方法，都是不可枚举的
console.log('Object.keys(Point.prototype): ', Object.keys(Point.prototype));
console.log('Object.getOwnPropertyNames(Point.prototype): ', Object.getOwnPropertyNames(Point.prototype));

/**
  * class Point {}
  * 等同于
  * class Point {
  *   constructor () {}
  * }
**/

// constructor 方法默认返回实例对象（即 this ）
class Foo {
    constructor () {
        return Object.create(null);
    }
}
console.log('new Foo() instanceof Foo: ', new Foo() instanceof Foo);

let p1 = new Point(1, 2);
let p2 = new Point(4, 5);
console.log('p1.constructor === p2.constructor: ', p1.constructor === p2.constructor);

// 类内部可以使用 get 和 set 关键字，对某个属性设置存值和取值函数，拦截该属性的存取行为
class MyClass {
    get prop () {
        return 'getter';
    }
    set prop (value) {
        console.log('setter: ', value);
    }
}
let inst = new MyClass();
inst.prop = 3;
console.log('inst.prop: ', inst.prop);

// 存值函数和取值函数时定义在 html 属性的描述对象上面
class CustomHTMLElement {
    constructor (element) {
        this.element = element
    }
    get html () {
        this.element.innerHTML;
    }
    set html (value) {
        this.element.innerHTML = value;
    }
}
let descriptor = Object.getOwnPropertyDescriptor(CustomHTMLElement.prototype, 'html');
console.log('"get" in descriptor: ', 'get' in descriptor);

// printName 方法中的 this ，默认指向 Logger 类的实例，如果将这个方法提取出来单独使用，this 会指向该方法运行时所在的环境
// 一个比较简单的解决方法是，在构造方法中绑定 this ，这样就不会找不到 print 方法
// 另一种方法是使用箭头函数
class Logger {
    constructor () {
        this.printName = this.printName.bind(this);
        // this.printName = (name = 'there') => this.print(`Hello ${name}`);
    }
    printName (name = 'there') {
        this.print(`Hello ${name}`);
    }

    print (text) {
        console.log(text);
    }
}
const logger = new Logger();
const { printName } = logger;
console.log('logger:', logger);
console.log('printName:', printName);
printName(); // Cannot read property 'print' of undefined

// 静态方法
// 静态方法直接在类上调用，该方法不会被实例继承
// 静态方法包含 this 关键字，指向类，而不是实例
// 子类可以从 super 对象上调用父类静态对象
class Car {
    static getCarBand () {
        return this.baz();
    }
    static baz () {
        return 'Benzi';
    }
    baz () {
        return 'BYD';
    }
}
console.log('Car.getCarBand(): ', Car.getCarBand());
let car = new Car();
// car.getCarBand(); // car.getCarBand is not a function
class ElectricVehicle extends Car {
    static bar () {
        return super.baz() + ', too';
    }
}
console.log('ElectricVehicle.bar(): ', ElectricVehicle.bar());

class IncreasingCounter {
    constructor () {
        this._count = 0;
    }

    get value () {
        console.log('Getting the current value!');
        return this._count;
    }
    increment () {
        this._count++;
    }
}
const increasingCounter = new IncreasingCounter();
console.log('increasingCounter.value: ', increasingCounter.value);

// 如果构造函数不是通过 new 命令或 Reflect.construct() 调用，new.target 会返回 undefined
/* function Person (name) {
  if (new.target === Person) {
    this.name = name;
  } else {
    throw new Error('必须使用 new 命令生成实例');
  }
}

const person = new Person('joy');
const notAPerson = Person.call(person, 'joy'); */

// 子类继承父类时，new.target 会返回子类
class Rectangle {
    constructor (length, width) {
        console.log('new.target: ', new.target);
    }
}

class Square extends Rectangle {
    constructor (length) {
        super(length, length); // 调用父类的 constructor
    }
}

new Square(3)
```

```js
// 子类必须在 constructor 方法中调用 super 方法，否则新建实例时会报错。
// 这是因为子类自己的 this 对象，必须先通过父类的构造函数完成塑造，得到与父类同样的实例属性和方法
// 然后再对其进行加工，加上子类自己的实例属性和方法。
// ES5 的继承，实质是先创造子类的实例对象 this ，然后再将父类的方法添加到 this 上面（ Parent.apply(this) ）
// ES6 的继承机制完全不同，实质是先将父类实例对象的属性和方法，加到 this 上面（所以必须先调用 super 方法），
// 然后再用子类的构造函数修改 this。
class Point {

}

class ColorPoint extends Point {
    constructor (x, y, color) {
        super(x, y);
        this.color = color;
    }
    toString () {
        return this.color + ' ' + super.toString(); // 调用父类的 toString()
    }
}

const colorPoint = new ColorPoint(10, 10, 'red');
// Object.getPrototypeOf() 从子类获取父类
console.log('Object.getPrototypeOf(ColorPoint): ', Object.getPrototypeOf(ColorPoint));

// super 关键字既可以当函数使用，也可以当对象使用
// super 作为函数使用时，代表父类构造函数
// super 作为对象时，在普通方法中，指向父类的原型对象；在静态方法中，指向父类
// super 虽然代表了父类的构造函数，但是返回的是子类的实例，即 super()在这里相当于 A.prototype.constructor.call(this)
// ES6 规定，在子类普通方法中通过 super 调用父类的方法时，方法内部的 this 指向当前的子类实例
class A {
    constructor () {
        this.p = 2;
        console.log(new.target.name);
    }
    print () {
        console.log(this.x);
    }
}

class B extends A {
    constructor () {
        super();
        this.x = 2;
        // 通过 super 对某个属性赋值，这是 super 就是 this
        super.x = 3;
        console.log('super.x: ', super.x);
        console.log('this.x: ', this.x);
    }
    m () {
        super.print();
        // 由于 super 指向父类的原型对象，所以定义在父类实例上的方法或属性，无法通过 super 调用
        console.log('super.p: ', super.p); // undefined
    }
}

const a = new A();
const b = new B();
b.m();

// super 在静态方法中指向父类，在普通方法中指向父类的原型对象
class Parent {
    static myMethod (msg) {
        console.log('static: ', msg);
    }
    myMethod (msg) {
        console.log('instance: ', msg);
    }
}

class Child extends Parent {
    static myMethod (msg) {
        super.myMethod(msg);
    }
    myMethod (msg) {
        super.myMethod(msg);
    }
}

Child.myMethod(1); // static: 1
const parent = new Parent();
const child = new Child();
child.myMethod(2); // static: 2
console.log(child);

// 子类的 __proto__ 属性，表示构造函数的继承，总是指向父类
// 子类 prototype 属性的 __proto__ 属性，表示方法的继承，总是指向父类的 prototype 属性
console.log('Child.__proto__ === Parent: ', Child.__proto__ === Parent);
console.log('Child.prototype.__proto__ === Parent.prototype: ', Child.prototype.__proto__ === Parent.prototype);

// 子类实例的 __proto__ 属性的 __proto__ 属性，指向父类实例的 __proto__ 属性
console.log('child.__proto__.__proto__ === parent.__proto__: ', child.__proto__.__proto__ === parent.__proto__);

// ES5 原生构造函数无法继承，ES6 允许继承原生构造函数定义子类
class VersionedArray extends Array {
    constructor () {
        super();
        this.history = [[]];
    }
    commit () {
        this.history.push(this.slice());
    }
    revert () {
        this.splice(0, this.length, ...this.history[this.history.length - 1]);
    }
}
const v = new VersionedArray();

v.push(1);
v.push(2);
console.log('v: ', v); // [1, 2]
v.commit();
console.log('history: ', v.history); // [[], [1, 2]]
v.push(3);
console.log('v: ', v); // [1, 2, 3]
console.log('history: ', v.history); // [[], [1, 2]]
v.revert();
console.log('v: ', v); // [1, 2]
```
