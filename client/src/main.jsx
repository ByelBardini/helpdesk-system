import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Login from "./pages/Login.jsx";
import Home from "./pages/Home.jsx";
import Faq from "./pages/Faq.jsx";
import NovoChamado from "./pages/NovoChamado.jsx";
import Chamados from "./pages/Chamados.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import AdminLayout from "./pages/AdminLayout.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/home",
    element: <Home />,
  },
  {
    path: "/faq",
    element: <Faq />,
  },
  {
    path: "/novo-chamado",
    element: <NovoChamado />,
  },
  {
    path: "/chamados",
    element: <Chamados />,
  },
  {
    path: "/suporte/dashboard",
    element: (
      <AdminLayout>
        <Dashboard />
      </AdminLayout>
    ),
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
