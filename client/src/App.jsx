import './App.css'
import Login from './pages/login.jsx'
import Navbar from './components/navbar.jsx'
import HeroSection from './pages/student/HeroSection'
import { createBrowserRouter } from 'react-router-dom'
import MainLayout from './layout/MainLayout'
import { RouterProvider } from 'react-router'
import Cources from './pages/student/Cources'
import MyLearning from './pages/student/MyLearning'
import Profile from './pages/student/Profile'
import Sidebar from './pages/Sidebar'
import Dashboard from './pages/admin/Dashboard'
import CourceTable from './pages/admin/cource/CourceTable'
import AddCource from './pages/admin/cource/AddCource'
import EditCource from './pages/admin/cource/EditCource'
import CreateLecture from './pages/admin/lecture/CreateLecture'
import EditLecture from './pages/admin/lecture/EditLecture'
import CourceDetails from './pages/student/CourceDetails'
import CourceProgress from './pages/student/CourceProgress'


const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: (
          <>
            <HeroSection />
            <Cources />
          </>
        ),
      },
      {
        path: "login",
        element: (
          <Login />
        ),
      },
      {
        path: "my_learning",
        element: (
          <MyLearning />
        ),
      },
      {
        path: "profile",
        element: (
          <Profile />
        ),
      },
      { 
        path:"cource-details/:courceId",
        element:<CourceDetails/>
      },
      { 
        path:"cource-progress/:courceId",
        element:<CourceProgress/>
      },

      {
        path: "admin",
        element:<Sidebar/>,
        children:[
          {
            path:"dashboard",
            element:<Dashboard/>
          },
          {
            path:"cources",
            element:<CourceTable/>
          },
          {
            path:"cources/create",
            element:<AddCource/>
          },
          {
            path:"cources/:courceId",
            element:<EditCource/>
          },
          {
            path:"cources/:courceId/lecture",
            element:<CreateLecture/>
          },
          {
            path:"cources/:courceId/lecture/:lectureId",
            element:<EditLecture/>
          }

        ]
      },



    ],

  }
])

function App() {

  return (
    <main>
      <RouterProvider router={appRouter} />
    </main>
  )
}

export default App
