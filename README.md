
# Engineering Assessment

Welcome, candidate! This project contains **intentional issues** that mimic real‑world scenarios.
Your task is to refactor, optimize, and fix these problems.

<img width="1512" height="861" alt="Screenshot 2026-03-18 at 4 13 57 AM" src="https://github.com/user-attachments/assets/d7390404-f67b-4fbe-aab5-3acb8e6b7a30" />

## Objectives

### 💻 Frontend (React)

1. **Memory Leak**

   - `Items.js` leaks memory if the component unmounts before fetch completes. Fix it.
2. **Pagination & Search**

   - Implement paginated list with server‑side search (`q` param). Contribute to both client and server.
3. **Performance**

   - The list can grow large. Integrate **virtualization** (e.g., `react-window`) to keep UI smooth.
4. **UI/UX Polish(optional)**

   - Feel free to enhance styling, accessibility, and add loading/skeleton states.

### 🔧 Backend (Node.js)

1. **Refactor blocking I/O**

   - `src/routes/items.js` uses `fs.readFileSync`. Replace with non‑blocking async operations.
2. **Performance**

   - `GET /api/stats` recalculates stats on every request. Cache results, watch file changes, or introduce a smarter strategy.

---

## 🚀 What Was Changed & Added (Assessment Validation)

### 🔧 Backend Improvements

- **Refactored I/O to Async**: Removed all blocking `fs.readFileSync` calls and replaced them with non-blocking `fs.promises` operations in the `DataRepository`.

- **Controller/Service/Repository Pattern**: Extracted logic out of routes into structured Controllers, Services, and a centralized `DataRepository` for proper modularity.

- **Performance - O(1) Stats Calculation**: Resolved the `GET /api/stats` performance bottleneck. The `DataRepository` computes totals and exactly counts categories on the primary read and securely caches them. Subsequent inserts incrementally update the memory cache in $O(1)$ time without traversing or reparsing the JSON array.

- **Efficient Appends**: Implemented an optimized `appendItemToFile` mechanism that seeks the closing bracket from the end of the file and injects the new item, preventing costly full-file rewrites.

- **CORS Support**: Applied the `cors` middleware to resolve frontend cross-origin request issues gracefully.

- **Data Validation**: Introduced `schemaValidation.js` middleware utilizing Joi alongside an `ItemModel` to strictly validate payload integrity on POST requests.

### 💻 Frontend Improvements

- **Memory Leak Fixed**: Correctly implemented `AbortController` inside `DataContext.jsx` and `Items.jsx` to natively cancel pending requests when components unmount or search dependencies change.

- **Functional Pagination & Search**: Established robust server-side pagination integrated directly with the frontend Context and a debounced real-time search component.

- **Responsive MUI-Inspired Design**: Handcrafted an extremely polished UI using vanilla global CSS.
  - **Desktop**: Features a clean responsive sidebar and a beautifully structured horizontal table with traditional pagination controls.
  - **Mobile**: Features a responsive slide-over hamburger menu, and the data table dynamically flexes into an MUI-style Tile "List View".

- **Infinite Scroll Virtualization (Mobile-Only)**: Added a native `IntersectionObserver` that attaches to the last item on the mobile List View. As the user scrolls to the bottom, the API natively fetches the next page and seamlessly appends it to the list.

- **Real-Time Stats Dashboard**: Transformed `Stats.jsx` into an elegant responsive dashboard projecting the O(1) backend stats, tracking Total Items, Average Price, and pill badges denoting counts of items per specific Category.

- **"Add Item" Modal Integration**: Engineered a responsive modal form enabling users to execute POST `/api/items`. Successful creations trigger synchronized state refreshes to keep the Dashboard and Item Lists immediately pristine.

## ⏰ Time Expectation

- Estimated time to complete: **1–2 hours**.

## 📤 Submission

Once completed, submit one of the following:

- **short video** recording your work.
- Explaination Video : https://www.loom.com/share/bd41bd37181549dcb9aada7144834a92
- Demo for API / UI : https://www.loom.com/share/264826a87b9c40019691c07da2c084ea
- **Github Link** where your assessment result were pushed.

---

## Quick Start

node version: 18.XX

```bash
nvm install 18
nvm use 18

# Terminal 1
cd backend
npm install
npm start

# Terminal 2
cd frontend
npm install
npm start
```

> The frontend proxies `/api` requests to `http://localhost:4001`.
>
