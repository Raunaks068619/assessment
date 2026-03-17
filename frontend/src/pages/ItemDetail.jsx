import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

function ItemDetail() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:4001/api/items/' + id)
      .then(res => res.ok ? res.json() : Promise.reject(res))
      .then(data => {
        setItem(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        navigate('/');
      });
  }, [id, navigate]);

  if (loading) {
    return (
      <div>
        <div className="page-header">
          <h1 className="page-title">Item Details</h1>
        </div>
        <div className="card" style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>
          Loading item...
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: '16px' }}>
        <Link to="/" style={{ color: '#2563eb', textDecoration: 'none', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '4px' }}>
          &larr; Back to Items
        </Link>
      </div>
      <div className="page-header">
        <h1 className="page-title">Item Details</h1>
        <p style={{ color: '#6b7280', fontSize: '0.875rem', marginTop: '4px' }}>
          Detailed view of the selected inventory item.
        </p>
      </div>

      <div className="card" style={{ padding: '32px', maxWidth: '600px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div>
            <div style={{ color: '#6b7280', fontSize: '0.875rem', fontWeight: 500, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Item Name
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 600, color: '#111827' }}>
              {item.name}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <div>
              <div style={{ color: '#6b7280', fontSize: '0.875rem', fontWeight: 500, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Price
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 700, color: '#059669' }}>
                ${(item.price ? Number(item.price) : 0).toFixed(2)}
              </div>
            </div>
            <div>
              <div style={{ color: '#6b7280', fontSize: '0.875rem', fontWeight: 500, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Category
              </div>
              <div>
                <span className="badge" style={{ fontSize: '1rem', padding: '6px 12px' }}>
                  {item.category}
                </span>
              </div>
            </div>
          </div>

          <div style={{ paddingTop: '24px', borderTop: '1px solid #e5e7eb', marginTop: '8px' }}>
            <div style={{ color: '#6b7280', fontSize: '0.875rem', fontWeight: 500, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              System ID
            </div>
            <div style={{ fontFamily: 'monospace', color: '#4b5563', backgroundColor: '#f3f4f6', padding: '8px 12px', borderRadius: '6px', display: 'inline-block' }}>
              {item.id}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ItemDetail;