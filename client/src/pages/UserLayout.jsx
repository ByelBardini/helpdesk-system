/* eslint-disable no-unused-vars */
import { AnimatePresence, motion } from "framer-motion";
import { useLocation, Outlet } from "react-router-dom";

export default function UserLayout() {
  const location = useLocation();

  return (
    <div className="h-screen w-screen bg-gradient-to-br overflow-x-hidden from-[#0e1033] via-[#14163d] to-[#1c1f4a] text-white">
      <AnimatePresence mode="wait">
        <motion.main
          key={location.pathname}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="w-full h-full overflow-y-auto overflow-x-hidden custom-scrollbar"
        >
          <Outlet />
        </motion.main>
      </AnimatePresence>
    </div>
  );
}
