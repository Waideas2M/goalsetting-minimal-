import React, { useState, useEffect } from 'react';

const MOCK_CHARTS = [
    { id: 'reading-scores-v1', name: 'Reading Achievement (Dist.)', type: 'Bar Chart', preview: 'https://images.unsplash.com/photo-1551288049-bbbda536339a?auto=format&fit=crop&w=600&q=80' },
    { id: 'attendance-trend', name: 'Attendance Trend 2025', type: 'Line Chart', preview: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80' },
    { id: 'strategy-usage-2025', name: 'Strategy Usage Report', type: 'Radar Chart', preview: 'https://images.unsplash.com/photo-1543286386-713bdd548da4?auto=format&fit=crop&w=600&q=80' },
    { id: 'progress-trend-final', name: 'Comparative Growth', type: 'Area Chart', preview: 'https://images.unsplash.com/photo-1551288049-bbbda536339a?auto=format&fit=crop&w=600&q=80' },
    { id: 'attendance-outcome', name: 'Target vs Actual Attendance', type: 'Combo Chart', preview: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80' }
];

const EvidenceModal = ({ isOpen, onClose, onAdd, contextType, contextId, initialTab = 'upload' }) => {
    const [activeTab, setActiveTab] = useState(initialTab);
    const [description, setDescription] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [selectedCharts, setSelectedCharts] = useState([]);

    // Chart Carousel State
    const [chartIndex, setChartIndex] = useState(0);
    const [moduleFilter, setModuleFilter] = useState('All');
    const [timeFilter, setTimeFilter] = useState('Last Term');

    useEffect(() => {
        if (isOpen) {
            setActiveTab(initialTab);
            setChartIndex(0);
        }
    }, [isOpen, initialTab]);

    if (!isOpen) return null;

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
        }
    };

    const toggleChartSelection = (chart) => {
        if (selectedCharts.find(c => c.id === chart.id)) {
            setSelectedCharts(selectedCharts.filter(c => c.id !== chart.id));
        } else {
            setSelectedCharts([...selectedCharts, chart]);
        }
    };

    const handleAdd = () => {
        if (activeTab === 'upload' && selectedFile) {
            onAdd({
                type: 'file',
                name: selectedFile.name,
                url: URL.createObjectURL(selectedFile),
                description,
                contextType,
                contextId
            });
        } else if (activeTab === 'charts' && selectedCharts.length > 0) {
            selectedCharts.forEach(chart => {
                onAdd({
                    type: 'chart',
                    name: chart.name,
                    chartId: chart.id,
                    description,
                    contextType,
                    contextId
                });
            });
        }
        resetAndClose();
    };

    const resetAndClose = () => {
        setDescription('');
        setSelectedFile(null);
        setSelectedCharts([]);
        onClose();
    };

    const currentChart = MOCK_CHARTS[chartIndex];
    const isCurrentSelected = selectedCharts.some(c => c.id === currentChart.id);

    const nextChart = () => setChartIndex((prev) => (prev + 1) % MOCK_CHARTS.length);
    const prevChart = () => setChartIndex((prev) => (prev - 1 + MOCK_CHARTS.length) % MOCK_CHARTS.length);

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
                width: '650px',
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)'
            }}>
                <div style={{ padding: '1.5rem', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 style={{ margin: 0, fontSize: '1.25rem' }}>Add Evidence</h2>
                    <button onClick={resetAndClose} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#666' }}>&times;</button>
                </div>

                <div style={{ display: 'flex', borderBottom: '1px solid #eee' }}>
                    <button
                        onClick={() => setActiveTab('upload')}
                        style={{
                            flex: 1,
                            padding: '1rem',
                            border: 'none',
                            background: activeTab === 'upload' ? '#f0f4ff' : 'white',
                            borderBottom: activeTab === 'upload' ? '2px solid #1B3AEC' : 'none',
                            color: activeTab === 'upload' ? '#1B3AEC' : '#666',
                            fontWeight: '600',
                            cursor: 'pointer'
                        }}
                    >
                        Attach Files
                    </button>
                    <button
                        onClick={() => setActiveTab('charts')}
                        style={{
                            flex: 1,
                            padding: '1rem',
                            border: 'none',
                            background: activeTab === 'charts' ? '#f0f4ff' : 'white',
                            borderBottom: activeTab === 'charts' ? '2px solid #1B3AEC' : 'none',
                            color: activeTab === 'charts' ? '#1B3AEC' : '#666',
                            fontWeight: '600',
                            cursor: 'pointer'
                        }}
                    >
                        Skolanalys Charts
                    </button>
                </div>

                <div style={{ padding: '1.5rem', maxHeight: '500px', overflowY: 'auto' }}>
                    {activeTab === 'upload' ? (
                        <div>
                            <div style={{
                                border: '2px dashed #ddd',
                                borderRadius: '8px',
                                padding: '2rem',
                                textAlign: 'center',
                                cursor: 'pointer',
                                background: selectedFile ? '#f8fdf8' : '#fcfcfc',
                                marginBottom: '1.5rem'
                            }} onClick={() => document.getElementById('fileInput').click()}>
                                <input
                                    type="file"
                                    id="fileInput"
                                    style={{ display: 'none' }}
                                    onChange={handleFileChange}
                                />
                                {selectedFile ? (
                                    <div>
                                        <div style={{ fontSize: '1.1rem', fontWeight: '600', color: '#00875a' }}>{selectedFile.name}</div>
                                        <div style={{ fontSize: '0.85rem', color: '#666', marginTop: '0.5rem' }}>Click to change file</div>
                                    </div>
                                ) : (
                                    <div>
                                        <div style={{ fontSize: '1.1rem', fontWeight: '600', color: '#333' }}>Drop files here or click to browse</div>
                                        <div style={{ fontSize: '0.85rem', color: '#666', marginTop: '0.5rem' }}>PDF, PNG, JPG, DOCX (Max 10MB)</div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div>
                            {/* Toolbar */}
                            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                                <select
                                    className="form-select"
                                    style={{ flex: 1, padding: '0.5rem', fontSize: '0.9rem' }}
                                    value={moduleFilter}
                                    onChange={(e) => setModuleFilter(e.target.value)}
                                >
                                    <option>All Modules</option>
                                    <option>Subject Results</option>
                                    <option>Attendance</option>
                                    <option>Student Wellbeing</option>
                                </select>
                                <select
                                    className="form-select"
                                    style={{ flex: 1, padding: '0.5rem', fontSize: '0.9rem' }}
                                    value={timeFilter}
                                    onChange={(e) => setTimeFilter(e.target.value)}
                                >
                                    <option>Last Term</option>
                                    <option>Current Year to Date</option>
                                    <option>Last Year</option>
                                </select>
                            </div>

                            {/* Carousel View */}
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem',
                                marginBottom: '1.5rem',
                                background: '#f9f9f9',
                                padding: '1rem',
                                borderRadius: '8px',
                                border: '1px solid #eee'
                            }}>
                                <button onClick={prevChart} style={{ background: 'white', border: '1px solid #ddd', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>&lt;</button>

                                <div style={{ flex: 1, textAlign: 'center' }}>
                                    <div style={{
                                        height: '200px',
                                        width: '100%',
                                        background: '#fff',
                                        marginBottom: '0.5rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        overflow: 'hidden',
                                        borderRadius: '4px',
                                        border: '1px solid #eee'
                                    }}>
                                        <img src={currentChart.preview} alt={currentChart.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </div>
                                    <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>{currentChart.name} ({chartIndex + 1}/{MOCK_CHARTS.length})</div>
                                    <div style={{ fontSize: '0.8rem', color: '#666', marginBottom: '0.5rem' }}>{currentChart.type}</div>

                                    <button
                                        onClick={() => toggleChartSelection(currentChart)}
                                        style={{
                                            padding: '0.3rem 1rem',
                                            borderRadius: '20px',
                                            border: '1px solid',
                                            fontSize: '0.8rem',
                                            fontWeight: '600',
                                            background: isCurrentSelected ? '#e0e7ff' : 'white',
                                            borderColor: isCurrentSelected ? '#1B3AEC' : '#ddd',
                                            color: isCurrentSelected ? '#1B3AEC' : '#666',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        {isCurrentSelected ? '✓ Selected' : 'Select Chart'}
                                    </button>
                                </div>

                                <button onClick={nextChart} style={{ background: 'white', border: '1px solid #ddd', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>&gt;</button>
                            </div>

                            {selectedCharts.length > 0 && (
                                <div style={{
                                    padding: '0.75rem',
                                    background: '#f0f4ff',
                                    borderRadius: '6px',
                                    marginBottom: '1rem',
                                    display: 'flex',
                                    gap: '0.5rem',
                                    flexWrap: 'wrap',
                                    alignItems: 'center'
                                }}>
                                    <span style={{ fontSize: '0.8rem', fontWeight: '600', color: '#1B3AEC', marginRight: '0.5rem' }}>Selected:</span>
                                    {selectedCharts.map(c => (
                                        <span key={c.id} style={{
                                            background: 'white',
                                            border: '1px solid #c7d2fe',
                                            borderRadius: '12px',
                                            padding: '0.2rem 0.6rem',
                                            fontSize: '0.75rem',
                                            color: '#1B3AEC',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '4px'
                                        }}>
                                            {c.name}
                                            <button
                                                onClick={() => toggleChartSelection(c)}
                                                style={{ border: 'none', background: 'none', color: '#1B3AEC', cursor: 'pointer', padding: 0, fontSize: '1rem', lineHeight: 1 }}
                                            >&times;</button>
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.5rem' }}>Description / Note (Optional)</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Add context to this evidence..."
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                borderRadius: '6px',
                                border: '1px solid #ddd',
                                fontSize: '0.9rem',
                                resize: 'vertical',
                                minHeight: '80px'
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
                        disabled={activeTab === 'upload' ? !selectedFile : selectedCharts.length === 0}
                        style={{
                            padding: '0.6rem 1.25rem',
                            borderRadius: '6px',
                            border: 'none',
                            background: (activeTab === 'upload' ? selectedFile : selectedCharts.length > 0) ? '#1B3AEC' : '#ccc',
                            color: 'white',
                            fontWeight: '600',
                            cursor: (activeTab === 'upload' ? selectedFile : selectedCharts.length > 0) ? 'pointer' : 'not-allowed'
                        }}
                    >
                        Attach Evidence
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EvidenceModal;
