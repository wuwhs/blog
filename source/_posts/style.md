---
title: 前端代码规范
date: 2021-12-01 16:25:27
tags:
---

为了提升前端代码书写质量，减少 bug 率，本着”高效、快乐工作，不留坑“的宗旨。现制定 JavaScrip、ES6 和 Vue 单文件组件相关代码风格规范，请在项目中参考落实。

## Javascript 代码风格

### 使用有意义的变量名称

变量的名称应该是可描述，有意义的， JavaScript 变量都应该采用驼峰式大小写 ( camelCase) 命名。

```js
// bad ❌
const foo = 'JDoe@example.com';
const bar = 'John';
const age = 23;
const qux = true;

// good ✅
const email = 'John@example.com';
const firstName = 'John';
const age = 23;
const isActive = true;
```

布尔变量通常需要回答特定问题，例如：

```js
isActive;
didSubscribe;
hasLinkedAccount;
```

### 避免添加不必要的上下文

当对象或类已经包含了上下文的命名时，不要再向变量名称添加冗余的上下文。

```js
// bad ❌
const user = {
  userId: '296e2589-7b33-400a-b762-007b730c8e6d',
  userEmail: 'JDoe@example.com',
  userFirstName: 'John',
  userLastName: 'Doe',
  userAge: 23
};

user.userId;

//good ✅
const user = {
  id: '296e2589-7b33-400a-b762-007b730c8e6d',
  email: 'JDoe@example.com',
  firstName: 'John',
  lastName: 'Doe',
  age: 23
};

user.id;
```

### 避免硬编码值

```js
// bad ❌
setTimeout(clearSessionData, 900000);

//good ✅
const SESSION_DURATION_MS = 15 * 60 * 1000;

setTimeout(clearSessionData, SESSION_DURATION_MS);
```

### 使用有意义的函数名称

函数名称需要描述函数的实际作用，即使很长也没关系。函数名称通常使用动词，但返回布尔值的函数可能是个例外 — 它可以采用 `是或否` 问题的形式，函数名也应该是驼峰式的。

```js
// bad ❌
function toggle() {
  // ...
}

function agreed(user) {
  // ...
}

//good ✅
function toggleThemeSwitcher() {
  // ...
}

function didAgreeToAllTerms(user) {
  // ...
}
```

### 限制参数的数量

尽管这条规则可能有争议，但函数最好是有 3 个以下参数。如果参数较多可能是以下两种情况之一：

- 该函数做的事情太多，应该拆分。
- 传递给函数的数据以某种方式相关，可以作为专用数据结构传递。

```js
// bad ❌
function sendPushNotification(title, message, image, isSilent, delayMs) {
  // ...
}

sendPushNotification('New Message', '...', 'http://...', false, 1000);

//good ✅
function sendPushNotification({ title, message, image, isSilent, delayMs }) {
  // ...
}

const notificationConfig = {
  title: 'New Message',
  message: '...',
  image: 'http://...',
  isSilent: false,
  delayMs: 1000
};

sendPushNotification(notificationConfig);
```

### 避免在一个函数中做太多事情

一个函数应该一次做一件事，这有助于减少函数的大小和复杂性，使测试、调试和重构更容易。

```js
// bad ❌
function pingUsers(users) {
  users.forEach((user) => {
    const userRecord = database.lookup(user);
    if (!userRecord.isActive()) {
      ping(user);
    }
  });
}

//good ✅
function pingInactiveUsers(users) {
  users.filter(!isUserActive).forEach(ping);
}

function isUserActive(user) {
  const userRecord = database.lookup(user);
  return userRecord.isActive();
}
```

### 避免使用布尔标志作为参数

函数含有布尔标志的参数意味这个函数是可以被简化的。

```js
// bad ❌
function createFile(name, isPublic) {
  if (isPublic) {
    fs.create(`./public/${name}`);
  } else {
    fs.create(name);
  }
}

//good ✅
function createFile(name) {
  fs.create(name);
}

function createPublicFile(name) {
  createFile(`./public/${name}`);
}
```

### 避免写重复的代码

如果你写了重复的代码，每次有逻辑改变，你都需要改动多个位置。

```js
// bad ❌
function renderCarsList(cars) {
  cars.forEach((car) => {
    const price = car.getPrice();
    const make = car.getMake();
    const brand = car.getBrand();
    const nbOfDoors = car.getNbOfDoors();

    render({ price, make, brand, nbOfDoors });
  });
}

function renderMotorcyclesList(motorcycles) {
  motorcycles.forEach((motorcycle) => {
    const price = motorcycle.getPrice();
    const make = motorcycle.getMake();
    const brand = motorcycle.getBrand();
    const seatHeight = motorcycle.getSeatHeight();

    render({ price, make, brand, nbOfDoors });
  });
}

//good ✅
function renderVehiclesList(vehicles) {
  vehicles.forEach((vehicle) => {
    const price = vehicle.getPrice();
    const make = vehicle.getMake();
    const brand = vehicle.getBrand();

    const data = { price, make, brand };

    switch (vehicle.type) {
      case 'car':
        data.nbOfDoors = vehicle.getNbOfDoors();
        break;
      case 'motorcycle':
        data.seatHeight = vehicle.getSeatHeight();
        break;
    }

    render(data);
  });
}
```

### 避免副作用

在 `JavaScript` 中，你应该更喜欢函数式模式而不是命令式模式。换句话说，大多数情况下我们都应该保持函数纯洁。副作用可能会修改共享状态和资源，从而导致一些奇怪的问题。所有的副作用都应该集中管理，例如你需要更改全局变量或修改文件，可以专门写一个 `util` 来做这件事。

```js
// bad ❌
let date = '21-8-2021';

function splitIntoDayMonthYear() {
  date = date.split('-');
}

splitIntoDayMonthYear();

// Another function could be expecting date as a string
console.log(date); // ['21', '8', '2021'];

//good ✅
function splitIntoDayMonthYear(date) {
  return date.split('-');
}

const date = '21-8-2021';
const newDate = splitIntoDayMonthYear(date);

// Original vlaue is intact
console.log(date); // '21-8-2021';
console.log(newDate); // ['21', '8', '2021'];
```

另外，如果你将一个可变值传递给函数，你应该直接克隆一个新值返回，而不是直接改变该它。

```js
// bad ❌
function enrollStudentInCourse(course, student) {
  course.push({ student, enrollmentDate: Date.now() });
}

//good ✅
function enrollStudentInCourse(course, student) {
  return [...course, { student, enrollmentDate: Date.now() }];
}
```

### 使用非负条件

```js
// bad ❌
function isUserNotVerified(user) {
  // ...
}

if (!isUserNotVerified(user)) {
  // ...
}

//good ✅
function isUserVerified(user) {
  // ...
}

if (isUserVerified(user)) {
  // ...
}
```

### 尽可能使用简写

```js
// bad ❌
if (isActive === true) {
  // ...
}

if (firstName !== '' && firstName !== null && firstName !== undefined) {
  // ...
}

const isUserEligible = user.isVerified() && user.didSubscribe() ? true : false;

//good ✅
if (isActive) {
  // ...
}

if (!!firstName) {
  // ...
}

const isUserEligible = user.isVerified() && user.didSubscribe();
```

### 避免过多分支

尽早 `return` 会使你的代码线性化、更具可读性且不那么复杂。

```js
// bad ❌
function addUserService(db, user) {
  if (!db) {
    if (!db.isConnected()) {
      if (!user) {
        return db.insert('users', user);
      } else {
        throw new Error('No user');
      }
    } else {
      throw new Error('No database connection');
    }
  } else {
    throw new Error('No database');
  }
}

//good ✅
function addUserService(db, user) {
  if (!db) throw new Error('No database');
  if (!db.isConnected()) throw new Error('No database connection');
  if (!user) throw new Error('No user');

  return db.insert('users', user);
}
```

### 优先使用 map 而不是 switch 语句

既能减少复杂度又能提升性能。

```js
// bad ❌
const getColorByStatus = (status) => {
  switch (status) {
    case 'success':
      return 'green';
    case 'failure':
      return 'red';
    case 'warning':
      return 'yellow';
    case 'loading':
    default:
      return 'blue';
  }
};

//good ✅
const statusColors = {
  success: 'green',
  failure: 'red',
  warning: 'yellow',
  loading: 'blue'
};

const getColorByStatus = (status) => statusColors[status] || 'blue';
```

### 使用可选链接

```js
const user = {
  email: 'JDoe@example.com',
  billing: {
    iban: '...',
    swift: '...',
    address: {
      street: 'Some Street Name',
      state: 'CA'
    }
  }
};

// bad ❌
const email = (user && user.email) || 'N/A';
const street = (user && user.billing && user.billing.address && user.billing.address.street) || 'N/A';
const state = (user && user.billing && user.billing.address && user.billing.address.state) || 'N/A';

//good ✅
const email = user?.email ?? 'N/A';
const street = user?.billing?.address?.street ?? 'N/A';
const street = user?.billing?.address?.state ?? 'N/A';
```

### 避免回调

回调很混乱，会导致代码嵌套过深，使用 Promise 替代回调。

```js
// bad ❌
getUser(function (err, user) {
  getProfile(user, function (err, profile) {
    getAccount(profile, function (err, account) {
      getReports(account, function (err, reports) {
        sendStatistics(reports, function (err) {
          console.error(err);
        });
      });
    });
  });
});

//good ✅
getUser()
  .then(getProfile)
  .then(getAccount)
  .then(getReports)
  .then(sendStatistics)
  .catch((err) => console.error(err));

// or using Async/Await ✅✅

async function sendUserStatistics() {
  try {
    const user = await getUser();
    const profile = await getProfile(user);
    const account = await getAccount(profile);
    const reports = await getReports(account);
    return sendStatistics(reports);
  } catch (e) {
    console.error(err);
  }
}
```

### 处理抛出的错误和 reject 的 promise

```js
// bad ❌
try {
  // Possible erronous code
} catch (e) {
  console.log(e);
}

//good ✅
try {
  // Possible erronous code
} catch (e) {
  // Follow the most applicable (or all):
  // 1- More suitable than console.log
  console.error(e);

  // 2- Notify user if applicable
  alertUserOfError(e);

  // 3- Report to server
  reportErrorToServer(e);

  // 4- Use a custom error handler
  throw new CustomError(e);
}
```

### 只注释业务逻辑

```js
// bad ❌
function generateHash(str) {
  // Hash variable
  let hash = 0;

  // Get the length of the string
  let length = str.length;

  // If the string is empty return
  if (!length) {
    return hash;
  }

  // Loop through every character in the string
  for (let i = 0; i < length; i++) {
    // Get character code.
    const char = str.charCodeAt(i);

    // Make the hash
    hash = (hash << 5) - hash + char;

    // Convert to 32-bit integer
    hash &= hash;
  }
}

// good ✅
function generateHash(str) {
  let hash = 0;
  let length = str.length;
  if (!length) {
    return hash;
  }

  for (let i = 0; i < length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash;
}
```

## ES6 优化原生 JS（ES5） 代码风格

### 使用默认参数

```js
// bad ❌
function printAllFilesInDirectory(dir) {
  const directory = dir || './';
  //   ...
}

// good ✅
function printAllFilesInDirectory(dir = './') {
  // ...
}
```

### 对象结构取值

```js
const obj = {
  a: 1,
  b: 2,
  c: 3,
  d: 4,
  e: 5
};

// bad ❌
const f = obj.a + obj.d;
const g = obj.c + obj.e;

// good ✅
const { a, b, c, d, e } = obj;
const f = a + d;
const g = c + e;
```

`ES6` 的解构赋值虽然好用。但是要注意解构的对象不能为 `undefined`、`null`。否则会报错，故要给被解构的对象一个默认值。

```js
const { a, b, c, d, e } = obj || {};
```

### 拓展运算符合并数据

合并数组或者对象，用 ES5 的写法有些冗余

```js
const a = [1, 2, 3];
const b = [1, 5, 6];
const obj1 = {
  a: 1
};
const obj2 = {
  b: 1
};

// bad ❌
const c = a.concat(b); //[1,2,3,1,5,6]
const obj = Object.assign({}, obj1, obj2); // {a:1, b:1}

// good ✅
const c = [...new Set([...a, ...b])]; //[1,2,3,5,6]
const obj = { ...obj1, ...obj2 }; // {a:1, b:1}
```

### 拼接字符

```js
const name = '小明';
const score = 59;

// bad ❌
let result = '';
if (score > 60) {
  result = `${name}的考试成绩及格`;
} else {
  result = `${name}的考试成绩不及格`;
}

// good ✅
const result = `${name}${score > 60 ? '的考试成绩及格' : '的考试成绩不及格'}`;
```

### includes 替代多条件判断

```js
// bad ❌
f(
    type == 1 ||
    type == 2 ||
    type == 3 ||
    type == 4 ||
){
   //...
}

// good ✅
const condition = [1,2,3,4];

if( condition.includes(type) ){
   //...
}
```

### 列表查找某一项

```js
const a = [1, 2, 3, 4, 5];

// bad ❌
const result = a.filter((item) => {
  return item === 3;
});

// good ✅
const result = a.find((item) => {
  return item === 3;
});
```

### 数组扁平化

```js
// bad ❌
const deps = {
  采购部: [1, 2, 3],
  人事部: [5, 8, 12],
  行政部: [5, 14, 79],
  运输部: [3, 64, 105]
};
let member = [];
for (let item in deps) {
  const value = deps[item];
  if (Array.isArray(value)) {
    member = [...member, ...value];
  }
}
member = [...new Set(member)];

// good ✅
const member = Object.values(deps).flat(Infinity);
```

### 可选链操作符获取对象属性值

```js
// bad ❌
const name = obj && obj.name;

// good ✅
const name = obj?.name;
```

### 动态对象属性名

```js
// bad ❌
let obj = {};
let index = 1;
let key = `topic${index}`;
obj[key] = '话题内容';

// good ✅
obj[`topic${index}`] = '话题内容';
```

### 判断非空

```js
// bad ❌
if(value !== null && value !== undefined && value !== ''){
    //...
}

// good ✅
if((value??'') !== ''){
  //...
}
```

## Vue 组件风格

Vue 单文件组件风格指南内容节选自 [Vue 官方风格指南](https://v3.cn.vuejs.org/style-guide/)。

### 组件数据

组件的 data 必须是一个函数。

```js
// bad
export default {
  data: {
    foo: 'bar'
  }
};

// good
export default {
  data() {
    return {
      foo: 'bar'
    };
  }
};
```

### 单文件组件文件名称

单文件组件的文件名应该要么始终是单词大写开头 (PascalCase)，要么始终是横线连接 (kebab-case)。

```js
// bad
mycomponent.vue;
myComponent.vue;

// good
my - component.vue;
MyComponent.vue;
```

### 紧密耦合的组件名

和父组件紧密耦合的子组件应该以父组件名作为前缀命名。

```js
// bad
components/
|- TodoList.vue
|- TodoItem.vue
└─ TodoButton.vue

// good
components/
|- TodoList.vue
|- TodoListItem.vue
└─ TodoListItemButton.vue
```

### 自闭合组件

在单文件组件中没有内容的组件应该是自闭合的。

```html
<!-- bad -->
<my-component></my-component>

<!-- good -->
<my-component />
```

### Prop 名大小写

在声明 prop 的时候，其命名应该始终使用 camelCase，而在模板中应该始终使用 kebab-case。

```js
// bad
export default {
  props: {
    'greeting-text': String
  }
};

// good
export default {
  props: {
    greetingText: String
  }
};
```

```html
<!-- bad -->
<welcome-message greetingText="hi" />

<!-- good -->
<welcome-message greeting-text="hi" />
```

### 指令缩写

指令缩写，用 `:` 表示 `v-bind:` ，用 `@` 表示 `v-on:`

```html
<!-- bad -->
<input v-bind:value="value" v-on:input="onInput" />

<!-- good -->
<input :value="value" @input="onInput" />
```

### Props 顺序

标签的 Props 应该有统一的顺序，依次为指令、属性和事件。

```html
<my-component
  v-if="if"
  v-show="show"
  v-model="value"
  ref="ref"
  :key="key"
  :text="text"
  @input="onInput"
  @change="onChange"
/>
```

### 组件选项的顺序

组件选项应该有统一的顺序。

```js
export default {
  name: '',

  components: {},

  props: {},

  emits: [],

  setup() {},

  data() {},

  computed: {},

  watch: {},

  created() {},

  mounted() {},

  unmounted() {},

  methods: {}
};
```

### 组件选项中的空行

组件选项较多时，建议在属性之间添加空行。

```js
export default {
  computed: {
    formattedValue() {
      // ...
    },

    styles() {
      // ...
    }
  },

  methods: {
    onInput() {
      // ...
    },

    onChange() {
      // ...
    }
  }
};
```

### 单文件组件顶级标签的顺序

单文件组件应该总是让顶级标签的顺序保持一致，且标签之间留有空行。

```html
<template> ... </template>

<script>
  /* ... */
</script>

<style>
  /* ... */
</style>
```
