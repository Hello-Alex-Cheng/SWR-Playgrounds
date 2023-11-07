import { useState } from 'react'
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json())

const config = {
  // 自动重新验证
  // refreshInterval: 1000,

  // 网络重新连接时，重新验证
  // revalidateOnReconnect: true,

  // 组件挂载时，重新验证
  // revalidateOnMount: true

  // 窗口聚焦时，重新验证
  // focusThrottleInterval: 1000, // 设置短一点，更容易验证
  // revalidateOnFocus: true,

  // 窗口不可见时，轮询
  // refreshInterval: 1000,
  // refreshWhenHidden: true

  // 浏览器离线时，轮询?
  // refreshWhenOffline: true
}

/** @name swr-key变化时，重新验证 */
// const Child = () => {
//   const [postId, setPostId] = useState(1)

//   const { data, error, isLoading } = useSWR(
//     `https://jsonplaceholder.typicode.com/posts/${postId}`,
//     fetcher,
//   )

//   if (error) return <div>failed to load</div>
//   if (isLoading) return <div>loading...</div>
//   if (!data) return <div>暂无数据...</div>

//   // 渲染数据
//   return (
//     <>
//       <h1>{data?.title}</h1>

//       <button onClick={() => setPostId(postId + 1)}>修改title</button>
//     </>
//   )
// }


/** @name 组件挂载时，重新验证 */
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

const Demo = () => {
  // const [show, setShow] = useState(false)

  const { data, error, isLoading } = useSWR(
    'https://jsonplaceholder.typicode.com/posts/1',
    fetcher,
    config
  )
  if (error) return <div>failed to load</div>
  if (isLoading) return <div>loading...</div>
  // if (!data) return <div>暂无数据...</div>

  return (
    <div>
      <h1>{data.title}!</h1>
 
      {/* <>
        <button onClick={() => setShow(!show)}>show Child</button>

        {show && <Child />}
      </> */}
    </div>
  )
}

export default Demo
