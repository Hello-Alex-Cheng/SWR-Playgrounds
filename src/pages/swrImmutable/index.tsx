import useSWRImmutable from "swr/immutable";
import useSWR, {SWRConfig} from 'swr'
import {Suspense, useState} from 'react'


const fetcher = (url: string) => fetch(url).then((res) => res.json())

const Child = () => {
  const { data, error } = useSWRImmutable(`https://jsonplaceholder.typicode.com/users/${1}`, fetcher);

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

const Demo = () => {
  const [show, setShow] = useState(true)

  return (
    <SWRConfig value={{}}>
      <button onClick={() => setShow(!show)}>show Child</button>

      <Suspense fallback={<>Suspense Loading...</>}>
        {show && <Child />}
      </Suspense>

    </SWRConfig>
  )
}

export default Demo
