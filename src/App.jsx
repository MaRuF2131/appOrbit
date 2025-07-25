import { RouterProvider } from 'react-router-dom';
import {Routers} from './routes/Routers';
import './App.scss';


function App() {

  return (
       <RouterProvider router={Routers}></RouterProvider>

  );
}

export default App;
