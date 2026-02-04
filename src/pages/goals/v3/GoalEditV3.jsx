import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useGoals, SCHOOLS, SCHOOL_YEARS } from '../../../context/GoalsContext';
import V3PageLayout from './V3PageLayout';
import GoalStatusModal from '../../../components/GoalStatusModal';
import EvidenceUploadModal from '../../../components/EvidenceUploadModal';
import EvidenceList from '../../../components/EvidenceList';
import '../goals.css';

const GoalEditV3 = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { goals, updateGoal, deleteGoal, canEditGoal, reopenGoal, addEvidence, removeEvidence } = useGoals();
    const [formData, setFormData] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const textareaRef = useRef(null);

    const goal = goals.find(g => g.id === id);

    useEffect(() => {
        if (goal) {
            setFormData({
                title: goal.title,
                school: goal.school || '',
                schoolYear: goal.schoolYear || '',
                description: goal.description || ''
            });
        }
    }, [goal]);

    // Auto-grow textarea effect
    useEffect(() => {
        if (textareaRef.current && formData) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
        }
    }, [formData?.description]);

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

        if (!formData.title || !formData.school || !formData.schoolYear) {
            alert('Please fill in required fields (Title, School, School Year).');
            return;
        }

        updateGoal(id, formData);
        navigate(`/goals/${id}`);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleReopen = () => {
        reopenGoal(id);
        setShowModal(false);
    };

    const attachments = goal.evidence || [];

    const handleAddEvidence = (evData) => {
        addEvidence(id, {
            ...evData,
            contextType: 'goal',
        });
    };

    if (isClosed || isArchived) {
        return (
            <V3PageLayout title={goal.title} backLink={`/goals/${id}`}>
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
                        <button className="btn-secondary" onClick={() => navigate(`/goals/${id}`)}>
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
        <V3PageLayout title={goal.title} backLink={`/goals/${id}`}>
            {isActive && (
                <div style={{ padding: '1rem', background: '#fff9e6', border: '1px solid #ffeeba', borderRadius: '4px', marginBottom: '2rem', color: '#856404', fontSize: '0.9rem' }}>
                    <strong>Warning:</strong> This goal is active. Changes should clarify, not redefine the goal.
                </div>
            )}

            <form onSubmit={handleSubmit} className="form-container" style={{ maxWidth: '800px', margin: '0 auto' }}>
                <div className="form-section" style={{ border: 'none', padding: 0 }}>
                    <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                        <label className="form-label" style={{ fontWeight: '500', color: '#444' }}>Goal Title *</label>
                        <input
                            type="text"
                            name="title"
                            className="form-input"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            style={{ border: '1px solid #e0e0e0', borderRadius: '6px', padding: '0.75rem' }}
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.5rem' }}>
                        <div className="form-group" style={{ flex: 1 }}>
                            <label className="form-label" style={{ fontWeight: '500', color: '#444' }}>School *</label>
                            <select
                                name="school"
                                className="form-select"
                                value={formData.school}
                                onChange={handleChange}
                                required
                                style={{ border: '1px solid #e0e0e0', borderRadius: '6px', padding: '0.75rem' }}
                            >
                                <option value="">Select school...</option>
                                {SCHOOLS.map(s => (
                                    <option key={s} value={s}>{s}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group" style={{ flex: 1 }}>
                            <label className="form-label" style={{ fontWeight: '500', color: '#444' }}>School Year *</label>
                            <select
                                name="schoolYear"
                                className="form-select"
                                value={formData.schoolYear}
                                onChange={handleChange}
                                required
                                disabled={goal.status !== 'Draft'}
                                style={{
                                    border: '1px solid #e0e0e0',
                                    borderRadius: '6px',
                                    padding: '0.75rem',
                                    background: goal.status !== 'Draft' ? '#f5f5f5' : '#fff',
                                    cursor: goal.status !== 'Draft' ? 'not-allowed' : 'default'
                                }}
                            >
                                <option value="">Select year...</option>
                                {SCHOOL_YEARS.map(y => (
                                    <option key={y} value={y}>{y}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                        <label className="form-label" style={{ fontWeight: '500', color: '#444' }}>Description (Optional)</label>
                        <textarea
                            ref={textareaRef}
                            name="description"
                            className="form-textarea"
                            rows="1"
                            value={formData.description}
                            onChange={handleChange}
                            style={{
                                border: '1px solid #e0e0e0',
                                borderRadius: '6px',
                                padding: '0.75rem',
                                minHeight: '44px',
                                resize: 'none',
                                overflow: 'hidden'
                            }}
                        />
                    </div>

                    <div className="form-group" style={{ marginBottom: '2rem' }}>
                        <label className="form-label" style={{ fontWeight: '500', color: '#444', display: 'block', marginBottom: '0.75rem' }}>Attachments (Optional)</label>
                        <EvidenceList
                            evidence={attachments}
                            allowedToAdd={true}
                            onAdd={() => setIsUploadModalOpen(true)}
                            onRemove={(evId) => removeEvidence(id, evId)}
                        />
                    </div>
                </div>

                <div style={{ marginTop: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f0f0f0', paddingTop: '1.5rem' }}>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button type="submit" className="btn-primary" style={{ padding: '0.75rem 2rem', borderRadius: '6px', fontWeight: '600' }}>
                            Save changes
                        </button>
                        <button type="button" className="btn-secondary" onClick={() => navigate(`/goals/${id}`)} style={{ padding: '0.75rem 2.1rem', borderRadius: '6px', border: 'none', background: 'transparent' }}>
                            Cancel
                        </button>
                    </div>

                    {!isArchived && (
                        <button
                            type="button"
                            onClick={() => {
                                if (window.confirm("ARE YOU SURE? This will permanently delete the goal and all its data. This action cannot be undone.")) {
                                    deleteGoal(id);
                                    navigate('/goals');
                                }
                            }}
                            style={{ color: '#dc3545', background: 'none', border: 'none', fontSize: '0.85rem', fontWeight: '600', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.04em' }}
                        >
                            Delete Goal
                        </button>
                    )}
                </div>
            </form>

            <EvidenceUploadModal
                isOpen={isUploadModalOpen}
                onClose={() => setIsUploadModalOpen(false)}
                onAdd={handleAddEvidence}
                contextType="goal"
                contextId={id}
            />
        </V3PageLayout>
    );
};

export default GoalEditV3;
