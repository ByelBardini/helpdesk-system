/* eslint-disable no-unused-vars */
import Header from "../components/default/Header.jsx";
import { AnimatePresence, motion } from "framer-motion";
import { useLocation, Outlet } from "react-router-dom";

export default function AdminLayout() {
  const location = useLocation();

  return (
    <div className="overflow-hidden p-0 w-full h-screen bg-gradient-to-br from-[#0e1033] via-[#14163d] to-[#1c1f4a] text-white">
      <Header />

      <AnimatePresence mode="wait">
        <motion.main
          key={location.pathname}
          initial={{ x: 40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -40, opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="w-full h-full overflow-hidden"
        >
          <Outlet />
        </motion.main>
      </AnimatePresence>
    </div>
  );
}
