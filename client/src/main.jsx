import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useEffect } from "react";
import { conectarSocket, getUserInfo } from "./services/auth/authService";

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
    element: <UserLayout />,
    children: [
      { path: "/", element: <Login /> },
      { path: "/home", element: <Home /> },
      { path: "/faq", element: <Faq /> },
      { path: "/novo-chamado", element: <NovoChamado /> },
      { path: "/chamados", element: <Chamados /> },
      { path: "/compras", element: <Compras /> },
    ],
  },
  {
    path: "/suporte",
    element: <AdminLayout />,
    children: [
      { path: "dashboard", element: <Dashboard /> },
      { path: "chamados", element: <ChamadosSuporte /> },
      { path: "relatorios", element: <Relatorios /> },
      { path: "compras", element: <ComprasAdm /> },
      { path: "usuarios", element: <Usuarios /> },
      { path: "avisos", element: <Avisos /> },
      { path: "perguntas", element: <Perguntas /> },
      { path: "configuracoes", element: <Configuracoes /> },
    ],
  },
]);

function AppWrapper() {
  useEffect(() => {
    async function init() {
      await conectarSocket();
      await getUserInfo();
    }
    init();
  }, []);

  return (
    <SocketListener>
      <RouterProvider router={router} />
    </SocketListener>
  );
}
export default AppWrapper;

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AppWrapper />
  </StrictMode>
);
