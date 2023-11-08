import React from 'react'
import useSWR, { preload, useSWRConfig } from 'swr'

const fetcher = (url) => fetch(url).then((res) => res.json())
preload('https://jsonplaceholder.typicode.com/posts/', fetcher)

const PreloadDemo = () => {
	const { cache } = useSWRConfig()

	const { data, isValidating } = useSWR('https://jsonplaceholder.typicode.com/posts/', fetcher)
  
	if (isValidating) {
		return (
			<div>Loading....</div>
		)
	}

  return (
    <div>
			{
				data?.map(i => (
					<p>{i.title}</p>
				))
			}
		</div>
  )
}

export default PreloadDemo
