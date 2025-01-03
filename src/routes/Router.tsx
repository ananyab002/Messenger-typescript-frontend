import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LoginPage from "../pages/LoginPage/LoginPage";
import RegisterPage from "../pages/RegisterPage/RegisterPage";
import HomePage from "../pages/HomePage/HomePage"
import Chat from "../components/chat/Chat";


function Router() {
  const router = createBrowserRouter([
    {
      path: "/Messenger-typescript-frontend/",
      element: <LoginPage />,
    },
    {
      path: "/Messenger-typescript-frontend/register",
      element: <RegisterPage />,
    },
    {
      path: "/Messenger-typescript-frontend/messenger",
      element: <HomePage />,
      children: [
        {
          path: "/Messenger-typescript-frontend/messenger/:chatID",
          element: <Chat />,
        },
      ],
    },
  ]);
  return <RouterProvider router={router}></RouterProvider>;
}

export default Router;
