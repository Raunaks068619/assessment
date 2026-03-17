import React, { useEffect, useState, useRef } from 'react';
import { useData } from '../state/DataContext';
import Search from '../components/Search';
import Table from '../components/Table';
import Pagination from '../components/Pagination';

function Items() {
  const { items, fetchItems, pagination, setPage, setQ, page, addItem } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Modal State
  const [isAdding, setIsAdding] = useState(false);
  const [newItem, setNewItem] = useState({ name: '', price: '', category: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Track previous search to know when to wipe the list
  const prevSearchRef = useRef('');

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    // Determine whether to append or replace based on if the search query changed
    const isNewSearch = prevSearchRef.current !== searchTerm;
    const isPageChange = page > 1;

    // Append ONLY on mobile when paginating. On desktop, replace items for traditional pagination.
    const shouldAppend = isMobile ? (isPageChange && !isNewSearch) : false;

    fetchItems({
      signal: controller.signal,
      append: shouldAppend
    });

    if (isNewSearch) {
      prevSearchRef.current = searchTerm;
    }

    return () => {
      controller.abort();
    };
  }, [fetchItems, page, searchTerm, isMobile]);

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    setQ(term);
    setPage(1);
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await addItem({
        name: newItem.name,
        price: Number(newItem.price),
        category: newItem.category
      });
      setIsAdding(false);
      setNewItem({ name: '', price: '', category: '' });
    } catch (err) {
      alert("Error adding item");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px' }}>
        <div>
          <h1 className="page-title">Inventory Items</h1>
          <p style={{ color: '#6b7280', fontSize: '0.875rem', marginTop: '4px' }}>
            Manage and view your product inventory.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', width: isMobile ? '100%' : 'auto' }}>
          <Search value={searchTerm} onChange={handleSearch} />
          <button
            className="btn"
            style={{ backgroundColor: '#2563eb', color: 'white', border: 'none', height: '42px', alignSelf: 'flex-start' }}
            onClick={() => setIsAdding(true)}
          >
            + Add Item
          </button>
        </div>
      </div>

      <div className="card">
        {items.length === 0 && searchTerm ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>
            No results found for "{searchTerm}".
          </div>
        ) : items.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>
            Loading items...
          </div>
        ) : (
          <>
            <Table items={items} isMobile={isMobile} />

            {!isMobile && (
              <div className="desktop-pagination-only">
                <Pagination pagination={pagination} setPage={setPage} />
              </div>
            )}

            {isMobile && pagination?.hasNextPage && (
              <div style={{ padding: '16px', textAlign: 'center', fontSize: '0.875rem', color: '#6b7280' }}>
                Scroll for more...
              </div>
            )}
          </>
        )}
      </div>

      {isAdding && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 100,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '20px'
        }}>
          <div className="card" style={{ width: '100%', maxWidth: '400px', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Create New Item</h2>
              <button onClick={() => setIsAdding(false)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#6b7280' }}>&times;</button>
            </div>
            <form onSubmit={handleCreateSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '6px' }}>Name</label>
                <input required type="text" className="search-input" style={{ paddingLeft: '16px' }} value={newItem.name} onChange={e => setNewItem({ ...newItem, name: e.target.value })} placeholder="Item name" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '6px' }}>Price</label>
                <input required type="number" min="0" step="0.01" className="search-input" style={{ paddingLeft: '16px' }} value={newItem.price} onChange={e => setNewItem({ ...newItem, price: e.target.value })} placeholder="0.00" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '6px' }}>Category</label>
                <input required type="text" className="search-input" style={{ paddingLeft: '16px' }} value={newItem.category} onChange={e => setNewItem({ ...newItem, category: e.target.value })} placeholder="Electronics" />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
                <button type="button" className="btn" onClick={() => setIsAdding(false)}>Cancel</button>
                <button type="submit" disabled={isSubmitting} className="btn" style={{ backgroundColor: '#2563eb', color: 'white', border: 'none' }}>
                  {isSubmitting ? 'Saving...' : 'Save Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Items;