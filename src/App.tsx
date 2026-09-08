import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import type { RouteObject } from 'react-router-dom'
import { ArchiveShell } from './components/ArchiveShell.tsx'
import { AboutPage } from './pages/AboutPage.tsx'
import { ArchiveOpeningPage } from './pages/ArchiveOpeningPage.tsx'
import { CalendarPage } from './pages/CalendarPage.tsx'
import { HistoricalMomentPage } from './pages/HistoricalMomentPage.tsx'
import { NotFoundPage } from './pages/NotFoundPage.tsx'

const routes: RouteObject[] = [
  {
    element: <ArchiveShell />,
    children: [
      { path: '/', element: <ArchiveOpeningPage /> },
      { path: '/calendar', element: <CalendarPage /> },
      { path: '/event/:date', element: <HistoricalMomentPage /> },
      { path: '/about', element: <AboutPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]

const router = createBrowserRouter(routes)

function App() {
  return <RouterProvider router={router} />
}

export default App
