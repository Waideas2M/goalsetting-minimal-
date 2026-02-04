import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGoals } from '../../../context/GoalsContext';
import V3PageLayout from './V3PageLayout';
import EvidenceUploadModal from '../../../components/EvidenceUploadModal';
import EvidenceList from '../../../components/EvidenceList';
import '../goals.css';

const EditIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
    </svg>
);

const PlusIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="5" x2="12" y2="19"></line>
        <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
);

const TrashIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="3 6 5 6 21 6"></polyline>
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
        <line x1="10" y1="11" x2="10" y2="17"></line>
        <line x1="14" y1="11" x2="14" y2="17"></line>
    </svg>
);

const sectionHeaderStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem',
    borderBottom: '1px solid #eee',
    paddingBottom: '0.6rem'
};

const sectionTitleStyle = {
    fontSize: '0.85rem',
    margin: 0,
    textTransform: 'uppercase',
    color: '#888',
    letterSpacing: '0.06em',
    fontWeight: '600'
};

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

    const [isEditingIntervention, setIsEditingIntervention] = useState(false);
    const [interventionForm, setInterventionForm] = useState(null);
    const [modalState, setModalState] = useState({ isOpen: false, contextId: null });

    const goal = goals.find(g => g.id === id);
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

    const openModal = (contextId) => setModalState({ isOpen: true, contextId });
    const handleAddEvidence = (evData) => addEvidence(id, { ...evData, contextType: 'follow-up', contextId: modalState.contextId });

    const breadcrumbs = [
        { label: 'Goals', to: '/goals' },
        { label: goal.title, to: `/goals/${id}/overview` },
        { label: 'Interventions', to: `/goals/${id}/interventions` }
    ];

    const actions = canEditIntervention && !isArchived && !isEditingIntervention ? (
        <div style={{ display: 'flex', gap: '0.25rem' }}>
            <button
                onClick={() => setIsEditingIntervention(true)}
                disabled={isArchived}
                style={{ background: 'none', border: 'none', color: isArchived ? '#ccc' : '#999', cursor: isArchived ? 'default' : 'pointer', padding: '0.4rem', transition: 'color 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                onMouseEnter={(e) => !isArchived && (e.currentTarget.style.color = '#1B3AEC')}
                onMouseLeave={(e) => !isArchived && (e.currentTarget.style.color = '#999')}
                title="Edit intervention"
            >
                <EditIcon />
            </button>
            <button
                onClick={handleDeleteIntervention}
                disabled={isArchived}
                style={{ background: 'none', border: 'none', color: isArchived ? '#ccc' : '#999', cursor: isArchived ? 'default' : 'pointer', padding: '0.4rem', transition: 'color 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                title="Delete intervention"
                onMouseEnter={(e) => !isArchived && (e.currentTarget.style.color = '#dc3545')}
                onMouseLeave={(e) => !isArchived && (e.currentTarget.style.color = '#999')}
            >
                <TrashIcon />
            </button>
        </div>
    ) : null;

    return (
        <V3PageLayout
            title={isEditingIntervention ? `Edit: ${intervention.description}` : intervention.description}
            isItemView={true}
            breadcrumbs={breadcrumbs}
            actions={actions}
        >
            <div style={{ marginBottom: '2rem' }}>
                <div style={{ background: '#f0f4ff', padding: '1.5rem', borderRadius: '12px', borderLeft: '4px solid #1B3AEC', marginBottom: '3.5rem' }}>
                    {!isEditingIntervention ? (
                        <>
                            <div style={{ color: '#1B3AEC', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: '700', marginBottom: '0.6rem' }}>Expected effect</div>
                            <div style={{ fontSize: '1.1rem', fontWeight: '600', color: '#111', lineHeight: '1.5', marginBottom: '1.5rem' }}>
                                {intervention.expectedEffect}
                            </div>
                            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                {intervention.hypothesisIds?.map(hId => {
                                    const h = hypotheses.find(hyp => hyp.id === hId);
                                    return h ? (
                                        <span key={hId} style={{ fontSize: '0.7rem', fontWeight: '600', textTransform: 'uppercase', background: 'white', color: '#1B3AEC', padding: '0.2rem 0.6rem', borderRadius: '4px', border: '1px solid #d0d7ff' }}>
                                            Linked to: {h.title}
                                        </span>
                                    ) : null;
                                })}
                            </div>
                        </>
                    ) : (
                        <form onSubmit={handleUpdateIntervention} style={{ background: 'white', padding: '1.5rem', borderRadius: '10px', border: '1px solid #eee' }}>
                            <div className="form-group">
                                <label className="form-label">Intervention Description *</label>
                                <textarea className="form-textarea" rows="2" value={interventionForm.description} onChange={(e) => setInterventionForm({ ...interventionForm, description: e.target.value })} required />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Expected Effect *</label>
                                <textarea className="form-textarea" rows="2" value={interventionForm.expectedEffect} onChange={(e) => setInterventionForm({ ...interventionForm, expectedEffect: e.target.value })} required />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Linked Hypotheses *</label>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', padding: '0.75rem', border: '1px solid #eee', borderRadius: '6px', maxHeight: '150px', overflowY: 'auto' }}>
                                    {hypotheses.map(h => (
                                        <label key={h.id} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', gap: '0.6rem', fontSize: '0.85rem' }}>
                                            <input type="checkbox" checked={interventionForm.hypothesisIds.includes(h.id)} onChange={() => toggleHypothesis(h.id)} />
                                            <span>{h.title}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
                                <button type="submit" className="btn-primary">Save Changes</button>
                                <button type="button" className="btn-secondary" onClick={() => setIsEditingIntervention(false)}>Cancel</button>
                            </div>
                        </form>
                    )}
                </div>

                <div style={sectionHeaderStyle}>
                    <h3 style={sectionTitleStyle}>Follow-ups</h3>
                    {!isAdding && allowedToAdd && (
                        <button
                            onClick={() => setIsAdding(true)}
                            disabled={isArchived}
                            style={{ background: 'none', border: 'none', color: isArchived ? '#ccc' : '#999', cursor: isArchived ? 'default' : 'pointer', padding: '0.4rem', transition: 'color 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            onMouseEnter={(e) => !isArchived && (e.currentTarget.style.color = '#1B3AEC')}
                            onMouseLeave={(e) => !isArchived && (e.currentTarget.style.color = '#999')}
                            title="Record follow-up"
                        >
                            <PlusIcon />
                        </button>
                    )}
                </div>

                {isAdding && (
                    <div style={{ background: '#f9f9f9', padding: '1.5rem', borderRadius: '10px', marginBottom: '2rem', border: '1px solid #eee' }}>
                        <form onSubmit={handleSaveFollowUp}>
                            <div className="form-group" style={{ maxWidth: '300px' }}>
                                <label className="form-label">Type *</label>
                                <select className="form-select" value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} required>
                                    <option value="Implementation">Implementation</option>
                                    <option value="Effect">Effect</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Observation *</label>
                                <textarea className="form-textarea" placeholder="What have you observed so far?" rows="4" value={formData.observation} onChange={(e) => setFormData({ ...formData, observation: e.target.value })} required autoFocus />
                            </div>
                            <div className="form-group" style={{ maxWidth: '300px' }}>
                                <label className="form-label">Checkpoint Date (Optional)</label>
                                <input type="date" className="form-input" value={formData.checkpointDate} onChange={(e) => setFormData({ ...formData, checkpointDate: e.target.value })} />
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
                        <div style={{ padding: '3rem', textAlign: 'center', border: '1px dashed #eee', borderRadius: '12px', background: '#fafafa' }}>
                            <p style={{ color: '#888', marginBottom: '1.5rem', fontSize: '0.9rem' }}>No follow-ups recorded yet.</p>
                            {!isAdding && (
                                <button className="btn-primary" onClick={() => setIsAdding(true)}>Record first follow-up</button>
                            )}
                        </div>
                    ) : (
                        [...intervention.followUps].reverse().map((fu) => {
                            const fuEvidence = goalEvidence.filter(ev => ev.contextType === 'follow-up' && ev.contextId === fu.id);
                            return (
                                <div key={fu.id} style={{ padding: '1.5rem', border: '1px solid #eee', borderRadius: '10px', marginBottom: '1.5rem', background: 'white' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', alignItems: 'center' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                            <span style={{ fontSize: '0.7rem', fontWeight: '700', textTransform: 'uppercase', color: fu.type === 'Implementation' ? '#1B3AEC' : '#00875a', background: fu.type === 'Implementation' ? '#f0f4ff' : '#e6fffa', padding: '0.2rem 0.6rem', borderRadius: '4px' }}>{fu.type}</span>
                                            {fu.checkpointDate && <span style={{ fontSize: '0.8rem', color: '#777', fontStyle: 'italic' }}>{new Date(fu.checkpointDate).toLocaleDateString()}</span>}
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <span style={{ fontSize: '0.75rem', color: '#999', fontWeight: '500' }}>{new Date(fu.dateAdded).toLocaleDateString()}</span>
                                            {!isArchived && (
                                                <button
                                                    onClick={() => handleDeleteFollowUp(fu.id)}
                                                    style={{ background: 'none', border: 'none', color: '#ccc', cursor: 'pointer', padding: '0.2rem', transition: 'color 0.2s' }}
                                                    onMouseEnter={(e) => e.currentTarget.style.color = '#dc3545'}
                                                    onMouseLeave={(e) => e.currentTarget.style.color = '#ccc'}
                                                    title="Delete follow-up"
                                                >
                                                    <TrashIcon />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                    <div style={{ fontSize: '1rem', color: '#111', whiteSpace: 'pre-wrap', marginBottom: '1.5rem', lineHeight: '1.6' }}>{fu.observation}</div>
                                    <div style={{ borderTop: '1px solid #f9f9f9', paddingTop: '1.25rem' }}>
                                        <EvidenceList
                                            evidence={fuEvidence}
                                            allowedToAdd={evidenceAllowed}
                                            onAdd={() => openModal(fu.id)}
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
                isOpen={modalState.isOpen}
                onClose={() => setModalState({ ...modalState, isOpen: false })}
                onAdd={handleAddEvidence}
                contextType="follow-up"
                contextId={modalState.contextId}
            />
        </V3PageLayout>
    );
};

export default GoalInterventionDetailV3;
