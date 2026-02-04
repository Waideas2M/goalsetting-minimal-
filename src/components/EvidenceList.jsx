import React from 'react';

const EvidenceList = ({ evidence = [], onRemove, allowedToAdd = false, onAdd, addLabel = 'Add attachment' }) => {
    if (evidence.length === 0 && !allowedToAdd) return null;

    return (
        <div className="evidence-list-container">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'stretch' }}>
                {evidence.map((item) => (
                    <div key={item.id} style={{
                        border: '1px solid #f0f0f0',
                        borderRadius: '6px',
                        padding: '0.5rem 0.6rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.6rem',
                        background: '#ffffff',
                        position: 'relative',
                        cursor: item.url ? 'pointer' : 'default',
                        transition: 'background-color 0.2s, border-color 0.2s',
                        width: 'auto',
                        minWidth: '200px',
                        maxWidth: '280px',
                        flex: '1 1 auto'
                    }}
                        onClick={() => item.url && window.open(item.url, '_blank')}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#fafafa';
                            e.currentTarget.style.borderColor = '#e0e0e0';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = '#ffffff';
                            e.currentTarget.style.borderColor = '#f0f0f0';
                        }}
                    >
                        {/* File Type Icon */}
                        <div style={{
                            width: '28px',
                            height: '28px',
                            background: item.type === 'chart' ? '#f0f4ff' : '#f8f9fa',
                            color: item.type === 'chart' ? '#1B3AEC' : '#666',
                            borderRadius: '4px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.9rem',
                            flexShrink: 0
                        }}>
                            {item.type === 'chart' ? '📊' :
                                item.type === 'image' || (item.url && item.url.match(/\.(jpeg|jpg|gif|png)$/i)) ? '🖼️' : '📄'}
                        </div>

                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{
                                fontWeight: '700',
                                fontSize: '0.75rem',
                                color: '#111',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis'
                            }}>
                                {item.name || 'Unnamed file'}
                            </div>
                            {item.description && item.description !== item.name && (
                                <div style={{
                                    fontSize: '0.65rem',
                                    color: '#666',
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    marginTop: '0.1rem'
                                }}>
                                    {item.description}
                                </div>
                            )}
                        </div>

                        {onRemove && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (window.confirm('Remove this attachment?')) onRemove(item.id);
                                }}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: '#ccc',
                                    cursor: 'pointer',
                                    padding: '0.15rem',
                                    fontSize: '1.1rem',
                                    lineHeight: 1,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.color = '#ff4d4f';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.color = '#ccc';
                                }}
                                title="Remove attachment"
                            >
                                &times;
                            </button>
                        )}
                    </div>
                ))}

                {allowedToAdd && onAdd && (
                    <button
                        onClick={onAdd}
                        style={{
                            border: '1px dashed #d0d7ff',
                            borderRadius: '6px',
                            padding: '0.5rem 1rem',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem',
                            background: '#f8f9ff',
                            color: '#1B3AEC',
                            cursor: 'pointer',
                            minHeight: '42px',
                            transition: 'all 0.2s',
                            width: 'fit-content',
                            boxShadow: 'none',
                            flex: '0 0 auto'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = '#1B3AEC';
                            e.currentTarget.style.background = '#f0f4ff';
                            e.currentTarget.style.transform = 'translateY(-1px)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = '#d0d7ff';
                            e.currentTarget.style.background = '#f8f9ff';
                            e.currentTarget.style.transform = 'translateY(0)';
                        }}
                    >
                        {/* Paperclip/attachment icon */}
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path>
                        </svg>
                        <span style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                            {addLabel || 'Attach'}
                        </span>
                    </button>
                )}
            </div>
        </div>
    );
};

export default EvidenceList;
