import React, { useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useData } from '../state/DataContext';

const Table = ({ items, isMobile }) => {
    const { pagination, setPage } = useData();
    const observer = useRef();
    const navigate = useNavigate();

    const lastItemRef = useCallback(node => {
        // Only run IntersectionObserver if we are in mobile infinite scroll mode
        if (!isMobile) return;

        if (!pagination || !pagination.hasNextPage) return;

        if (observer.current) observer.current.disconnect();

        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                setPage(prevPage => prevPage + 1);
            }
        });

        if (node) observer.current.observe(node);
    }, [pagination, setPage, isMobile]);

    if (!items || items.length === 0) {
        return (
            <div style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>
                No items found.
            </div>
        );
    }

    return (
        <div className="table-container">
            <table className="stats-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((item, index) => {
                        const isLastItem = index === items.length - 1;
                        return (
                            <tr
                                ref={isLastItem && isMobile ? lastItemRef : null}
                                key={`${item.id}-${index}`}
                                className="animate-in"
                                style={{ animationDelay: `${(index % 10) * 0.03}s` }}
                                onClick={() => navigate(`/items/${item.id}`)}
                            >
                                <td data-label="ID">
                                    <span style={{ fontFamily: 'monospace', color: '#6b7280', fontSize: '0.8rem' }}>
                                        {item.id}
                                    </span>
                                </td>
                                <td data-label="Name" style={{ fontWeight: 500 }}>{item.name}</td>
                                <td data-label="Category">
                                    <span className="badge">{item.category}</span>
                                </td>
                                <td data-label="Price">
                                    ${(item.price ? Number(item.price) : 0).toFixed(2)}
                                </td>
                                <td data-label="Action" onClick={e => e.stopPropagation()}>
                                    <Link
                                        to={`/items/${item.id}`}
                                        style={{ color: '#2563eb', textDecoration: 'none', fontWeight: 500, fontSize: '0.875rem' }}
                                    >
                                        View details &rarr;
                                    </Link>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default Table;
