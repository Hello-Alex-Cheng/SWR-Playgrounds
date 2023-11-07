import { useState, Suspense } from 'react'
import useSWR from "swr";
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

const config: SWRConfiguration = {
  suspense: true,

  // 超时配置
  // loadingTimeout: 2000,
  // onLoadingSlow(key, config) {
  //   console.log('onLoadingSlow: ', key, config)
  // }

  // 请求未完成的初始化数据
  // fallbackData: {
  //   title: '这是默认数据....'
  // }

  // 请求未完成时，继续使用上一次缓存过的数据
  // keepPreviousData: true
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

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

function Demo() {
  const [show, setShow] = useState(true)

  return (
    <Suspense fallback={<>Suspense Loading...</>}>
      <Child />
    </Suspense>
  )
}

export default Demo
