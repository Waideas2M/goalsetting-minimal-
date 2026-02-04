import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useGoals } from '../../../context/GoalsContext';
import V3PageLayout from './V3PageLayout';
import GoalStatusModal from '../../../components/GoalStatusModal';
import '../goals.css';

const GoalInterventionsV3 = () => {
    const { id } = useParams();
    const { goals, addIntervention, reopenGoal } = useGoals();
    const [isAdding, setIsAdding] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        description: '',
        expectedEffect: '',
        hypothesisIds: []
    });

    const goal = goals.find(g => g.id === id);

    if (!goal) {
        return (
            <V3PageLayout title="Interventions">
                <div style={{ textAlign: 'center', padding: '3rem' }}>
                    <p>Goal not found.</p>
                </div>
            </V3PageLayout>
        );
    }

    const hypotheses = goal.hypotheses || [];
    const interventions = goal.interventions || [];

    const handleSave = (e) => {
        e.preventDefault();
        if (!formData.description.trim() || !formData.expectedEffect.trim() || formData.hypothesisIds.length === 0) {
            alert('Please fill in all required fields and link at least one hypothesis.');
            return;
        }

        addIntervention(id, formData);
        setFormData({ description: '', expectedEffect: '', hypothesisIds: [] });
        setIsAdding(false);
    };

    const toggleHypothesis = (hId) => {
        setFormData(prev => {
            const current = [...prev.hypothesisIds];
            if (current.includes(hId)) {
                return { ...prev, hypothesisIds: current.filter(item => item !== hId) };
            } else {
                return { ...prev, hypothesisIds: [...current, hId] };
            }
        });
    };

    const isClosed = goal.status === 'Closed';
    const isArchived = goal.status === 'Archived';

    const handleAddClick = () => {
        if (isArchived) return;
        if (isClosed) {
            setShowModal(true);
            return;
        }
        setIsAdding(true);
    };

    const handleReopen = () => {
        reopenGoal(id);
        setShowModal(false);
        setIsAdding(true);
    };

    const getDisabledReason = () => {
        if (isArchived) return "Interventions cannot be added to an archived goal.";
        if (hypotheses.length === 0) return "You need at least one hypothesis to add an intervention.";
        return "";
    };

    return (
        <V3PageLayout title={goal.title}>
            <div style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h2 style={{ fontSize: '0.9rem', margin: 0, textTransform: 'uppercase', color: '#777' }}>Interventions</h2>
                    {!isAdding && (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                            <button
                                className={`btn-primary ${isArchived ? 'disabled' : ''}`}
                                onClick={handleAddClick}
                                disabled={isArchived}
                            >
                                Add intervention
                            </button>
                            {(isArchived || (hypotheses.length === 0 && !isClosed)) && (
                                <span style={{ fontSize: '0.75rem', color: '#999', marginTop: '0.4rem' }}>
                                    {getDisabledReason()}
                                </span>
                            )}
                        </div>
                    )}
                </div>

                {hypotheses.length === 0 && (
                    <div style={{ padding: '2rem', textAlign: 'center', background: '#fff9e6', border: '1px solid #ffeeba', borderRadius: '8px', marginBottom: '2rem' }}>
                        <p style={{ margin: 0, color: '#856404' }}>
                            You need to add at least one hypothesis on the <strong>Investigate causes</strong> page before you can plan interventions.
                        </p>
                    </div>
                )}

                {isAdding && (
                    <div style={{ background: '#f9f9f9', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem', border: '1px solid #ddd' }}>
                        <form onSubmit={handleSave}>
                            <div className="form-group">
                                <label className="form-label" style={{ fontSize: '0.8rem' }}>Intervention Description *</label>
                                <p style={{ fontSize: '0.75rem', color: '#666', marginTop: '0.2rem', marginBottom: '0.5rem' }}>What action will be taken in response to the hypothesis?</p>
                                <textarea
                                    className="form-textarea"
                                    placeholder="Example: Implement structured peer reading groups twice a week."
                                    rows="2"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    required
                                    autoFocus
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label" style={{ fontSize: '0.8rem' }}>Expected Effect *</label>
                                <textarea
                                    className="form-textarea"
                                    placeholder="What do you hope to achieve with this intervention?"
                                    rows="2"
                                    value={formData.expectedEffect}
                                    onChange={(e) => setFormData({ ...formData, expectedEffect: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label" style={{ fontSize: '0.8rem' }}>Linked Hypotheses * (Select at least one)</label>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', background: 'white', padding: '1rem', border: '1px solid #ddd', borderRadius: '4px' }}>
                                    {hypotheses.map(h => (
                                        <label key={h.id} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', gap: '0.5rem' }}>
                                            <input
                                                type="checkbox"
                                                checked={formData.hypothesisIds.includes(h.id)}
                                                onChange={() => toggleHypothesis(h.id)}
                                            />
                                            <span style={{ fontSize: '0.9rem' }}>{h.title}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '0.75rem' }}>
                                <button type="submit" className="btn-primary">Save Intervention</button>
                                <button type="button" className="btn-secondary" onClick={() => setIsAdding(false)}>Cancel</button>
                            </div>
                        </form>
                    </div>
                )}

                <div className="interventions-list">
                    {interventions.length === 0 ? (
                        <div style={{ padding: '3rem', textAlign: 'center', border: '1px solid #eee', borderRadius: '8px', background: '#fafafa' }}>
                            {hypotheses.length > 0 ? (
                                <>
                                    <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#333', marginBottom: '0.5rem' }}>Decide what to try</h3>
                                    <p style={{ color: '#666', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
                                        Based on your hypotheses, describe one or more actions you want to test in practice.
                                    </p>
                                    <button
                                        className={`btn-primary ${isArchived ? 'disabled' : ''}`}
                                        onClick={handleAddClick}
                                        disabled={isArchived}
                                    >
                                        Add intervention
                                    </button>
                                </>
                            ) : (
                                <p style={{ color: '#999', margin: 0 }}>Awaiting hypotheses...</p>
                            )}
                        </div>
                    ) : (
                        interventions.map((intervention) => (
                            <Link
                                to={`/goals/${id}/interventions/${intervention.id}`}
                                key={intervention.id}
                                style={{ display: 'block', textDecoration: 'none', color: 'inherit', padding: '1.25rem', border: '1px solid #eee', borderRadius: '8px', marginBottom: '1rem', background: 'white', transition: 'border-color 0.2s' }}
                                onMouseEnter={(e) => e.currentTarget.style.borderColor = '#1B3AEC'}
                                onMouseLeave={(e) => e.currentTarget.style.borderColor = '#eee'}
                            >
                                <div style={{ fontWeight: '600', fontSize: '1.05rem', marginBottom: '0.6rem', color: '#111' }}>{intervention.description}</div>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                    {intervention.hypothesisIds.map(hId => {
                                        const h = hypotheses.find(h => h.id === hId);
                                        return h ? (
                                            <span key={hId} style={{ fontSize: '0.75rem', background: '#eef2ff', color: '#1B3AEC', padding: '0.2rem 0.5rem', borderRadius: '4px', border: '1px solid #dbe6fe' }}>
                                                {h.title}
                                            </span>
                                        ) : null;
                                    })}
                                </div>
                            </Link>
                        ))
                    )}
                </div>
            </div>

            <GoalStatusModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                onReopen={handleReopen}
            />
        </V3PageLayout>
    );
};

export default GoalInterventionsV3;
