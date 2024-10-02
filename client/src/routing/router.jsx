import { Route, createBrowserRouter, createRoutesFromElements,RouterProvider } from 'react-router-dom'
import { Home} from '@/pages'
import App from '@/Initializer/App.jsx'
import { PageNotFound } from '@/components'

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path='/' element={<App />}>
            <Route
                path='/:categoryId?'
                element={<Home />} />
            <Route path='*' element={<PageNotFound />} />
        </Route>
    )
)

export {
    router,
    RouterProvider
}