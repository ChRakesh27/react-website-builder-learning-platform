import { useEffect, useRef } from 'react';
import { AlertTriangle, X } from 'lucide-react';

export default function ConfirmDialog({ open, title, message, confirmLabel, cancelLabel, onConfirm, onCancel, variant = 'danger' }) {
  const overlayRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const handleEsc = (e) => { if (e.key === 'Escape') onCancel(); };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div className="modal-overlay" ref={overlayRef} onClick={onCancel}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <AlertTriangle size={22} color={variant === 'danger' ? '#dc2626' : '#f59e0b'} />
            <h2>{title}</h2>
          </div>
          <button onClick={onCancel} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', padding: 4 }}>
            <X size={18} />
          </button>
        </div>
        <p style={{ marginTop: 12 }}>{message}</p>
        <div className="modal-actions">
          <button
            onClick={onCancel}
            style={{
              padding: '10px 20px', borderRadius: 12, border: '1px solid #e2e8f0',
              background: 'white', cursor: 'pointer', fontWeight: 600, fontSize: 14,
            }}
          >
            {cancelLabel || 'Cancel'}
          </button>
          <button
            onClick={onConfirm}
            style={{
              padding: '10px 20px', borderRadius: 12, border: 'none',
              background: variant === 'danger' ? '#dc2626' : '#f59e0b',
              color: 'white', cursor: 'pointer', fontWeight: 600, fontSize: 14,
            }}
          >
            {confirmLabel || 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}