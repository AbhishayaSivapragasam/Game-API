import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Signup from './Components/Signup';
import Login from './Components/Login';
import Home from './Components/Home';
import Play from './Components/Play';
import Profile from './Components/Profile';
import Settings from './Components/Settings';
import Leaderboard from './Components/Leaderboard';
import Levels from './Components/Levels';
import Cover from './Components/Cover';

// Define routes with future flags enabled
const router = createBrowserRouter(
  [
    { path: "/", element: <Cover /> },
    { path: "/home", element: <Home /> },
    { path: "/signup", element: <Signup /> },
    { path: "/login", element: <Login /> },
    { path: "/play", element: <Play /> },
    { path: "/profile", element: <Profile /> },
    { path: "/settings", element: <Settings /> },
    { path: "/leaderboard", element: <Leaderboard /> },
    { path: "/levels", element: <Levels /> },
  ],
  {
    future: {
      v7_startTransition: true,              // Smoother navigation using startTransition
      v7_relativeSplatPath: true,            // Updated relative splat resolution
      v7_skipActionErrorRevalidation: true,  // Skip revalidation after 4xx/5xx action errors
      v7_partialHydration: true,             // Opt-in to partial hydration
      v7_normalizeFormMethod: true,          // Normalize formMethod to uppercase
      v7_fetcherPersist: true,
      
    },
  }
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
