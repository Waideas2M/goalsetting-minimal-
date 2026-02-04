import React from 'react';
import { useGoals } from '../../../context/GoalsContext';
import EvidenceList from '../../../components/EvidenceList';
import EvidenceUploadModal from '../../../components/EvidenceUploadModal';
import '../goals.css';

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

const cardStyle = {
    background: '#fff',
    border: '1px solid #eee',
    borderRadius: '12px',
    padding: '2rem',
    marginBottom: '2rem',
    boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
};

const labelStyle = {
    display: 'block',
    fontSize: '0.7rem',
    textTransform: 'uppercase',
    fontWeight: '800',
    color: '#666',
    marginBottom: '0.6rem',
    letterSpacing: '0.06em'
};

const inputStyle = {
    width: '100%',
    padding: '0.75rem',
    fontSize: '0.95rem',
    border: '1px solid #eee',
    borderRadius: '6px',
    background: '#fafafa',
    marginBottom: '1.5rem',
    fontFamily: 'inherit',
    transition: 'all 0.2s',
    boxSizing: 'border-box'
};

const textareaStyle = {
    ...inputStyle,
    resize: 'vertical',
    minHeight: '80px',
    marginBottom: '1.5rem'
};

const lockedStyle = {
    background: '#f5f5f5',
    color: '#666',
    border: '1px solid #eee',
    cursor: 'not-allowed'
};

const EditIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
    </svg>
);

export const EvaluationSection = ({ goal }) => {
    const { id, evaluationPlan, status, evidence } = goal;
    const { updateEvaluationPlan, addEvidence, removeEvidence, closeGoal, reopenGoal } = useGoals();

    const [isUploadModalOpen, setIsUploadModalOpen] = React.useState(false);
    const [isEditingPlan, setIsEditingPlan] = React.useState(false);
    const [isEditingReflection, setIsEditingReflection] = React.useState(false);

    const plan = evaluationPlan || {
        period: '',
        indicator: '',
        whatWorked: '',
        whatDidntWork: '',
        whatNext: '',
        isClosed: false
    };

    const isClosed = status === 'Closed';
    const isArchived = status === 'Archived';
    const hasPlanContent = plan.period || plan.indicator;
    const hasReflectionContent = plan.whatWorked || plan.whatDidntWork || plan.whatNext;
    const showReflection = status !== 'Draft';

    const handleUpdate = (updates) => {
        updateEvaluationPlan(id, updates);
    };

    const handleToggleClose = (e) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        const msg = isClosed ? 'Reopen goal?' : 'Mark goal as Closed? This will lock all fields.';
        if (window.confirm(msg)) {
            if (isClosed) {
                reopenGoal(id);
                updateEvaluationPlan(id, { isClosed: false });
            } else {
                closeGoal(id);
                updateEvaluationPlan(id, { isClosed: true });
            }
        }
    };

    const contextId = 'evaluation-plan';
    const evEvidence = evidence?.filter(e => e.contextType === 'evaluation' && e.contextId === contextId) || [];

    return (
        <div className="evaluation-container">
            <div style={sectionHeaderStyle}>
                <h2 style={sectionTitleStyle}>Evaluation Plan</h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    {isClosed && (
                        <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#00875a', textTransform: 'uppercase', letterSpacing: '0.04em', background: '#e3fcef', padding: '0.2rem 0.6rem', borderRadius: '4px' }}>
                            Closed
                        </span>
                    )}
                    {hasPlanContent && !isClosed && !isArchived && (
                        <button
                            className="btn-primary"
                            style={{ fontSize: '0.75rem', padding: '0.4rem 0.8rem', borderRadius: '6px' }}
                            onClick={handleToggleClose}
                        >
                            Mark as Closed
                        </button>
                    )}
                    {isClosed && (
                        <button
                            className="btn-secondary"
                            style={{ fontSize: '0.75rem', padding: '0.4rem 0.8rem', borderRadius: '6px' }}
                            onClick={handleToggleClose}
                        >
                            Reopen
                        </button>
                    )}
                </div>
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
                <div style={{ fontSize: '0.95rem', color: '#444', marginBottom: '0.25rem' }}>How will we know if it worked?</div>
                <div style={{ fontSize: '0.8rem', color: '#888', lineHeight: '1.4' }}>Define when and what to evaluate, then reflect on outcomes after the intervention period.</div>
            </div>

            {/* Empty State / CTA for Plan */}
            {!hasPlanContent && !isEditingPlan && (
                <div style={{ padding: '2.5rem', textAlign: 'center', border: '1px dashed #eee', borderRadius: '10px', background: '#fafafa' }}>
                    <p style={{ marginBottom: '1.25rem', fontSize: '0.9rem', color: '#999' }}>
                        Plan how and when this goal will be evaluated.
                    </p>
                    <button
                        className="btn-primary"
                        onClick={() => setIsEditingPlan(true)}
                        disabled={isArchived}
                        style={{ fontSize: '0.85rem', padding: '0.6rem 1.5rem', borderRadius: '8px' }}
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '0.5rem' }}>
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                        Plan evaluation
                    </button>
                </div>
            )}

            {/* Main Card */}
            {(hasPlanContent || isEditingPlan) && (
                <div style={{ ...cardStyle, marginBottom: '1rem', position: 'relative' }}>

                    {/* PLAN SECTION */}
                    <div style={{ marginBottom: showReflection ? '2rem' : '0' }}>
                        {isEditingPlan && !isClosed ? (
                            <div style={{ background: '#f9f9f9', padding: '1.5rem', borderRadius: '8px', border: '1px solid #eee' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                                    <div>
                                        <label style={labelStyle}>Evaluation Period</label>
                                        <input
                                            style={{ ...inputStyle, marginBottom: 0 }}
                                            value={plan.period}
                                            onChange={(e) => handleUpdate({ period: e.target.value })}
                                            placeholder="e.g. End of term"
                                        />
                                    </div>
                                    <div>
                                        <label style={labelStyle}>What will be evaluated?</label>
                                        <textarea
                                            style={{ ...textareaStyle, marginBottom: 0 }}
                                            value={plan.indicator}
                                            onChange={(e) => handleUpdate({ indicator: e.target.value })}
                                            placeholder="Criteria..."
                                            rows="2"
                                        />
                                    </div>
                                </div>
                                <button className="btn-primary" onClick={() => setIsEditingPlan(false)}>Save Plan</button>
                            </div>
                        ) : (
                            <div style={{ position: 'relative' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
                                    <div>
                                        <label style={{ ...labelStyle, color: '#888' }}>Evaluation Period</label>
                                        <div style={{ fontSize: '0.95rem', color: '#333' }}>{plan.period || '—'}</div>
                                    </div>
                                    <div>
                                        <label style={{ ...labelStyle, color: '#888' }}>Indicator</label>
                                        <div style={{ fontSize: '0.95rem', color: '#333' }}>{plan.indicator || '—'}</div>
                                    </div>
                                </div>
                                {!isClosed && !isArchived && (
                                    <button
                                        onClick={() => setIsEditingPlan(true)}
                                        style={{ position: 'absolute', top: 0, right: 0, background: 'none', border: 'none', color: '#ccc', cursor: 'pointer', padding: '0.4rem' }}
                                        onMouseEnter={(e) => e.currentTarget.style.color = '#1B3AEC'}
                                        onMouseLeave={(e) => e.currentTarget.style.color = '#ccc'}
                                        title="Edit plan"
                                    >
                                        <EditIcon />
                                    </button>
                                )}
                            </div>
                        )}
                    </div>

                    {/* REFLECTION SECTION */}
                    {showReflection && (
                        <>
                            <div style={{ borderTop: '1px solid #eee', margin: '2rem 0' }}></div>

                            {/* Empty/Add State */}
                            {!hasReflectionContent && !isEditingReflection && !isClosed && (
                                <div style={{ padding: '1.5rem', textAlign: 'center', border: '1px dashed #eee', borderRadius: '10px', background: '#fafafa' }}>
                                    <p style={{ marginBottom: '1rem', fontSize: '0.85rem', color: '#999' }}>
                                        Ready to reflect on outcomes?
                                    </p>
                                    <button
                                        onClick={() => setIsEditingReflection(true)}
                                        disabled={isArchived}
                                        style={{ background: 'none', border: '1px solid #1B3AEC', color: '#1B3AEC', padding: '0.5rem 1rem', borderRadius: '6px', fontSize: '0.8rem', cursor: 'pointer' }}
                                    >
                                        + Add reflection
                                    </button>
                                </div>
                            )}

                            {/* Editing State */}
                            {isEditingReflection && !isClosed && (
                                <div style={{ background: '#f9f9f9', padding: '1.5rem', borderRadius: '8px', border: '1px solid #eee' }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1rem' }}>
                                        <div>
                                            <label style={{ ...labelStyle, color: '#00875a' }}>What worked?</label>
                                            <textarea
                                                style={{ ...textareaStyle, borderLeft: '3px solid #00875a' }}
                                                value={plan.whatWorked}
                                                onChange={(e) => handleUpdate({ whatWorked: e.target.value })}
                                                rows={3}
                                            />
                                        </div>
                                        <div>
                                            <label style={{ ...labelStyle, color: '#de350b' }}>What didn't work?</label>
                                            <textarea
                                                style={{ ...textareaStyle, borderLeft: '3px solid #de350b' }}
                                                value={plan.whatDidntWork}
                                                onChange={(e) => handleUpdate({ whatDidntWork: e.target.value })}
                                                rows={3}
                                            />
                                        </div>
                                    </div>
                                    <div style={{ marginBottom: '1.5rem' }}>
                                        <label style={{ ...labelStyle, color: '#1B3AEC' }}>What next?</label>
                                        <textarea
                                            style={{ ...textareaStyle, width: '100%', borderLeft: '3px solid #1B3AEC' }}
                                            value={plan.whatNext}
                                            onChange={(e) => handleUpdate({ whatNext: e.target.value })}
                                            rows={2}
                                        />
                                    </div>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <button className="btn-primary" onClick={() => setIsEditingReflection(false)}>Save Reflection</button>
                                        <button className="btn-secondary" onClick={() => setIsEditingReflection(false)}>Cancel</button>
                                    </div>
                                </div>
                            )}

                            {/* View State */}
                            {hasReflectionContent && !isEditingReflection && (
                                <div style={{ position: 'relative' }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem' }}>
                                        <div>
                                            <label style={{ ...labelStyle, color: '#00875a' }}>What worked?</label>
                                            <div style={{ fontSize: '0.9rem', color: '#333', paddingLeft: '0.75rem', borderLeft: '3px solid #00875a' }}>{plan.whatWorked || '—'}</div>
                                        </div>
                                        <div>
                                            <label style={{ ...labelStyle, color: '#de350b' }}>What didn't work?</label>
                                            <div style={{ fontSize: '0.9rem', color: '#333', paddingLeft: '0.75rem', borderLeft: '3px solid #de350b' }}>{plan.whatDidntWork || '—'}</div>
                                        </div>
                                        <div>
                                            <label style={{ ...labelStyle, color: '#1B3AEC' }}>What next?</label>
                                            <div style={{ fontSize: '0.9rem', color: '#333', paddingLeft: '0.75rem', borderLeft: '3px solid #1B3AEC' }}>{plan.whatNext || '—'}</div>
                                        </div>
                                    </div>
                                    {!isClosed && !isArchived && (
                                        <button
                                            onClick={() => setIsEditingReflection(true)}
                                            style={{ position: 'absolute', top: 0, right: 0, background: 'none', border: 'none', color: '#ccc', cursor: 'pointer', padding: '0.4rem' }}
                                            onMouseEnter={(e) => e.currentTarget.style.color = '#1B3AEC'}
                                            onMouseLeave={(e) => e.currentTarget.style.color = '#ccc'}
                                            title="Edit reflection"
                                        >
                                            <EditIcon />
                                        </button>
                                    )}
                                </div>
                            )}
                        </>
                    )}

                    {/* Evidence Part */}
                    {showReflection && hasPlanContent && (
                        <div style={{ marginTop: '2rem', borderTop: '1px solid #eee', paddingTop: '1rem' }}>
                            <h4 style={{ ...labelStyle, marginBottom: '0.5rem' }}>Attachments</h4>
                            <EvidenceList
                                evidence={evEvidence}
                                allowedToAdd={!isClosed && !isArchived}
                                onAdd={() => setIsUploadModalOpen(true)}
                                onRemove={!isClosed ? (evId) => removeEvidence(id, evId) : null}
                                addLabel="Attach"
                            />
                        </div>
                    )}
                </div>
            )}

            {isClosed && (
                <div style={{ textAlign: 'center', padding: '1.5rem', background: '#fafafa', borderRadius: '12px', border: '1px solid #eee', color: '#999', fontSize: '0.85rem', marginTop: '1rem' }}>
                    This evaluation is locked.
                </div>
            )}

            <EvidenceUploadModal
                isOpen={isUploadModalOpen}
                onClose={() => setIsUploadModalOpen(false)}
                onAdd={(evData) => addEvidence(id, { ...evData, contextType: 'evaluation', contextId: 'evaluation-plan' })}
                contextType="evaluation"
                contextId="evaluation-plan"
            />
        </div>
    );
};
