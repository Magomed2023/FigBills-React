import './App.css';
import {RouterProvider, createBrowserRouter} from "react-router-dom";
import Bill from './components/getBill/Bill';
import Add from './components/addBill/Add';
import Edit from './components/updateBill/Edit';
import Register from './components/getRegister/Register';
import Login from './components/getRegister/LogIn';




function App() {

  const route = createBrowserRouter([
    {
      path:"/",
      element: <Bill/>,
    },
    {
      path:"/add",
      element: <Add/>,
    },
    {
      path:"/edit/:id",
      element: <Edit/>,
    },
    {
      path:"/register",
      element: <Register/>,
    },
    {
      path:"/login",
      element: <Login/>,
    },
  ])

  return (
    <div className="App">
       <RouterProvider router={route}></RouterProvider>
    </div>
  );
}

export default App;
