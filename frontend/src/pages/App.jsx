import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Items from './Items';
import ItemDetail from './ItemDetail';
import Stats from './Stats';
import { DataProvider } from '../state/DataContext';
import Layout from '../components/Layout';

function App() {
  return (
    <DataProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<Items />} />
          <Route path="/stats" element={<Stats />} />
          <Route path="/items/:id" element={<ItemDetail />} />
        </Routes>
      </Layout>
    </DataProvider>
  );
}

export default App;