import React, { useState } from 'react';

const EvidenceUploadModal = ({ isOpen, onClose, onAdd, contextType, contextId }) => {
    const [description, setDescription] = useState('');
    const [selectedFiles, setSelectedFiles] = useState([]);

    if (!isOpen) return null;

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            setSelectedFiles(Array.from(e.target.files));
        }
    };

    const handleAdd = () => {
        if (selectedFiles.length > 0) {
            selectedFiles.forEach(file => {
                onAdd({
                    type: 'file',
                    name: file.name,
                    url: URL.createObjectURL(file), // In a real app this would be an upload URL
                    description,
                    contextType,
                    contextId
                });
            });
            resetAndClose();
        }
    };

    const resetAndClose = () => {
        setDescription('');
        setSelectedFiles([]);
        onClose();
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2000
        }}>
            <div style={{
                background: 'white',
                width: '500px',
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)'
            }}>
                <div style={{ padding: '1.25rem', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 style={{ margin: 0, fontSize: '1.1rem' }}>Attach Files</h2>
                    <button onClick={resetAndClose} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#666' }}>&times;</button>
                </div>

                <div style={{ padding: '1.5rem' }}>
                    <div style={{
                        border: '2px dashed #ddd',
                        borderRadius: '8px',
                        padding: '2rem',
                        textAlign: 'center',
                        cursor: 'pointer',
                        background: selectedFiles.length > 0 ? '#f8fdf8' : '#fcfcfc',
                        marginBottom: '1.5rem',
                        transition: 'background 0.2s'
                    }} onClick={() => document.getElementById('fileInput').click()}>
                        <input
                            type="file"
                            id="fileInput"
                            multiple
                            style={{ display: 'none' }}
                            onChange={handleFileChange}
                        />
                        {selectedFiles.length > 0 ? (
                            <div>
                                <div style={{ fontSize: '1.1rem', fontWeight: '600', color: '#00875a', marginBottom: '0.5rem' }}>
                                    {selectedFiles.length} file(s) selected
                                </div>
                                <div style={{ fontSize: '0.85rem', color: '#666', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                    {selectedFiles.map((f, i) => (
                                        <span key={i} style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{f.name}</span>
                                    ))}
                                </div>
                                <div style={{ fontSize: '0.8rem', color: '#1B3AEC', marginTop: '1rem', fontWeight: '500' }}>Click to change selection</div>
                            </div>
                        ) : (
                            <div>
                                <div style={{ fontSize: '1.1rem', fontWeight: '600', color: '#333' }}>Drop files here or click to browse</div>
                                <div style={{ fontSize: '0.85rem', color: '#666', marginTop: '0.5rem' }}>PDF, PNG, JPG, DOCX (Max 10MB)</div>
                            </div>
                        )}
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.5rem' }}>Description / Note (Optional)</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Add context to these files..."
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                borderRadius: '6px',
                                border: '1px solid #ddd',
                                fontSize: '0.9rem',
                                resize: 'vertical',
                                minHeight: '80px',
                                boxSizing: 'border-box'
                            }}
                        />
                    </div>
                </div>

                <div style={{ padding: '1.25rem', borderTop: '1px solid #eee', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                    <button
                        onClick={resetAndClose}
                        style={{ padding: '0.6rem 1.25rem', borderRadius: '6px', border: '1px solid #ddd', background: 'white', cursor: 'pointer' }}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleAdd}
                        disabled={selectedFiles.length === 0}
                        style={{
                            padding: '0.6rem 1.25rem',
                            borderRadius: '6px',
                            border: 'none',
                            background: selectedFiles.length > 0 ? '#1B3AEC' : '#ccc',
                            color: 'white',
                            fontWeight: '600',
                            cursor: selectedFiles.length > 0 ? 'pointer' : 'not-allowed'
                        }}
                    >
                        Attach Files
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EvidenceUploadModal;
