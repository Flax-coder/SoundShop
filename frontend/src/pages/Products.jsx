import { useEffect, useMemo, useState } from "react";
import { getProducts } from "../services/api";
import ProductCard from "../components/ProductCard";
import "./Products.css";

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    getProducts()
      .then((data) => {
        setProducts(data);
      })
      .catch((error) => console.error("Errore prodotti:", error))
      .finally(() => setLoading(false));
  }, []);

  const filteredProducts = useMemo(() => {
    const term = search.toLowerCase().trim();

    if (!term) return products;

    return products.filter((product) =>
      `${product.title} ${product.description}`
        .toLowerCase()
        .includes(term)
    );
  }, [products, search]);

  if (loading) {
    return <p>Caricamento prodotti...</p>;
  }

  return (
    <div className="products-page">
      <div className="products-header">
        <h1 className="products-title">Our Products</h1>

        <input
          type="text"
          className="products-search"
          placeholder="Cerca un prodotto..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {filteredProducts.length === 0 ? (
        <p>Nessun prodotto trovato.</p>
      ) : (
        <div className="products-grid">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Products;