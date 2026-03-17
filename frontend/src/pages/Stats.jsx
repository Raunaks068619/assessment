import React, { useEffect } from 'react';
import { useData } from '../state/DataContext';

function Stats() {
    const { stats, fetchStats } = useData();

    useEffect(() => {
        const controller = new AbortController();
        fetchStats(controller.signal);

        return () => {
            controller.abort();
        };
    }, [fetchStats]);

    if (!stats) {
        return (
            <div>
                <div className="page-header">
                    <h1 className="page-title">Analytics &amp; Stats</h1>
                </div>
                <div className="card" style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>
                    Loading statistics...
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">Analytics &amp; Stats</h1>
                <p style={{ color: '#6b7280', fontSize: '0.875rem', marginTop: '4px' }}>
                    Overview of your inventory ($O(1)$ real-time calculation)
                </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '20px' }}>
                <div className="card" style={{ padding: '24px' }}>
                    <div style={{ color: '#6b7280', fontSize: '0.875rem', fontWeight: 500, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Total Items
                    </div>
                    <div style={{ fontSize: '2.5rem', fontWeight: 700, color: '#111827' }}>
                        {stats.total.toLocaleString()}
                    </div>
                </div>

                <div className="card" style={{ padding: '24px' }}>
                    <div style={{ color: '#6b7280', fontSize: '0.875rem', fontWeight: 500, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Average Price
                    </div>
                    <div style={{ fontSize: '2.5rem', fontWeight: 700, color: '#059669' }}>
                        ${stats.averagePrice.toFixed(2)}
                    </div>
                </div>

                <div className="card" style={{ padding: '24px' }}>
                    <div style={{ color: '#6b7280', fontSize: '0.875rem', fontWeight: 500, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Total Categories
                    </div>
                    <div style={{ fontSize: '2.5rem', fontWeight: 700, color: '#4f46e5' }}>
                        {stats.totalCategories}
                    </div>
                </div>
            </div>

            <div className="card" style={{ padding: '24px' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#111827', marginBottom: '16px' }}>
                    Categories Breakdown
                </h2>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                    {stats.categories.map((cat, idx) => (
                        <div key={idx} style={{
                            padding: '8px 12px',
                            backgroundColor: '#f3f4f6',
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                            fontSize: '0.875rem',
                            fontWeight: 500,
                            color: '#374151',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}>
                            {cat}
                            {stats.categoryCounts && stats.categoryCounts[cat] !== undefined && (
                                <span style={{
                                    backgroundColor: '#cbd5e1',
                                    padding: '2px 8px',
                                    borderRadius: '12px',
                                    fontSize: '0.75rem',
                                    fontWeight: 600,
                                    color: '#1e293b'
                                }}>
                                    {stats.categoryCounts[cat]}
                                </span>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Stats;
