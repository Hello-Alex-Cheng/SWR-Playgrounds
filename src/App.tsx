import { useState, Suspense } from 'react'

import Basic from './pages/basic'
import Revalidate from './pages/revalidate'
import OtherConfig from './pages/otherConfig'
import GlobalConfig from './pages/globalConfig'
import HandleRequest from './pages/handleRequest'
import SwrImmutable from './pages/swrImmutable'
import SwrMutation from './pages/swrMutation'
import PerfRequest from './pages/perfRequest'
import SwrPreload from './pages/swrPreload'
import SwrSubscription from './pages/swrSubscription'

function App() {

  return (
    <> 
      <Basic />
    </>
  )
}

export default App
