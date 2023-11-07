import { useEffect, useState } from 'react'
import useSWR, { Fetcher } from 'swr'

const fetcher: Fetcher<any, string> = url => fetch(url).then(res => res.json())

const usePersistentPolling = (url: string, interval: number) => {
  const [isOnLine, setIsOnline] = useState(navigator.onLine)

  const {
    data,
    error,
    isLoading,
    mutate,
  } = useSWR(url, fetcher, {
    refreshInterval: isOnLine ? interval : 0,
  })

  useEffect(() => {

    const handleOnline = () => {
      setIsOnline(true)
    }

    const handleOffline = () => {
      setIsOnline(false)
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    const intervalId = setInterval(() => {
      if (!isOnLine) {
        mutate()
      }
    }, interval)


    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)

      clearInterval(intervalId)
    }

  }, [isOnLine, interval, mutate])

  return { data, error, isOnLine, isLoading, mutate }
}

export default usePersistentPolling
