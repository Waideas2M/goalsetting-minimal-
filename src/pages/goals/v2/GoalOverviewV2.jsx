import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useGoals } from '../../../context/GoalsContext';
import V2PageLayout from './V2PageLayout';
import EvidenceModal from '../../../components/EvidenceModal';
import EvidenceList from '../../../components/EvidenceList';
import '../goals.css';

const GoalOverviewV2 = () => {
    const { id } = useParams();
    const { goals, addEvidence, canAddEvidence } = useGoals();
    const [evidenceFilter, setEvidenceFilter] = useState('all');
    const [isEvidenceModalOpen, setIsEvidenceModalOpen] = useState(false);

    // Find the current goal
    const goal = goals.find(g => g.id === id);

    if (!goal) {
        return (
            <V2PageLayout title="Goal Overview">
                <div style={{ textAlign: 'center', padding: '3rem' }}>
                    <p>Goal not found.</p>
                </div>
            </V2PageLayout>
        );
    }

    const evidence = goal.evidence || [];
    const filteredEvidence = evidence.filter(item => {
        if (evidenceFilter === 'all') return true;
        if (evidenceFilter === 'baseline') return item.phase === 'baseline';
        return item.contextType === evidenceFilter;
    });

    const counts = {
        all: evidence.length,
        baseline: evidence.filter(e => e.phase === 'baseline').length,
        hypothesis: evidence.filter(e => e.contextType === 'hypothesis').length,
        'follow-up': evidence.filter(e => e.contextType === 'follow-up').length,
        evaluation: evidence.filter(e => e.contextType === 'evaluation').length
    };

    // Calculations for summary
    const hypothesisCount = goal.hypotheses?.length || 0;
    const interventionCount = goal.interventions?.length || 0;
    const followUpCount = goal.interventions?.reduce((sum, i) => sum + (i.followUps?.length || 0), 0) || 0;
    const evaluationCount = goal.evaluations?.length || 0;

    const allowedToAdd = canAddEvidence(goal, 'goal');

    return (
        <V2PageLayout title={goal.title}>
            <div style={{ marginBottom: '2rem' }}>


                <div className="info-grid">
                    <div className="form-section" style={{ border: 'none', padding: 0 }}>
                        <div className="field-value">
                            <label className="field-label">School</label>
                            <div className="field-content" style={{ fontSize: '1rem' }}>{goal.school || 'Not specified'}</div>
                        </div>

                        <div className="field-value">
                            <label className="field-label">School year</label>
                            <div className="field-content" style={{ fontSize: '1rem' }}>{goal.schoolYear || 'Not specified'}</div>
                        </div>

                        <div className="field-value">
                            <label className="field-label">Improvement focus</label>
                            <div className="field-content" style={{ fontSize: '1rem', fontWeight: '500' }}>{goal.improvementFocus || 'No focus defined.'}</div>
                        </div>

                        <div className="field-value">
                            <label className="field-label">Data basis</label>
                            <div className="field-content" style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                {Array.isArray(goal.dataBasis) && goal.dataBasis.length > 0 ? (
                                    goal.dataBasis.map(item => (
                                        <span key={item} style={{
                                            background: '#f0f4ff',
                                            color: '#1B3AEC',
                                            padding: '0.2rem 0.6rem',
                                            borderRadius: '4px',
                                            fontSize: '0.85rem',
                                            border: '1px solid #d0d7ff'
                                        }}>
                                            {item}
                                        </span>
                                    ))
                                ) : (
                                    <span style={{ fontSize: '1rem' }}>{goal.dataBasis || 'No data basis defined.'}</span>
                                )}
                            </div>
                        </div>

                        <div className="field-value">
                            <label className="field-label">Scope / context</label>
                            <div className="field-content" style={{ fontSize: '1rem' }}>
                                {goal.scope}
                                {goal.className && <span style={{ marginLeft: '0.5rem', color: '#666' }}>({goal.className})</span>}
                            </div>
                        </div>

                        <div className="field-value">
                            <label className="field-label">Intended direction</label>
                            <div className="field-content" style={{ fontSize: '1rem' }}>{goal.intendedDirection || 'No direction defined.'}</div>
                        </div>
                    </div>

                    <div style={{ background: '#f9f9f9', padding: '1.25rem', borderRadius: '8px' }}>
                        <h3 style={{ fontSize: '0.9rem', textTransform: 'uppercase', color: '#777', marginBottom: '1.25rem' }}>Linked work summary</h3>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                            <Link to={`/goals/${id}/causes`} style={{ textDecoration: 'none', border: '1px solid #ddd', padding: '0.75rem', borderRadius: '4px', background: 'white', color: 'inherit' }}>
                                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1B3AEC' }}>{hypothesisCount}</div>
                                <div style={{ fontSize: '0.7rem', color: '#666', textTransform: 'uppercase', marginTop: '0.1rem' }}>Hypotheses</div>
                            </Link>

                            <Link to={`/goals/${id}/interventions`} style={{ textDecoration: 'none', border: '1px solid #ddd', padding: '0.75rem', borderRadius: '4px', background: 'white', color: 'inherit' }}>
                                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1B3AEC' }}>{interventionCount}</div>
                                <div style={{ fontSize: '0.7rem', color: '#666', textTransform: 'uppercase', marginTop: '0.1rem' }}>Interventions</div>
                            </Link>

                            <Link to={`/goals/${id}/interventions`} style={{ textDecoration: 'none', border: '1px solid #ddd', padding: '0.75rem', borderRadius: '4px', background: 'white', color: 'inherit' }}>
                                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1B3AEC' }}>{followUpCount}</div>
                                <div style={{ fontSize: '0.7rem', color: '#666', textTransform: 'uppercase', marginTop: '0.1rem' }}>Follow-ups</div>
                            </Link>

                            <Link to={`/goals/${id}/evaluation`} style={{ textDecoration: 'none', border: '1px solid #ddd', padding: '0.75rem', borderRadius: '4px', background: 'white', color: 'inherit' }}>
                                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1B3AEC' }}>{evaluationCount}</div>
                                <div style={{ fontSize: '0.7rem', color: '#666', textTransform: 'uppercase', marginTop: '0.1rem' }}>Evaluations</div>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Evidence Summary Section */}
                <div style={{ marginTop: '3rem', borderTop: '1px solid #eee', paddingTop: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <h2 style={{ fontSize: '0.9rem', margin: 0, textTransform: 'uppercase', color: '#777' }}>Evidence Summary</h2>
                            <span style={{
                                background: '#eee',
                                color: '#666',
                                padding: '0.1rem 0.6rem',
                                borderRadius: '12px',
                                fontSize: '0.75rem',
                                fontWeight: 'bold'
                            }}>
                                {evidence.length}
                            </span>
                        </div>
                        {allowedToAdd && (
                            <button
                                className="btn-secondary"
                                style={{ fontSize: '0.85rem', padding: '0.4rem 0.8rem' }}
                                onClick={() => setIsEvidenceModalOpen(true)}
                            >
                                + Add baseline evidence
                            </button>
                        )}
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                        {[
                            { id: 'all', label: 'All' },
                            { id: 'baseline', label: 'Baseline' },
                            { id: 'hypothesis', label: 'Hypotheses' },
                            { id: 'follow-up', label: 'Follow-ups' },
                            { id: 'evaluation', label: 'Evaluations' }
                        ].map(filter => (
                            <button
                                key={filter.id}
                                onClick={() => setEvidenceFilter(filter.id)}
                                style={{
                                    padding: '0.4rem 0.8rem',
                                    borderRadius: '20px',
                                    border: '1px solid',
                                    borderColor: evidenceFilter === filter.id ? '#1B3AEC' : '#eee',
                                    background: evidenceFilter === filter.id ? '#f0f4ff' : 'white',
                                    color: evidenceFilter === filter.id ? '#1B3AEC' : '#666',
                                    fontSize: '0.8rem',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                            >
                                {filter.label} ({counts[filter.id]})
                            </button>
                        ))}
                    </div>

                    {filteredEvidence.length > 0 ? (
                        <EvidenceList
                            evidence={filteredEvidence}
                            allowedToAdd={false}
                        />
                    ) : (
                        <div style={{
                            padding: '2rem',
                            textAlign: 'center',
                            border: '1px dashed #eee',
                            borderRadius: '8px',
                            color: '#999',
                            fontSize: '0.9rem'
                        }}>
                            No evidence found for this category.
                        </div>
                    )}
                </div>
            </div>

            <EvidenceModal
                isOpen={isEvidenceModalOpen}
                onClose={() => setIsEvidenceModalOpen(false)}
                onAdd={(data) => addEvidence(id, { ...data, phase: 'baseline' })}
                contextType="goal"
                contextId={id}
            />
        </V2PageLayout>
    );
};

export default GoalOverviewV2;
