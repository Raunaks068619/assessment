import React, { createContext, useCallback, useContext, useState } from 'react';

const DataContext = createContext();

export function DataProvider({ children }) {
  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState({});
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [q, setQ] = useState('');

  const [stats, setStats] = useState(null);

  const fetchItems = useCallback(async ({ signal, append = false } = {}) => {
    try {
      const res = await fetch(`http://localhost:4001/api/items?limit=${limit}&page=${page}&q=${q}`, {
        headers: { 'Access-Control-Allow-Origin': '*' },
        signal
      });
      const json = await res.json();

      setItems(prevItems => append ? [...prevItems, ...json.items] : json.items);
      setPagination(json.pagination);
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error('Error fetching items:', err);
      }
    }
  }, [limit, page, q]);

  const fetchStats = useCallback(async (signal) => {
    try {
      const res = await fetch(`http://localhost:4001/api/stats`, {
        headers: { 'Access-Control-Allow-Origin': '*' },
        signal
      });
      const json = await res.json();
      setStats(json);
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error('Error fetching stats:', err);
      }
    }
  }, []);

  const addItem = async (newItem) => {
    try {
      const res = await fetch('http://localhost:4001/api/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify(newItem)
      });

      if (!res.ok) {
        throw new Error('Failed to create item');
      }

      // Re-fetch items and stats after a successful create
      fetchItems();
      fetchStats();

      return await res.json();
    } catch (err) {
      console.error('Error adding item:', err);
      throw err;
    }
  };

  return (
    <DataContext.Provider value={{
      items, fetchItems, pagination, setLimit, setPage, setQ, page,
      stats, fetchStats, addItem
    }}>
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => useContext(DataContext);