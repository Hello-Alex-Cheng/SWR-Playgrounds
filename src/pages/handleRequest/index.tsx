import { useState } from "react";
import useSWR, { mutate } from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json())

const Demo = () => {
  const [id, setId] = useState(1)

  const { data, error, isLoading } = useSWR(`https://jsonplaceholder.typicode.com/posts/${id}`, fetcher)
  if (error) return <div>failed to load</div>
  if (isLoading) return <div>loading...</div>

  return (
    <div>
      <h1>{data.title}!</h1>

      <button onClick={() => {
        mutate(`https://jsonplaceholder.typicode.com/posts/${id}`, data => {
          return {
            ...data,
            title: data.title.toUpperCase()
          }
        })
      }}>
        mutate
      </button>
    </div>
  )
}

export default Demo
