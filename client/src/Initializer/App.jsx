import React, { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { setTheme } from '@/app/slices/themeSlice'
import { Toaster } from "@/components/ui/toaster"
import { TooltipProvider } from "@/components/ui/tooltip"
import { useDispatch, useSelector } from 'react-redux'

const App = () => {
  const theme= useSelector(state=>state.theme.theme)
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(setTheme())
  }, [dispatch]);
  return (
    <>
      <div className={`bg-repeat h-screen overflow-hidden ${theme==='dark'?'bg-black':'bg-white'}`}>
        <TooltipProvider>
          <div className='relative'>
            <main>
              <Outlet />
            </main>
          </div>
          <div className='absolute inset-x-0 bottom-0 flex justify-center m-10'>
            <div className='pointer-events-auto'>
            </div>
          </div>
          <Toaster />
        </TooltipProvider>
      </div>
    </>
  )
}

export default App
