import React from 'react';

const EvidenceList = ({ evidence = [], onAdd, allowedToAdd = true, onRemove }) => {
    if (evidence.length === 0 && !allowedToAdd) return null;

    return (
        <div style={{ marginTop: '1rem' }}>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                {evidence.map(item => (
                    <div
                        key={item.id}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            padding: '0.5rem 0.75rem',
                            background: '#f9f9f9',
                            border: '1px solid #eee',
                            borderRadius: '6px',
                            maxWidth: '250px',
                            position: 'relative',
                            paddingRight: onRemove ? '2rem' : '0.75rem'
                        }}
                    >
                        <div style={{
                            width: '32px',
                            height: '32px',
                            background: item.type === 'chart' ? '#e0e7ff' : '#f0f0f0',
                            color: item.type === 'chart' ? '#1B3AEC' : '#666',
                            borderRadius: '4px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                        }}>
                            {item.type === 'chart' ? (
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
                            ) : (
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path><polyline points="13 2 13 9 20 9"></polyline></svg>
                            )}
                        </div>
                        <div style={{ overflow: 'hidden' }}>
                            <div style={{
                                fontSize: '0.8rem',
                                fontWeight: '600',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                color: '#333'
                            }}>
                                {item.name}
                            </div>
                            {item.description && (
                                <div style={{ fontSize: '0.7rem', color: '#888', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    {item.description}
                                </div>
                            )}
                        </div>
                        {onRemove && (
                            <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); onRemove(item.id); }}
                                style={{
                                    position: 'absolute',
                                    right: '4px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    background: 'none',
                                    border: 'none',
                                    color: '#999',
                                    cursor: 'pointer',
                                    fontSize: '1.2rem',
                                    lineHeight: 1,
                                    padding: '0 4px',
                                    display: 'flex',
                                    alignItems: 'center'
                                }}
                                title="Remove evidence"
                            >
                                &times;
                            </button>
                        )}
                    </div>
                ))}

                {allowedToAdd && (
                    <button
                        onClick={onAdd}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.5rem 0.75rem',
                            background: 'white',
                            border: '1px dashed #ccc',
                            borderRadius: '6px',
                            fontSize: '0.8rem',
                            color: '#666',
                            cursor: 'pointer',
                            fontWeight: '500'
                        }}
                    >
                        <span>+ Add evidence</span>
                    </button>
                )}
            </div>
        </div>
    );
};

export default EvidenceList;
