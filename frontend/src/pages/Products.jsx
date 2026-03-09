import { useEffect, useMemo, useState } from "react";
import { getProducts } from "../services/api";
import { getCategories } from "../services/categoryService";
import ProductCard from "../components/ProductCard";
import "./Products.css";

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    getProducts()
      .then((data) => {
        setProducts(data);
      })
      .catch((error) => console.error("Errore prodotti:", error))
      .finally(() => setLoading(false));

    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (error) {
        console.error("Errore categorie:", error);
      }
    };

    fetchCategories();
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = `${product.name} ${product.description}`
        .toLowerCase()
        .includes(search.toLowerCase().trim());

      const matchesCategory =
        selectedCategory === "all" ||
        product.category_id === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [products, search, selectedCategory]);

  if (loading) {
    return <p>Caricamento prodotti...</p>;
  }

  const categoryIcons = {
    Guitars: "🎸",
    Pedals: "🎛️",
    Amplifiers: "🔊",
    Accessories: "🎧",
  };

  const getCategoryCount = (categoryId) => {
    return products.filter((product) => product.category_id === categoryId).length;
  };

  const allCount = products.length;

  return (
    <div className="products-page">
      <div className="category-filter">
       <button
          className={`category-btn ${
            selectedCategory === "all" ? "active" : ""
          }`}
          onClick={() => setSelectedCategory("all")}
        >
          All <span className="category-count">({allCount})</span>
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            className={`category-btn ${
              selectedCategory === category.id ? "active" : ""
            }`}
            onClick={() => setSelectedCategory(category.id)}
          >
            {categoryIcons[category.name] ?? "🛍️"} {category.name}
            <span className="category-count">({getCategoryCount(category.id)})</span>
          </button>
        ))}
      </div>
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