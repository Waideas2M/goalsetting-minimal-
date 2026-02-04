import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGoals } from '../../../context/GoalsContext';
import V3PageLayout from './V3PageLayout';
import EvidenceUploadModal from '../../../components/EvidenceUploadModal';
import EvidenceChartModal from '../../../components/EvidenceChartModal';
import EvidenceList from '../../../components/EvidenceList';
import '../goals.css';

const HAS_SKOLANALYS_ACCESS = true;

const GoalInterventionDetailV3 = () => {
    const { id, interventionId } = useParams();
    const navigate = useNavigate();
    const { goals, addFollowUp, addEvidence, removeEvidence, updateIntervention, deleteIntervention, deleteFollowUp, canAddEvidence, canAddFollowUp } = useGoals();
    const [isAdding, setIsAdding] = useState(false);
    const [formData, setFormData] = useState({
        type: 'Implementation',
        observation: '',
        checkpointDate: ''
    });

    // Edit Intervention State
    const [isEditingIntervention, setIsEditingIntervention] = useState(false);
    const [interventionForm, setInterventionForm] = useState(null);

    // Evidence Modal State
    const [modalState, setModalState] = useState({ isOpen: false, type: 'upload', contextId: null, contextType: 'follow-up' });

    const goal = goals.find(g => g.id === id);
    // Don't return early yet!

    const intervention = goal ? (goal.interventions || []).find(i => i.id === interventionId) : null;

    const isArchived = goal?.status === 'Archived';
    const allowedToAdd = canAddFollowUp(goal);
    const evidenceAllowed = canAddEvidence(goal, 'follow-up');
    const goalEvidence = goal?.evidence || [];
    const hypotheses = goal?.hypotheses || [];
    const canEditIntervention = goal?.status === 'Draft' || goal?.status === 'Active';

    useEffect(() => {
        if (intervention) {
            setInterventionForm({
                description: intervention.description,
                expectedEffect: intervention.expectedEffect,
                hypothesisIds: intervention.hypothesisIds || []
            });
        }
    }, [intervention]);

    if (!goal) return <V3PageLayout title="Intervention Detail">Goal not found.</V3PageLayout>;
    if (!intervention) return <V3PageLayout title="Intervention Detail">Intervention not found.</V3PageLayout>;

    const handleSaveFollowUp = (e) => {
        e.preventDefault();
        if (!formData.observation.trim()) return;

        addFollowUp(id, interventionId, formData);
        setFormData({ type: 'Implementation', observation: '', checkpointDate: '' });
        setIsAdding(false);
    };

    const handleDeleteFollowUp = (fuId) => {
        if (window.confirm("Are you sure you want to delete this follow-up?")) {
            deleteFollowUp(id, interventionId, fuId);
        }
    };

    const handleUpdateIntervention = (e) => {
        e.preventDefault();
        if (!interventionForm.description.trim() || !interventionForm.expectedEffect.trim() || interventionForm.hypothesisIds.length === 0) {
            alert('Please fill in all required fields and link at least one hypothesis.');
            return;
        }
        updateIntervention(id, interventionId, interventionForm);
        setIsEditingIntervention(false);
    };

    const handleDeleteIntervention = () => {
        let message = "Are you sure you want to delete this intervention?";
        if ((intervention.followUps || []).length > 0) {
            message = `Warning: This intervention has ${(intervention.followUps || []).length} recorded follow-up(s). Deleting the intervention will permanently delete all associated follow-ups. Continue?`;
        }

        if (window.confirm(message)) {
            deleteIntervention(id, interventionId);
            navigate(`/goals/${id}/interventions`);
        }
    };

    const toggleHypothesis = (hId) => {
        setInterventionForm(prev => {
            const current = [...prev.hypothesisIds];
            if (current.includes(hId)) {
                return { ...prev, hypothesisIds: current.filter(item => item !== hId) };
            } else {
                return { ...prev, hypothesisIds: [...current, hId] };
            }
        });
    };

    const openModal = (type, contextId) => {
        setModalState({ isOpen: true, type, contextId, contextType: 'follow-up' });
    };

    const handleAddEvidence = (evData) => {
        addEvidence(id, {
            ...evData,
            contextType: modalState.contextType,
            contextId: modalState.contextId
        });
    };

    const breadcrumbs = [
        { label: 'Goals', to: '/goals' },
        { label: goal.title, to: `/goals/${id}/overview` },
        { label: 'Interventions', to: `/goals/${id}/interventions` }
    ];

    const actions = canEditIntervention && !isArchived && !isEditingIntervention ? (
        <>
            <button
                className="btn-secondary"
                onClick={() => setIsEditingIntervention(true)}
                disabled={isArchived}
                style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
            >
                Edit
            </button>
            <button
                onClick={handleDeleteIntervention}
                disabled={isArchived}
                style={{
                    background: 'none',
                    border: 'none',
                    cursor: isArchived ? 'not-allowed' : 'pointer',
                    padding: '0.4rem',
                    color: '#999',
                    display: 'flex',
                    alignItems: 'center'
                }}
                title="Delete intervention"
                onMouseEnter={(e) => !isArchived && (e.currentTarget.style.color = '#dc3545')}
                onMouseLeave={(e) => !isArchived && (e.currentTarget.style.color = '#999')}
            >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
            </button>
        </>
    ) : null;

    return (
        <V3PageLayout
            title={isEditingIntervention ? `Edit: ${intervention.description}` : intervention.description}
            isItemView={true}
            breadcrumbs={breadcrumbs}
            actions={actions}
        >
            <div style={{ marginBottom: '2rem' }}>

                {/* INTERVENTION CARD (VIEW / EDIT) */}
                <div style={{ background: '#f0f4ff', padding: '1.5rem', borderRadius: '8px', borderLeft: '4px solid #1B3AEC', marginBottom: '2rem' }}>

                    {!isEditingIntervention ? (
                        <>
                            <div style={{ color: '#555', fontSize: '0.95rem' }}>
                                <strong>Expected effect:</strong> {intervention.expectedEffect}
                            </div>
                            <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                {intervention.hypothesisIds?.map(hId => {
                                    const h = hypotheses.find(hyp => hyp.id === hId);
                                    return h ? (
                                        <span key={hId} style={{ fontSize: '0.75rem', background: 'white', color: '#1B3AEC', padding: '0.2rem 0.5rem', borderRadius: '4px', border: '1px solid #d0d7ff' }}>
                                            Linked to: {h.title}
                                        </span>
                                    ) : null;
                                })}
                            </div>
                        </>
                    ) : (
                        <form onSubmit={handleUpdateIntervention} style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', border: '1px solid #ddd' }}>
                            <div className="form-group">
                                <label className="form-label" style={{ fontSize: '0.8rem' }}>Intervention Description *</label>
                                <textarea
                                    className="form-textarea"
                                    rows="2"
                                    value={interventionForm.description}
                                    onChange={(e) => setInterventionForm({ ...interventionForm, description: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label" style={{ fontSize: '0.8rem' }}>Expected Effect *</label>
                                <textarea
                                    className="form-textarea"
                                    rows="2"
                                    value={interventionForm.expectedEffect}
                                    onChange={(e) => setInterventionForm({ ...interventionForm, expectedEffect: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label" style={{ fontSize: '0.8rem' }}>Linked Hypotheses *</label>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px', maxHeight: '150px', overflowY: 'auto' }}>
                                    {hypotheses.map(h => (
                                        <label key={h.id} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', gap: '0.5rem' }}>
                                            <input
                                                type="checkbox"
                                                checked={interventionForm.hypothesisIds.includes(h.id)}
                                                onChange={() => toggleHypothesis(h.id)}
                                            />
                                            <span style={{ fontSize: '0.9rem' }}>{h.title}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
                                <div style={{ display: 'flex', gap: '0.75rem' }}>
                                    <button type="submit" className="btn-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>Save Changes</button>
                                    <button type="button" className="btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }} onClick={() => setIsEditingIntervention(false)}>Cancel</button>
                                </div>
                            </div>
                        </form>
                    )}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h3 style={{ fontSize: '0.9rem', margin: 0, textTransform: 'uppercase', color: '#777' }}>Follow-ups</h3>
                    {!isAdding && allowedToAdd && (
                        <button
                            className="btn-primary"
                            onClick={() => setIsAdding(true)}
                        >
                            + Record follow-up
                        </button>
                    )}
                </div>

                {isAdding && (
                    <div style={{ background: '#f9f9f9', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem', border: '1px solid #ddd' }}>
                        <form onSubmit={handleSaveFollowUp}>
                            <div className="form-group" style={{ maxWidth: '300px' }}>
                                <label className="form-label" style={{ fontSize: '0.8rem' }}>Type *</label>
                                <select
                                    className="form-select"
                                    value={formData.type}
                                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                    required
                                >
                                    <option value="Implementation">Implementation</option>
                                    <option value="Effect">Effect</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label" style={{ fontSize: '0.8rem' }}>Observation *</label>
                                <p style={{ fontSize: '0.75rem', color: '#666', marginTop: '0.2rem', marginBottom: '0.5rem' }}>What have you observed so far?</p>
                                <textarea
                                    className="form-textarea"
                                    placeholder="Example: The group was engaged, but transition time took longer than expected."
                                    rows="4"
                                    value={formData.observation}
                                    onChange={(e) => setFormData({ ...formData, observation: e.target.value })}
                                    required
                                    autoFocus
                                />
                            </div>
                            <div className="form-group" style={{ maxWidth: '300px' }}>
                                <label className="form-label" style={{ fontSize: '0.8rem' }}>Checkpoint Date (Optional)</label>
                                <input
                                    type="date"
                                    className="form-input"
                                    value={formData.checkpointDate}
                                    onChange={(e) => setFormData({ ...formData, checkpointDate: e.target.value })}
                                />
                            </div>
                            <div style={{ display: 'flex', gap: '0.75rem' }}>
                                <button type="submit" className="btn-primary">Save Follow-up</button>
                                <button type="button" className="btn-secondary" onClick={() => setIsAdding(false)}>Cancel</button>
                            </div>
                        </form>
                    </div>
                )}

                <div className="follow-ups-list">
                    {!intervention.followUps || intervention.followUps.length === 0 ? (
                        <div style={{ padding: '3rem', textAlign: 'center', border: '1px solid #eee', borderRadius: '8px', background: '#fafafa' }}>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#333', marginBottom: '0.5rem' }}>Track what happens</h3>
                            <p style={{ color: '#666', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
                                Record observations during or after implementation to support learning and adjustment.
                            </p>
                            <button
                                className="btn-primary"
                                onClick={() => setIsAdding(true)}
                            >
                                Record follow-up
                            </button>
                        </div>
                    ) : (
                        [...intervention.followUps].reverse().map((fu) => {
                            const fuEvidence = goalEvidence.filter(ev => ev.contextType === 'follow-up' && ev.contextId === fu.id);

                            return (
                                <div key={fu.id} style={{ padding: '1.5rem', border: '1px solid #eee', borderRadius: '8px', marginBottom: '1.25rem', background: 'white' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', alignItems: 'center' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                            <span style={{
                                                fontSize: '0.7rem',
                                                fontWeight: 'bold',
                                                textTransform: 'uppercase',
                                                color: fu.type === 'Implementation' ? '#1B3AEC' : '#00875a',
                                                background: fu.type === 'Implementation' ? '#f0f4ff' : '#e6fffa',
                                                padding: '0.2rem 0.5rem',
                                                borderRadius: '4px',
                                                border: '1px solid',
                                                borderColor: fu.type === 'Implementation' ? '#d0d7ff' : '#c6f6e5'
                                            }}>
                                                {fu.type}
                                            </span>
                                            {fu.checkpointDate && (
                                                <span style={{ fontSize: '0.8rem', color: '#666', fontStyle: 'italic' }}>{new Date(fu.checkpointDate).toLocaleDateString()}</span>
                                            )}
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                            <span style={{ fontSize: '0.8rem', color: '#888' }}>
                                                {new Date(fu.dateAdded).toLocaleDateString()}
                                            </span>
                                            {!isArchived && (
                                                <button
                                                    onClick={() => handleDeleteFollowUp(fu.id)}
                                                    style={{
                                                        background: 'none',
                                                        border: 'none',
                                                        color: '#999',
                                                        cursor: 'pointer',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        padding: 0
                                                    }}
                                                    title="Delete follow-up"
                                                    onMouseEnter={(e) => e.currentTarget.style.color = '#dc3545'}
                                                    onMouseLeave={(e) => e.currentTarget.style.color = '#999'}
                                                >
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                    <div style={{ fontSize: '1rem', color: '#333', whiteSpace: 'pre-wrap', marginBottom: '1.25rem' }}>{fu.observation}</div>

                                    {/* Evidence for Follow-up */}
                                    <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: '1rem' }}>
                                        {evidenceAllowed && (
                                            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.5rem' }}>
                                                <button
                                                    onClick={() => openModal('upload', fu.id)}
                                                    style={{ background: 'none', border: 'none', color: '#666', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', padding: 0 }}
                                                >
                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path></svg>
                                                    Attach files
                                                </button>
                                                {HAS_SKOLANALYS_ACCESS && (
                                                    <button
                                                        onClick={() => openModal('chart', fu.id)}
                                                        style={{ background: 'none', border: 'none', color: '#666', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', padding: 0 }}
                                                    >
                                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
                                                        Add charts
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                        <EvidenceList
                                            evidence={fuEvidence}
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
        </V3PageLayout>
    );
};

export default GoalInterventionDetailV3;
