import React, { useState } from 'react';
import { useGoals } from '../../../context/GoalsContext';
import GoalStatusModal from '../../../components/GoalStatusModal';
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
    borderBottom: '2px solid #000',
    paddingBottom: '0.8rem'
};

const sectionTitleStyle = {
    fontSize: '1rem',
    margin: 0,
    textTransform: 'uppercase',
    color: '#000',
    letterSpacing: '0.08em',
    fontWeight: '800'
};

export const InterventionsSection = ({ goal }) => {
    const { id } = goal;
    const { addIntervention, reopenGoal, updateIntervention, deleteIntervention, deleteFollowUp, canAddEvidence } = useGoals();

    const [isAddingIntervention, setIsAddingIntervention] = useState(false);
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [interventionForm, setInterventionForm] = useState({ description: '', expectedEffect: '', hypothesisIds: [], followUps: [] });
    const [editingInterventionId, setEditingInterventionId] = useState(null);
    const [planningFollowUpForIntervention, setPlanningFollowUpForIntervention] = useState(null);
    const [recordingFollowUpId, setRecordingFollowUpId] = useState(null);

    const hypotheses = goal.hypotheses || [];
    const interventions = goal.interventions || [];
    const isClosed = goal.status === 'Closed';
    const isArchived = goal.status === 'Archived';
    const evidenceAllowed = canAddEvidence(goal, 'follow-up');

    const handleSaveIntervention = (e) => {
        e.preventDefault();
        if (!interventionForm.description.trim() || !interventionForm.expectedEffect.trim() || interventionForm.hypothesisIds.length === 0) {
            alert('Please fill in all required fields and link at least one hypothesis.');
            return;
        }
        if (editingInterventionId) {
            updateIntervention(id, editingInterventionId, interventionForm);
            setEditingInterventionId(null);
        } else {
            addIntervention(id, interventionForm);
        }
        setInterventionForm({ description: '', expectedEffect: '', hypothesisIds: [], followUps: [] });
        setIsAddingIntervention(false);
    };

    const addFollowUpRow = () => {
        setInterventionForm(prev => ({
            ...prev,
            followUps: [...prev.followUps, { id: Math.random().toString(36).substr(2, 9), followUpPeriod: '', indicator: '', assessment: '' }]
        }));
    };

    const updateFollowUpInForm = (rowId, field, value) => {
        setInterventionForm(prev => ({
            ...prev,
            followUps: prev.followUps.map(fu => fu.id === rowId ? { ...fu, [field]: value } : fu)
        }));
    };

    const removeFollowUpFromForm = (rowId) => {
        setInterventionForm(prev => ({
            ...prev,
            followUps: prev.followUps.filter(fu => fu.id !== rowId)
        }));
    };

    const updateFollowUpInExistingIntervention = (interventionId, rowId, field, value) => {
        const intervention = interventions.find(i => i.id === interventionId);
        if (!intervention) return;

        const updatedFollowUps = (intervention.followUps || []).map(fu =>
            fu.id === rowId ? { ...fu, [field]: value } : fu
        );

        updateIntervention(id, interventionId, { followUps: updatedFollowUps });
    };

    const addFollowUpToExistingIntervention = (interventionId, initialData = {}) => {
        const intervention = interventions.find(i => i.id === interventionId);
        if (!intervention) return;

        const newRow = {
            id: Math.random().toString(36).substr(2, 9),
            followUpPeriod: initialData.followUpPeriod || '',
            indicator: initialData.indicator || '',
            assessment: ''
        };
        const updatedFollowUps = [...(intervention.followUps || []), newRow];

        updateIntervention(id, interventionId, { followUps: updatedFollowUps });
    };

    const removeFollowUpFromExistingIntervention = (interventionId, rowId) => {
        const intervention = interventions.find(i => i.id === interventionId);
        if (!intervention) return;

        const updatedFollowUps = (intervention.followUps || []).filter(fu => fu.id !== rowId);
        updateIntervention(id, interventionId, { followUps: updatedFollowUps });
    };

    const toggleHypothesis = (hId) => {
        setInterventionForm(prev => {
            const current = [...prev.hypothesisIds];
            if (current.includes(hId)) return { ...prev, hypothesisIds: current.filter(item => item !== hId) };
            return { ...prev, hypothesisIds: [...current, hId] };
        });
    };

    const startAddingIntervention = () => {
        if (isArchived) return;
        if (isClosed) { setShowStatusModal(true); return; }
        setIsAddingIntervention(true);
        setEditingInterventionId(null);
        setInterventionForm({ description: '', expectedEffect: '', hypothesisIds: [], followUps: [] });
    };

    const startEditingIntervention = (i) => {
        setEditingInterventionId(i.id);
        setInterventionForm({ description: i.description, expectedEffect: i.expectedEffect, hypothesisIds: i.hypothesisIds || [], followUps: i.followUps || [] });
        setIsAddingIntervention(true);
    };

    return (
        <div>
            <div style={sectionHeaderStyle}>
                <h2 style={sectionTitleStyle}>Interventions & Follow-ups</h2>
                {!isAddingIntervention && (
                    <button
                        onClick={startAddingIntervention}
                        disabled={isArchived}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '0.5rem',
                            padding: '0.4rem 0.8rem',
                            background: 'white',
                            border: '1px solid #ddd',
                            borderRadius: '6px',
                            color: '#444',
                            fontSize: '0.85rem',
                            fontWeight: '600',
                            cursor: isArchived ? 'default' : 'pointer',
                            transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                            if (!isArchived) {
                                e.currentTarget.style.borderColor = '#1B3AEC';
                                e.currentTarget.style.color = '#1B3AEC';
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (!isArchived) {
                                e.currentTarget.style.borderColor = '#ddd';
                                e.currentTarget.style.color = '#444';
                            }
                        }}
                    >
                        <PlusIcon />
                        Add intervention
                    </button>
                )}
            </div>

            {/* Section Description */}
            <div style={{ marginBottom: '1.25rem' }}>
                <div style={{ fontSize: '0.95rem', color: '#444', marginBottom: '0.25rem' }}>What are we going to try?</div>
                <div style={{ fontSize: '0.8rem', color: '#888', lineHeight: '1.4' }}>A concrete action or change in practice intended to address one or more hypotheses.</div>
            </div>

            {isAddingIntervention && (
                <div style={{ background: '#f9f9f9', padding: '1.5rem', borderRadius: '10px', marginBottom: '2rem', border: '1px solid #eee' }}>
                    <form onSubmit={handleSaveIntervention}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                            <div className="form-group" style={{ marginBottom: 0 }}>
                                <label className="form-label" style={{ fontSize: '0.85rem', fontWeight: '800', color: '#111' }}>Intervention Description *</label>
                                <textarea className="form-textarea" rows="2" value={interventionForm.description} onChange={(e) => setInterventionForm({ ...interventionForm, description: e.target.value })} required />
                            </div>
                            <div className="form-group" style={{ marginBottom: 0 }}>
                                <label className="form-label" style={{ fontSize: '0.85rem', fontWeight: '800', color: '#111' }}>Expected Effect *</label>
                                <textarea className="form-textarea" rows="2" value={interventionForm.expectedEffect} onChange={(e) => setInterventionForm({ ...interventionForm, expectedEffect: e.target.value })} required />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label" style={{ fontSize: '0.85rem', fontWeight: '800', color: '#111' }}>Linked Hypotheses *</label>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', background: 'white', padding: '0.75rem', border: '1px solid #eee', borderRadius: '6px' }}>
                                {hypotheses.map(h => (
                                    <label key={h.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#444', backgroundColor: interventionForm.hypothesisIds.includes(h.id) ? '#f0f4ff' : '#fafafa', padding: '0.4rem 0.8rem', borderRadius: '4px', border: '1px solid', borderColor: interventionForm.hypothesisIds.includes(h.id) ? '#1B3AEC' : '#eee', cursor: 'pointer', transition: 'all 0.2s' }}>
                                        <input type="checkbox" checked={interventionForm.hypothesisIds.includes(h.id)} onChange={() => toggleHypothesis(h.id)} style={{ margin: 0 }} /> {h.title}
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '0.75rem', borderTop: '1px solid #eee', paddingTop: '1.5rem', marginTop: '1.5rem' }}>
                            <button type="submit" className="btn-primary" style={{ padding: '0.75rem 2rem' }}>{editingInterventionId ? 'Update Intervention' : 'Save Intervention'}</button>
                            <button type="button" className="btn-secondary" onClick={() => { setIsAddingIntervention(false); setEditingInterventionId(null); }}>Cancel</button>
                        </div>
                    </form>
                </div>
            )}

            <div className="interventions-list">
                {interventions.length === 0 ? (
                    <div style={{ padding: '3rem', textAlign: 'center', border: '1px dashed #ddd', borderRadius: '12px', background: '#fafafa', color: '#666' }}>
                        <p style={{ marginBottom: '1.5rem', fontSize: '0.95rem' }}>
                            {hypotheses.length === 0 ? "You need to add hypotheses before you can plan interventions." : "No interventions have been planned for this goal yet."}
                        </p>
                        {!isAddingIntervention && hypotheses.length > 0 && (
                            <button
                                className="btn-primary"
                                onClick={startAddingIntervention}
                                disabled={isArchived}
                                style={{ fontSize: '0.85rem', padding: '0.6rem 1.5rem', borderRadius: '8px' }}
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '0.5rem' }}>
                                    <line x1="12" y1="5" x2="12" y2="19"></line>
                                    <line x1="5" y1="12" x2="19" y2="12"></line>
                                </svg>
                                Add first intervention
                            </button>
                        )}
                        {hypotheses.length === 0 && (
                            <div style={{ fontSize: '0.85rem', color: '#999', fontStyle: 'italic' }}>
                                Go to the Hypotheses section above to get started.
                            </div>
                        )}
                    </div>
                ) : (
                    interventions.map(i => (
                        <div key={i.id} style={{ padding: '1.5rem', border: '1px solid #eee', borderRadius: '12px', marginBottom: '2rem', background: 'white' }}>
                            {/* Intervention Header */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: '700', fontSize: '1.1rem', color: '#111', marginBottom: '0.5rem' }}>{i.description}</div>
                                </div>
                                {!isArchived && (
                                    <div style={{ display: 'flex', gap: '0.25rem' }}>
                                        <button
                                            type="button"
                                            onClick={() => startEditingIntervention(i)}
                                            style={{ background: 'none', border: 'none', color: '#ccc', cursor: 'pointer', padding: '0.6rem', transition: 'color 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                            onMouseEnter={e => e.currentTarget.style.color = '#1B3AEC'}
                                            onMouseLeave={e => e.currentTarget.style.color = '#ccc'}
                                            title="Edit"
                                        >
                                            <EditIcon />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                setTimeout(() => {
                                                    if (window.confirm("Delete intervention?")) deleteIntervention(id, i.id);
                                                }, 10);
                                            }}
                                            style={{ background: 'none', border: 'none', color: '#ccc', cursor: 'pointer', padding: '0.6rem', transition: 'color 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                            onMouseEnter={e => e.currentTarget.style.color = '#dc3545'}
                                            onMouseLeave={e => e.currentTarget.style.color = '#ccc'}
                                            title="Delete"
                                        >
                                            <TrashIcon />
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Grid-style Follow-ups Section */}
                            <div style={{ marginTop: '0.5rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                    <h4 style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: '#111', margin: 0, letterSpacing: '0.06em', fontWeight: '800' }}>Follow-ups</h4>
                                </div>

                                {(i.followUps || []).length === 0 && (
                                    <div style={{ fontSize: '0.8rem', color: '#ccc', fontStyle: 'italic', marginBottom: '0.75rem' }}>Not planned</div>
                                )}

                                {(i.followUps || []).length > 0 && (
                                    <div style={{ overflowX: 'auto', border: '1px solid #eee', borderRadius: '8px', marginBottom: '0.75rem' }}>
                                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                            <thead style={{ background: '#fafafa' }}>
                                                <tr>
                                                    <th style={{ textAlign: 'left', padding: '0.75rem', fontSize: '0.7rem', textTransform: 'uppercase', color: '#999', width: '20%', borderBottom: '1px solid #eee' }}>Follow-up period</th>
                                                    <th style={{ textAlign: 'left', padding: '0.75rem', fontSize: '0.7rem', textTransform: 'uppercase', color: '#999', width: '30%', borderBottom: '1px solid #eee' }}>Indicator</th>
                                                    <th style={{ textAlign: 'left', padding: '0.75rem', fontSize: '0.7rem', textTransform: 'uppercase', color: '#999', borderBottom: '1px solid #eee' }}>How is it going?</th>
                                                    {!isArchived && <th style={{ width: '100px', borderBottom: '1px solid #eee' }}></th>}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {(i.followUps || []).map((fu) => (
                                                    <tr key={fu.id} style={{ borderBottom: '1px solid #f5f5f5' }}>
                                                        <td style={{ padding: '0.75rem', fontSize: '0.85rem', color: '#333' }}>{fu.followUpPeriod || '—'}</td>
                                                        <td style={{ padding: '0.75rem', fontSize: '0.85rem', color: '#333' }}>{fu.indicator || '—'}</td>
                                                        <td style={{ padding: '0.75rem' }}>
                                                            {recordingFollowUpId === fu.id ? (
                                                                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                                                    <textarea
                                                                        style={{ flex: 1, padding: '0.5rem', border: '1px solid #1B3AEC', borderRadius: '4px', fontSize: '0.85rem', minHeight: '36px', resize: 'none' }}
                                                                        defaultValue={fu.assessment || ''}
                                                                        id={`assessment-${fu.id}`}
                                                                        rows="1"
                                                                        autoFocus
                                                                    />
                                                                    <button
                                                                        onClick={() => {
                                                                            const val = document.getElementById(`assessment-${fu.id}`).value;
                                                                            updateFollowUpInExistingIntervention(i.id, fu.id, 'assessment', val);
                                                                            setRecordingFollowUpId(null);
                                                                        }}
                                                                        style={{ padding: '0.4rem 0.8rem', background: '#1B3AEC', color: 'white', border: 'none', borderRadius: '4px', fontSize: '0.75rem', cursor: 'pointer' }}
                                                                    >Save</button>
                                                                    <button
                                                                        onClick={() => setRecordingFollowUpId(null)}
                                                                        style={{ padding: '0.4rem 0.6rem', background: 'transparent', color: '#999', border: '1px solid #ddd', borderRadius: '4px', fontSize: '0.75rem', cursor: 'pointer' }}
                                                                    >Cancel</button>
                                                                </div>
                                                            ) : (
                                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                                    <span style={{ fontSize: '0.85rem', color: fu.assessment ? '#333' : '#ccc' }}>{fu.assessment || '—'}</span>
                                                                    {!isArchived && !fu.assessment && (
                                                                        <>
                                                                            <span style={{ fontSize: '0.75rem', color: '#888', fontStyle: 'italic' }}>Ready with outcomes?</span>
                                                                            <button
                                                                                onClick={() => setRecordingFollowUpId(fu.id)}
                                                                                style={{ padding: '0.25rem 0.5rem', background: 'transparent', color: '#1B3AEC', border: '1px solid #1B3AEC', borderRadius: '4px', fontSize: '0.7rem', cursor: 'pointer', whiteSpace: 'nowrap' }}
                                                                            >Record</button>
                                                                        </>
                                                                    )}
                                                                    {!isArchived && fu.assessment && (
                                                                        <button
                                                                            onClick={() => setRecordingFollowUpId(fu.id)}
                                                                            style={{ background: 'none', border: 'none', color: '#ccc', cursor: 'pointer', padding: '0.25rem' }}
                                                                            onMouseEnter={e => e.currentTarget.style.color = '#1B3AEC'}
                                                                            onMouseLeave={e => e.currentTarget.style.color = '#ccc'}
                                                                            title="Edit assessment"
                                                                        ><EditIcon /></button>
                                                                    )}
                                                                </div>
                                                            )}
                                                        </td>
                                                        {!isArchived && (
                                                            <td style={{ textAlign: 'center' }}>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => removeFollowUpFromExistingIntervention(i.id, fu.id)}
                                                                    style={{ background: 'none', border: 'none', color: '#ddd', cursor: 'pointer', padding: '0.5rem' }}
                                                                    onMouseEnter={e => e.currentTarget.style.color = '#dc3545'}
                                                                    onMouseLeave={e => e.currentTarget.style.color = '#ddd'}
                                                                >
                                                                    <TrashIcon />
                                                                </button>
                                                            </td>
                                                        )}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}

                                {(i.followUps || []).length === 0 && planningFollowUpForIntervention !== i.id && (
                                    <div style={{ padding: '1.5rem', textAlign: 'center', border: '1px dashed #eee', borderRadius: '8px', background: '#fafafa', color: '#999', fontSize: '0.85rem', marginBottom: '0.75rem' }}>
                                        No follow-ups planned yet.
                                    </div>
                                )}

                                {planningFollowUpForIntervention === i.id && (
                                    <div style={{ padding: '1rem', border: '1px solid #1B3AEC', borderRadius: '8px', background: '#f8f9ff', marginBottom: '0.75rem' }}>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1rem', marginBottom: '1rem' }}>
                                            <div>
                                                <label style={{ fontSize: '0.75rem', fontWeight: '700', color: '#444', display: 'block', marginBottom: '0.25rem' }}>Follow-up period</label>
                                                <input type="text" id={`new-fu-period-${i.id}`} style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px', fontSize: '0.85rem' }} placeholder="e.g. after 4 weeks" />
                                            </div>
                                            <div>
                                                <label style={{ fontSize: '0.75rem', fontWeight: '700', color: '#444', display: 'block', marginBottom: '0.25rem' }}>What is being followed up?</label>
                                                <input type="text" id={`new-fu-indicator-${i.id}`} style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px', fontSize: '0.85rem' }} placeholder="Indicator or focus area" />
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <button
                                                onClick={() => {
                                                    const period = document.getElementById(`new-fu-period-${i.id}`).value;
                                                    const indicator = document.getElementById(`new-fu-indicator-${i.id}`).value;
                                                    if (period || indicator) {
                                                        addFollowUpToExistingIntervention(i.id, { followUpPeriod: period, indicator: indicator });
                                                    }
                                                    setPlanningFollowUpForIntervention(null);
                                                }}
                                                style={{ padding: '0.5rem 1rem', background: '#1B3AEC', color: 'white', border: 'none', borderRadius: '4px', fontSize: '0.8rem', cursor: 'pointer' }}
                                            >Save follow-up</button>
                                            <button
                                                onClick={() => setPlanningFollowUpForIntervention(null)}
                                                style={{ padding: '0.5rem 1rem', background: 'transparent', color: '#666', border: '1px solid #ddd', borderRadius: '4px', fontSize: '0.8rem', cursor: 'pointer' }}
                                            >Cancel</button>
                                        </div>
                                    </div>
                                )}

                                {!isArchived && planningFollowUpForIntervention !== i.id && (
                                    <button
                                        onClick={() => setPlanningFollowUpForIntervention(i.id)}
                                        style={{ background: 'none', border: 'none', fontSize: '0.8rem', color: '#1B3AEC', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.25rem' }}
                                    >
                                        <PlusIcon /> New follow-up plan
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div >

            <GoalStatusModal isOpen={showStatusModal} onClose={() => setShowStatusModal(false)} onReopen={() => { reopenGoal(id); setShowStatusModal(false); startAddingIntervention(); }} />
        </div >
    );
};
