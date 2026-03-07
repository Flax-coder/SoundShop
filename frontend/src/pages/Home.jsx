import { useEffect, useState } from "react";
import { getTest } from "../services/api";
import { Link } from "react-router-dom";
import "./Home.css";

function Home() {
  return (
    <div className="home-page">
      <section className="hero">
        <div className="hero-content">
          <span className="hero-badge">Music Gear Store</span>

          <h1 className="hero-title">
            Find your sound,
            <br />
            play with style
          </h1>

          <p className="hero-text">
            Discover guitars, pedals and amplifiers selected for musicians who
            want quality gear for studio, rehearsal and live performance.
          </p>

          <div className="hero-actions">
            <Link to="/products" className="hero-button">
              Browse products
            </Link>

            <Link to="/products" className="hero-button secondary">
              View catalog
            </Link>
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-card">
            <img
              src="http://127.0.0.1:8000/storage/products/guitar.jpeg"
              alt="Featured guitar"
            />
          </div>
        </div>
      </section>

      <section className="home-features">
        <div className="features-grid">
          <article className="feature-card">
            <div className="feature-icon">🎸</div>
            <h3 className="feature-title">Quality instruments</h3>
            <p className="feature-text">
              Carefully selected guitars and gear with a clean, modern shopping
              experience.
            </p>
          </article>

          <article className="feature-card">
            <div className="feature-icon">🎛️</div>
            <h3 className="feature-title">Studio & live ready</h3>
            <p className="feature-text">
              Pedals and amplifiers suited for home practice, recording sessions
              and live gigs.
            </p>
          </article>

          <article className="feature-card">
            <div className="feature-icon">🚚</div>
            <h3 className="feature-title">Fast experience</h3>
            <p className="feature-text">
              Fast navigation, simple product pages and a structure ready to
              grow into a real store.
            </p>
          </article>
        </div>
      </section>
    </div>
  );
}

export default Home;