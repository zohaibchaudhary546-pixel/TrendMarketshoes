/* =====================================
   TREND MARKET SHOES — PREMIUM JS
===================================== */

document.addEventListener("DOMContentLoaded", () => {
  const $ = (selector, parent = document) =>
    parent.querySelector(selector);

  const $$ = (selector, parent = document) =>
    [...parent.querySelectorAll(selector)];

  // Mobile navigation
  const menuButton = $(
    ".menu-toggle, #menu-toggle, #hamburger"
  );

  const navigation = $(
    ".nav-links, #nav-links, .navbar-menu"
  );

  if (menuButton && navigation) {
    menuButton.addEventListener("click", () => {
      const opened = navigation.classList.toggle("active");
      menuButton.setAttribute("aria-expanded", String(opened));
    });

    $$(".nav-links a, #nav-links a, .navbar-menu a")
      .forEach(link => {
        link.addEventListener("click", () => {
          navigation.classList.remove("active");
          menuButton.setAttribute("aria-expanded", "false");
        });
      });
  }

  // Premium product search
  const searchInputs = $$(
    ".search-input, #search-input, [data-product-search]"
  );

  const products = $$(".product-card, .product");

  searchInputs.forEach(input => {
    input.addEventListener("input", () => {
      const query = input.value.trim().toLowerCase();

      products.forEach(product => {
        const matches = product.textContent
          .toLowerCase()
          .includes(query);

        product.hidden = !matches;
      });
    });
  });

  // Product category filters
  const filterButtons = $$("[data-filter]");

  filterButtons.forEach(button => {
    button.addEventListener("click", () => {
      const category = button.dataset.filter;

      filterButtons.forEach(item => {
        item.classList.toggle("active", item === button);
      });

      products.forEach(product => {
        const productCategory =
          product.dataset.category || "all";

        product.hidden =
          category !== "all" &&
          category !== productCategory;
      });
    });
  });

  // Shopping cart
  const cart = [];

  const cartCount = $(
    ".cart-count, #cart-count, [data-cart-count]"
  );

  const money = value =>
    new Intl.NumberFormat("en-PK", {
      style: "currency",
      currency: "PKR",
      maximumFractionDigits: 0
    }).format(value);

  function updateCart() {
    const totalItems = cart.reduce(
      (sum, item) => sum + item.quantity,
      0
    );

    if (cartCount) {
      cartCount.textContent = totalItems;
    }

    const cartTotal = $("#cart-total");

    if (cartTotal) {
      cartTotal.textContent = money(
        cart.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        )
      );
    }

    const cartItems = $("#cart-items");

    if (cartItems) {
      cartItems.replaceChildren();

      if (!cart.length) {
        const empty = document.createElement("p");
        empty.textContent = "Your cart is waiting for you.";
        cartItems.append(empty);
      }

      cart.forEach(item => {
        const row = document.createElement("div");
        row.className = "cart-item";

        const title = document.createElement("span");
        title.textContent =
          `${item.name} × ${item.quantity}`;

        const price = document.createElement("span");
        price.textContent = money(
          item.price * item.quantity
        );

        row.append(title, price);
        cartItems.append(row);
      });
    }
  }

  // Add product to cart
  $$(".add-to-cart, [data-add-to-cart]").forEach(button => {
    button.addEventListener("click", () => {
      const card = button.closest(
        ".product-card, .product"
      );

      if (!card) return;

      const name =
        card.dataset.name ||
        $(".product-title, h2, h3", card)?.textContent?.trim();

      const priceText =
        card.dataset.price ||
        $(".product-price, .price", card)?.textContent;

      const price = Number(
        String(priceText || "").replace(/[^\d.]/g, "")
      );

      if (!name || !Number.isFinite(price) || price <= 0) {
        showToast("Please check this product's name and price.");
        return;
      }

      const existing = cart.find(item => item.name === name);

      if (existing) {
        existing.quantity++;
      } else {
        cart.push({ name, price, quantity: 1 });
      }

      updateCart();
      showToast(`${name} added to your bag.`);
    });
  });

  // Toast notification
  function showToast(message) {
    let toast = $("#site-toast");

    if (!toast) {
      toast = document.createElement("div");
      toast.id = "site-toast";
      toast.setAttribute("role", "status");

      Object.assign(toast.style, {
        position: "fixed",
        bottom: "24px",
        left: "50%",
        transform: "translateX(-50%)",
        padding: "14px 22px",
        background: "#171717",
        color: "#ffffff",
        borderRadius: "10px",
        zIndex: "9999",
        boxShadow: "0 8px 30px #0003",
        maxWidth: "90%",
        textAlign: "center"
      });

      document.body.append(toast);
    }

    toast.textContent = message;
    toast.hidden = false;

    clearTimeout(toast._hideTimer);

    toast._hideTimer = setTimeout(() => {
      toast.hidden = true;
    }, 2500);
  }

  // Smooth scrolling for page links
  $$('a[href^="#"]').forEach(link => {
    link.addEventListener("click", event => {
      const target = $(link.getAttribute("href"));

      if (target) {
        event.preventDefault();

        target.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      }
    });
  });

  // Reveal animations
  const revealItems = $$(
    ".reveal, .product-card, .product"
  );

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    revealItems.forEach(item => observer.observe(item));
  } else {
    revealItems.forEach(item => item.classList.add("visible"));
  }

  // Current year in footer
  const year = $("#current-year");

  if (year) {
    year.textContent = new Date().getFullYear();
  }

  updateCart();

  console.log("TrendMarketShoes premium features loaded.");
});
