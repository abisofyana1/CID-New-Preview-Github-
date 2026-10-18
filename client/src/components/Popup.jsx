import React from 'react';
import { createPortal } from 'react-dom';
import { CheckCircle, AlertTriangle, XCircle, Trash2 } from 'lucide-react';

const Popup = ({ isOpen, onClose, type, title, message, onConfirm }) => {
    if (!isOpen) return null;

    let icon = <CheckCircle size={48} color="#22c55e" />; // Green

    if (type === 'delete') {
        icon = <Trash2 size={48} color="#ef4444" />; // Red
    } else if (type === 'error') {
        icon = <XCircle size={48} color="#ef4444" />; // Red
    }

    const buttonBaseStyle = {
        padding: '0.75rem 1.5rem',
        borderRadius: '0.75rem',
        border: 'none',
        fontWeight: '600',
        cursor: 'pointer',
        fontSize: '0.9rem',
        transition: 'transform 0.2s, box-shadow 0.2s',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
    };

    return createPortal(
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(4px)'
        }}>
            <div style={{
                backgroundColor: 'white',
                padding: '2.5rem',
                borderRadius: '1.5rem',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                maxWidth: '28rem',
                width: '90%',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                border: '1px solid rgba(255,255,255,0.4)'
            }}>
                <div style={{
                    marginBottom: '1.5rem',
                    padding: '1rem',
                    borderRadius: '50%',
                    background: type === 'delete' || type === 'error' ? '#fee2e2' : '#dcfce7',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    {icon}
                </div>

                <h3 style={{
                    fontSize: '1.5rem',
                    fontWeight: '700',
                    marginBottom: '0.5rem',
                    color: '#1e293b',
                    marginTop: 0
                }}>
                    {title}
                </h3>

                <p style={{
                    color: '#64748b',
                    marginBottom: '2rem',
                    fontSize: '0.95rem',
                    lineHeight: '1.6'
                }}>
                    {message}
                </p>

                <div style={{
                    display: 'flex',
                    gap: '1rem',
                    width: '100%',
                    justifyContent: 'center'
                }}>
                    {type === 'delete' ? (
                        <>
                            <button
                                onClick={onClose}
                                style={{
                                    ...buttonBaseStyle,
                                    background: 'white',
                                    border: '1px solid #cbd5e1',
                                    color: '#475569'
                                }}
                                onMouseEnter={(e) => e.target.style.background = '#f1f5f9'}
                                onMouseLeave={(e) => e.target.style.background = 'white'}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={onConfirm}
                                style={{
                                    ...buttonBaseStyle,
                                    background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                                    color: 'white'
                                }}
                                onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                                onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                            >
                                Yes, Delete
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={onClose}
                            style={{
                                ...buttonBaseStyle,
                                ...type === 'error' ? { background: '#ef4444' } : { background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' },
                                color: 'white',
                                minWidth: '120px'
                            }}
                            onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                            onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                        >
                            {type === 'error' ? 'Close' : 'Okay, Great!'}
                        </button>
                    )}
                </div>
            </div>
        </div>,
        document.body
    );
};

export default Popup;
