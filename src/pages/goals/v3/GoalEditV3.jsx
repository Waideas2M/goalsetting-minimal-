import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useGoals, MOCK_USERS, SCHOOLS, SCHOOL_YEARS, DATA_BASIS_OPTIONS } from '../../../context/GoalsContext';
import V3PageLayout from './V3PageLayout';
import GoalStatusModal from '../../../components/GoalStatusModal';
import EvidenceUploadModal from '../../../components/EvidenceUploadModal';
import EvidenceChartModal from '../../../components/EvidenceChartModal';
import EvidenceList from '../../../components/EvidenceList';
import '../goals.css';

const HAS_SKOLANALYS_ACCESS = true;

const GoalEditV3 = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { goals, updateGoal, canEditGoal, reopenGoal, addEvidence, removeEvidence } = useGoals();
    const [formData, setFormData] = useState(null);
    const [showModal, setShowModal] = useState(false);

    // Evidence Modal State
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [isChartModalOpen, setIsChartModalOpen] = useState(false);

    const goal = goals.find(g => g.id === id);

    useEffect(() => {
        if (goal) {
            setFormData({
                title: goal.title,
                goalLead: goal.goalLead || '',
                improvementFocus: goal.improvementFocus,
                dataBasis: Array.isArray(goal.dataBasis) ? goal.dataBasis : [],
                scope: goal.scope,
                className: goal.className,
                school: goal.school || '',
                schoolYear: goal.schoolYear || '',
                intendedDirection: goal.intendedDirection,
                description: goal.description
            });
        }
    }, [goal]);

    if (!goal || !formData) {
        return <V3PageLayout title="Edit Goal">Loading...</V3PageLayout>;
    }

    const isClosed = goal.status === 'Closed';
    const isArchived = goal.status === 'Archived';
    const isActive = goal.status === 'Active';
    const allowedToEdit = canEditGoal(goal);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!allowedToEdit) return;

        if (!formData.title || !formData.improvementFocus || !formData.school || !formData.schoolYear || formData.dataBasis.length === 0) {
            alert('Please fill in required fields:\n- Goal Title\n- School\n- School Year\n- Improvement Focus\n- At least one Data Basis option');
            return;
        }

        updateGoal(id, formData);
        navigate(`/goals/${id}/overview`);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleDataBasisChange = (option) => {
        setFormData(prev => {
            const current = [...prev.dataBasis];
            if (current.includes(option)) {
                return { ...prev, dataBasis: current.filter(o => o !== option) };
            } else {
                return { ...prev, dataBasis: [...current, option] };
            }
        });
    };

    const handleReopen = () => {
        reopenGoal(id);
        setShowModal(false);
    };

    // Filter for baseline evidence for this goal
    const baselineEvidence = (goal.evidence || []).filter(e => e.contextType === 'goal' && e.phase === 'baseline');

    const handleAddEvidence = (evData) => {
        addEvidence(id, {
            ...evData,
            phase: 'baseline',
            contextType: 'goal',
        });
    };

    // If Closed or Archived, show the blocking view
    if (isClosed || isArchived) {
        return (
            <V3PageLayout title={goal.title} backLink={`/goals/${id}/overview`}>
                <div style={{
                    padding: '3rem',
                    textAlign: 'center',
                    background: '#f9f9f9',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    margin: '2rem auto',
                    maxWidth: '600px'
                }}>
                    <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>
                        {isArchived ? "Archived goal" : "This goal is closed"}
                    </h2>
                    <p style={{ fontSize: '1rem', color: '#666', marginBottom: '2rem' }}>
                        {isArchived
                            ? "Archived goals are read-only historical records."
                            : "To continue working on this goal, you must reopen it."}
                    </p>
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                        {isClosed && (
                            <button className="btn-primary" onClick={() => setShowModal(true)}>
                                Reopen goal
                            </button>
                        )}
                        <button className="btn-secondary" onClick={() => navigate(`/goals/${id}/overview`)}>
                            Cancel
                        </button>
                    </div>
                </div>

                <GoalStatusModal
                    isOpen={showModal}
                    onClose={() => setShowModal(false)}
                    onReopen={handleReopen}
                />
            </V3PageLayout>
        );
    }

    return (
        <V3PageLayout title={goal.title} backLink={`/goals/${id}/overview`}>
            {isActive && (
                <div style={{ padding: '1rem', background: '#fff9e6', border: '1px solid #ffeeba', borderRadius: '4px', marginBottom: '2rem', color: '#856404', fontSize: '0.9rem' }}>
                    <strong>Warning:</strong> This goal is active. Changes should clarify, not redefine the goal.
                </div>
            )}

            <form onSubmit={handleSubmit} className="form-container">
                <div className="form-section" style={{ border: 'none', padding: 0 }}>
                    <div className="form-group">
                        <label className="form-label">Goal Title *</label>
                        <input
                            type="text"
                            name="title"
                            className="form-input"
                            value={formData.title}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="section-header" style={{ marginTop: '1.5rem', marginBottom: '1rem', fontWeight: 'bold', color: '#555', fontSize: '0.85rem', textTransform: 'uppercase' }}>
                        Context & Ownership
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                        <div className="form-group" style={{ flex: 2 }}>
                            <label className="form-label">School *</label>
                            <select
                                name="school"
                                className="form-select"
                                value={formData.school}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select school...</option>
                                {SCHOOLS.map(s => (
                                    <option key={s} value={s}>{s}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group" style={{ flex: 1 }}>
                            <label className="form-label">School Year *</label>
                            <select
                                name="schoolYear"
                                className="form-select"
                                value={formData.schoolYear}
                                onChange={handleChange}
                                required
                                disabled={goal.status !== 'Draft'}
                                style={goal.status !== 'Draft' ? { background: '#f5f5f5', cursor: 'not-allowed' } : {}}
                            >
                                <option value="">Select year...</option>
                                {SCHOOL_YEARS.map(y => (
                                    <option key={y} value={y}>{y}</option>
                                ))}
                            </select>
                            {goal.status !== 'Draft' && <small style={{ color: '#999' }}>Locked for active goals</small>}
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Goal lead</label>
                        <select
                            name="goalLead"
                            className="form-select"
                            value={formData.goalLead}
                            onChange={handleChange}
                        >
                            <option value="">Select a goal lead...</option>
                            {MOCK_USERS.map(user => (
                                <option key={user.id} value={user.id}>{user.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Improvement Focus *</label>
                        <textarea
                            name="improvementFocus"
                            className="form-textarea"
                            rows="4"
                            value={formData.improvementFocus}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="section-header" style={{ marginTop: '2rem', marginBottom: '1rem', fontWeight: 'bold', color: '#555', fontSize: '0.85rem', textTransform: 'uppercase' }}>
                        Evidence Foundation
                    </div>

                    <div className="form-group">
                        <label className="form-label">Data Basis (Select at least one) *</label>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.5rem', marginTop: '0.5rem' }}>
                            {DATA_BASIS_OPTIONS.map(option => (
                                <label key={option} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem' }}>
                                    <input
                                        type="checkbox"
                                        checked={formData.dataBasis.includes(option)}
                                        onChange={() => handleDataBasisChange(option)}
                                    />
                                    {option}
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="form-group" style={{ marginBottom: '2rem' }}>
                        <label className="form-label">Baseline Evidence (Optional)</label>
                        <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '1rem' }}>
                            Attach baseline data, assessment reports, or diagnostic charts that define the starting point.
                        </p>

                        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                            <button
                                type="button"
                                className="btn-secondary"
                                onClick={() => setIsUploadModalOpen(true)}
                                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path></svg>
                                Attach files
                            </button>
                            {HAS_SKOLANALYS_ACCESS && (
                                <button
                                    type="button"
                                    className="btn-secondary"
                                    onClick={() => setIsChartModalOpen(true)}
                                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
                                    Add charts from Skolanalys
                                </button>
                            )}
                        </div>

                        <EvidenceList
                            evidence={baselineEvidence}
                            allowedToAdd={false}
                            onRemove={(evId) => removeEvidence(id, evId)}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Scope / Context (Optional)</label>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <select
                                name="scope"
                                className="form-select"
                                style={{ flex: 1 }}
                                value={formData.scope}
                                onChange={handleChange}
                            >
                                <option value="">Select scope...</option>
                                <option value="Class-related">Class-related</option>
                                <option value="Individual">Individual</option>
                                <option value="Organization">Organization</option>
                                <option value="General">General</option>
                            </select>
                            {formData.scope === 'Class-related' && (
                                <input
                                    type="text"
                                    name="className"
                                    className="form-input"
                                    style={{ flex: 1 }}
                                    placeholder="Class name"
                                    value={formData.className}
                                    onChange={handleChange}
                                />
                            )}
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Intended Direction (Optional)</label>
                        <textarea
                            name="intendedDirection"
                            className="form-textarea"
                            rows="3"
                            value={formData.intendedDirection}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', borderTop: '1px solid #eee', paddingTop: '1.5rem' }}>
                    <button type="submit" className="btn-primary">
                        Save changes
                    </button>
                    <button type="button" className="btn-secondary" onClick={() => navigate(`/goals/${id}/overview`)}>
                        Cancel
                    </button>
                </div>
            </form>

            <EvidenceUploadModal
                isOpen={isUploadModalOpen}
                onClose={() => setIsUploadModalOpen(false)}
                onAdd={handleAddEvidence}
                contextType="goal"
                contextId="new"
            />

            <EvidenceChartModal
                isOpen={isChartModalOpen}
                onClose={() => setIsChartModalOpen(false)}
                onAdd={handleAddEvidence}
                contextType="goal"
                contextId="new"
            />
        </V3PageLayout>
    );
};

export default GoalEditV3;
