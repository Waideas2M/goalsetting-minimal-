import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useGoals } from '../../context/GoalsContext';
import './goals.css';

const GoalDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { goals, updateGoal, deleteGoal, duplicateGoal, archiveGoal, reactivateGoal } = useGoals();
    const [activeTab, setActiveTab] = useState('goal');
    const [goal, setGoal] = useState(null);

    useEffect(() => {
        const found = goals.find(g => g.id === id);
        if (found) setGoal(found);
    }, [id, goals]);

    if (!goal) return <div className="goals-container">Goal not found.</div>;

    const isEditable = goal.status === 'Draft' || goal.status === 'Active';
    const isCompleted = goal.status === 'Completed';
    const isArchived = goal.status === 'Archived';

    // Evaluation editable if not archived (allows post-completion evaluation edits)
    const isEvalEditable = !isArchived;

    // Handlers
    const handleDuplicate = () => {
        const newId = duplicateGoal(goal.id);
        navigate(`/goals/${newId}`);
    };

    const handleArchive = () => {
        archiveGoal(goal.id);
    };

    const handleReactivate = () => {
        reactivateGoal(goal.id);
    };

    const handleEdit = () => {
        navigate(`/goals/${goal.id}/edit`);
    };

    const handleExport = () => {
        alert("Generating Export Report... (Date: " + new Date().toLocaleDateString() + ")");
    };

    // Sub-component for listing evidence (read-only)
    const EvidenceListItem = ({ item, onDelete }) => (
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', padding: '0.5rem', borderBottom: '1px solid #eee' }}>
            <div style={{ fontSize: '1.2rem' }}>📄</div>
            <div style={{ flex: 1 }}>
                <div style={{ fontWeight: '500', fontSize: '0.95rem' }}>{item.url}</div>
                {item.description && <div style={{ color: '#666', fontSize: '0.85rem' }}>{item.description}</div>}
                <div style={{ color: '#999', fontSize: '0.75rem' }}>Added: {item.dateAdded}</div>
            </div>
            {onDelete && (
                <button
                    onClick={() => onDelete(item.id)}
                    style={{ border: 'none', background: 'none', color: '#ccc', fontSize: '1.2rem', cursor: 'pointer', padding: '0 0.5rem' }}
                    title="Delete attachment"
                >
                    ✕
                </button>
            )}
        </div>
    );

    // Sub-component for Adding Evidence (Strickly File Upload)
    const AddEvidenceInput = ({ onAdd, label = "+ Attach File" }) => {
        const [showInput, setShowInput] = useState(false);
        const [data, setData] = useState({ type: 'file', url: '', description: '' });

        if (!showInput) {
            return (
                <button
                    className="btn-secondary"
                    style={{ fontSize: '0.8rem', padding: '0.2rem 0.6rem', marginTop: '0.5rem' }}
                    onClick={() => setShowInput(true)}
                >
                    {label}
                </button>
            );
        }

        const handleAdd = () => {
            if (data.url) {
                onAdd({
                    id: Math.random().toString(36).substr(2, 5),
                    type: 'file',
                    url: data.url,
                    description: data.description,
                    dateAdded: new Date().toISOString().split('T')[0]
                });
                setData({ type: 'file', url: '', description: '' });
                setShowInput(false);
            }
        };

        return (
            <div style={{ background: '#f9f9f9', padding: '0.5rem', marginTop: '0.5rem', borderRadius: '4px', border: '1px dashed #ccc' }}>
                <div style={{ marginBottom: '0.5rem', fontSize: '0.8rem', fontWeight: 'bold', color: '#555' }}>Upload File (PDF, Image, Doc)</div>
                <input
                    className="form-input"
                    style={{ marginBottom: '0.5rem', fontSize: '0.9rem' }}
                    placeholder="Simulate filename (e.g. reflection.pdf)..."
                    value={data.url}
                    onChange={(e) => setData({ ...data, url: e.target.value })}
                />
                <input
                    className="form-input"
                    style={{ marginBottom: '0.5rem', fontSize: '0.9rem' }}
                    placeholder="Brief description..."
                    value={data.description}
                    onChange={(e) => setData({ ...data, description: e.target.value })}
                />
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="btn-primary" style={{ fontSize: '0.8rem', padding: '0.2rem 0.6rem' }} onClick={handleAdd}>Upload</button>
                    <button className="btn-secondary" style={{ fontSize: '0.8rem', padding: '0.2rem 0.6rem' }} onClick={() => setShowInput(false)}>Cancel</button>
                </div>
            </div>
        );
    };

    // Tabs
    const GoalTab = () => (
        <div className="sub-view">
            <div className="info-grid">
                {/* Column 1: Main Content */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div className="field-value">
                        <div className="field-label">Goal Title</div>
                        <div className="field-content" style={{ fontWeight: '700', fontSize: '1.25rem' }}>{goal.title}</div>
                    </div>
                    <div className="field-value">
                        <div className="field-label">Description</div>
                        <div className="field-content" style={{ lineHeight: '1.6', fontSize: '1rem', color: '#333' }}>{goal.description}</div>
                    </div>
                </div>

                {/* Column 2: Context Metadata */}
                <div className="eval-card" style={{ background: '#f9f9f9', border: 'none', boxShadow: 'none' }}>
                    <div className="eval-section-title" style={{ marginBottom: '1.5rem' }}>Core Context</div>
                    <div className="field-meta-grid">
                        <div className="field-value">
                            <div className="field-label">Scope</div>
                            <div className="field-content">{goal.scope}</div>
                        </div>
                        <div className="field-value">
                            <div className="field-label">Period</div>
                            <div className="field-content" style={{ fontSize: '0.9rem' }}>{goal.period.startDate} — {goal.period.endDate}</div>
                        </div>
                        {goal.scope === 'Class-related' && (
                            <>
                                <div className="field-value">
                                    <div className="field-label">Class</div>
                                    <div className="field-content">{goal.className}</div>
                                </div>
                                <div className="field-value">
                                    <div className="field-label">Subject</div>
                                    <div className="field-content">{goal.subject}</div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
            {isEditable && (
                <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
                    <button className="btn-secondary" onClick={handleEdit}>Edit Goal Details</button>
                </div>
            )}
        </div>
    );

    // TAB 2: Goal Evidence (Baseline)
    const EvidenceTab = () => {
        const addGoalEvidence = (item) => {
            const current = goal.initialEvidence || [];
            updateGoal(goal.id, { initialEvidence: [...current, item] });
        };

        const deleteGoalEvidence = (eId) => {
            const current = goal.initialEvidence || [];
            updateGoal(goal.id, { initialEvidence: current.filter(e => e.id !== eId) });
        };

        const evidence = goal.initialEvidence || [];

        return (
            <div className="sub-view">
                <div style={{ maxWidth: '600px' }}>
                    <div style={{ marginBottom: '1.5rem', fontSize: '0.9rem', color: '#555' }}>
                        Manage goal-level documents here (e.g. plans, baseline data).
                    </div>

                    {evidence.length > 0 ? (
                        evidence.map(e => (
                            <EvidenceListItem
                                key={e.id}
                                item={e}
                                onDelete={isEditable ? deleteGoalEvidence : null}
                            />
                        ))
                    ) : (
                        isEditable && <div style={{ color: '#999', fontStyle: 'italic', padding: '0.5rem 0', fontSize: '0.85rem' }}>Add initial evidence or baseline documents.</div>
                    )}

                    {isEditable && (
                        <div style={{ marginTop: '1rem' }}>
                            <AddEvidenceInput onAdd={addGoalEvidence} label="+ Add Attachment" />
                        </div>
                    )}
                </div>
            </div>
        );
    };

    const ActivitiesTab = () => {
        const addActivity = () => {
            const newActivity = {
                id: Math.random().toString(36).substr(2, 5),
                title: '',
                description: '',
                responsible: 'Teacher',
                plannedReviewDate: '',
                status: 'Not started'
            };
            updateGoal(goal.id, { activities: [...goal.activities, newActivity] });
        };

        const updateActivity = (aId, field, value) => {
            const updated = goal.activities.map(a => a.id === aId ? { ...a, [field]: value } : a);
            updateGoal(goal.id, { activities: updated });
        };

        return (
            <div className="sub-view">
                <table className="activity-table" style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 0.5rem' }}>
                    <thead>
                        <tr>
                            <th style={{ width: '45%', borderBottom: '2px solid #ccc', paddingBottom: '0.5rem' }}>Activity</th>
                            <th style={{ borderBottom: '2px solid #ccc', paddingBottom: '0.5rem' }}>Responsible</th>
                            <th style={{ borderBottom: '2px solid #ccc', paddingBottom: '0.5rem' }}>Planned Review <span style={{ fontSize: '0.75rem', fontWeight: 'normal', color: '#777' }}>(Optional)</span></th>
                            <th style={{ borderBottom: '2px solid #ccc', paddingBottom: '0.5rem' }}>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {goal.activities.map(a => (
                            <React.Fragment key={a.id}>
                                <tr style={{ background: '#fff' }}>
                                    <td style={{ verticalAlign: 'top', padding: '0.5rem' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                            <input
                                                className="form-input"
                                                value={a.title}
                                                disabled={!isEditable}
                                                onChange={(e) => updateActivity(a.id, 'title', e.target.value)}
                                                placeholder="Activity Title (Required)..."
                                                style={{ border: isEditable ? '1px solid #ddd' : 'none', fontWeight: 'bold' }}
                                            />
                                            {(a.description || !isEditable) ? (
                                                <textarea
                                                    className="form-textarea"
                                                    value={a.description || ''}
                                                    disabled={!isEditable}
                                                    onChange={(e) => updateActivity(a.id, 'description', e.target.value)}
                                                    placeholder="Activity description (optional)..."
                                                    rows={2}
                                                    style={{ border: isEditable ? '1px solid #eee' : 'none', fontSize: '0.9rem', color: '#555', resize: 'vertical' }}
                                                />
                                            ) : (
                                                <button
                                                    onClick={() => updateActivity(a.id, 'description', ' ')}
                                                    style={{ alignSelf: 'flex-start', background: 'none', border: 'none', textDecoration: 'underline', color: '#888', cursor: 'pointer', fontSize: '0.8rem', padding: '0' }}
                                                >
                                                    + Add details (optional)
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                    <td style={{ verticalAlign: 'top', padding: '0.5rem' }}>
                                        <input className="form-input" value={a.responsible} disabled={!isEditable} onChange={(e) => updateActivity(a.id, 'responsible', e.target.value)} style={{ border: isEditable ? '1px solid #ddd' : 'none' }} />
                                    </td>
                                    <td style={{ verticalAlign: 'top', padding: '0.5rem' }}>
                                        {(a.plannedReviewDate || !isEditable) ? (
                                            <div>
                                                <input
                                                    type="date"
                                                    className="form-input"
                                                    value={a.plannedReviewDate || ''}
                                                    disabled={!isEditable}
                                                    onChange={(e) => updateActivity(a.id, 'plannedReviewDate', e.target.value)}
                                                    style={{ border: isEditable ? '1px solid #ddd' : 'none', color: '#555', fontSize: '0.9rem' }}
                                                />
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => updateActivity(a.id, 'plannedReviewDate', new Date().toISOString().split('T')[0])}
                                                style={{ background: 'none', border: 'none', textDecoration: 'underline', color: '#666', cursor: 'pointer', fontSize: '0.85rem' }}
                                            >
                                                + Add planned review (optional)
                                            </button>
                                        )}
                                    </td>
                                    <td style={{ verticalAlign: 'top', padding: '0.5rem' }}>
                                        <select className="form-select" value={a.status} disabled={!isEditable} onChange={(e) => updateActivity(a.id, 'status', e.target.value)} style={{ border: isEditable ? '1px solid #ddd' : 'none', fontWeight: 'bold', color: a.status === 'Completed' ? 'green' : (a.status === 'In progress' ? 'orange' : 'black') }}>
                                            <option>Not started</option>
                                            <option>In progress</option>
                                            <option>Completed</option>
                                        </select>
                                    </td>
                                </tr>
                                <tr style={{ height: '0.5rem' }}></tr>
                            </React.Fragment>
                        ))}
                        {goal.activities.length === 0 && isEditable && (
                            <tr><td colSpan="4" style={{ textAlign: 'center', color: '#999', padding: '1.5rem', fontSize: '0.85rem' }}>Define activities for this goal.</td></tr>
                        )}
                    </tbody>
                </table>
                {isEditable && <div style={{ marginTop: '1rem' }}><button className="btn-secondary" onClick={addActivity}>+ Add Activity</button></div>}
            </div>
        );
    };

    const FollowUpTab = () => {
        const addFollowUp = () => {
            const newF = {
                id: Math.random().toString(36).substr(2, 5),
                date: new Date().toISOString().split('T')[0],
                observation: '',
                status: 'Not reviewed',
                evidence: []
            };
            updateGoal(goal.id, { followUps: [...goal.followUps, newF] });
        };

        const updateFollowUp = (fId, field, value) => {
            const updated = goal.followUps.map(f => f.id === fId ? { ...f, [field]: value } : f);
            updateGoal(goal.id, { followUps: updated });
        };

        const addFollowUpEvidence = (fId, evidenceItem) => {
            const f = goal.followUps.find(x => x.id === fId);
            if (!f) return;
            const updatedEvidence = [...(f.evidence || []), evidenceItem];
            updateFollowUp(fId, 'evidence', updatedEvidence);
        };

        const deleteFollowUpEvidence = (fId, evidenceId) => {
            const f = goal.followUps.find(x => x.id === fId);
            if (!f) return;
            const updatedEvidence = (f.evidence || []).filter(e => e.id !== evidenceId);
            updateFollowUp(fId, 'evidence', updatedEvidence);
        };

        const sortedFollowUps = [...goal.followUps].sort((a, b) => new Date(b.date) - new Date(a.date));

        return (
            <div className="sub-view">
                <div style={{ maxWidth: '600px' }}>
                    {sortedFollowUps.map(f => (
                        <div key={f.id} className="timeline-item">
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.8rem', alignItems: 'center' }}>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <label style={{ fontSize: '0.75rem', color: '#777', textTransform: 'uppercase', fontWeight: 'bold' }}>Reflection Date</label>
                                    <input
                                        type="date"
                                        value={f.date}
                                        disabled={!isEditable}
                                        onChange={(e) => updateFollowUp(f.id, 'date', e.target.value)}
                                        style={{
                                            border: '1px solid #ddd',
                                            background: isEditable ? '#fff' : 'transparent',
                                            padding: '0.2rem',
                                            fontWeight: 'bold',
                                            marginTop: '0.2rem'
                                        }}
                                    />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                                    <label style={{ fontSize: '0.75rem', color: '#777', textTransform: 'uppercase', fontWeight: 'bold' }}>Review Status</label>
                                    <select
                                        value={f.status}
                                        disabled={!isEditable}
                                        onChange={(e) => updateFollowUp(f.id, 'status', e.target.value)}
                                        style={{
                                            border: 'none',
                                            background: '#eee',
                                            padding: '0.2rem 0.5rem',
                                            borderRadius: '4px',
                                            fontWeight: '600',
                                            marginTop: '0.2rem'
                                        }}
                                    >
                                        <option value="Not reviewed">Not reviewed</option>
                                        <option value="Reviewed">Reviewed</option>
                                    </select>
                                </div>
                            </div>

                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 'bold', color: '#777', display: 'block', marginBottom: '0.2rem' }}>Observation</label>
                                <textarea
                                    className="form-textarea"
                                    value={f.observation || ''}
                                    disabled={!isEditable}
                                    onChange={(e) => updateFollowUp(f.id, 'observation', e.target.value)}
                                    placeholder="Enter your observation or reflection notes here..."
                                    rows={3}
                                    style={{ background: isEditable ? 'white' : 'transparent', border: isEditable ? '1px solid #ccc' : 'none' }}
                                />
                            </div>

                            <div style={{ marginTop: '0.5rem', borderTop: '1px solid #eee', paddingTop: '0.5rem' }}>
                                <div style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#555', marginBottom: '0.3rem' }}>Supporting Evidence</div>
                                {(f.evidence && f.evidence.length > 0) ? (
                                    <div style={{ marginBottom: '0.5rem' }}>
                                        {f.evidence.map(e => <EvidenceListItem key={e.id} item={e} onDelete={isEditable ? (eid) => deleteFollowUpEvidence(f.id, eid) : null} />)}
                                    </div>
                                ) : (
                                    isEditable && <div style={{ fontSize: '0.75rem', color: '#aaa', marginBottom: '0.5rem' }}>Attach supporting evidence...</div>
                                )}

                                {isEditable && (
                                    <AddEvidenceInput onAdd={(item) => addFollowUpEvidence(f.id, item)} label="+ Attach File" />
                                )}
                            </div>
                        </div>
                    ))}
                    {goal.followUps.length === 0 && isEditable && <div style={{ marginBottom: '1.5rem', color: '#999', fontSize: '0.85rem' }}>Record observations and follow-ups.</div>}

                    {isEditable && <button className="btn-secondary" onClick={addFollowUp}>Add Follow-up</button>}
                </div>
            </div>
        );
    };

    const EvaluationTab = () => {
        const [evalData, setEvalData] = useState(goal.evaluation || {
            achieved: '', howWell: '', adjustmentNeeded: '', reflection: '', evidence: []
        });

        useEffect(() => {
            if (goal.evaluation) setEvalData(goal.evaluation);
        }, [goal.evaluation]);

        const handleEvalChange = (field, value) => {
            setEvalData(prev => ({ ...prev, [field]: value }));
        };

        const addEvalEvidence = (item) => {
            setEvalData(prev => ({ ...prev, evidence: [...(prev.evidence || []), item] }));
        };

        const deleteEvalEvidence = (id) => {
            setEvalData(prev => ({ ...prev, evidence: (prev.evidence || []).filter(e => e.id !== id) }));
        };

        const saveEvaluation = () => {
            updateGoal(goal.id, {
                evaluation: evalData,
                status: 'Completed'
            });
        };

        return (
            <div className="sub-view">
                <div className="eval-layout">
                    {/* Section 1: Result Analysis */}
                    <div className="eval-card">
                        <div className="eval-section-title">1. Result Analysis</div>
                        <div className="eval-group" style={{ marginBottom: '1.25rem' }}>
                            <div className="form-label" style={{ fontSize: '0.8rem', marginBottom: '0.5rem' }}>Was the goal achieved?</div>
                            <div className="radio-options">
                                {['Yes', 'Partly', 'No'].map(opt => (
                                    <label key={opt} className="radio-label">
                                        <input type="radio" value={opt} checked={evalData.achieved === opt} onChange={() => handleEvalChange('achieved', opt)} disabled={!isEvalEditable} />
                                        {opt}
                                    </label>
                                ))}
                            </div>
                        </div>
                        <div className="eval-group">
                            <div className="form-label" style={{ fontSize: '0.8rem', marginBottom: '0.5rem' }}>How well was the goal reached?</div>
                            <textarea className="form-textarea" rows={3} value={evalData.howWell || ''} onChange={(e) => handleEvalChange('howWell', e.target.value)} disabled={!isEvalEditable} placeholder="Describe achievement..." style={{ padding: '0.75rem', fontSize: '1rem' }} />
                        </div>
                    </div>

                    {/* Section 2: Future Planning */}
                    <div className="eval-card">
                        <div className="eval-section-title">2. Future Planning</div>
                        <div className="eval-group">
                            <div className="form-label" style={{ fontSize: '0.8rem', marginBottom: '0.5rem' }}>Is adjustment or a new goal needed?</div>
                            <textarea className="form-textarea" rows={6} value={evalData.adjustmentNeeded || ''} onChange={(e) => handleEvalChange('adjustmentNeeded', e.target.value)} disabled={!isEvalEditable} placeholder="Next steps..." style={{ padding: '0.75rem', fontSize: '1rem' }} />
                        </div>
                    </div>

                    {/* Section 3: Deep Reflection (Full Width) */}
                    <div className="eval-card eval-full-width">
                        <div className="eval-section-title">3. Teacher Reflection</div>
                        <div className="eval-group">
                            <textarea className="form-textarea" rows={4} value={evalData.reflection || ''} onChange={(e) => handleEvalChange('reflection', e.target.value)} disabled={!isEvalEditable} placeholder="What did you learn from this process?" style={{ padding: '0.75rem', fontSize: '1rem' }} />
                        </div>
                    </div>

                    {/* Section 4: Evidence (Full Width) */}
                    <div className="eval-card eval-full-width">
                        <div className="eval-section-title">4. Final Evidence</div>
                        <div className="eval-group">
                            {(evalData.evidence && evalData.evidence.length > 0) ? (
                                <div style={{ marginBottom: '1rem' }}>
                                    {evalData.evidence.map(e => <EvidenceListItem key={e.id} item={e} onDelete={isEvalEditable ? deleteEvalEvidence : null} />)}
                                </div>
                            ) : isEvalEditable && <div style={{ fontSize: '0.8rem', color: '#aaa', marginBottom: '1rem' }}>Attach final summative evidence...</div>}

                            {isEvalEditable && <AddEvidenceInput onAdd={addEvalEvidence} label="+ Attach Summative File" />}
                        </div>
                    </div>
                </div>

                {isEvalEditable && (
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem', gap: '1rem' }}>
                        <button className="btn-primary" onClick={saveEvaluation} style={{ padding: '0.8rem 2.5rem' }}>
                            {goal.status === 'Completed' ? 'Update Evaluation' : 'Finalize & Complete Goal'}
                        </button>
                    </div>
                )}
                <div style={{ height: '40px' }}></div>
            </div>
        );
    };

    return (
        <div className="goals-container">
            <Link to="/goals" className="back-link">← Back to Goals</Link>

            <div className="detail-header">
                <div>
                    <h1 className="goals-title" style={{ marginBottom: '0.75rem' }}>{goal.title}</h1>

                    <div className="detail-context-row">
                        <span style={{ fontWeight: '700' }}>{goal.school}</span>
                        <span className="context-separator">|</span>
                        <span>{goal.schoolYear}</span>
                        <span className="context-separator">|</span>
                        <span className="detail-scope-tag">{goal.scope}</span>
                    </div>

                    <div className="detail-meta-row">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <span style={{ fontSize: '1.1rem', opacity: 0.7 }}>🗓</span>
                            {goal.period.startDate} — {goal.period.endDate}
                        </div>
                        <span className={`status-badge status-${goal.status}`}>{goal.status}</span>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                    {isArchived ? (
                        <button className="btn-primary" onClick={handleReactivate} style={{ background: '#000', color: '#fff' }}>
                            Re-activate goal
                        </button>
                    ) : (
                        <>
                            {isEditable && <button className="btn-secondary" onClick={handleEdit}>Edit</button>}
                            <button className="btn-secondary" onClick={handleDuplicate}>Duplicate</button>
                            <button className="btn-secondary" onClick={handleArchive}>Archive</button>
                        </>
                    )}
                    <button className="btn-primary" onClick={handleExport} style={{ marginLeft: '0.5rem' }}>
                        Export Report
                    </button>
                </div>
            </div>

            <div className="tabs-nav">
                {['goal', 'evidence', 'activities', 'follow-up', 'evaluation'].map(tab => (
                    <button
                        key={tab}
                        className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
                        onClick={() => setActiveTab(tab)}
                    >
                        {tab.replace('-', ' ')}
                    </button>
                ))}
            </div>

            {activeTab === 'goal' && <GoalTab />}
            {activeTab === 'evidence' && <EvidenceTab />}
            {activeTab === 'activities' && <ActivitiesTab />}
            {activeTab === 'follow-up' && <FollowUpTab />}
            {activeTab === 'evaluation' && <EvaluationTab />}
        </div>
    );
};

export default GoalDetail;
