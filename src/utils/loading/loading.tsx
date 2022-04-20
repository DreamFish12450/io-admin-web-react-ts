import React, { FC, useEffect } from 'react'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

const Loading: FC = () => {
  NProgress.configure({ showSpinner: false })
  NProgress.start()

  useEffect(() => {
    NProgress.done()
    // return function cleanup() {
    //   NProgress.done()
    // }
  }, [])

  return <div />
}

export default Loading
