import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export function NavbarLoadingBar() {
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 600); // Simulate progress completion

    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <AnimatePresence>
      {loading && (
        <div className="loading-bar-container">
          <motion.div
            className="loading-bar-progress"
            initial={{ width: "0%" }}
            animate={{ width: "70%" }}
            exit={{ width: "100%", opacity: 0 }}
            transition={{ 
              width: { duration: 0.4, ease: "easeOut" },
              opacity: { duration: 0.2, delay: 0.1 }
            }}
          />
        </div>
      )}
    </AnimatePresence>
  );
}
