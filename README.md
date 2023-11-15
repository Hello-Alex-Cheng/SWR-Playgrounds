1.  **介绍 SWR 的基本概念**： 
   - SWR 名称的来源及其与 HTTP 缓存策略 "stale-while-revalidate" 的关系。
   - SWR 如何适应 React 数据获取的现代需求。
2.  **SWR 的主要特性以及使用案例**
   - 基本用法。
   - 自动重新验证。
   - 依赖请求的数据更新。
   - 本地缓存管理。
   - 重焦点时的数据刷新（如用户切换回标签页）。
   - 网络恢复时的数据刷新。
   - 轮询。
   - 其它配置。
   - 其它Hooks。
4.  **请求优化**： 
   - 缓存策略的重要性和 SWR 如何优化这一点。
   - 并发和请求去重。
   - 预加载数据以提高响应速度。
5.  **错误处理和加载状态**： 
   - 展示如何处理加载状态和错误。
   - 使用 SWR 的错误重试机制。
6.  **SWR缺点**
7.  **最佳实践**：
   - 如何避免和解决常见的陷阱和问题。

# SWR基本概念


### SWR 的定义和它的出现背景
SWR 是一个用于数据获取的 React Hooks 库，由 Vercel 团队开发，旨在简化数据依赖的 UI 组件的数据获取过程。"SWR" 这个名字代表 "stale-while-revalidate"，这是一种缓存无效化策略，它允许应用首先返回缓存（即可能是“陈旧”的）数据，然后再去异步获取更新的数据，并最终用新数据刷新 UI。

### stale-while-revalidate 策略

- **Stale（陈旧）**：当有请求发出时，SWR 首先返回的是缓存中的数据（如果可用），即使这些数据可能是过时的。
- **While（当）**：SWR 同时发起新的请求（revalidate）来获取最新的数据。
- **Revalidate（重新验证）**：当请求的新数据到达时，SWR 会用这些新数据更新应用的 UI。

### SWR 的关键特点

- **快速响应**：用户体验得到提升，因为应用立即显示缓存数据，而不是每次都等待请求的响应。
- **实时更新**：SWR 会自动重新获取数据，保持数据的最新状态。
- **缓存与重用**：它会缓存数据并在其他页面或组件重用这些数据，减少不必要的网络请求。
- **轻量级**：SWR 本身非常轻巧，不需要其他状态管理库的支持。
- **支持 SSR（服务器端渲染）**：它允许在服务器端预先获取数据，减少客户端加载时间。
- **内置功能**：SWR 内置了错误重试、分页和预加载等特性。
- **可配置性**：SWR 提供了丰富的配置选项，以满足不同的数据获取需求。

### SWR 的工作流程

1. **挂载组件时的数据获取**：当组件首次挂载时，SWR 会检查缓存中是否有数据，如果有，会立即返回缓存数据。
2. **后台数据更新**：无论是否有缓存数据，SWR 都会尝试重新获取数据来保证数据的新鲜。
3. **重新获取的触发条件**：可以配置 SWR 在特定事件（如窗口聚焦、网络重连、定时间隔等）时重新获取数据。

### SWR 使用场景

- **数据实时性要求高的应用**：如仪表板、聊天应用等。
- **需要服务器端渲染的应用**：为了首屏快速加载。
- **需要频繁更新数据的应用**：如股票市场、新闻网站等。

# **SWR 的使用案例和演示**
## 基本用法
```javascript
import useSWR from "swr";

function App() {
  const { data, error, isLoading } = useSWR('https://jsonplaceholder.typicode.com/posts/1', fetcher)
  if (error) return <div>failed to load</div>
  if (isLoading) return <div>loading...</div>

  return <h1>{data.title}!</h1>
}
```
## 重新验证

- 自动重新验证
- 网络重新连接时，重新验证
- 组件挂载时，重新验证
- 窗口聚焦时，重新验证
- swr key变化时，重新验证
- 窗口不可见时，轮询
- 浏览器离线时，轮询

### 自动重新验证（refreshInterval）

- 默认 disabled: refreshInterval = 0
- 如果设置为数字，轮询间隔（以毫秒为单位）
```javascript
const config = {
  refreshInterval: 1000
}

const { data, error, isLoading } = useSWR(
  'https://jsonplaceholder.typicode.com/posts/1',
  fetcher,
  config,
)
```

- 如果设置为函数，该函数将接收最新数据，并且应以毫秒为单位返回间隔
```javascript
const config = {
  refreshInterval: (data) => {
    console.log('data - -', data)
    return 1000
  }
}
```


### 网络重新连接时，重新验证
默认开启。浏览器恢复网络连接时自动重新验证（通过 navigator.onLine）
```javascript
const config = {
  revalidateOnReconnect: true,
}

const { data, error, isLoading } = useSWR(
  'https://jsonplaceholder.typicode.com/posts/1',
  fetcher,
  config,
)
```

### 组件挂载时，重新验证
```javascript
import type { SWRConfiguration } from 'swr'

const config: SWRConfiguration = {
  revalidateOnMount: true
}

const Child = () => {
  const { data, error, isLoading } = useSWR(
    'https://jsonplaceholder.typicode.com/posts/1',
    fetcher,
    config,
  )

  if (error) return <div>failed to load</div>
  if (isLoading) return <div>loading...</div>
  if (!data) return <div>暂无数据...</div>

  // 渲染数据
  return (
    <h1>{data?.title}</h1>
  )
}

function App() {
  const [show, setShow] = useState(false)
 
  return (
    <>
      <button onClick={() => setShow(!show)}>show Child</button>

      {show && <Child />}
    </>
  )
}
```

### 窗口聚焦时，重新验证

- focusThrottleInterval = 5000: 在一段时间内只重新验证一次（以毫秒为单位）
```javascript
const config: SWRConfiguration = {
  focusThrottleInterval: 1000, // 设置短一点，更容易验证
  revalidateOnFocus: true,
}
```

### swr key变化时，重新验证
```javascript
const Child = () => {
  const [postId, setPostId] = useState(1)

  const { data, error, isLoading } = useSWR(
    `https://jsonplaceholder.typicode.com/posts/${postId}`,
    fetcher,
  )

  if (error) return <div>failed to load</div>
  if (isLoading) return <div>loading...</div>
  if (!data) return <div>暂无数据...</div>

 
  // 渲染数据
  return (
    <>
      <h1>{data?.title}</h1>

      <button onClick={() => setPostId(postId + 1)}>修改title</button>
    </>
  )
}
```

### 窗口不可见时，轮询
refreshWhenHidden = false: 窗口不可见时进行轮询（如果启用了 refreshInterval）
```javascript
const config: SWRConfiguration = {
  refreshInterval: 1000,
  refreshWhenHidden: true
}

const { data, error, isLoading } = useSWR(
  `https://jsonplaceholder.typicode.com/posts/${postId}`,
  fetcher,
  config,
)

```

### 浏览器离线时，轮询?
并没有轮询，不过我们可以自己实现
```javascript
import { useEffect, useState } from 'react'
import useSWR, { Fetcher } from 'swr'

const fetcher: Fetcher<any, string> = url => fetch(url).then(res => res.json())

const usePersistentPolling = (url: string, interval: number) => {
  const [isOnLine, setIsOnline] = useState(navigator.onLine)

  const {
    data,
    error,
    isLoading,
    mutate,
  } = useSWR(url, fetcher, {
    refreshInterval: isOnLine ? interval : 0,
  })

  useEffect(() => {

    const handleOnline = () => {
      setIsOnline(true)
    }

    const handleOffline = () => {
      setIsOnline(false)
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    const intervalId = setInterval(() => {
      if (!isOnLine) {
        mutate()
      }
    }, interval)


    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)

      clearInterval(intervalId)
    }

  }, [isOnLine, interval, mutate])

  return { data, error, isOnLine, isLoading, mutate }
}

export default usePersistentPolling

```

使用

```javascript
const { data, error, isLoading } = usePersistentPolling(
  `https://jsonplaceholder.typicode.com/posts/${postId}`,
  1000
)
```

## 其它配置

### 搭配 Suspense 组件使用

`<Suspense>`组件 允许在子组件**完成加载前**展示后备方案。 swr 配置中，我们需要开启 'suspense'。点击修改 title，我们就能看到 Suspense Loading... 的后备方案。如果效果不明显，将浏览器网络速度调慢即可。
```tsx
const config: SWRConfiguration = {
  suspense: true,
}

const Child = () => {
  const [postId, setPostId] = useState(1)
  const { data, error, isLoading } = useSWR(
    `https://jsonplaceholder.typicode.com/posts/${postId}`,
    fetcher,
    config,
  )

  if (error) return <div>failed to load</div>
  if (isLoading) return <div>loading...</div>
  if (!data) return <div>暂无数据...</div>

  return (
    <>
      <h1>{data?.title}</h1>

      <button onClick={() => setPostId(postId + 1)}>修改title</button>
    </>
  )
}

function App() {
  const [show, setShow] = useState(true)

  return (
    <Suspense fallback={<>Suspense Loading...</>}>
      <Child />
    </Suspense>
  )
}

```

在 Suspense 模式下，**data 总是请求响应的结果**。（因此你无需检查它是否是 undefined）。但如果发生错误，则需要使用**ErrorBoundary**来捕获它。

**需要注意的是：**当它与条件请求或依赖请求一起使用时，如果请求被**暂停**，data 将会是 **undefined**。

当 `postId`等 3时，我们暂停请求。此时的 `data` 就是 `undefined`
```javascript
const Child = () => {

  const [postId, setPostId] = useState(1)

  const { data, error, isLoading } = useSWR(
    postId === 3 ? null : `https://jsonplaceholder.typicode.com/posts/${postId}`,
    fetcher,
    config,
  )
  
  if (error) return <div>failed to load</div>
  if (isLoading) return <div>loading...</div>

  console.log('data', data)

  return (
    <>
      <h1>{data?.title}</h1>

      <button onClick={() => setPostId(postId + 1)}>修改title</button>
    </>
  )
}
```


### 超时配置
```javascript
const config: SWRConfiguration = {
  loadingTimeout: 2000,
  onLoadingSlow(key, config) {
    console.log('onLoadingSlow: ', key, config)
  }
}
```

### 请求未完成的初始化数据
需要注意的是，我这里将 `isLoading`的判断去掉了，那是因为请求未完成时，组件一直处于 loading 状态，看不到初始化数据。
```javascript
const config: SWRConfiguration = {
  fallbackData: {
    title: '这是默认数据....'
  }
}

const Child = () => {
  const [postId, setPostId] = useState(1)
  const { data, error, isLoading } = useSWR(
    `https://jsonplaceholder.typicode.com/posts/${postId}`,
    fetcher,
    config,
  )
  
  if (error) return <div>failed to load</div>
  // if (isLoading) return <div>loading...</div>

  return (
    <>
      <h1>{data?.title}</h1>

      <button onClick={() => setPostId(postId + 1)}>修改title</button>
    </>
  )
}

```

### 请求未完成时，继续使用上一次缓存过的数据
当我们调用接口时，不希望文档流来回抖动，可以使用这个配置。你会发现，原来的数据不会被清空，请求成功之后，直接替换掉老数据。
```javascript

const config: SWRConfiguration = {
  keepPreviousData: true
}

const Child = () => {
  const [postId, setPostId] = useState(1)
  const { data, error, isLoading } = useSWR(
    `https://jsonplaceholder.typicode.com/posts/${postId}`,
    fetcher,
    config,
  )
  
  if (error) return <div>failed to load</div>

  return (
    <>
      <h1>{data?.title}</h1>

      <button onClick={() => setPostId(postId + 1)}>修改title</button>
    </>
  )
}
```

### 暂停请求
用于暂停所有数据请求，如果返回值为 true，请求的数据和错误都会被忽略，初始值为true时请求也不会发出去。默认返回值为 false。
```javascript
const { data, error, isLoading } = useSWR(
  `https://jsonplaceholder.typicode.com/posts/${postId}`,
  fetcher,
  {
    ...config,
    isPaused() {
      return true
    }
  },
)
```

### 中间件
```javascript
const myMiddleware: Middleware = (useSWRNext: SWRHook) => {
  return (key, fetcher, config) => {
    // hook 运行之前...

    // 将日志记录器添加到原始 fetcher。
    const extendedFetcher = (...args) => {
      console.log('SWR Request:', key)
      return fetcher(...args)
    }
 
    // 处理下一个中间件，如果这是最后一个，则处理 `useSWR` hook。
    const swr = useSWRNext(key, extendedFetcher, config)
 
    // hook 运行之后...
    // 可以在这里处理下响应结果 ==== swr.data
    console.log('运行之后 ', swr)
    return swr
  }
}
```

## 全局配置 SWRConfig
```jsx
import { SWRConfig } from 'swr';

function App() {
  const [show, setShow] = useState(true)

  return (
    <SWRConfig value={{
      use: [myMiddleware]
    }}>
      <button onClick={() => setShow(!show)}>show Child</button>

      <Suspense fallback={<>Suspense Loading...</>}>
        {show && <Child />}
      </Suspense>

    </SWRConfig>
  )
}
```

## 手动触发请求
SWR 提供了 **mutate** 和 **useSWRMutation** 两个 API 用于更改远程数据及相关缓存。

1. 全局 mutate

必须指定 key。第二个参数是**立即使用的数据（也可以是函数）**，待 mutate 数据拿到之后，会替换掉传入的数据。
```tsx

<button onClick={() => {
  mutate(`https://jsonplaceholder.typicode.com/posts/${1}`, data => {
    return {
      ...data,
      title: data.title.toUpperCase()
    }
  })
}}>
  global mutate
</button>


```

2. 绑定数据更改（**局部 mutate**）。和全局的 mutate 不同的是，不需要传递 key。
```javascript
const { data, error, isLoading, mutate: mutatePost } = useSWR(
  `https://jsonplaceholder.typicode.com/posts/${postId}`,
  fetcher,
  config
)

<button onClick={() => {
  mutatePost({
    title: '默认数据'
  })
}}>local mutate</button>
```

## useSWRImmutable
如果资源是**不可变的**，即使我们再怎么重新请求也永远不会发生任何改变，那么我们可以禁用它的所有的自动重新请求。<br />从 1.0 版本开始，SWR 提供了一个辅助 hook useSWRImmutable 来标记资源为不可变的：
```javascript
const {data, mutate} = useSWR(key, fetcher, {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false
})
 
// 相当于
const {trigger} = useSWRImmutable(key, fetcher)
```

它具有与 useSWR hook 完全相同的 API，但它永远不会在浏览器标签页获得焦点或网络恢复时重新请求。
```javascript
const { data, error, mutate, isValidating } = useSWRImmutable(
  `https://jsonplaceholder.typicode.com/users/${1}`,
  fetcher,
  {
    revalidateOnMount: false, // 组件挂载时，不发送请求
  }
);
```
还有一个新选项 **revalidateIfStale(即使存在陈旧数据，也自动重新验证)**，可以使用它来精确地控制行为。
```tsx
const Child = () => {
  const { data, error } = useSWR(['https://worldtimeapi.org/api/timezone/Etc/UTC'], fetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false, // 为了测试方便，避免焦点变化时重新验证
    revalidateOnReconnect: false, // 网络恢复连接时不重新验证
  });

  // 处理加载状态和错误状态
  if (!data) return <div>Loading...</div>;
  if (error) return <div>Failed to load</div>;


  // 渲染数据
  return (
    <>
      <h1>{data.datetime}</h1>
    </>
  )
}

function App() {
  const [show, setShow] = useState(true)

  return (
    <SWRConfig value={{
      use: [myMiddleware]
    }}>
      <button onClick={() => setShow(!show)}>show Child</button>

      <Suspense fallback={<>Suspense Loading...</>}>
        {show && <Child />}
      </Suspense>

    </SWRConfig>
  )
}
```
当我们点击 button，隐藏了 Child 组件，再显示它，会发现Child组件不会再发送请求了，而是使用的缓存数据。

## useSWRMutation
SWR 还提供了 useSWRMutation 作为一个远程数据更改的 hook。远程数据更改只能手动触发，而不像 useSWR 那样会自动触发。
```tsx
import useSWRMutation from 'swr/mutation'
 
// 实现 fetcher
// 额外的参数可以通过第二个参数 `arg` 传入
// 在下例中，`arg` 为 `'my_token'`
async function fechter(url, { arg }) {
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${arg}`
    }
  })

  return res.json()
}
 
// 组件中使用
const Basic = () => {
  const { trigger: mutationTrigger } = useSWRMutation(`https://jsonplaceholder.typicode.com/users/${8}`, fechter)

  return (
    <Button onClick={() => {
      mutationTrigger('my_token')
    }}>
      mutation trigger
    </Button>
  )
}
```

第三个参数：options(可选的对象)
- optimisticData：用于立即更新客户端缓存的数据，或是一个接受当前数据并返回新的客户端缓存数据的函数，通常用于乐观 UI。
- revalidate = true：一旦异步更新完成，重新验证缓存。
- populateCache = true：将远程数据更改的结果写入缓存，或者将接收新结果和当前结果作为参数并返回数据更改结果的函数。
- rollbackOnError = true：如果远程数据更改失败，缓存会回滚。或者接受一个函数，它接收从 fetcher 抛出的错误作为参数，并返回一个布尔值判断是否应该回滚。
- throwOnError = true：数据更改失败时抛出错误。
- onSuccess(data, key, config):　远程数据更改完成时的回调函数
- onError(err, key, config): 远程数据更改返回错误时的回调函数

## useSWRMutation 的主要特性

这不仅是 useSWRMutation 的特性，像 全局 mutate 和 绑定数据的 mutate 都具备这样的能力。

为了更好的验证这些属性，搭一个简易的 TodoList 服务端。

```js
const express = require('express');
const app = express();

// 存储Todo列表的数组
const todos = [];
// 解析请求体中的JSON数据
app.use(express.json());

app.post('/todos', (req, res) => {
  const todo = req.body;
  if (Math.random() < 0.5) {
    res.status(500).json({ error: '系统异常' });
  } else {
    todos.push(todo);
    res.status(201).json(todo)
  }
  // todos.push(todo);
  // res.status(201).json(todo)
});

// 查询所有todo的接口
app.get('/fetch/todos', (req, res) => {
  res.json(todos);
});

// 启动服务
app.listen(8888, () => {
  console.log('Server is running on port 8888');
});
```

同时别忘了前端配置代理

```js
server: {
  cors: true,
  proxy: {
    '/api': {
      target: 'http://localhost:8888/',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api/, ''),
    },
  }
}
```

### 延迟加载数据
你也可以使用 useSWRMutation 来加载数据。useSWRMutation 在 trigger 被调用之前永远不会开始请求，所以你可以推迟到真正需要时再加载数据。


```js
import { useState } from 'react'
import useSWRMutation from 'swr/mutation'

const fetcher = url => fetch(url).then(res => res.json())

const Page = () => {
  const [show, setShow] = useState(false)
  // 直到 trigger 被调用前，data 都为 undefined 
  const { data, trigger } = useSWRMutation(`https://jsonplaceholder.typicode.com/users/${8}`, fetcher);

  return (
    <div>
      <button onClick={() => {
        trigger();
        setShow(true);
      }}>Show User</button>
      {show && data ? <div>{data.name}</div> : null}
    </div>
  );
}
```

### 乐观更新

很多情况下，应用本地的数据更改是一个让用户感觉页面反馈快速的好方法——不需要等待远程数据源。

如果我们的远程突变接口，成功之后会返回最新的数据，我们也可以直接显示这个结果（而不是开始一个新的重新验证）。

首先我们先通过 useSWR 去获取 todolist 列表

```js
async function fetcher(...args) {
  const res = await fetch(...args)
	return res.json()
}

const { data = [], isValidating, mutate } = useSWR(
  '/api/todos',
  fetcher,
  {
    revalidateOnFocus: false, // 关闭聚焦时重新验证，便于观察后续操作
  }
)
```

这时，我们应该是可以获取 todolist 数据了。

然后我们需要一个 post 方法，来实现远程数据突变。绑定 key 的 mutate 第一个参数可以接受一个异步处理函数。

```js
async function updateFetcher(url, payload) {
  const res = await fetch(url, {
    method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(arg)
  })

	if (res.status !== 201) {
		throw new Error('报错了')
	}

	return res.json()
}
```

异步处理函数有了之后，我们就来实现乐观UI的逻辑部分。

```js
const onAdd = async () => {
  if (!todo) return message.warning('请输入')

  const newTodo = {
    id: Date.now(),
    title: todo
  }

  mutate(updateFetcher('/api/todos', newTodo), {
    optimisticData: [...data, newTodo], // 立即更新，待请求完成后，获取缓存数据
    populateCache: newItem => { // 这里可以决定是否要将最新的数据写入缓存
      return [...data, newItem]
    },
    rollbackOnError: err => {
      // 返回一个布尔值判断是否应该回滚
      return false
    },
    revalidate: false,
  })
  setTodo('')
}
```

*使用 相同时，useSWRMutation 的trigger 方法也一样*

我使用 useSWRMutation 的 trigger 来触发 post 请求，当 key 相同时，useSWRMutation 与 useSWR 共享一个缓存空间。

可以使用 `useSWRConfig` 来查看配置信息
```js
import useSWR, { useSWRConfig } from 'swr'

//...
const swrConfig = useSWRConfig()
```

在使用乐观更新的功能时，我们需要知道它的一些配置属性。来看看 trigger 支持一些什么参数：

- key: 与 mutate 的 key 相同
- fetcher(key, { arg })：一个用于远程数据更改的异步函数
- options：一个可选的对象，包含了下列属性：
  - optimisticData：与 mutate 的 optimisticData 相同
  - revalidate = true：与 mutate 的 revalidate 相同
  - populateCache = false：与 mutate' 的 populateCache 相同 ，但默认值为 false
  - rollbackOnError = true：与 mutate 的 rollbackOnError 相同
  - throwOnError = true： 与 mutate' 的 throwOnError 相同
  - onSuccess(data, key, config):　远程数据更改完成时的回调函数
  - onError(err, key, config): 远程数据更改返回错误时的回调函数


实现乐观更新，主要是使用到了 `optimisticData` 和 `populateCache` 属性。

实现如下：

```js
// todolist 添加按钮

const onAdd = async () => {
  if (!todo) return message.warning('请输入')

  const newTodo = {
    id: Date.now(),
    title: todo
  }

  /**@name trigger实现乐观UI */
  trigger(newTodo, {
    optimisticData: [...data, newTodo],
    populateCache: newItem => {
      // newItem 表示 post 请求成功后返回的 远端数据

      // 我们这里没有将 newItem 写入到缓存，
      // return [...data]
      return [...data, newItem]
    },
    rollbackOnError(err) {
      return true
    },
    revalidate: false,
  })

  setTodo('')
}
```

`optimisticData` 表示立即更新当前数据，渲染到页面上。由于 `revalidate` 被我们设置为了 false，`useSWR('/api/todos')` 并没有重新验证。

因为我们没有将 最新的数据，写入到缓存中，所以待请求成功后，会从缓存中获取数据，此时的 optimisticData 设置的数据就无效了，所以页面上又会回到添加 todo 之前的样子。

### 在数据更改成功后，更新缓存
有时远程数据更改的请求会直接返回更新后的数据，因此不需要发送额外的请求来加载它。 你可以启用 populateCache 选项，用数据更改的响应来更新 useSWR 的缓存。

在乐观更新中，我们没有将远程数据写入缓存，页面上首先会展示最新的 todo，待请求成功后又会回到初始状态。

我们这里将远端数据写入缓存

```js
trigger(newTodo, {
  optimisticData: [...data, newTodo],
  populateCache: newItem => {
    return [...data, newItem]
  },
  revalidate: false,
})
```

当请求成功，页面上就会展示最新的 todolist。并没有重新验证。

### 错误回滚
当你设置了optimisticData 选项时，有可能在乐观数据展示给用户后，远程数据更改却失败了。在这种情况下，你可以启用rollbackOnError，将本地缓存恢复到之前的状态，确保用户看到的是正确的数据。

```js
trigger(newTodo, {
  optimisticData: [...data, newTodo],
  populateCache: newItem => {
    return [...data, newItem]
  },
  rollbackOnError(err) {
    // 返回一个布尔值判断是否应该回滚
    return true
  },
  revalidate: false,
})
```

## 预请求
预加载数据可以极大地改善用户体验。如果你知道某个资源稍后将在应用程序被使用，那么你可以使用新的 preload API 提前开始请求它。

需要注意的是，SWR 的预请求功能并不会直接将预请求的数据存储在 SWR 的缓存对象中。预请求只是在后台发起请求，以获取数据并缓存在浏览器的 HTTP 缓存中。这样做是为了确保当实际使用该数据的时候，可以从缓存中获取，以提高性能。

```js
import React, { useEffect, useState } from 'react'
import useSWR, { preload, useSWRConfig } from 'swr'

const apiKey = 'https://jsonplaceholder.typicode.com/posts/'

const fetcher = (url) => fetch(url).then((res) => res.json())

const Child = ({prefetchData}: {prefetchData: Array<any>}) => {

	const { data, isValidating } = useSWR(apiKey, fetcher, {
		revalidateOnMount: false,
		revalidateOnFocus: false,
    		fallbackData: prefetchData
	})
  
	if (isValidating) {
	  return (
	    <div>Loading....</div>
	  )
	}

  return (
    <div>
      <h1>Child Component</h1>
      {
	data?.map(i => (
	  <p key={i.id}>{i.title}</p>
	))
      }
    </div>
  )
}

const PreloadDemo = () => {
  const [show, setShow] = useState(false)
  const [prefetchData, setPrefetchData] = useState([])
  const config = useSWRConfig()

  /** @name 直接向cache对象中写入数据  */
  // config.cache.set('https://jsonplaceholder.typicode.com/posts/', {
  //   data: [{ title: 123, id: 1 }],
  //   error: false,
  //   isValidating: false,
  //   isLoading: false,
  // })

  const onPreloadData = async () => {

    const prefetchData = await preload(apiKey, fetcher)

    console.log('prefetchData ', prefetchData)
    setPrefetchData(prefetchData)
  }

  useEffect(() => {
    onPreloadData()
  }, [])

  return (
    <div>
      <h1>SWR PRELOAD</h1>
      <p>
        <button onClick={() => setShow(!show)}>SHOW CHILD</button>
      </p>

      {show && <Child prefetchData={prefetchData} />}
    </div>
  )
}

export default PreloadDemo

```

在这个例子中， preload API 在全局作用域中被调用。这意味着我们在组件开始渲染之前就开始预加载资源。 当组件被渲染时，数据可能已经可用。如果它还在进行中，useSWR 钩子将复用那个正在进行的预加载请求，而不是启动一个新的请求。

当然，我们也可以在组件内部请求，毕竟很多接口是需要携带参数的。

```js
useEffect(() => {
  preload('/api/user?id=' + userId, fetcher)
}, [userId])
```

# SWR缺点

1. 全局 key 命名问题

2. 未提供请求中断的 API

请求的时序问题中，用户操作页面两次，先后发出了请求 1 和请求 2，用户期望页面展示请求 2 的数据，但页面却展示了请求 1 的数据。请求 2 发出时如果请求 1 没有结束，最好的处理方式是将请求 1 进行终止，避免资源浪费，类似 axios 的取消机制。可惜目前 useSWR 并没有提供终止请求的方法。

```js
import axios from 'axios';

// 创建一个 CancelToken 实例
const cancelTokenSource = axios.CancelToken.source();

// 发起请求
axios.get('/api/data', { cancelToken: cancelTokenSource.token })
  .then(response => {
    // 请求成功的处理逻辑
  })
  .catch(error => {
    // 请求错误的处理逻辑
    if (axios.isCancel(error)) {
      console.log('请求已被取消：', error.message);
    } else {
      console.log('请求发生错误：', error.message);
    }
  });

// 在需要取消请求的时候调用 cancel 方法
cancelTokenSource.cancel('请求被取消');
```

`fetch` 也可以实现请求取消，使用原生 API `AbortController`。 [GO](https://hello-alex-cheng.github.io/post/abort-controller.html)

3. 未提供 getter 方法读取数据

useSWR 只有通过它提供的 Hook 才能访问到数据，没有提供一个 getter 方法通过 key 获取数据。这在复杂的更新逻辑中还是很需要的，类似于 Redux 的 getState 方法，在任何地方需要某个全局数据时，调一下就拿到数据的当前值了，非常方便。

4. 需要手动删除不使用的缓存

目前所有 key 对应的响应结果都没有被删除，为了避免内存泄漏，需要开发人员主动清理缓存

# 最佳实践

## 封装请求，统一管理代码

将使用 useSWR 请求的代码提取为单独的 Hook，以便多个组件进行复用，像前面实现的 useData 一样。如果将同 key 的请求放在不同的位置，就可能导致各个地方给 useSWR 调用时传的 fetcher 和 config 不同，导致莫名其妙的问题。
js复制代码

```js
// 不推荐将同 key 的请求分散到各处
// 比如下面两个 fetcher 函数的返回值就不同
function CompA() {
  const { data } = useSWR("/api/data", async () => {
    await new Promise(r => setTimeout(r, 500))
    return "xxxx"
  })
  return <div>组件A：{data || "-"}</div>
}

function CompB() {
  const { data } = useSWR("/api/data", async () => {
    await new Promise(r => setTimeout(r, 500))
    return "xxxxxx"
  })
  return <div>组件B：{data || "-"}</div>
}

```

## 预加载
比如说，用户滑动到某个按钮上，那么用户下一步的动作大概率是需要点击按钮的，在用户滑动到按钮上时我们就可以预先加载资源，当弹窗出来后用户就能很快的看到数据了，而不是让用户苦苦的等待弹窗后页面白屏一段时间。

```js
function App({ userId }) {
  const [show, setShow] = useState(false)

  return (
    <div>
      <button
        onClick={() => setShow(true)}
        onMouseEnter={() => preload('/api/user?id=' + userId, fetcher)}
      >
        Show User
      </button>
      {show ? <User /> : null}
    </div>
  )
}
```

## 多个参数

```javascript

！！！错误示范：

useSWR('/api/user', url => fetchWithToken(url, token))
```

因为数据的标识符（也是缓存 key）是 '/api/user'，所以即使 token 变了，SWR 仍然会使用相同的 key 并返回错误的数据。


```js
const { data: user } = useSWR(['/api/user', token], ([url, token]) => {
   fetchWithToken(url, token) 
})
```

## 错误处理

最好是设置全局的 onError 回调函数，并打印 err 或将 err 上传至 Sentry，方便我们定位问题。

## 清理 Cache 避免内存泄漏

```js
const { cache } = useSWRConfig()

const { data, isValidating} = useSWR(
  'https://jsonplaceholder.typicode.com/posts/',
    fetcher,
    {
      revalidateOnFocus: false,
    }
  )

  if (isValidating) {
    return (
      <div>Loading....</div>
    )
  }

  // cache.delete('https://jsonplaceholder.typicode.com/posts/')

  return (
  <div>
    {
      data?.map(i => (
        <p>{i.title}</p>
      ))
    }
  </div>
)
```
