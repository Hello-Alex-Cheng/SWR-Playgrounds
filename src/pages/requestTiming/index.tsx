import { useEffect, useState } from "react";
import useSWR from "swr";

const sleep = () => new Promise(r => setTimeout(r, 3000))

/**@name 慢请求 */
const fetcher1 = (url: string) => fetch(url).then(async (res) => {
  await sleep()
  return res.json()
})

const fetcher2 = (url: string) => fetch(url).then((res) => res.json())

/** @name 请求时序DEMO */

const Demo = () => {
  const [result, setResult] = useState(null)
  const { data  } = useSWR('https://jsonplaceholder.typicode.com/posts/1', fetcher1, {
    revalidateOnFocus: false,
  })
  const { data: data2, mutate } = useSWR('https://jsonplaceholder.typicode.com/posts/2', fetcher2, {
    revalidateOnFocus: false,
    revalidateOnMount: false
  })


  useEffect(() => {
    if (data) {
      setResult(data)
    }
  }, [data])

  useEffect(() => {
    if (data2) {
      setResult(data2)
    }
  }, [data2])


  return (
    <div>
      <h1>{result?.title}!</h1>

      <button onClick={() => mutate()}>POSTs 2</button>
    </div>
  )
}

export default Demo
