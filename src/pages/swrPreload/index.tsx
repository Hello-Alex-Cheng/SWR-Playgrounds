import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json())

const Demo = () => {
  const { data, error, isLoading } = useSWR('https://jsonplaceholder.typicode.com/posts/1', fetcher)
  if (error) return <div>failed to load</div>
  if (isLoading) return <div>loading...</div>

  return (
    <div>
      <h1>{data.title}!</h1>
    </div>
  )
}

export default Demo
