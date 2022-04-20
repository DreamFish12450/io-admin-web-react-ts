import React, { FC } from 'react'
import { useLocation } from 'react-router-dom'

const NotFound: FC = () => {
  const location = useLocation()

  return (
    <div>
      <h4 style={{ color: 'red' }}>
        No match for <code>{location.pathname}</code>
      </h4>
    </div>
  )
}

export default NotFound
