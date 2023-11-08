import React, { useState } from 'react'
import { Input, Button, message } from 'antd'
import useSWRMutation from 'swr/mutation'
import useSWR, { useSWRConfig } from 'swr'
import styles from './index.module.less'

async function fetcher(...args) {
  const res = await fetch(...args)

	return res.json()
}

async function updateFetcher(url, {arg}) {
  const res = await fetch(url, {
    method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(arg)
  })

	if (res.status !== 201) {
		throw new Error('报错了')
	}

	return res.json()
}

const TodoList = () => {
	const [todo, setTodo] = useState('')
	const swrConfig = useSWRConfig()

	const { data = [], isValidating, mutate } = useSWR(
		'/api/todos',
		fetcher,
		{
			revalidateOnFocus: false,
			onSuccess(data, key, config) {
				console.log('on success', data, key)
			},
		}
	)


	const { trigger } = useSWRMutation('/api/todos', updateFetcher)

	const onAdd = async () => {
		if (!todo) return message.warning('请输入')

		const newTodo = {
			id: Date.now(),
			title: todo
		}

		/**@name 绑定mutate实现乐观UI */
		// mutate(updateFetcher('/api/todos', { arg: newTodo}), {
		// 	optimisticData: [...data, newTodo],
		// 	populateCache: newItem => {
		// 		return [...data, newItem]
		// 	},
		// 	rollbackOnError: err => {
		// 		console.log('err ', err.message)
		// 		// 返回一个布尔值判断是否应该回滚
		// 		return false
		// 	},
		// 	revalidate: false,
		// })

		/**@name trigger实现乐观UI */
		trigger(newTodo, {
			optimisticData: [...data, newTodo],
			populateCache: newItem => {
				// newItem 表示 post 请求成功后返回的 远端数据

				// 我们这里没有将 newItem 写入到缓存，
				// return [...data]
				return [...data, newItem]
			},
			rollbackOnError(err) {
				return true
			},
			revalidate: false,
		})
		setTodo('')
	}
	
	console.log('??data', data)
	console.log('??swrConfig', swrConfig)

  return (
    <div className={styles.wrapper}>
			<div className={styles.inputWraper}>
				<Input
					value={todo}
					style={{ width: '300px' }}
					onChange={e => setTodo(e.target.value)}
				/>
				<Button onClick={onAdd}>添加</Button>
			</div>

			{
				isValidating ? (
					<div className={styles.content}>
						<h1>Loading....</h1>
					</div>
				) : (
					<div className={styles.content}>
						{
							data?.length > 0 ? data?.map((i: any) => {
								return (
									<h1 key={i.id}>{i.title}</h1>
								)
							}) : (
								<div>暂无数据</div>
							)
						}
					</div>
				)
			}
    </div>
  )
}

export default TodoList
