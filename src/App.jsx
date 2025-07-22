import { RouterProvider } from 'react-router-dom';
import {Routers} from './routes/Routers';
import './App.scss';
import { Suspense } from 'react';
import ComponentLoader from'./components/ComponentLoader'

function App() {
  return (
       <RouterProvider router={Routers}></RouterProvider>

  );
}

export default App;
