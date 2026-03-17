import React, { useEffect, useState, useRef } from 'react';
import { useData } from '../state/DataContext';
import Search from '../components/Search';
import Table from '../components/Table';
import Pagination from '../components/Pagination';

function Items() {
  const { items, fetchItems, pagination, setPage, setQ, page } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

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

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px' }}>
        <div>
          <h1 className="page-title">Inventory Items</h1>
          <p style={{ color: '#6b7280', fontSize: '0.875rem', marginTop: '4px' }}>
            Manage and view your product inventory.
          </p>
        </div>
        <Search value={searchTerm} onChange={handleSearch} />
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
    </div>
  );
}

export default Items;