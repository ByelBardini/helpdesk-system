import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { SocketListener } from "./SocketListener.jsx";

import Login from "./pages/Login.jsx";
import Home from "./pages/Home.jsx";
import Faq from "./pages/Faq.jsx";
import NovoChamado from "./pages/NovoChamado.jsx";
import Chamados from "./pages/Chamados.jsx";
import Compras from "./pages/Compras.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import AdminLayout from "./pages/AdminLayout.jsx";
import ChamadosSuporte from "./pages/ChamadosSuporte.jsx";
import Relatorios from "./pages/Relatorios.jsx";
import Usuarios from "./pages/Usuarios.jsx";
import Configuracoes from "./pages/Configuracoes.jsx";
import ComprasAdm from "./pages/ComprasAdm.jsx";
import Avisos from "./pages/Avisos.jsx";

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
    path: "/compras",
    element: <Compras />,
  },
  {
    path: "/suporte/dashboard",
    element: (
      <AdminLayout>
        <Dashboard />
      </AdminLayout>
    ),
  },
  {
    path: "/suporte/chamados",
    element: (
      <AdminLayout>
        <ChamadosSuporte />
      </AdminLayout>
    ),
  },
  {
    path: "/suporte/relatorios",
    element: (
      <AdminLayout>
        <Relatorios />
      </AdminLayout>
    ),
  },
  {
    path: "/suporte/compras",
    element: (
      <AdminLayout>
        <ComprasAdm />
      </AdminLayout>
    ),
  },
  {
    path: "/suporte/usuarios",
    element: (
      <AdminLayout>
        <Usuarios />
      </AdminLayout>
    ),
  },
  {
    path: "/suporte/avisos",
    element: (
      <AdminLayout>
        <Avisos />
      </AdminLayout>
    ),
  },
  {
    path: "/suporte/configuracoes",
    element: (
      <AdminLayout>
        <Configuracoes />
      </AdminLayout>
    ),
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <SocketListener>
      <RouterProvider router={router} />
    </SocketListener>
  </StrictMode>
);
