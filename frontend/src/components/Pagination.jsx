import React from 'react';

const Pagination = ({ pagination, setPage }) => {
    if (!pagination) return null;

    const { currentPage, totalPages, hasPrevPage, hasNextPage, totalItems } = pagination;

    return (
        <div className="pagination">
            <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                Showing page <span style={{ fontWeight: 500, color: '#111827' }}>{currentPage}</span> of{" "}
                <span style={{ fontWeight: 500, color: '#111827' }}>{totalPages}</span> ({totalItems} total)
            </div>
            <div className="pagination-controls" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Jump to:</span>
                    <input
                        type="number"
                        min="1"
                        max={totalPages}
                        defaultValue={currentPage}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                const val = parseInt(e.target.value);
                                if (val >= 1 && val <= totalPages) {
                                    setPage(val);
                                }
                            }
                        }}
                        onBlur={(e) => {
                            const val = parseInt(e.target.value);
                            if (val >= 1 && val <= totalPages && val !== currentPage) {
                                setPage(val);
                            } else {
                                e.target.value = currentPage; // Reset if invalid
                            }
                        }}
                        style={{
                            width: '60px',
                            padding: '4px 8px',
                            border: '1px solid #d1d5db',
                            borderRadius: '6px',
                            fontSize: '0.875rem'
                        }}
                    />
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                        className="btn"
                        disabled={!hasPrevPage}
                        onClick={() => setPage(p => p - 1)}
                    >
                        Previous
                    </button>
                    <button
                        className="btn"
                        disabled={!hasNextPage}
                        onClick={() => setPage(p => p + 1)}
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Pagination;
