---
title: php基础
date: 2018-05-04 20:42:30
tags: php
categories: php
---

### 数组

直接赋值声明

索引数组：下标为数字

```js
$arr1[0] = 1;
$arr1[1] = 2;
$arr1[2] = 3;
print_r($arr1);
echo '<br>';
```

关联数组：下标为字符串

```js
$arr2['one'] = 1;
$arr2['two'] = 2;
$arr2['three'] = 3;
print_r($arr2);
echo '<br>'; */
```

`[]`和`{}`可以访问下标，建议使用`[]`，因为 echo "$arr1{0}2222"; 报错

```js
echo $arr1[0];
echo $arr1{0};
```

下标是字符串，数字字符串转化为整数

```js
$arr1['2'] = 'a';
print_r($arr1); // Array ( [0] => 1 [1] => 2 [2] => a )
echo '<br>';
```

例外，'08'不会转化成8，而是'08'，被当作八进制

```js
$arr1['01'] = '01';
print_r($arr1); // Array ( [0] => 1 [1] => 2 [2] => 3 [01] => 01 )
echo '<br>';
```

下标是浮点数，小数部分会被舍弃

```js
$arr1[1.8] = 1.8;
print_r($arr1); // Array ( [0] => 1 [1] => 1.8 [2] => 3 )
echo '<br>';
```

下标是布尔值，true转化为1，false转化为0

```js
$arr1[true] = 'true';
print_r($arr1); // Array ( [0] => 1 [1] => true [2] => 3 )
echo '<br>';
```

下标是null，转化为空字符串''

```js
$arr1[null] = 'null';
print_r($arr1); // Array ( [0] => 1 [1] => 2 [2] => 3 [] => null )
echo '<br>';
```

数组和对象做下标会有警告

```js
$index = array();
$arr1[$index] = '$index';
print_r($arr1); // Warning: Illegal offset type */
``

`[]`不写下标，会自动增加索引

```js
$arr1[] = '[]';
print_r($arr1); // Array ( [0] => 1 [1] => 2 [2] => 3 [3] => [] )
```

默认从零开始，当前数组索引出现过的最大值加1

```js
$arr1[8] = 8;
$arr1[] = '9';
print_r($arr1); // Array ( [0] => 1 [1] => 2 [2] => 3 [8] => 8 [9] => 9 )
```

关联数组不会影响索引下标的排列规则

```js
$arr1['one'] = 'one';
print_r($arr1); // Array ( [0] => 1 [1] => 2 [2] => 3 [one] => one )
$arr1[] = 'two';
print_r($arr1); // Array ( [0] => 1 [1] => 2 [2] => 3 [one] => one [3] => two )
```

使用`array`声明数组，默认是索引的下标，从0开始

```js
$arr = array('a', 'b', 'c');
print_r($arr); // Array ( [0] => a [1] => b [2] => c )
```

可以使用`=>`符号指定下标

```js
$arr = array('aaa', 'two'=>'bbb', 'ccc');
print_r($arr);
```

php5.4+，可以使用

```js
$arr = ['aaa', 'two'=>'bbb', 'ccc'];
print_r($arr); // Array ( [0] => aaa [two] => bbb [1] => ccc )
```

`unset`删除数组中一个元素，`array_values`重新索引

```js
$arr = ['a', 'b', 'c'];
// `unset`删除数组中一个元素
unset($arr[1]);
print_r($arr); // Array ( [0] => a [2] => c )
// `array_values`重新索引
$arr = array_values($arr);
print_r($arr); // Array ( [0] => a [1] => c )
```

`list()`遍历，左边是`list`函数，等号右边只能是一个数组，只能是索引数组（下标是连续的），`list()`中的参数和数组总一一对应

```js
$str = 'zs_ls_ww';
list($a, $b, $c) = explode('_', $str);
echo $a . '<br>'; // 'zs'
echo $b . '<br>'; // 'ls'
echo $c . '<br>'; // 'ww'
```

`each()`遍历，`each()`只处理当前元素，指针指向当前元素，下一次调用，指针指向下一个元素，最后一个元素再调用返回`false`

```js
$arr = ['zs', 'ls', 'ww'];
$one = each($arr);
echo '<pre>';
print_r($one);
echo '</pre>';
$two = each($arr);
echo '<pre>';
print_r($two);
echo '</pre>';
```

结合`list()`和`each()`遍历

```js
$arr = ['zs', 'ls', 'ww'];
while (list($key, $val) = each($arr)) {
    echo "{$key}".'---'."{$val}".'<br>';
}
```

数组地址访问方法 `prev()` `next()` `reset()` `end()` `key()` `current()`

```js
$arr = ['one'=>'1', 'two'=>'2', 'three'=>'3'];
next($arr);
print_r(key($arr)); // two
echo key($arr); // two
echo current($arr); // 2
```

超全局数组（变量），在php中，已经声明完的变量，你可以直接就去使用，变量名字已经规定好了，`$_SERVER $_ENV` `$_GET` `$_POST` `$_FILES` `$_COOKIE` `$_SESSION` `$GLOBALS`

```js
foreach ($_SERVER as $key => $value) {
    echo $key.'--->'.$value.'<br>';
}
```

数组相关的函数

```js
$lamp = array('os'=>'Linux', 'webserver'=>'Apache', 'db'=>'Mysql', 'language'=>'PHP', 'num'=>10);
Print_r($lamp);
echo '<br>';

// `array_values()` 获取数组值
$val = array_values($lamp);
print_r($val);
echo '<br>';

// `array_keys(input, search_value, strict)` 获取数组键
$key = array_keys($lamp, 'Apache', true);
print_r($key);
echo '<br>';

// `in_array($needle, $haystack, strict)` 检查数组中是否存在某个值，返回布尔值
$in = in_array('10', $lamp, true);
echo $in ? '在数组中':'不在数组中';
echo '<br>';

// `array_search($needle, $haystack, strick)` 检查数组中是否存在某个值，返回键名
$s = array_search('10', $lamp);
echo $s;
echo '<br>';

// `array_key_exist($key, $haystack, strick)` 检查数组中键名是否存在
$k = array_key_exists('db', $lamp);
echo $k ? '键在数组中' : '键不在数组中';
echo '<br>';

// `array_flip($haystack)` 交换数组中的键和值
$f = array_flip($lamp);
print_r($f);
echo '<br>';

// `array_reverse($haystack)` 返回一个单元顺序相反的数组
$r = array_reverse($lamp);
print_r($r);
```

统计数组元素个数和唯一性

```js
$lamp = ['os'=>'Linux', 'Linux', 'webserver'=>'Apache'];
$web = [
    'lamp'=>['os'=>'Linux', 'webserver'=>'Apache'],
    'javaEE'=>['os'=>'Unix', 'webserver'=>'Tomcat']
];

// `count($arr, $mode)`，计算数组元素个数，第二个参数为真，递归累加数组元素个数
echo count($web, true);
echo '<br>';

// array_count_values($input)，统计数组重复值的出现个数
print_r(array_count_values($lamp)); // Array ( [Linux] => 2 [Apache] => 1 )
echo '<br>';

// array_unique($arr) ，去除数组重复值
print_r(array_unique($lamp)); // Array ( [os] => Linux [webserver] => Apache )
```

使用回调函数处理数组的函数

`array_filter($input, fn)`过滤数组，不传回调函数，返回值为真的元素

```js
$arr = [1, 2, 3, null, -1, 'a', false, true];
var_dump($arr);
var_dump(array_filter($arr));
var_dump(array_filter($arr, function($var) {
    return $var % 2;
}));
var_dump($arr);
```

`unset()` 删除数组本身的元素

```js
unset($arr[1]);
var_dump($arr);
```

`array_walk($arr, $fn, $userdata)`对数组的每个成员应用用户函数

```js
$arr = [1, 2, 3, null, -1, 'a', false, true];
array_walk($arr, function(&$val, $key, $userdata) {
    $val = $val * 2;
    echo $userdata;
    echo '<br>';
}, '###');
print_r($arr);
```

`array_map($fn, $arr1, $arr2,...)`作用于数组的每个元素上

```js
$arr1 = [1, 2, 4];
$arr2 = ['a', 'b', 'c'];
array_map(function($val1, $val2) {
    echo "{$val1} => {$val2}<br>";
}, $arr1, $arr2);
```

当第一参数回调函数为空，返回结果是数组对应各项合并

```js
$arr3 = [false, true];
$m = array_map(null, $arr1, $arr2, $arr3);
var_dump($m);
```

冒泡排序
```js
function bubbleSort($arr) {
    $len = count($arr);
    for ($i = 0; $i < $len; $i++) {
        for ($j = 0; $j < $len - 1 - $i; $j++) {
            if($arr[$j] > $arr[$j + 1]) {
                $tmp = $arr[$j];
                $arr[$j] = $arr[$j + 1];
                $arr[$j + 1] = $tmp;
            }
        }
    }
    return $arr;
}
$arr = [0, 12, 2, 3, 14, 5, 6, 7, 8, 9];
print_r(bubbleSort($arr));
```

数组拆分、合并、分解

`array_slice($arr, $offset, $len, true)`从数组中取出一段

```js
$arr = ['a', 'b', 'c', 'd'];
$narr = array_slice($arr, 2, 1, true);
print_r($narr); // Array ( [2] => c )
```

`array_splice(&$input, $offset, $len, $replace)` 把数组中的一部分去掉并用其他值取代

```js
$arr = ['a', 'b'=>2, 'c', 'd'];
$narr = array_splice($arr, 1, 1, 'rrr');
print_r($narr);
echo '<br>';
print_r($arr);
```

`array_combine($keys, $values)` 创建一个数组，用一个数组的值作为其键名，另一个数组作为其值

```js
$arr1 = ['a', 'b', 'c'];
$arr2 = ['php', 'linux', 'mysql'];
$c = array_combine($arr1, $arr2);
print_r($c); // Array ( [a] => php [b] => linux [c] => mysql )
```

`+`下标相同的会覆盖，前面的覆盖后面的

```js
$a = ['a', 'two'=>'b', 'c'];
$b = [7, 'two' => 8, 9];
$c = $a + $b;
print_r($c); // Array ( [0] => a [two] => b [1] => c )
echo '<br>';
```

`array_merge($arr1, $arr2, ...)`合并数组，索引数组下标相同不覆盖，关联数组下标相同会覆盖

```js
$m = array_merge($a, $b);
print_r($m); // Array ( [0] => a [two] => 8 [1] => c [2] => 7 [3] => 9 )
```

`array_intersect($arr1, $arr2, $arr3...)`计算数组交集

```js
$arr1 = [4, 5, 6, 7, 8];
$arr2 = [5, 6, 7, 8, 9];
$intersect= array_intersect($arr1, $arr2);
print_r($intersect); // Array ( [1] => 5 [2] => 6 [3] => 7 [4] => 8 )
```

`array_diff($arr1, $arr2)` 计算数组差集

```js
$arr1 = [4, 5, 6, 7, 8];
$arr2 = [5, 6, 7, 8, 9];
$diff = array_diff($arr1, $arr2);
print_r($diff); // Array ( [0] => 4 )
```

### 类

```php
class Person {
    // 在类的成员属性前面一定要有一个修饰词，如果不知道使用什么修饰词，就可以使用var（关键字）
    // 如果一旦有其他的修饰词就不要有var
    // 变量（成员属性）
    private $name = 'wuwh';
    private $age;
    private $gender;

    // 构造方法
    function __construct($name='', $age = 1, $gender = 'male') {
        $this->name = $name;
        $this->age = $age;
        $this->gender = $gender;
    }
    // 在直接读取私有属性时自动调用
    function __get($name) {
        echo $name;
        echo '<br>';
        return $this->$name;
    }
    // 在直接设置私有属性时调用
    function __set($name, $value) {
        $this->$name = $value;
    }
    // 在使用`isset()`判断一个私有属性是否存在时，自动调用`__isset()`方法
    function __isset($name) {
        if($name == 'name') {
            return isset($this->$name);
        }
    }
    // 在使用`unset()`删除一个私有属性时，自动调用`__unset()`方法
    function __unset($name) {
        if($name == 'name') {
            unset($this->$name);
        }
    }

    // 函数（成员方法）
    // 方法前面加修饰符 `private`，外部不能调用，但是内部方法可以调用
    function getName() {
        return $this->name;
    }
    function getAge() {
        return $this->age;
    }
    // 私有方法
    private function g() {
        return $this->gender;
    }
    function getGender() {
        return $this->g();
    }
    // 析构方法
    function __destruct() {
        echo "destory {$this->name} over!";
    }
}

$person = new Person('zhangsan', 11, 'female');
echo $person->getName();
echo '<br>';
echo $person->getAge();
echo '<br>';
echo $person->getGender();
echo '<br>';

// 魔术方法
// `__get()` `__set()` `__isset()` `__unset()`
// 读取私有属性，调用`__get()`方法
$person->name;
// 设置私有属性，调用`__set()`方法
$person->name = 'abc';
echo '<br>';
/* unset($person->name);
print_r($person); */
if(isset($person->name)) {
    echo '存在该属性';
} else {
    echo '不存在该属性';
}
```

### 继承

```php
// `private`这是私有的，只能自己用，子类也不能使用
// `protected`保护权限，只能是自己和自己的子类中可以使用
// `final`在类前面加这个关键字，则不能让这个类被继承，也可以修饰方法，不能让子类覆盖这个方法
class Person {
    public $name;
    private $age;
    private $gender;
    public static $country = 'cn';
    function __construct($name, $age, $gender) {
        $this->name = $name;
        $this->age = $age;
        $this->gender = $gender;
    }
    function say() {
        echo "my name is {$this->name}, my age is {$this->age}, my gender is {$this->gender} ";
        // `self`指向类本身
        echo 'my country is '.self::$country;
        echo '<br>';
    }
    function eat() {
        echo 'person can eat';
    }
}
class Student extends Person {
    var $school;
    function __construct($name = '', $age = 1, $gender = 'male', $school = '') {
        // 覆盖父类中的`__construct()`构造方法
        Parent::__construct($name, $age, $gender);
        $this->school = $school;
    }
    function study() {
        echo "before studying, say {$this->name}";
        echo '<br>';
    }
    /* function say() {
        echo "I am a student, my name is {$this->name}";
        echo '<br>';
    } */
    function say() {
        // 类::成员，使用 `Parent::成员` 访问父类中被覆盖的方法
        Parent::say();
        echo "my school is {$this->school}";
        echo '<br>';
    }
}
class Teacher extends Person {
    var $job;
    function teach() {
        echo( "before teaching, say {$this->name}");
    }
}

$student = new Student('wuwh', 22, 'male', 'qing university');
$student->say();
$student->study();

// `instanceof`
if($student instanceof Person) {
    echo '$student属于Person类';
    echo '<br>';
} else {
    echo '$student不属于Person类';
    echo '<br>';
}

// 静态成员只能用类来访问
echo Student::$country;
```

### 魔术方法

```php
// 魔术方法 `__construct()` `__desctruct()` `__set()` `__get()` `__isset()` `__unset()`
class Person {
    public $name;
    public $age;
    public $gender;

    function __construct($name, $age, $gender) {
        $this->name = $name;
        $this->age = $age;
        $this->gender = $gender;
    }
    // 魔术方法`__tostring()`，在直接使用`echo` `print` `printf`输出一个对象引用时，自动调用这个方法
    // 将对象的基本信息放在`__tostring`内部，形成字符串返回
    // `__tostring()`不能有参数，返回一个字符串
    function __toString() {
        return "my name is {$this->name}, my age is {$this->age}, my gender is {$this->gender}";
    }
    // 在克隆对象时自动调用
    // 和构造方法一样，对新克隆对象进行初始化
    // `this`指向副本
    function __clone() {
        echo 'clone...';
        echo '<br>';
        $this->name = 'clone wuwh';
        $this->age = 100;
        $this->gender = 'female';
    }
    // 调用一个对象中不存在的方法时，自动调用的方法
    // 有两个参数，第一个是方法名，第二个是方法的参数
    function __call($method, $args) {
        print_r("sorry, there is not exist the function which method {$method}, arguments are");
        // print_r($args);
        // `serialize()`序列化，对象转化成字符串
        // `unserialize()`反序列化，字符串转化成对象
        echo '<br>';
        echo serialize($args);
        echo '<br>';
    }
    // 在序列化时，自动调用的方法，返回一个数组中声明了的属性名会被序列化
    function __sleep() {
        echo '序列化自动调用了...';
        echo '<br>';
        return array('name');
    }
    // 在反序列化时，自动调用的方法
    function __wakeup() {
        echo '反序列化自动调用了...';
        echo '<br>';
    }
    // 使用`var_export()`方法时，自动调用的方法
    static function __set_state($arr) {
    }
    // `$person()`，自动调用的方法，php5.3+
    function __invoke() {
        echo '实例调用了';
        echo '<br>';
    }
    // `Person::hello()`，调用不存在的静态方法时自动调用
    static function __callStatic($method, $args) {
        echo "你调用的静态方法{$method}不存在";
        echo '<br>';
    }
    function say() {
        print_r("my name is {$this->name}, my age is {$this->age}, my gender is {$this->gender}");
    }
}
$person = new Person('wuwh', 22, 'male');
// 序列化
$ser = serialize($person);
echo $ser;
echo '<br>';
// 反序列化
$unser = unserialize($ser);
echo $unser;
echo '<br>';

$p = clone $person;
$p->say();
$p->aaa('a', 'a', 'a');

/* $ex = var_export($p, true);
var_dump($ex); */

// 调用静态方法`__invoke()`
$p();

// 调用 `__callStatic()`
Person::hello();
```

### 接口

```php
/**
 * 接口和抽象类对比
 * 1. 接口中的方法，必须全是抽象方法
 * 2. 接口中的成员属性，必须是常量
 * 3. 所有的权限必须是共有的
 * 4. 声明接口不使用class，而是使用interface
 */
interface Demo {
    // 接口中的成员属性，必须是常量
    const NAME = 'ABC';
    // 抽象方法修饰符`static`可以省略
    function a();
    function b();
}
// 可以使用`extends`让一个接口继承另一个接口
interface Test extends Demo {
    function t();
}

class Word {
    function w() {

    }
}

// 可以使用一个类来实现接口中的全部方法，可以使用一个抽象类，来实现接口中的部分方法
// 一个类可以在继承另一个类的同时，使用`implements`实现一个接口，可以实现多个接口（一定要先继承，再实现接口）
class Hello extends Word implements Test {
    function a() {}
    function b() {}
    function t() {}
}
```

### 单例模式

```php
// 单例模式
class Person {
    static $obj = null;
    static function getObj() {
        if(!self::$obj instanceof self) {
            self::$obj = new self;
        }
        /* if(is_null(self::$obj)) {
            self::$obj = new self;
        } */
        return self::$obj;
    }
    function __construct(){
        echo 'hello...';
    }
    function __destruct() {
        echo 'destruct...';
    }
}

Person::getObj();
Person::getObj();
Person::getObj();
Person::getObj();
Person::getObj();
```

### 数据库

配置环境变量，可以直接使用`mysql`命令：
`此电脑->属性->高级->环境变量`

连接远程数据库 `-u`用户名 `-p`密码
`mysql -h localhost -uroot -p`

获取user表格所有数据
`select * from mysql.user`

`create database [dbname]`添加库

```
mysql> create database aaa;
Query OK, 1 row affected (0.00 sec)
```

`show databases`查看数据库

```
mysql> show databases;
+--------------------+
| Database           |
+--------------------+
| information_schema |
| mysql              |
| performance_schema |
| test               |
| xsphp              |
+--------------------+
5 rows in set (0.16 sec)
```

`use [dbname]`切换到数据库

```
mysql> use xsphp
Database changed
```

`show tables`查看表格

```
mysql> show tables;
Empty set (0.00 sec)
```

`create table [tablename]`创建一个表格

```
mysql> create table users(id int not null auto_increment primary key);
Query OK, 0 rows affected (0.64 sec)
```

再查看表格列表

```
mysql> show tables;
+-----------------+
| Tables_in_xsphp |
+-----------------+
| users           |
+-----------------+
1 row in set (0.00 sec)
```

`desc [tablename]`查看表格详细信息

```
mysql> desc users;
+-------+---------+------+-----+---------+----------------+
| Field | Type    | Null | Key | Default | Extra          |
+-------+---------+------+-----+---------+----------------+
| id    | int(11) | NO   | PRI | NULL    | auto_increment |
+-------+---------+------+-----+---------+----------------+
1 row in set (0.13 sec)
```

`alter table [tablename] add [field] [desc]`新增字段

```
mysql> alter table users add username char(30) not null default '';
Query OK, 0 rows affected (0.46 sec)
Enregistrements: 0  Doublons: 0  Avertissements: 0

mysql> desc users;
+----------+----------+------+-----+---------+----------------+
| Field    | Type     | Null | Key | Default | Extra          |
+----------+----------+------+-----+---------+----------------+
| id       | int(11)  | NO   | PRI | NULL    | auto_increment |
| username | char(30) | NO   |     |         |                |
+----------+----------+------+-----+---------+----------------+
2 rows in set (0.01 sec)
```

`show create table [tablename]`查看创建表格语句

```
mysql> show create table users;
| users | CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` char(30) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 |
```

再增加一个字段

```
mysql> alter table users add password varchar(40) not null default '';
Query OK, 0 rows affected (0.36 sec)
Enregistrements: 0  Doublons: 0  Avertissements: 0

mysql> desc users;
+----------+-------------+------+-----+---------+----------------+
| Field    | Type        | Null | Key | Default | Extra          |
+----------+-------------+------+-----+---------+----------------+
| id       | int(11)     | NO   | PRI | NULL    | auto_increment |
| username | char(30)    | NO   |     |         |                |
| password | varchar(40) | NO   |     |         |                |
+----------+-------------+------+-----+---------+----------------+
3 rows in set (0.01 sec)
```

`alter table [tablename] drop column [field]`删除字段

```
mysql> alter table users drop column password;
Query OK, 0 rows affected (0.34 sec)
Enregistrements: 0  Doublons: 0  Avertissements: 0

mysql> desc users;
+----------+----------+------+-----+---------+----------------+
| Field    | Type     | Null | Key | Default | Extra          |
+----------+----------+------+-----+---------+----------------+
| id       | int(11)  | NO   | PRI | NULL    | auto_increment |
| username | char(30) | NO   |     |         |                |
+----------+----------+------+-----+---------+----------------+
2 rows in set (0.01 sec)
```

`alter table [tablename] modify column [filed] [desc]`修改一个字段

```
mysql> alter table users modify column username char(22);
Query OK, 0 rows affected (0.51 sec)
Enregistrements: 0  Doublons: 0  Avertissements: 0

mysql> desc users;
+----------+----------+------+-----+---------+----------------+
| Field    | Type     | Null | Key | Default | Extra          |
+----------+----------+------+-----+---------+----------------+
| id       | int(11)  | NO   | PRI | NULL    | auto_increment |
| username | char(22) | YES  |     | NULL    |                |
+----------+----------+------+-----+---------+----------------+
2 rows in set (0.01 sec)
```

`insert into [tablename] (key1, key2, ...) values (value1, value2, ...)`添加数据

```
mysql> insert into users (username, password) values ('admin', 'admin');
Query OK, 1 row affected (0.07 sec)

mysql> select * from users;
+----+----------+----------+
| id | username | password |
+----+----------+----------+
|  1 | admin    | admin    |
+----+----------+----------+
1 row in set (0.00 sec)
```

`update [tablename] set [field]=value1, [field]=values2 where [conditions]` 修改数据

```
mysql> update users set username='www', password='123456' where id=3;
Query OK, 1 row affected (0.09 sec)
Enregistrements correspondants: 1  Modifi茅s: 1  Warnings: 0

mysql> select * from users;
+----+----------+----------+
| id | username | password |
+----+----------+----------+
|  1 | admin    | admin    |
|  2 | boss     | boss     |
|  3 | www      | 123456   |
+----+----------+----------+
3 rows in set (0.00 sec)
```

`delete from [tablename] where [conditions]`删除数据

```
mysql> select * from users;
+----+----------+----------+
| id | username | password |
+----+----------+----------+
|  1 | admin    | admin    |
|  3 | www      | 123456   |
+----+----------+----------+
2 rows in set (0.00 sec)
```

`drop table [tablename]`删除表

`drop database [dbname]`删除库

### PHP操作数据库

```
// 连接数据库（返回资源）
$link = @mysql_connect('localhost', 'root', '');
if(!$link) {
    echo '连接数据库失败！<br>';
    echo mysql_error();
}

// 设置操作
// mysql_query('set names utf8'); // 设置字符集为utf-8
// 选择一个数据库作为默认的数据库使用
mysql_select_db('xsphp');
// 操作数据库的sql语句执行
$sql = 'select id, username, password from users order by id';
// 执行sql语句
$result = mysql_query($sql);

// 前一个操作影响的行数（判断表是否有变化）
// echo mysql_affected_rows().'<br>';
// echo mysql_insert_id();

// 从结果集这个资源中获取想要的结果
// `mysql_fetch_row($result)` 转化成索引数组
// `mysql_fetch_assoc($result)` 转化成关联数组
// `mysql_fetch_array($result, MYSQL_ASSOC)` 转化索引数组和关联数组的组合，第二个参数可取值：MYSQL_ASSOC（关联），MYSQL_NUM（索引），MYSQL_BOTH（默认两个都返回）
// `mysql_fetch_object($result) ` 转化为对象
// 默认指针指向第一条（可以使用`mysql_data_seek`改变自己定义的指定位置）
// 获取一条后，指针自动移动下一位置，最后一个位置返回false
// mysql_data_seek($result, 1);

/* print_r(mysql_fetch_row($result));
echo '<br>'; */

echo '<table border="1">';
echo '<tr>';
for($i = 0; $i < mysql_num_fields($result); $i++) {
    echo '<td>'.mysql_field_name($result, $i).'</td>';
}
echo '</tr>';

while ($row = mysql_fetch_assoc($result)) {
    echo '<tr>';
    echo "<td>{$row['id']}</td>";
    echo "<td>{$row['username']}</td>";
    echo "<td>{$row['password']}</td>";
    /* foreach ($row as $key => $value) {
        echo "<td>{$value}</td>";
    } */
    echo '</tr>';
}
echo '</table>';
echo '共有'.mysql_num_rows($result).'条记录；'.mysql_num_fields($result).'个字段';

print_r(mysql_fetch_assoc($result));
echo '<br>';

var_dump($result);
// 关闭连接
mysql_close($link);
```
```
<?php
    header("content-type:text/html;charset=utf-8");         //设置编码

    /* function parseFileSize($size) {
        if($size > pow(2, 40)) {
            $size = $size / pow(2, 40);
            $suffix = 'TB';
        } else if($size > pow(2, 30)) {
            $size = $size / pow(2, 30);
            $suffix = 'GB';
        } else if ($size > pow(2, 20)) {
            $size = $size / pow(2, 20);
            $suffix = 'MB';
        } else if ($size > pow(2, 10)) {
            $size = $size / pow(2, 10);
            $suffix = 'KB';
        } else {
            $suffix = 'Types';
        }
        return $size.$suffix;
    } */

    /* function getFilePro($filename) {
        if(file_exists($filename)) {
            // `filesize($filename)`文件大小
            echo parseFileSize(filesize($filename));
            echo '<br>';

            // `is_dir($filename)`是否目录
            if(is_dir($filename)) {
                echo '这是一个目录<br>';
            }
            // `is_file($filename)`是否为文件
            if(is_file($filename)) {
                echo '这是一个文件<br>';
            }
            // `is_readable($filename)`是否可读
            if(is_readable($filename)) {
                echo '文件可读<br>';
            }
            // `is_writeable($filename)`是否可写
            if(is_writable($filename)) {
                echo '文件可写<br>';
            }
            // `is_excutable($filename)`是否可执行
            if(is_executable($filename)) {
                echo '文件可执行<br>';
            }
            // 创建时间
            echo '创建时间：'.date('y-m-d h:m:s', filectime($filename)).'<br>';
            // 访问时间
            echo '访问时间：'.date('y-m-d h:m:s', fileatime($filename)).'<br>';
            // 修改时间
            echo '修改时间：'.date('y-m-d h:m:s', filemtime($filename)).'<br>';
        } else {
            echo '文件不存在！<br>';
        }
    }

    getFilePro('./test.txt'); */

    /* function getFileType($filename) {
        if(!file_exists($filename)) {
            echo '文件不存在！';
            return false;
        }
        // `filetype()`返回文件类型
        // 文件类型 fifo, char, dir, block, link, file
        switch (filetype($filename)) {
            case 'dir':
                echo '这是一个目录<br>';
                break;
            case 'char':
                echo '这是一个字符设置<br>';
                break;
            case 'block':
                echo '这是一块设备<br>';
                break;
            case 'file':
                echo '这是一个文件<br>';
                break;
            case 'link':
                echo '这是一个链接<br>';
                break;
            default:
                break;
        }
    }

    getFileType('./test.txt'); */

    /* $filename = 'http://baidu.com/search/index.php?w=666';
    // `basename` `dirname` `pathinfo`
    echo 'basename:'.basename($filename).'<br>';
    echo 'dirname:'.dirname($filename).'<br>';
    echo 'pathinfo:';
    // print_r(pathinfo($filename));

    // `glob()`遍历文件
    foreach(glob('./php/*.dll') as $filename) {
        echo $filename;
        echo '<br>';
    }

    // `opendir($path)`打开目录资源
    $dir = opendir('php');
    // `readdir($dir_handle)`读取目录
    while($filename = readdir($dir)) {
        if($filename != '.' && $filename != '..') {
            $filename = 'php/'.$filename;
            if(is_file($filename)) {
                echo '文件：'.$filename.'<br>';
            } else {
                echo '目录：'.$filename.'<br>';
            }
        }
    }
    echo '########################<br>';
    // `rewinddir($dir_handle)`倒回目录句柄
    rewinddir($dir);

    while($filename = readdir($dir)) {
        if($filename != '.' && $filename != '..') {
            $filename = 'php/'.$filename;
            if(is_file($filename)) {
                echo '文件：'.$filename.'<br>';
            } else {
                echo '目录：'.$filename.'<br>';
            }
        }
    }

    // 关闭目录资源
    closedir($dir); */

    // `disk_total_space($directory)` 磁盘总大小
    $total = disk_total_space('c:');
    echo 'c盘总大小：'.($total / pow(2, 30)).'<br>';
    // `disk_free_space($directory)` 磁盘剩余空间
    $free = disk_free_space('c:');
    echo 'c盘剩余可用空间：'.($free / pow(2, 30)).'<br>';

    $dirnum = 0; // 目录总数
    $filenum = 0; // 文件总数
    $filesize = 0; // 文件总大小
    function getDirNum($file) {
        global $dirnum;
        global $filenum;
        $dir = opendir($file);
        while($filename = readdir($dir)) {
            if($filename != '.' && $filename != '..') {
                $filename = $file.'/'.$filename;
                if(is_dir($filename)) {
                    $dirnum++;
                    getDirNum($filename);
                } else {
                    $filenum++;
                    $filesize += filesize($filename);
                }
            }
        }
        closedir($dir);
    }
    $directory = 'php';
    getDirNum($directory);
    echo $directory.'文件夹下的目录总个数'.$dirnum;
    echo $directory.'文件夹下的文件总个数'.$filenum;
    echo $directory.'文件夹下的文件总大小：'.$filesize;

    // `touch($filename)`创建一个空文件
    // touch('demo.js');
    // `copy($source, $dest)`复制文件
    // copy('demo.js', 'text.js');
    // `rename($oldname, $newname)`移动或重命名一个文件
    // rename('demo.js', 'demo_rename.js');
    // `unlink($filename)`删除一个文件
    // unlink('demo.js');
    // `fopen($filename, $mode)`打开文件

    // $fp = fopen('demo.js', 'w');
    // `ftruncate($handle, $size)`将文件截取指定长度
    // ftruncate($fp, 100);

    // 对文件内容的操作
    // `file_get_contents($filename)`获取文件内容
    // $content = file_get_contents('demo.js');
    // print_r($content);
    // `file_put_contents($filename, $data)`覆盖写入内容
    // file_put_contents('demo.js', 'abc');

    // `file($filename)`读取文件内容到数组中
    // $fileArr = file('demo.js');
    // print_r($fileArr);

    // `readfile($filename)`读取文件并写入到缓存
    // readfile('http://baidu.com');

    // `fopen($filename, $mode)`打开文件
    // `$mode`打开模式
    // r只读，将文件指针指向文件头
    // r+读写，将文件指针指向文件头
    // w只写，将文件指针指向文件头并将文件大小截为0，不存在则创建，也就是覆盖
    // w+读写，将文件指针指向文件头并将文件大小截为0，不存在则创建
    // a只写，将文件指针指向文件尾，不存在则创建，也就是追加
    // a+读写，将文件指针指向文件尾，不存在则创建
    // 读取二进制文件要加上b
    $fp = fopen('demo.js', 'r+');
    // `fwrite($handle, $string)`写入内容
    // fwrite($fp, 'bb\n');
    // `fgetc($handle)`获取一个字符
    // echo fgetc($fp);

    // feof($handle)文件出错或文件结尾变成假
    /* while (!feof($fp)) {
        // `fgets($handle)`一次读取一行
        echo fgets($fp);
    } */
    // `fread($handle, $length)`一次读取文件的长度
    echo fread($fp, 4);
    echo '<br>';
    // `ftell($handle)`读取指针位置
    echo ftell($fp);
    echo '<br>';
    // `fseek($handle, $offset)`移动指针到指定位置
    fseek($fp, 6);
    echo ftell($fp);
    echo '<br>';
    // `rewind($handle)`文件指针设置到文件开头
    rewind($fp);
    echo ftell($fp);
    echo '<br>';

    fclose($fp);
?>
```