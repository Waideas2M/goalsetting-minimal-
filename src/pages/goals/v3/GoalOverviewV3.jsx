import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGoals } from '../../../context/GoalsContext';
import V3PageLayout from './V3PageLayout';
import EvidenceList from '../../../components/EvidenceList';
import EvidenceUploadModal from '../../../components/EvidenceUploadModal';
import { SituationAnalysisSection, HypothesesSection } from './GoalCausesV3';
import { InterventionsSection } from './GoalInterventionsV3';
import { EvaluationSection } from './GoalEvaluationV3';
import '../goals.css';

const GoalOverviewV3 = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { goals, addEvidence, removeEvidence } = useGoals();
    const goal = goals.find(g => g.id === id);

    const [uploadModal, setUploadModal] = useState({ isOpen: false, contextId: null });

    if (!goal) return <V3PageLayout title="Goal Overview">Goal not found.</V3PageLayout>;

    // Summary Calculations
    const hCount = goal.hypotheses?.length || 0;
    const iCount = goal.interventions?.length || 0;
    const fCount = goal.interventions?.reduce((acc, i) => acc + (i.followUps?.length || 0), 0) || 0;

    const hasEvalPlan = goal.evaluationPlan && (goal.evaluationPlan.period || goal.evaluationPlan.indicator);
    let eDisplay = 0;
    let eIsStatus = false;

    if (goal.status === 'Closed' || goal.evaluationPlan?.isClosed) {
        eDisplay = "Done";
        eIsStatus = true;
    } else if (hasEvalPlan) {
        eDisplay = "Planned";
    }

    const goalEvidence = goal.evidence?.filter(ev => ev.contextType === 'goal' && ev.contextId === goal.id) || [];

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

    const editIcon = (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block' }}>
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
        </svg>
    );

    const handleAddEvidence = (d) => addEvidence(id, { ...d, contextType: 'goal', contextId: id });

    const scrollToSection = (sectionId) => {
        const el = document.getElementById(sectionId);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <V3PageLayout title={goal.title}>
            {/* Template Alert */}
            {goal.isDuplicateReviewPending && (
                <div style={{
                    background: '#eff6ff',
                    border: '1px solid #bfdbfe',
                    color: '#1e40af',
                    padding: '1rem',
                    borderRadius: '8px',
                    marginBottom: '2rem',
                    fontSize: '0.95rem',
                    position: 'sticky',
                    top: '1rem',
                    zIndex: 50,
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem'
                }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                    <div>
                        You created this goal from an existing goal template. Please review and adjust the content before making this goal active.
                    </div>
                </div>
            )}

            {/* Summary Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1rem', marginBottom: '3.5rem' }}>
                <SummaryCard label="Hypotheses" count={hCount} onClick={() => scrollToSection('hypotheses')} />
                <SummaryCard label="Interventions" count={iCount} onClick={() => scrollToSection('interventions')} disabled={hCount < 1} />
                <SummaryCard label="Follow-ups" count={fCount} emptyLabel="Not planned" onClick={() => scrollToSection('interventions')} />
                <SummaryCard label="Evaluation" count={eDisplay} isStatus={eIsStatus} emptyLabel="Not planned" onClick={() => scrollToSection('evaluation')} />
                <SummaryCard label="Status" count={goal.status} isStatus={true} />
            </div>

            {/* Overview Section */}
            <div style={{ marginBottom: '3.5rem' }}>
                <div style={sectionHeaderStyle}>
                    <h2 style={sectionTitleStyle}>Overview</h2>
                    <button
                        onClick={() => navigate(`/goals/${id}/edit`)}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '0.5rem',
                            padding: '0.4rem 0.8rem',
                            background: 'white',
                            border: '1px solid #ddd',
                            borderRadius: '6px',
                            color: '#444',
                            fontSize: '0.85rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = '#1B3AEC';
                            e.currentTarget.style.color = '#1B3AEC';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = '#ddd';
                            e.currentTarget.style.color = '#444';
                        }}
                    >
                        {editIcon}
                        Edit
                    </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                    <Field label="Goal Title" value={goal.title} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '1.5rem' }}>
                    <Field label="School" value={goal.school} />
                    <Field label="School Year" value={goal.schoolYear} />
                </div>

                <div style={{ marginBottom: '2.5rem' }}>
                    <Field label="Description" value={goal.description} />
                </div>

                <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: '#111', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: '800' }}>
                        Evidence
                    </label>
                    <div style={{ background: '#fafafa', padding: '1rem', borderRadius: '12px', border: '1px solid #f0f0f0' }}>
                        <EvidenceList
                            evidence={goalEvidence}
                            allowedToAdd={goal.status !== 'Archived'}
                            onAdd={() => setUploadModal({ isOpen: true, contextId: goal.id })}
                            onRemove={(evId) => removeEvidence(goal.id, evId)}
                            addLabel="Attach"
                        />
                    </div>
                </div>
            </div>

            <div id="situation" style={{ marginBottom: '4rem' }}><SituationAnalysisSection goal={goal} /></div>
            <div id="hypotheses" style={{ marginBottom: '4rem' }}><HypothesesSection goal={goal} /></div>
            <div id="interventions" style={{ marginBottom: '4rem' }}><InterventionsSection goal={goal} /></div>
            <div id="evaluation" style={{ marginBottom: '4rem' }}><EvaluationSection goal={goal} /></div>

            <EvidenceUploadModal
                isOpen={uploadModal.isOpen}
                onClose={() => setUploadModal({ isOpen: false, contextId: null })}
                onAdd={handleAddEvidence}
                contextType="goal"
                contextId={uploadModal.contextId}
            />
        </V3PageLayout>
    );
};

const SummaryCard = ({ label, count, isStatus, emptyLabel, onClick, disabled }) => {
    const [hover, setHover] = useState(false);

    // Determine if we should show the "empty" state (disabled look)
    const isEmpty = !isStatus && count === 0 && emptyLabel;
    const display = isEmpty ? emptyLabel : count;

    // Status colors
    const isActive = count === 'Active';
    const isClosed = count === 'Closed';
    const isArchived = count === 'Archived';

    // Styles
    const bg = isStatus
        ? (isActive ? '#f0f4ff' : (isClosed ? '#e3fcef' : (isArchived ? '#f5f5f5' : '#f9f9f9')))
        : 'white';

    const border = isStatus
        ? (isActive ? '#d0d7ff' : (isClosed ? '#defbe6' : '#eee'))
        : '#eee';

    const textColor = isStatus
        ? (isActive ? '#1B3AEC' : (isClosed ? '#00875a' : (isArchived ? '#666' : '#444')))
        : (isEmpty ? '#ccc' : (disabled ? '#ccc' : '#1B3AEC'));

    // Font size logic
    const isNumber = typeof count === 'number';
    const fontSize = isStatus
        ? '1rem'
        : (isEmpty ? '0.85rem' : (isNumber ? '1.5rem' : '1rem'));

    const isClickable = onClick && !isStatus && !disabled;

    return (
        <div
            onClick={isClickable ? onClick : undefined}
            style={{
                padding: '1.25rem 1rem',
                background: bg,
                borderRadius: '10px',
                border: `1px solid ${border}`,
                textAlign: 'center',
                transition: 'transform 0.2s, border-color 0.2s',
                transform: hover && isClickable ? 'translateY(-2px)' : 'translateY(0)',
                borderColor: hover && isClickable ? '#1B3AEC' : border,
                cursor: isClickable ? 'pointer' : 'default',
                opacity: disabled ? 0.6 : 1
            }}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
        >
            <div style={{
                fontSize: fontSize,
                fontWeight: '700',
                color: textColor,
                marginBottom: '0.25rem',
                fontStyle: isEmpty ? 'normal' : 'normal',
                minHeight: isStatus ? 'auto' : '1.8rem',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
                {display}
            </div>
            <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: isEmpty || disabled ? '#aaa' : '#888', letterSpacing: '0.06em', fontWeight: '500' }}>
                {label}
            </div>
        </div>
    );
};

const Field = ({ label, value }) => (
    <div>
        <div style={{ fontSize: '0.8rem', color: '#333', textTransform: 'uppercase', marginBottom: '0.4rem', letterSpacing: '0.06em', fontWeight: '800' }}>{label}</div>
        <div style={{ fontSize: '0.95rem', color: '#111', whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>{value || '—'}</div>
    </div>
);

export default GoalOverviewV3;
