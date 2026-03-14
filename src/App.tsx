import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "./components/layout/Layout";
import { TopicPage } from "./pages/TopicPage";
import { NotFound } from "./pages/NotFound";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* Default redirect to first topic */}
          <Route index element={<Navigate to="/fundamentals/latency-throughput" replace />} />
          
          {/* Dynamic topic route */}
          <Route path=":categoryId/:slug" element={<TopicPage />} />
          
          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
