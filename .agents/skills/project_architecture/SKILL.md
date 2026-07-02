---
name: Project Architecture and Extension Guidelines
description: Rules and architectural details for managing, extending, and editing the "Жуйка" e-commerce storefront. Use this when adding new pages, routing, products, categories, or structural changes to the codebase.
---

# Project Architecture - "Жуйка" E-Commerce

This document describes the architectural layout of the **Жуйка** e-commerce web application, how the routing and state persist, and how to safely extend the catalog, pages, and components.

---

## 1. Directory Structure

*   `src/App.jsx` - Core React application containing layout, state, routing logic, view rendering, shopping cart, authentication flow, and static pages (promotions & documents).
*   `src/data/products.json` - Source of truth for catalog products.
*   `index.html` - Site metadata, global fonts (Inter/Montserrat/Outfit), and root div mounting.
*   `package.json` - Dependencies (Vite, React, TailwindCSS, Lucide-react for icons).
*   `tailwind.config.js` - Configuration for Tailwind colors, spacing, and dark mode toggles.

---

## 2. Routing and State Management (SPA)

The application functions as a Single Page Application (SPA) using a state-driven router.

### Navigation State
*   `activeView`: Controls the currently active screen (`'shop'`, `'product'`, `'cart'`, `'profile'`, `'checkout'`, `'article'`, etc.).
*   `activeNav`: Controls the active product category.
*   `selectedProduct`: Holds the product object when viewing details.
*   `activeArticle`: Holds the promotion or policy document being viewed.

### Safe Navigation Function (`navigateTo`)
To navigate, **always** call the `navigateTo` function. 

```javascript
const navigateTo = (view, nav = activeNav, product = selectedProduct, article = activeArticle) => { ... }
```

> [!IMPORTANT]
> **DataCloneError Prevention**: The HTML5 History API (`window.history.pushState`) cannot serialize complex React JSX structures. Because of this, `navigateTo` and history listener store **only the IDs** (`productId` and `articleId`) in the browser history state. Do not change this behavior by trying to pass the whole article object with JSX nodes to `pushState`.

---

## 3. Product Catalog

The catalog consists of:
1.  **JSON Catalog**: `src/data/products.json` contains the primary imported items.
2.  **Custom Products**: `customProducts` array inside `App.jsx` contains items with specialized branding or promotional items.
3.  **Merged Array**: `allProducts` combines both of these arrays upon initialization.

### Product Fields
When adding new products to `products.json`, ensure the following structure is maintained:
```json
{
  "id": "unique-id-string",
  "name": "Product Name",
  "price": 150,
  "oldPrice": 180,
  "category": "Жуйки",
  "image": "images/product_name.png",
  "inStock": true,
  "rating": 4.8,
  "description": "Product description text.",
  "specs": {
    "manufacturer": "Brand/Company Name",
    "calories": "Calories value (e.g., 340 ккал)",
    "volume": "Volume/Weight (e.g., 250 мл / 150 г)",
    "brand": "Brand Name",
    "country": "Country of origin"
  }
}
```

---

## 4. Articles and Static Pages (FAQ, Documents)

The `promotions` array in `App.jsx` acts as the content management system for promotional posts and legal documents:
*   `id: 5` — Доставка та оплата
*   `id: 6` — Питання-відповідь (FAQ)
*   `id: 7` — Договір публічної оферти
*   `id: 8` — Політика конфіденційності
*   `id: 9` — Умови повернення

### Content Format
The `content` property of a promotion/article can accept either:
1.  A plain `string` (rendered inside a `whitespace-pre-wrap` paragraph).
2.  A **React JSX Node** (for richly styled pages with grids, cards, specific list formatting, and colors).

The renderer automatically checks the type:
```javascript
{typeof activeArticle.content === 'string' ? (
    <p className="whitespace-pre-wrap">{activeArticle.content}</p>
) : (
    activeArticle.content
)}
```

---

## 5. Coding & Development Guidelines

### Encoding on Windows (Critical)
*   **Cyrillic Character Support**: When writing, updating, or rewriting files (especially `.jsx` or `.json`), you **must** save them with `UTF-8` encoding. In PowerShell commands, use `-Encoding utf8` or ensure your file edit tools preserve the encoding.
*   **Preventing Corruption**: Raw PowerShell output redirection (`>`) on Windows defaults to UTF-16LE, which corrupts Cyrillic characters. Use appropriate tools (`write_to_file`, `replace_file_content`) to prevent encoding issues.

### Color Theme
The site uses custom Tailwind configuration with bubblegum/dark elements:
*   Primary theme colors: Pink accents (`#ec4899`, `#db2777`).
*   Tailwind utility classes are preferred over inline styles.
*   Supports dark mode via the `dark` class added to `document.documentElement`.
