import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./layouts/Navbar";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route
          path="/cart"
          element={<h1 style={{ padding: "40px" }}>Cart page coming soon</h1>}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
