import React, { useState, useEffect } from 'react';

const MOCK_CHARTS = [
    { id: 'reading-scores-v1', name: 'Reading Achievement (Dist.)', type: 'Bar Chart', preview: 'https://images.unsplash.com/photo-1551288049-bbbda536339a?auto=format&fit=crop&w=600&q=80' },
    { id: 'attendance-trend', name: 'Attendance Trend 2025', type: 'Line Chart', preview: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80' },
    { id: 'strategy-usage-2025', name: 'Strategy Usage Report', type: 'Radar Chart', preview: 'https://images.unsplash.com/photo-1543286386-713bdd548da4?auto=format&fit=crop&w=600&q=80' },
    { id: 'progress-trend-final', name: 'Comparative Growth', type: 'Area Chart', preview: 'https://images.unsplash.com/photo-1551288049-bbbda536339a?auto=format&fit=crop&w=600&q=80' },
    { id: 'attendance-outcome', name: 'Target vs Actual Attendance', type: 'Combo Chart', preview: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80' }
];

const EvidenceChartModal = ({ isOpen, onClose, onAdd, contextType, contextId }) => {
    const [selectedCharts, setSelectedCharts] = useState([]);
    const [description, setDescription] = useState('');

    // Filters & Carousel
    const [moduleFilter, setModuleFilter] = useState('All');
    const [timeFilter, setTimeFilter] = useState('Last Term');
    const [chartIndex, setChartIndex] = useState(0);

    /* Reset Logic can go here or parent */

    if (!isOpen) return null;

    const toggleChartSelection = (chart) => {
        if (selectedCharts.find(c => c.id === chart.id)) {
            setSelectedCharts(selectedCharts.filter(c => c.id !== chart.id));
        } else {
            setSelectedCharts([...selectedCharts, chart]);
        }
    };

    const handleAdd = () => {
        if (selectedCharts.length > 0) {
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
            resetAndClose();
        }
    };

    const resetAndClose = () => {
        setDescription('');
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
                width: '700px',
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)'
            }}>
                <div style={{ padding: '1.5rem', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 style={{ margin: 0, fontSize: '1.25rem' }}>Add Charts from Skolanalys</h2>
                    <button onClick={resetAndClose} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#666' }}>&times;</button>
                </div>

                <div style={{ padding: '2rem', maxHeight: '550px', overflowY: 'auto' }}>
                    {/* Filters */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', marginBottom: '0.5rem', color: '#444' }}>Module</label>
                            <select
                                className="form-select"
                                style={{ width: '100%', padding: '0.6rem', fontSize: '0.9rem' }}
                                value={moduleFilter}
                                onChange={(e) => setModuleFilter(e.target.value)}
                            >
                                <option>All Modules</option>
                                <option>Subject Results</option>
                                <option>Attendance</option>
                                <option>Student Wellbeing</option>
                            </select>
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', marginBottom: '0.5rem', color: '#444' }}>Time Period</label>
                            <select
                                className="form-select"
                                style={{ width: '100%', padding: '0.6rem', fontSize: '0.9rem' }}
                                value={timeFilter}
                                onChange={(e) => setTimeFilter(e.target.value)}
                            >
                                <option>Last Term</option>
                                <option>Current Year to Date</option>
                                <option>Last Year</option>
                            </select>
                        </div>
                    </div>

                    {/* Carousel */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1.5rem',
                        marginBottom: '2rem',
                        background: '#f8f9fa',
                        padding: '1.5rem',
                        borderRadius: '12px',
                        border: '1px solid #eee'
                    }}>
                        <button onClick={prevChart} style={{
                            background: 'white', border: '1px solid #ddd', borderRadius: '50%', width: '40px', height: '40px',
                            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
                        }}>&lt;</button>

                        <div style={{ flex: 1, textAlign: 'center' }}>
                            <div style={{
                                height: '240px',
                                width: '100%',
                                background: '#fff',
                                marginBottom: '1rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                overflow: 'hidden',
                                borderRadius: '8px',
                                border: '1px solid #eee',
                                boxShadow: 'inset 0 0 20px rgba(0,0,0,0.02)'
                            }}>
                                <img src={currentChart.preview} alt={currentChart.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                            <div style={{ fontWeight: '700', fontSize: '1.1rem', marginBottom: '0.25rem', color: '#222' }}>{currentChart.name}</div>
                            <div style={{ fontSize: '0.85rem', color: '#666', marginBottom: '1rem' }}>{currentChart.type} • {chartIndex + 1} of {MOCK_CHARTS.length}</div>

                            <button
                                onClick={() => toggleChartSelection(currentChart)}
                                style={{
                                    padding: '0.5rem 1.5rem',
                                    borderRadius: '30px',
                                    border: '1px solid',
                                    fontSize: '0.9rem',
                                    fontWeight: '600',
                                    background: isCurrentSelected ? '#e0e7ff' : 'white',
                                    borderColor: isCurrentSelected ? '#1B3AEC' : '#ddd',
                                    color: isCurrentSelected ? '#1B3AEC' : '#444',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    boxShadow: isCurrentSelected ? '0 0 0 1px #1B3AEC' : 'none'
                                }}
                            >
                                {isCurrentSelected ? '✓ Selected' : 'Select Chart'}
                            </button>
                        </div>

                        <button onClick={nextChart} style={{
                            background: 'white', border: '1px solid #ddd', borderRadius: '50%', width: '40px', height: '40px',
                            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
                        }}>&gt;</button>
                    </div>

                    {/* Selected Summary */}
                    {selectedCharts.length > 0 && (
                        <div style={{
                            padding: '1rem',
                            background: '#f0f4ff',
                            borderRadius: '8px',
                            marginBottom: '1.5rem',
                            border: '1px solid #dbeafe'
                        }}>
                            <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#1B3AEC', marginBottom: '0.75rem' }}>Selected ({selectedCharts.length}):</div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                {selectedCharts.map(c => (
                                    <span key={c.id} style={{
                                        background: 'white',
                                        border: '1px solid #c7d2fe',
                                        borderRadius: '20px',
                                        padding: '0.3rem 0.8rem',
                                        fontSize: '0.8rem',
                                        color: '#1B3AEC',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '6px',
                                        fontWeight: '500'
                                    }}>
                                        {c.name}
                                        <button
                                            onClick={() => toggleChartSelection(c)}
                                            style={{ border: 'none', background: 'none', color: '#1B3AEC', cursor: 'pointer', padding: 0, fontSize: '1.1rem', lineHeight: 0.8, opacity: 0.7 }}
                                        >&times;</button>
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.5rem', color: '#444' }}>Description / Note (Optional)</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Add context to why these charts are relevant..."
                            style={{
                                width: '100%',
                                padding: '0.8rem',
                                borderRadius: '8px',
                                border: '1px solid #ddd',
                                fontSize: '0.9rem',
                                resize: 'vertical',
                                minHeight: '80px',
                                boxSizing: 'border-box'
                            }}
                        />
                    </div>
                </div>

                <div style={{ padding: '1.25rem', borderTop: '1px solid #eee', display: 'flex', justifyContent: 'flex-end', gap: '1rem', background: '#fafafa' }}>
                    <button
                        onClick={resetAndClose}
                        style={{ padding: '0.7rem 1.5rem', borderRadius: '6px', border: '1px solid #ddd', background: 'white', cursor: 'pointer', fontWeight: '500', color: '#666' }}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleAdd}
                        disabled={selectedCharts.length === 0}
                        style={{
                            padding: '0.7rem 1.5rem',
                            borderRadius: '6px',
                            border: 'none',
                            background: selectedCharts.length > 0 ? '#1B3AEC' : '#ccc',
                            color: 'white',
                            fontWeight: '600',
                            cursor: selectedCharts.length > 0 ? 'pointer' : 'not-allowed',
                            boxShadow: selectedCharts.length > 0 ? '0 2px 5px rgba(27, 58, 236, 0.2)' : 'none'
                        }}
                    >
                        Attach Evidence
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EvidenceChartModal;
