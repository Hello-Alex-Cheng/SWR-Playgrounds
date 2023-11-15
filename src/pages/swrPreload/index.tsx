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
