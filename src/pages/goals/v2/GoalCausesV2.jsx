import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useGoals } from '../../../context/GoalsContext';
import V2PageLayout from './V2PageLayout';
import EvidenceUploadModal from '../../../components/EvidenceUploadModal';
import EvidenceChartModal from '../../../components/EvidenceChartModal';
import EvidenceList from '../../../components/EvidenceList';
import '../goals.css';

const HAS_SKOLANALYS_ACCESS = true;

const SUCCESS_FACTORS = [
    'Health-promoting learning environment',
    'Compensatory measures',
    'Competent leadership',
    'Professional development',
    'Systematic quality work with a focus on teaching',
    'Clear division of roles and responsibilities',
    'Trusting climate'
];

const CONFIDENCE_LEVELS = [
    { value: 'Certain', label: 'Certain — strongly supported by current data and consistent observations' },
    { value: 'Uncertain', label: 'Uncertain — some indications, but evidence is mixed or incomplete' },
    { value: 'Need more data', label: 'Need more data — not enough data or observations to assess reliably' }
];

const GoalCausesV2 = () => {
    const { id } = useParams();
    const { goals, addHypothesis, updateHypothesis, deleteHypothesis, canAddHypothesis, addEvidence, removeEvidence, canAddEvidence, updateSituationAnalysis } = useGoals();
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [newHypothesis, setNewHypothesis] = useState({
        title: '',
        notes: '',
        successFactor: '',
        confidenceLevel: ''
    });

    // Evidence Modal State
    const [modalState, setModalState] = useState({ isOpen: false, type: 'upload', contextId: null, contextType: 'hypothesis' });

    const goal = goals.find(g => g.id === id);

    if (!goal) {
        return (
            <V2PageLayout title="Investigate Causes">
                <div style={{ textAlign: 'center', padding: '3rem' }}>
                    <p>Goal not found.</p>
                </div>
            </V2PageLayout>
        );
    }

    const isClosed = goal.status === 'Closed';
    const isArchived = goal.status === 'Archived';
    const allowedToModify = canAddHypothesis(goal);
    const evidenceAllowed = canAddEvidence(goal, 'hypothesis');

    const handleAddClick = () => {
        if (isArchived) return;
        setIsAdding(true);
    };

    const handleSave = (e) => {
        e.preventDefault();
        if (!newHypothesis.title.trim() || !newHypothesis.successFactor || !newHypothesis.confidenceLevel) {
            alert('Please fill in all required fields (Success Factor and Confidence Level).');
            return;
        }

        addHypothesis(id, newHypothesis);
        setNewHypothesis({ title: '', notes: '', successFactor: '', confidenceLevel: '' });
        setIsAdding(false);
    };

    const handleUpdate = (e, hId) => {
        e.preventDefault();
        if (!newHypothesis.title.trim() || !newHypothesis.successFactor || !newHypothesis.confidenceLevel) {
            alert('Please fill in all required fields.');
            return;
        }
        updateHypothesis(id, hId, newHypothesis);
        setEditingId(null);
        setNewHypothesis({ title: '', notes: '', successFactor: '', confidenceLevel: '' });
    };

    const handleDelete = (hId) => {
        const h = goal.hypotheses.find(hype => hype.id === hId);
        const linkedInterventions = goal.interventions?.filter(i => i.hypothesisIds?.includes(hId));

        let message = "Are you sure you want to delete this hypothesis?";
        if (linkedInterventions?.length > 0) {
            message = `Warning: This hypothesis is linked to ${linkedInterventions.length} intervention(s). Deleting it will remove these links but keep the interventions. Continue?`;
        }

        if (window.confirm(message)) {
            deleteHypothesis(id, hId);
            setEditingId(null);
        }
    };

    const startEditing = (h) => {
        setEditingId(h.id);
        setNewHypothesis({
            title: h.title,
            notes: h.notes,
            successFactor: h.successFactor || '',
            confidenceLevel: h.confidenceLevel || ''
        });
        setIsAdding(false);
    };

    const openModal = (type, contextId) => {
        setModalState({ isOpen: true, type, contextId, contextType: 'hypothesis' });
    };

    const handleAddEvidence = (evData) => {
        addEvidence(id, {
            ...evData,
            contextType: modalState.contextType,
            contextId: modalState.contextId
        });
    };

    const goalEvidence = goal.evidence || [];

    return (
        <V2PageLayout title={goal.title}>
            <div style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h2 style={{ fontSize: '0.9rem', margin: 0, textTransform: 'uppercase', color: '#777' }}>Hypotheses</h2>
                    {!isAdding && !editingId && (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                            <button
                                className={`btn-primary ${isArchived ? 'disabled' : ''}`}
                                onClick={handleAddClick}
                                disabled={isArchived}
                            >
                                Add hypothesis
                            </button>
                            {isArchived && (
                                <span style={{ fontSize: '0.75rem', color: '#999', marginTop: '0.4rem' }}>
                                    Hypotheses are locked in archived goals.
                                </span>
                            )}
                        </div>
                    )}
                </div>

                {/* Situation Analysis Section */}
                <SituationAnalysisSection goal={goal} isArchived={isArchived} onUpdate={(data) => updateSituationAnalysis(id, data)} />

                {isAdding && (
                    <div style={{ background: '#f9f9f9', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem', border: '1px solid #ddd' }}>
                        <form onSubmit={handleSave}>
                            <div className="form-group">
                                <label className="form-label" style={{ fontSize: '0.8rem' }}>Hypothesis Statement *</label>
                                <p style={{ fontSize: '0.75rem', color: '#666', marginTop: '0.2rem', marginBottom: '0.5rem' }}>What do you think might explain the current situation?</p>
                                <textarea
                                    className="form-textarea"
                                    placeholder="Example: Students may struggle to apply reading strategies independently."
                                    rows="2"
                                    value={newHypothesis.title}
                                    onChange={(e) => setNewHypothesis({ ...newHypothesis, title: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label" style={{ fontSize: '0.8rem' }}>Success Factor (Skolverket) *</label>
                                <select
                                    className="form-select"
                                    value={newHypothesis.successFactor}
                                    onChange={(e) => setNewHypothesis({ ...newHypothesis, successFactor: e.target.value })}
                                    required
                                >
                                    <option value="">Select a success factor...</option>
                                    {SUCCESS_FACTORS.map(factor => (
                                        <option key={factor} value={factor}>{factor}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label className="form-label" style={{ fontSize: '0.8rem' }}>Confidence Level *</label>
                                {CONFIDENCE_LEVELS.map((level) => (
                                    <div key={level.value} style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                                        <input
                                            type="radio"
                                            name="confidence"
                                            id={`conf-${level.value}`}
                                            value={level.value}
                                            checked={newHypothesis.confidenceLevel === level.value}
                                            onChange={(e) => setNewHypothesis({ ...newHypothesis, confidenceLevel: e.target.value })}
                                            style={{ marginRight: '0.5rem' }}
                                            required
                                        />
                                        <label htmlFor={`conf-${level.value}`} style={{ cursor: 'pointer' }}>{level.label}</label>
                                    </div>
                                ))}
                                <small style={{ color: '#666', fontStyle: 'italic' }}>You can update confidence later as more evidence is added.</small>
                            </div>

                            <div className="form-group">
                                <label className="form-label" style={{ fontSize: '0.8rem' }}>Notes / Evidence (Optional)</label>
                                <textarea
                                    className="form-textarea"
                                    placeholder="Observations or data that support this hypothesis..."
                                    rows="3"
                                    value={newHypothesis.notes}
                                    onChange={(e) => setNewHypothesis({ ...newHypothesis, notes: e.target.value })}
                                />
                            </div>
                            <div style={{ display: 'flex', gap: '0.75rem' }}>
                                <button type="submit" className="btn-primary">Save Hypothesis</button>
                                <button type="button" className="btn-secondary" onClick={() => setIsAdding(false)}>Cancel</button>
                            </div>
                        </form>
                    </div>
                )}

                <div className="hypotheses-list">
                    {!goal.hypotheses || goal.hypotheses.length === 0 ? (
                        <div style={{ padding: '3rem', textAlign: 'center', border: '1px solid #eee', borderRadius: '8px', background: '#fafafa' }}>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#333', marginBottom: '0.5rem' }}>Start by exploring possible causes</h3>
                            <p style={{ color: '#666', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
                                What might explain the current situation? Add one or more hypotheses to guide your actions.
                            </p>
                            <button
                                className={`btn-primary ${isArchived ? 'disabled' : ''}`}
                                onClick={handleAddClick}
                                disabled={isArchived}
                            >
                                Add hypothesis
                            </button>
                        </div>
                    ) : (
                        goal.hypotheses.map((h, index) => {
                            const hEvidence = goalEvidence.filter(ev => ev.contextType === 'hypothesis' && ev.contextId === h.id);

                            return (
                                <div key={h.id} style={{ padding: '1.25rem', border: '1px solid #eee', borderRadius: '8px', marginBottom: '1rem', background: 'white' }}>
                                    {editingId === h.id ? (
                                        <form onSubmit={(e) => handleUpdate(e, h.id)}>
                                            <div className="form-group">
                                                <label className="form-label" style={{ fontSize: '0.8rem' }}>Hypothesis Statement *</label>
                                                <textarea
                                                    className="form-textarea"
                                                    rows="2"
                                                    value={newHypothesis.title}
                                                    onChange={(e) => setNewHypothesis({ ...newHypothesis, title: e.target.value })}
                                                    required
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label className="form-label" style={{ fontSize: '0.8rem' }}>Success Factor (Skolverket) *</label>
                                                <select
                                                    className="form-select"
                                                    value={newHypothesis.successFactor}
                                                    onChange={(e) => setNewHypothesis({ ...newHypothesis, successFactor: e.target.value })}
                                                    required
                                                >
                                                    <option value="">Select a success factor...</option>
                                                    {SUCCESS_FACTORS.map(factor => (
                                                        <option key={factor} value={factor}>{factor}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="form-group">
                                                <label className="form-label" style={{ fontSize: '0.8rem' }}>Confidence Level *</label>
                                                {CONFIDENCE_LEVELS.map((level) => (
                                                    <div key={level.value} style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                                                        <input
                                                            type="radio"
                                                            name={`confidence-${h.id}`}
                                                            id={`conf-${h.id}-${level.value}`}
                                                            value={level.value}
                                                            checked={newHypothesis.confidenceLevel === level.value}
                                                            onChange={(e) => setNewHypothesis({ ...newHypothesis, confidenceLevel: e.target.value })}
                                                            style={{ marginRight: '0.5rem' }}
                                                            required
                                                        />
                                                        <label htmlFor={`conf-${h.id}-${level.value}`} style={{ cursor: 'pointer' }}>{level.label}</label>
                                                    </div>
                                                ))}
                                                <small style={{ color: '#666', fontStyle: 'italic' }}>You can update confidence later as more evidence is added.</small>
                                            </div>
                                            <div className="form-group">
                                                <label className="form-label" style={{ fontSize: '0.8rem' }}>Notes / Evidence (Optional)</label>
                                                <textarea
                                                    className="form-textarea"
                                                    rows="2"
                                                    value={newHypothesis.notes}
                                                    onChange={(e) => setNewHypothesis({ ...newHypothesis, notes: e.target.value })}
                                                />
                                            </div>
                                            <div style={{ display: 'flex', gap: '0.75rem' }}>
                                                <button type="submit" className="btn-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>Update</button>
                                                <button type="button" className="btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }} onClick={() => setEditingId(null)}>Cancel</button>
                                            </div>
                                        </form>
                                    ) : (
                                        <div>
                                            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                                <div style={{ display: 'flex', gap: '1rem' }}>
                                                    <div style={{
                                                        width: '24px',
                                                        height: '24px',
                                                        background: '#eee',
                                                        borderRadius: '50%',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        fontSize: '0.75rem',
                                                        fontWeight: 'bold',
                                                        flexShrink: 0,
                                                        marginTop: '2px'
                                                    }}>
                                                        {index + 1}
                                                    </div>
                                                    <div>
                                                        <div style={{ fontWeight: '600', fontSize: '1.05rem', marginBottom: '0.4rem' }}>{h.title}</div>
                                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', marginBottom: '0.5rem', fontSize: '0.85rem', color: '#555' }}>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                                <span style={{ fontWeight: 500, color: '#666' }}>Success factor:</span>
                                                                <span style={{ background: '#e3f2fd', color: '#0d47a1', padding: '0.1rem 0.4rem', borderRadius: '4px', fontSize: '0.8rem' }}>
                                                                    {h.successFactor}
                                                                </span>
                                                            </div>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                                <span style={{ fontWeight: 500, color: '#666' }}>Confidence:</span>
                                                                <span style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#f5f5f5', color: '#616161', padding: '0.1rem 0.4rem', borderRadius: '4px', fontSize: '0.8rem', border: '1px solid #e0e0e0' }}>
                                                                    <span style={{
                                                                        width: '8px',
                                                                        height: '8px',
                                                                        borderRadius: '50%',
                                                                        background: h.confidenceLevel === 'Certain' ? '#2e7d32' : h.confidenceLevel === 'Uncertain' ? '#f9a825' : '#757575',
                                                                        display: 'inline-block'
                                                                    }}></span>
                                                                    {h.confidenceLevel}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        {h.notes && (
                                                            <div style={{ color: '#666', fontSize: '0.9rem', whiteSpace: 'pre-wrap' }}>
                                                                {h.notes}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                {allowedToModify && (
                                                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                                        <button
                                                            className={`btn-secondary ${isArchived ? 'disabled' : ''}`}
                                                            style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                                                            onClick={() => startEditing(h)}
                                                            disabled={isArchived}
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(h.id)}
                                                            disabled={isArchived}
                                                            style={{
                                                                background: 'none',
                                                                border: 'none',
                                                                cursor: isArchived ? 'not-allowed' : 'pointer',
                                                                padding: '0.25rem',
                                                                color: '#999',
                                                                display: 'flex',
                                                                alignItems: 'center'
                                                            }}
                                                            title="Delete hypothesis"
                                                            onMouseEnter={(e) => !isArchived && (e.currentTarget.style.color = '#dc3545')}
                                                            onMouseLeave={(e) => !isArchived && (e.currentTarget.style.color = '#999')}
                                                        >
                                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                                                        </button>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Evidence Actions & List */}
                                            <div style={{ marginLeft: '2.5rem' }}>
                                                {evidenceAllowed && (
                                                    <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.5rem' }}>
                                                        <button
                                                            onClick={() => openModal('upload', h.id)}
                                                            style={{ background: 'none', border: 'none', color: '#666', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', padding: 0 }}
                                                        >
                                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path></svg>
                                                            Attach files
                                                        </button>
                                                        {HAS_SKOLANALYS_ACCESS && (
                                                            <button
                                                                onClick={() => openModal('chart', h.id)}
                                                                style={{ background: 'none', border: 'none', color: '#666', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', padding: 0 }}
                                                            >
                                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
                                                                Add charts
                                                            </button>
                                                        )}
                                                    </div>
                                                )}

                                                <EvidenceList
                                                    evidence={hEvidence}
                                                    allowedToAdd={false}
                                                    onRemove={evidenceAllowed ? (evId) => removeEvidence(id, evId) : null}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            <EvidenceUploadModal
                isOpen={modalState.isOpen && modalState.type === 'upload'}
                onClose={() => setModalState({ ...modalState, isOpen: false })}
                onAdd={handleAddEvidence}
                contextType={modalState.contextType}
                contextId={modalState.contextId}
            />

            <EvidenceChartModal
                isOpen={modalState.isOpen && modalState.type === 'chart'}
                onClose={() => setModalState({ ...modalState, isOpen: false })}
                onAdd={handleAddEvidence}
                contextType={modalState.contextType}
                contextId={modalState.contextId}
            />
        </V2PageLayout>
    );
};

const SituationAnalysisSection = ({ goal, isArchived, onUpdate }) => {
    // Default to expanded if all fields are empty
    const isEmpty = !goal.situationAnalysis || (
        !goal.situationAnalysis.dataSummary &&
        !goal.situationAnalysis.affectedGroups &&
        !goal.situationAnalysis.patternsOverTime &&
        !goal.situationAnalysis.connectedFactors
    );

    const [isExpanded, setIsExpanded] = useState(isEmpty);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState(goal.situationAnalysis || {
        dataSummary: '',
        affectedGroups: '',
        patternsOverTime: '',
        connectedFactors: ''
    });

    const handleSave = () => {
        onUpdate(formData);
        setIsEditing(false);
        if (
            !formData.dataSummary &&
            !formData.affectedGroups &&
            !formData.patternsOverTime &&
            !formData.connectedFactors
        ) {
            // Keep expanded if still empty
        } else {
            // Optional: Auto-collapse on save? adhering to user request: "Collapsible (collapsed by default once filled)"
            setIsExpanded(false);
        }
    };

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    if (isEmpty && !isExpanded) {
        // If empty but somehow collapsed (shouldn't happen by default logic, but good for safety), default to expanded
        setIsExpanded(true);
    }

    return (
        <div style={{ marginBottom: '2.5rem', border: '1px solid #e0e0e0', borderRadius: '8px', overflow: 'hidden' }}>
            <div
                style={{
                    padding: '1rem 1.5rem',
                    background: '#f5f7fa',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer',
                    borderBottom: isExpanded ? '1px solid #e0e0e0' : 'none'
                }}
                onClick={toggleExpand}
            >
                <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#333', margin: 0 }}>Situation analysis (optional)</h3>
                    <p style={{ margin: '0.25rem 0 0', fontSize: '0.85rem', color: '#666' }}>Capture what you see in the data before formulating hypotheses.</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {!isEmpty && !isExpanded && !isEditing && (
                        <button
                            className="btn-secondary"
                            style={{ padding: '0.25rem 0.75rem', fontSize: '0.8rem' }}
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsExpanded(true);
                                setIsEditing(true);
                            }}
                            disabled={isArchived}
                        >
                            Edit
                        </button>
                    )}
                    <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.5rem' }}>
                        {isExpanded ? (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15"></polyline></svg>
                        ) : (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                        )}
                    </button>
                </div>
            </div>

            {isExpanded && (
                <div style={{ padding: '1.5rem', background: 'white' }}>
                    {isEditing || isEmpty ? (
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                            <div className="form-group">
                                <label className="form-label" style={{ fontSize: '0.85rem' }}>What does the data show so far?</label>
                                <textarea
                                    className="form-textarea"
                                    placeholder="Reading results have declined for Grade 6 over the last two terms, while attendance has remained stable."
                                    rows="3"
                                    value={formData.dataSummary}
                                    onChange={(e) => setFormData({ ...formData, dataSummary: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label" style={{ fontSize: '0.85rem' }}>Which student groups are most affected?</label>
                                <textarea
                                    className="form-textarea"
                                    placeholder="Students with reading support needs and students new to the school show the largest gaps."
                                    rows="3"
                                    value={formData.affectedGroups}
                                    onChange={(e) => setFormData({ ...formData, affectedGroups: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label" style={{ fontSize: '0.85rem' }}>What patterns are visible over time?</label>
                                <textarea
                                    className="form-textarea"
                                    placeholder="Comprehension scores drop after longer text assignments and have not recovered since last year."
                                    rows="3"
                                    value={formData.patternsOverTime}
                                    onChange={(e) => setFormData({ ...formData, patternsOverTime: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label" style={{ fontSize: '0.85rem' }}>What factors seem to be connected?</label>
                                <textarea
                                    className="form-textarea"
                                    placeholder="Lower comprehension appears alongside fewer structured reading discussions and recent staff changes."
                                    rows="3"
                                    value={formData.connectedFactors}
                                    onChange={(e) => setFormData({ ...formData, connectedFactors: e.target.value })}
                                />
                            </div>
                            <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                                <button
                                    className="btn-primary"
                                    onClick={handleSave}
                                    disabled={isArchived}
                                >
                                    Save analysis
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                            <div>
                                <h4 style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#999', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>Key Observations</h4>
                                <p style={{ margin: 0, color: '#333', whiteSpace: 'pre-wrap' }}>{formData.dataSummary || '—'}</p>
                            </div>
                            <div>
                                <h4 style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#999', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>Affected Groups</h4>
                                <p style={{ margin: 0, color: '#333', whiteSpace: 'pre-wrap' }}>{formData.affectedGroups || '—'}</p>
                            </div>
                            <div>
                                <h4 style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#999', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>Trends & Patterns</h4>
                                <p style={{ margin: 0, color: '#333', whiteSpace: 'pre-wrap' }}>{formData.patternsOverTime || '—'}</p>
                            </div>
                            <div>
                                <h4 style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#999', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>Connected Factors</h4>
                                <p style={{ margin: 0, color: '#333', whiteSpace: 'pre-wrap' }}>{formData.connectedFactors || '—'}</p>
                            </div>
                            <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', marginTop: '1rem', borderTop: '1px solid #eee', paddingTop: '1rem' }}>
                                <button
                                    className="btn-secondary"
                                    onClick={() => setIsEditing(true)}
                                    disabled={isArchived}
                                >
                                    Edit analysis
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default GoalCausesV2;
