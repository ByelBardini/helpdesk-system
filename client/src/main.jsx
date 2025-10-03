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
import ChamadosSuporte from "./pages/ChamadosSuporte.jsx";
import Relatorios from "./pages/Relatorios.jsx";
import Usuarios from "./pages/Usuarios.jsx";
import Configuracoes from "./pages/Configuracoes.jsx";
import ComprasAdm from "./pages/ComprasAdm.jsx";
import Avisos from "./pages/Avisos.jsx";
import Perguntas from "./pages/Perguntas.jsx";

import AdminLayout from "./pages/AdminLayout.jsx";
import UserLayout from "./pages/UserLayout.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <UserLayout>
        <Login />
      </UserLayout>
    ),
  },
  {
    path: "/home",
    element: (
      <UserLayout>
        <Home />
      </UserLayout>
    ),
  },
  {
    path: "/faq",
    element: (
      <UserLayout>
        <Faq />
      </UserLayout>
    ),
  },
  {
    path: "/novo-chamado",
    element: (
      <UserLayout>
        <NovoChamado />
      </UserLayout>
    ),
  },
  {
    path: "/chamados",
    element: (
      <UserLayout>
        <Chamados />
      </UserLayout>
    ),
  },
  {
    path: "/compras",
    element: (
      <UserLayout>
        <Compras />
      </UserLayout>
    ),
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
    path: "/suporte/perguntas",
    element: (
      <AdminLayout>
        <Perguntas />
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
