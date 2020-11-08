---
title: 「超详笔记」算法——深度与广度优先（JS版）
date: 2020-11-08 18:14:40
tags: [algorithm, javascript]
---

## 深度优先搜索（Depth-First Search / DFS）

深度优先搜索，从起点出发，从规定的方向中选择其中一个不断地向前走，直到无法继续为止，然后尝试另外一种方向，直到最后走到终点。就像走迷宫一样，尽量往深处走。

DFS 解决的是连通性的问题，即，给定两个点，一个是起始点，一个是终点，判断是不是有一条路径能从起点连接到终点。起点和终点，也可以指的是某种起始状态和最终的状态。问题的要求并不在乎路径是长还是短，只在乎有还是没有。有时候题目也会要求把找到的路径完整的打印出来。

### DFS 遍历

例题：假设我们有这么一个图，里面有 `A、B、C、D、E、F、G、H` 8 个顶点，点和点之间的联系如下图所示，对这个图进行深度优先的遍历。

![dfs](/gb/algorithm-dfs-bfs/dfs.png)

### DFS 遍历解题思路

必须依赖栈（`Stack`），特点是后进先出（`LIFO`）。

第一步，选择一个起始顶点，例如从顶点 `A` 开始。把 `A` 压入栈，标记它为访问过（用红色标记），并输出到结果中。

![dfs-gif-1](/gb/algorithm-dfs-bfs/dfs-gif-1.gif)

第二步，寻找与 `A` 相连并且还没有被访问过的顶点，顶点 `A` 与 `B`、`D`、`G` 相连，而且它们都还没有被访问过，我们按照字母顺序处理，所以将 `B` 压入栈，标记它为访问过，并输出到结果中。

![dfs-gif-2](/gb/algorithm-dfs-bfs/dfs-gif-2.gif)

第三步，现在我们在顶点 `B` 上，重复上面的操作，由于 `B` 与 `A`、`E`、`F` 相连，如果按照字母顺序处理的话，`A` 应该是要被访问的，但是 `A` 已经被访问了，所以我们访问顶点 `E`，将 `E` 压入栈，标记它为访问过，并输出到结果中。

![dfs-gif-3](/gb/algorithm-dfs-bfs/dfs-gif-3.gif)

第四步，从 `E` 开始，`E` 与 `B`、`G` 相连，但是 `B` 刚刚被访问过了，所以下一个被访问的将是 `G`，把 `G` 压入栈，标记它为访问过，并输出到结果中。

![dfs-gif-4](/gb/algorithm-dfs-bfs/dfs-gif-4.gif)

第五步，现在我们在顶点 `G` 的位置，由于与 `G` 相连的顶点都被访问过了，类似于我们走到了一个死胡同，必须尝试其他的路口了。所以我们这里要做的就是简单地将 `G` 从栈里弹出，表示我们从 `G` 这里已经无法继续走下去了，看看能不能从前一个路口找到出路。

![dfs-gif-5](/gb/algorithm-dfs-bfs/dfs-gif-5.gif)

可以看到，每次我们在考虑下一个要被访问的点是什么的时候，如果发现周围的顶点都被访问了，就把当前的顶点弹出。

第六步，现在栈的顶部记录的是顶点 `E`，我们来看看与 `E` 相连的顶点中有没有还没被访问到的，发现它们都被访问了，所以把 `E` 也弹出去。

![dfs-gif-6](/gb/algorithm-dfs-bfs/dfs-gif-6.gif)

第七步，当前栈的顶点是 `B`，看看它周围有没有还没被访问的顶点，有，是顶点 `F`，于是把 `F` 压入栈，标记它为访问过，并输出到结果中。

![dfs-gif-7](/gb/algorithm-dfs-bfs/dfs-gif-7.gif)

第八步，当前顶点是 `F`，与 `F` 相连并且还未被访问到的点是 `C` 和 `D`，按照字母顺序来，下一个被访问的点是 `C`，将 `C` 压入栈，标记为访问过，输出到结果中。

![dfs-gif-8](/gb/algorithm-dfs-bfs/dfs-gif-8.gif)

第九步，当前顶点为 `C`，与 `C` 相连并尚未被访问到的顶点是 `H`，将 `H` 压入栈，标记为访问过，输出到结果中。

![dfs-gif-9](/gb/algorithm-dfs-bfs/dfs-gif-9.gif)

第十步，当前顶点是 `H`，由于和它相连的点都被访问过了，将它弹出栈。

![dfs-gif-10](/gb/algorithm-dfs-bfs/dfs-gif-10.gif)

第十一步，当前顶点是 `C`，与 `C` 相连的点都被访问过了，将 `C` 弹出栈。

![dfs-gif-11](/gb/algorithm-dfs-bfs/dfs-gif-11.gif)

第十二步，当前顶点是 `F`，与 `F` 相连的并且尚未访问的点是 `D`，将 `D` 压入栈，输出到结果中，并标记为访问过。

![dfs-gif-12](/gb/algorithm-dfs-bfs/dfs-gif-12.gif)

第十三步，当前顶点是 `D`，与它相连的点都被访问过了，将它弹出栈。以此类推，顶点 `F`，`B`，`A` 的邻居都被访问过了，将它们依次弹出栈就好了。最后，当栈里已经没有顶点需要处理了，我们的整个遍历结束。

![dfs-gif-13](/gb/algorithm-dfs-bfs/dfs-gif-13.gif)

### 走迷宫问题

给定一个二维矩阵代表一个迷宫，迷宫里面有通道，也有墙壁，通道由数字 `0` 表示，而墙壁由 `-1` 表示，有墙壁的地方不能通过，那么，能不能从 `A` 点走到 `B` 点。

![maze](/gb/algorithm-dfs-bfs/maze.png)

从 `A` 开始走的话，有很多条路径通往 `B`，例如下面两种。

![maze-gif-1](/gb/algorithm-dfs-bfs/maze-gif-1.gif)

![maze-gif-2](/gb/algorithm-dfs-bfs/maze-gif-2.gif)

### 走迷宫问题代码实现

递归方式实现

```js
// 迷宫：从起点到达设定终点，要求绕过中间设置的障碍
// 通过递归的方式实现

// 目标点
const target = [4, 2]

// 水平方向偏移量
const dx = function (d) {
  switch (d) {
    case 0:
      return 1
    case 1:
      return 0
    case 2:
      return -1
    case 3:
      return 0
  }
}

// 竖直方向偏移量
const dy = function (d) {
  switch (d) {
    case 0:
      return 0
    case 1:
      return 1
    case 2:
      return 0
    case 3:
      return -1
  }
}

// 是否在安全范围：未超界并且不在障碍上
const isSafe = function (maze, i, j) {
  return i >= 0 && i < maze.length && j >= 0 && j < maze[0].length && maze[i][j] !== -1
}

const dfs = function (maze, x, y) {
  // 第一步：判断是否找到B
  if (x === target[0] && y === target[1]) {
    return true
  }

  // 第二步：标记当前的点已经被访问过
  maze[x][y] = -1

  // 第三步：在四个方向上尝试
  for (let d = 0; d < 4; d++) {
    let i = x + dx(d)
    let j = y + dy(d)

    // 第四步：如果有一条路径被找到了，返回true
    if (isSafe(maze, i, j) && dfs(maze, i, j)) {
      return true
    }
  }
  return false
}

const maze = [
  [0, 0, 0, 0, 0, 0],
  [0, 0, -1, 0, 0, 0],
  [0, 0, -1, 0, 0, 0],
  [0, 0, -1, 0, 0, 0],
  [0, -1, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, -1]
]
console.log('dfs: ', dfs(maze, 0, 3)) // dfs: true
```

非递归方式实现

```js
// 非递归方式实现
// 目标点
const target = [4, 2]

// 水平方向偏移量
const dx = function (d) {
  switch (d) {
    case 0:
      return 1
    case 1:
      return 0
    case 2:
      return -1
    case 3:
      return 0
  }
}

// 竖直方向偏移量
const dy = function (d) {
  switch (d) {
    case 0:
      return 0
    case 1:
      return 1
    case 2:
      return 0
    case 3:
      return -1
  }
}

// 是否在安全范围：未超界并且不在障碍上
const isSafe = function (maze, i, j) {
  return i >= 0 && i < maze.length && j >= 0 && j < maze[0].length && maze[i][j] !== -1
}

const dfs = function (maze, x, y) {
  // 创建一个 Stack
  const stack = []

  // 将起始点压入栈，标记它访问过
  stack.push([x, y])
  maze[x][y] = -1

  while (stack.length) {
    // 取出当前点
    const pos = stack.pop()
    x = pos[0]
    y = pos[1]

    // 判断是否找到了目的地
    if (x === target[0] && y === target[1]) {
      return true
    }

    // 在四个方向上尝试
    for (let d = 0; d < 4; d++) {
      let i = x + dx(d)
      let j = y + dy(d)
      if (isSafe(maze, i, j)) {
        stack.push([i, j])
        maze[i][j] = -1
      }
    }
  }
  return false
}

const maze = [
  [0, 0, 0, 0, 0, 0],
  [0, 0, -1, 0, 0, 0],
  [0, 0, -1, 0, 0, 0],
  [0, 0, -1, 0, 0, 0],
  [0, -1, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, -1]
]
console.log('dfs: ', dfs(maze, 0, 3))
```

递归实现：

- 代码看上去很简洁；
- 实际应用中，递归需要压入和弹出栈，栈深的时候会造成运行效率低下。

非递归实现：

- 栈支持压入和弹出；
- 栈能提高效率。

### DFS 算法分析

`DFS` 是图论里的算法，分析利用 `DFS` 解题的复杂度时，应当借用图论的思想。图有两种表示方式：邻接表、邻接矩阵。假设图里有 `V` 个顶点，`E` 条边。

时间复杂度：

- 邻接表

  访问所有顶点的时间为 `O(V)`，而查找所有顶点的邻居一共需要 `O(E)` 的时间，所以总的时间复杂度是 `O(V + E)`。

- 邻接矩阵

  查找每个顶点的邻居需要 `O(V)` 的时间，所以查找整个矩阵的时候需要 `O(V2)` 的时间。

举例：利用 DFS 在迷宫里找一条路径的复杂度。迷宫是用矩阵表示。

解法：把迷宫看成是邻接矩阵。假设矩阵有 `M` 行 `N` 列，那么一共有 `M × N` 个顶点，因此时间复杂度就是 `O(M × N)`。

空间复杂度：

`DFS` 需要堆栈来辅助，在最坏情况下，得把所有顶点都压入堆栈里，所以它的空间复杂度是 `O(V)`，即 `O(M × N)`。

### DFS 寻找最短路径

思路 1：暴力法。

寻找出所有的路径，然后比较它们的长短，找出最短的那个。此时必须尝试所有的可能。因为 `DFS` 解决的只是连通性问题，不是用来求解最短路径问题的。

思路 2：优化法。

一边寻找目的地，一边记录它和起始点的距离（也就是步数）。
从某方向到达该点所需要的步数更少，则更新。

![dfs-gif-14](/gb/algorithm-dfs-bfs/dfs-gif-14.gif)

从各方向到达该点所需要的步数都更多，则不再尝试。

![dfs-gif-15](/gb/algorithm-dfs-bfs/dfs-gif-15.gif)

### DFS 寻找最短路径代码实现

```js
// 通过 DFS 算法求最短路径
// 记录每一步和起始点的距离
// 从某方向到达该点所需的步数更少，则更新。从各个方向到达该点所需要的步数都更多，则不再尝试

// 目标点
const target = [4, 2]

// 起点
const begain = [0, 3]

// 水平方向偏移量
const dx = function (d) {
  switch (d) {
    case 0:
      return 1
    case 1:
      return 0
    case 2:
      return -1
    case 3:
      return 0
  }
}

// 竖直方向偏移量
const dy = function (d) {
  switch (d) {
    case 0:
      return 0
    case 1:
      return 1
    case 2:
      return 0
    case 3:
      return -1
  }
}

// 是否在安全范围：未超界并且不在障碍上
const isSafe = function (maze, i, j) {
  return i >= 0 && i < maze.length && j >= 0 && j < maze[0].length && maze[i][j] !== -1
}

const solve = function (maze) {
  // 第一步，除了起始点外，其他点都用 MAX_VALUE 替代
  for (let i = 0; i < maze.length; i++) {
    maze[i].fill(Number.MAX_VALUE)
  }
  maze[begain[0]][begain[1]] = 0

  // 第二步，进行优化的 DFS 操作
  dfs(maze, ...begain)

  // 第三步，是否找到了目的地
  if (maze[target[0]][target[1]] < Number.MAX_VALUE) {
    console.log('shortest path count is: ', maze[target[0]][target[1]])
  } else {
    console.log('can not find target')
  }
}

const dfs = function (maze, x, y) {
  // 第一步，判断是否找到了目标点
  if (x === target[0] && y === target[1]) return

  // 第二步，在四个方向上尝试
  for (let d = 0; d < 4; d++) {
    let i = x + dx(d)
    let j = y + dy(d)

    // 判断下一个点的步数是否比目前的步数+1还要大
    if (isSafe(maze, i, j) && maze[i][j] > maze[x][y] + 1) {
      // 如果是，更新下一个点的步数，并继续 DFS 下去
      maze[i][j] = maze[x][y] + 1
      dfs(maze, i, j)
    }
  }
}

const maze = [
  [0, 0, 0, 0, 0, 0],
  [0, 0, -1, 0, 0, 0],
  [0, 0, -1, 0, 0, 0],
  [0, 0, -1, 0, 0, 0],
  [0, -1, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, -1]
]
solve(maze)
```

## 广度优先搜索（Breadth-First Search / BFS）

广度优先搜索，一般用来解决最短路径的问题。和深度优先搜索不同，广度优先的搜索是从起始点出发，一层一层地进行，每层当中的点距离起始点的步数都是相同的，当找到了目的地之后就可以立即结束。

广度优先的搜索可以同时从起始点和终点开始进行，称之为双端 BFS。这种算法往往可以大大地提高搜索的效率。

举例：在社交应用程序中，两个人之间需要经过多少个朋友的介绍才能互相认识对方。

解法：

- 只从一个方向进行 BFS，有时候这个人认识的朋友特别多，那么会导致搜索起来非常慢；

- 如果另外一方认识的人比较少，从这一方进行搜索，就能极大地减少搜索的次数；

- 每次在决定从哪一边进行搜索的时候，要判断一下哪边认识的人比较少，然后从那边进行搜索。

### BFS 遍历

例题：假设我们有这么一个图，里面有 `A、B、C、D、E、F、G、H` 8 个顶点，点和点之间的联系如下图所示，对这个图进行深度优先的遍历。

![bfs](/gb/algorithm-dfs-bfs/bfs.png)

### BFS 遍历解题思路

依赖队列（`Queue`），先进先出（`FIFO`）。

一层一层地把与某个点相连的点放入队列中，处理节点的时候正好按照它们进入队列的顺序进行。

第一步，选择一个起始顶点，让我们从顶点 `A` 开始。把 `A` 压入队列，标记它为访问过（用红色标记）。

![bfs-gif-1](/gb/algorithm-dfs-bfs/bfs-gif-1.png)

第二步，从队列的头取出顶点 `A`，打印输出到结果中，同时将与它相连的尚未被访问过的点按照字母大小顺序压入队列，同时把它们都标记为访问过，防止它们被重复地添加到队列中。

![bfs-gif-2](/gb/algorithm-dfs-bfs/bfs-gif-2.png)

第三步，从队列的头取出顶点 `B`，打印输出它，同时将与它相连的尚未被访问过的点（也就是 `E` 和 `F`）压入队列，同时把它们都标记为访问过。

![bfs-gif-3](/gb/algorithm-dfs-bfs/bfs-gif-3.png)

第四步，继续从队列的头取出顶点 `D`，打印输出它，此时我们发现，与 `D` 相连的顶点 `A` 和 `F` 都被标记访问过了，所以就不要把它们压入队列里。

![bfs-gif-4](/gb/algorithm-dfs-bfs/bfs-gif-4.png)

第五步，接下来，队列的头是顶点 `G`，打印输出它，同样的，`G` 周围的点都被标记访问过了。我们不做任何处理。

![bfs-gif-5](/gb/algorithm-dfs-bfs/bfs-gif-5.png)

第六步，队列的头是 `E`，打印输出它，它周围的点也都被标记为访问过了，我们不做任何处理。

![bfs-gif-6](/gb/algorithm-dfs-bfs/bfs-gif-6.png)

第七步，接下来轮到顶点 `F`，打印输出它，将 `C` 压入队列，并标记 `C` 为访问过。

![bfs-gif-7](/gb/algorithm-dfs-bfs/bfs-gif-7.png)

第八步，将 `C` 从队列中移出，打印输出它，与它相连的 `H` 还没被访问到，将 `H` 压入队列，将它标记为访问过。

![bfs-gif-8](/gb/algorithm-dfs-bfs/bfs-gif-8.png)

第九步，队列里只剩下 `H` 了，将它移出，打印输出它，发现它的邻居都被访问过了，不做任何事情。

![bfs-gif-9](/gb/algorithm-dfs-bfs/bfs-gif-9.png)

第十步，队列为空，表示所有的点都被处理完毕了，程序结束。

### 迷宫最短路径问题

运用广度优先搜索的算法在迷宫中寻找最短的路径。

### 迷宫最短路径问题解题思路

搜索的过程如下。

![bfs-gif-10](/gb/algorithm-dfs-bfs/bfs-gif-10.png)

从起始点 `A` 出发，类似于涟漪，一层一层地扫描，避开墙壁，同时把每个点与 `A` 的距离或者步数标记上。当找到目的地的时候返回步数，这个步数保证是最短的。

### 迷宫最短路径问题代码实现

```js
// 目标点
const target = [4, 2]

// 起点
const begain = [0, 3]

// 水平方向偏移量
const dx = function (d) {
  switch (d) {
    case 0:
      return 1
    case 1:
      return 0
    case 2:
      return -1
    case 3:
      return 0
  }
}

// 竖直方向偏移量
const dy = function (d) {
  switch (d) {
    case 0:
      return 0
    case 1:
      return 1
    case 2:
      return 0
    case 3:
      return -1
  }
}

// 是否在安全范围：未超界并且不在障碍上
const isSafe = function (maze, i, j) {
  return i >= 0 && i < maze.length && j >= 0 && j < maze[0].length && maze[i][j] !== -1
}

const bfs = function (maze, x, y) {
  const queue = []
  queue.push([x, y])

  while (queue.length) {
    // 从队列头取出当前点
    const pos = queue.shift()
    x = pos[0]
    y = pos[1]

    // 从四个方向进行 BFS
    for (let d = 0; d < 4; d++) {
      let i = x + dx(d)
      let j = y + dy(d)

      if (isSafe(maze, i, j)) {
        // 记录步数（标记访问过）
        maze[i][j] = maze[x][y] + 1
        // 然后添加到队列中
        queue.push([i, j])
        // 如果发现了目的地就返回
        if (i === target[0] && j === target[1]) return
      }
    }
  }
}

const maze = [
  [0, 0, 0, 0, 0, 0],
  [0, 0, -1, 0, 0, 0],
  [0, 0, -1, 0, 0, 0],
  [0, 0, -1, 0, 0, 0],
  [0, -1, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, -1]
]
bfs(maze, 0, 3)
console.log('shortest path count is: ', maze[target[0]][target[1]])
```

### BFS 算法分析

同样借助图论的分析方法，假设有 `V` 个顶点，`E` 条边。

时间复杂度：

- 邻接表

  每个顶点都需要被访问一次，时间复杂度是 `O(V)`；相连的顶点（也就是每条边）也都要被访问一次，加起来就是 `O(E)`。因此整体时间复杂度就是 `O(V+E)`。

- 邻接矩阵

  `V` 个顶点，每次都要检查每个顶点与其他顶点是否有联系，因此时间复杂度是 `O(V2)`。

举例：在迷宫里进行 `BFS` 搜索。

解法：用邻接矩阵。假设矩阵有 `M` 行 `N` 列，那么一共有 `M×N` 个顶点，时间复杂度就是 `O(M×N)`。

空间复杂度：

需要借助一个队列，所有顶点都要进入队列一次，从队列弹出一次。在最坏的情况下，空间复杂度是 `O(V)`，即 `O(M×N)`。
