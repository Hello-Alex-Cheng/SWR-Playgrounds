import {useState, Suspense} from 'react'
import useSWR, { SWRConfig } from "swr";
import type { SWRConfiguration, SWRHook, Middleware, Fetcher } from 'swr'

// 中间件
const myMiddleware: Middleware = (useSWRNext: SWRHook) => {
  return (key, fetcher: Fetcher, config: SWRConfiguration) => {
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

const fetcher = (url: string) => fetch(url).then((res) => res.json())

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

const Demo = () => {
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

export default Demo
