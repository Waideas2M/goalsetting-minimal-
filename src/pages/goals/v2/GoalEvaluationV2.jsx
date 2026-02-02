import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useGoals } from '../../../context/GoalsContext';
import V2PageLayout from './V2PageLayout';
import EvidenceUploadModal from '../../../components/EvidenceUploadModal';
import EvidenceChartModal from '../../../components/EvidenceChartModal';
import EvidenceList from '../../../components/EvidenceList';
import '../goals.css';

const HAS_SKOLANALYS_ACCESS = true;

const GoalEvaluationV2 = () => {
    const { id } = useParams();
    const { goals, addEvaluation, updateEvaluation, deleteEvaluation, closeGoal, canAddEvaluation, canCloseGoal, addEvidence, removeEvidence, canAddEvidence } = useGoals();
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        whatWorked: '',
        whatDidntWork: '',
        whatNext: ''
    });

    // Evidence Modal State
    const [modalState, setModalState] = useState({ isOpen: false, type: 'upload', contextId: null, contextType: 'evaluation' });

    const goal = goals.find(g => g.id === id);

    if (!goal) {
        return (
            <V2PageLayout title="Evaluation">
                <div style={{ textAlign: 'center', padding: '3rem' }}>
                    <p>Goal not found.</p>
                </div>
            </V2PageLayout>
        );
    }

    const evaluations = goal.evaluations || [];
    const allowedToAdd = canAddEvaluation(goal);
    const allowedToClose = canCloseGoal(goal);
    const evidenceAllowed = canAddEvidence(goal, 'evaluation');
    const goalEvidence = goal.evidence || [];

    const handleSaveEvaluation = (e) => {
        e.preventDefault();
        if (!formData.whatWorked.trim() || !formData.whatDidntWork.trim() || !formData.whatNext.trim()) {
            alert('Please fill in all required fields.');
            return;
        }

        addEvaluation(id, formData);
        setFormData({ whatWorked: '', whatDidntWork: '', whatNext: '' });
        setIsAdding(false);
    };

    const handleUpdateEvaluation = (e) => {
        e.preventDefault();
        if (!formData.whatWorked.trim() || !formData.whatDidntWork.trim() || !formData.whatNext.trim()) {
            alert('Please fill in all required fields.');
            return;
        }
        updateEvaluation(id, editingId, formData);
        setEditingId(null);
        setFormData({ whatWorked: '', whatDidntWork: '', whatNext: '' });
    };



    const startEditing = (ev) => {
        setEditingId(ev.id);
        setFormData({
            whatWorked: ev.whatWorked,
            whatDidntWork: ev.whatDidntWork,
            whatNext: ev.whatNext
        });
        setIsAdding(false);
        // Scroll to top to see the form
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCloseGoal = () => {
        if (window.confirm('Are you sure you want to mark this goal as closed? This will update the goal status but all data will remain readable.')) {
            closeGoal(id);
        }
    };

    const openModal = (type, contextId) => {
        setModalState({ isOpen: true, type, contextId, contextType: 'evaluation' });
    };

    const handleAddEvidence = (evData) => {
        addEvidence(id, {
            ...evData,
            contextType: modalState.contextType,
            contextId: modalState.contextId
        });
    };

    return (
        <V2PageLayout title={goal.title}>
            <div style={{ marginBottom: '2.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '0.9rem', margin: 0, textTransform: 'uppercase', color: '#777' }}>Learning & Evaluations</h2>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        {!isAdding && !editingId && (
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                                <button
                                    className={`btn-primary ${!allowedToAdd ? 'disabled' : ''}`}
                                    onClick={() => allowedToAdd && setIsAdding(true)}
                                    disabled={!allowedToAdd}
                                >
                                    + Add evaluation
                                </button>
                                {!allowedToAdd && (
                                    <span style={{ fontSize: '0.75rem', color: '#999', marginTop: '0.4rem' }}>
                                        Evaluations can only be added while Active or Closed.
                                    </span>
                                )}
                            </div>
                        )}
                        {goal.status !== 'Closed' && goal.status !== 'Archived' && (
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                                <button
                                    className={`btn-secondary ${!allowedToClose ? 'disabled' : ''}`}
                                    style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}
                                    onClick={() => allowedToClose && handleCloseGoal()}
                                    disabled={!allowedToClose}
                                >
                                    Mark goal as closed
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {(isAdding || editingId) && (
                    <div style={{ background: '#f9f9f9', padding: '2rem', borderRadius: '8px', marginBottom: '3rem', border: '1px solid #ddd' }}>
                        <h3 style={{ fontSize: '1.1rem', marginBottom: '1.5rem' }}>
                            {editingId ? 'Edit Evaluation' : 'New Reflective Evaluation'}
                        </h3>
                        <form onSubmit={editingId ? handleUpdateEvaluation : handleSaveEvaluation}>
                            <div className="form-group">
                                <label className="form-label" style={{ fontSize: '0.8rem' }}>What worked and why? *</label>
                                <textarea
                                    className="form-textarea"
                                    placeholder="Describe successful actions and their impact..."
                                    rows="4"
                                    value={formData.whatWorked}
                                    onChange={(e) => setFormData({ ...formData, whatWorked: e.target.value })}
                                    required
                                    autoFocus
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label" style={{ fontSize: '0.8rem' }}>What didn't work and why? *</label>
                                <textarea
                                    className="form-textarea"
                                    placeholder="Describe challenges or actions that didn't have the desired effect..."
                                    rows="4"
                                    value={formData.whatDidntWork}
                                    onChange={(e) => setFormData({ ...formData, whatDidntWork: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label" style={{ fontSize: '0.8rem' }}>What should be done differently next time? *</label>
                                <textarea
                                    className="form-textarea"
                                    placeholder="Key takeaways for future goals or interventions..."
                                    rows="4"
                                    value={formData.whatNext}
                                    onChange={(e) => setFormData({ ...formData, whatNext: e.target.value })}
                                    required
                                />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
                                <div style={{ display: 'flex', gap: '0.75rem' }}>
                                    <button type="submit" className="btn-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>
                                        {editingId ? 'Update Evaluation' : 'Save Evaluation'}
                                    </button>
                                    <button type="button" className="btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }} onClick={() => { setIsAdding(false); setEditingId(null); setFormData({ whatWorked: '', whatDidntWork: '', whatNext: '' }); }}>Cancel</button>
                                </div>
                            </div>
                        </form>
                    </div>
                )}

                <div className="evaluations-list">
                    {evaluations.length === 0 ? (
                        <div style={{ padding: '3rem', textAlign: 'center', border: '1px solid #eee', borderRadius: '8px', background: '#fafafa' }}>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#333', marginBottom: '0.5rem' }}>Reflect and capture learning</h3>
                            <p style={{ color: '#666', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
                                What worked, what didn’t, and what should be done differently next time?
                            </p>
                            <button
                                className={`btn-primary ${!allowedToAdd ? 'disabled' : ''}`}
                                onClick={() => allowedToAdd && setIsAdding(true)}
                                disabled={!allowedToAdd}
                            >
                                Add evaluation
                            </button>
                        </div>
                    ) : (
                        [...evaluations].reverse().map((evaluation) => {
                            const evEvidence = goalEvidence.filter(e => e.contextType === 'evaluation' && e.contextId === evaluation.id);

                            return (
                                <div key={evaluation.id} style={{ padding: '2rem', border: '1px solid #eee', borderRadius: '8px', marginBottom: '2.5rem', background: 'white', position: 'relative' }}>
                                    <div style={{ position: 'absolute', top: '1.5rem', right: '2rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                        {allowedToAdd && (
                                            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                                <button
                                                    className="btn-secondary"
                                                    style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                                                    onClick={() => startEditing(evaluation)}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        if (window.confirm("Are you sure you want to delete this evaluation?")) {
                                                            deleteEvaluation(id, evaluation.id);
                                                        }
                                                    }}
                                                    style={{
                                                        background: 'none',
                                                        border: 'none',
                                                        color: '#999',
                                                        cursor: 'pointer',
                                                        padding: '0.25rem',
                                                        display: 'flex',
                                                        alignItems: 'center'
                                                    }}
                                                    title="Delete evaluation"
                                                    onMouseEnter={(e) => e.currentTarget.style.color = '#dc3545'}
                                                    onMouseLeave={(e) => e.currentTarget.style.color = '#999'}
                                                >
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                                                </button>
                                            </div>
                                        )}
                                        <span style={{ fontSize: '0.8rem', color: '#999' }}>
                                            {new Date(evaluation.dateAdded).toLocaleDateString()}
                                        </span>
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
                                        <div>
                                            <h4 style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#00875a', marginBottom: '0.75rem', fontWeight: 'bold' }}>Successful aspects</h4>
                                            <div style={{ fontSize: '1rem', lineHeight: '1.6', color: '#333' }}>{evaluation.whatWorked}</div>
                                        </div>
                                        <div>
                                            <h4 style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#de350b', marginBottom: '0.75rem', fontWeight: 'bold' }}>Challenges & obstacles</h4>
                                            <div style={{ fontSize: '1rem', lineHeight: '1.6', color: '#333' }}>{evaluation.whatDidntWork}</div>
                                        </div>
                                    </div>

                                    <div style={{ marginBottom: '2rem', padding: '1.25rem', background: '#f8f9ff', borderRadius: '8px', borderLeft: '4px solid #1B3AEC' }}>
                                        <h4 style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#1B3AEC', marginBottom: '0.5rem', fontWeight: 'bold' }}>Future recommendations</h4>
                                        <div style={{ fontSize: '1.1rem', lineHeight: '1.5', color: '#000', fontWeight: '500' }}>{evaluation.whatNext}</div>
                                    </div>

                                    {/* Evidence for Evaluation */}
                                    <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: '1.5rem' }}>
                                        {evidenceAllowed && (
                                            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.5rem' }}>
                                                <button
                                                    onClick={() => openModal('upload', evaluation.id)}
                                                    style={{ background: 'none', border: 'none', color: '#666', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', padding: 0 }}
                                                >
                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path></svg>
                                                    Attach files
                                                </button>
                                                {HAS_SKOLANALYS_ACCESS && (
                                                    <button
                                                        onClick={() => openModal('chart', evaluation.id)}
                                                        style={{ background: 'none', border: 'none', color: '#666', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', padding: 0 }}
                                                    >
                                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
                                                        Add charts
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                        <EvidenceList
                                            evidence={evEvidence}
                                            allowedToAdd={false}
                                            onRemove={evidenceAllowed ? (evId) => removeEvidence(id, evId) : null}
                                        />
                                    </div>
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

export default GoalEvaluationV2;
