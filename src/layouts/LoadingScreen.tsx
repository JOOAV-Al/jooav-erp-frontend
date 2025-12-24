import CustomLoader from '@/components/CustomLoader'
import React from 'react'

const LoadingScreen = () => {
  return (
    <div className='flex justify-center items-center min-h-screen'>
      <CustomLoader />
    </div>
  )
}

export default LoadingScreen