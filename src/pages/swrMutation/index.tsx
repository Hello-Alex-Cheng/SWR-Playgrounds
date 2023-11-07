import useSWR from "swr";
import useSWRMutation from 'swr/mutation'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

const Demo = () => {
  const { data, error, trigger } = useSWRMutation('https://jsonplaceholder.typicode.com/posts/1', fetcher)

  return (
    <div>
      <h1>{data.title}!</h1>

      <button onClick={() => trigger()}>trigger</button>
    </div>
  )
}

export default Demo
