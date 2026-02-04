import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useGoals, SCHOOLS, SCHOOL_YEARS } from '../../../context/GoalsContext';
import V3PageLayout from './V3PageLayout';
import EvidenceUploadModal from '../../../components/EvidenceUploadModal';
import EvidenceList from '../../../components/EvidenceList';
import '../goals.css';

const GoalCreateV3 = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { addGoal, goals } = useGoals();
    const sourceGoalId = location.state?.sourceGoalId;

    // Prefill from template
    useEffect(() => {
        if (sourceGoalId && goals.length > 0) {
            const source = goals.find(g => g.id === sourceGoalId);
            if (source) {
                setFormData(prev => ({
                    ...prev,
                    title: `Copy of ${source.title}`,
                    school: source.school,
                    schoolYear: source.schoolYear || prev.schoolYear,
                    description: source.description || '',
                }));
                if (source.evidence) {
                    setEvidence(source.evidence.map(e => ({
                        ...e,
                        id: Math.random().toString(36).substr(2, 9),
                        dateAdded: new Date().toISOString()
                    })));
                }
            }
        }
    }, [sourceGoalId, goals]);

    const [formData, setFormData] = useState({
        title: '',
        school: '',
        schoolYear: '',
        description: '',
        evaluationPeriod: '',
        evaluationIndicator: ''
    });

    const [evidence, setEvidence] = useState([]);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const textareaRef = useRef(null);

    // Auto-grow textarea effect
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
        }
    }, [formData.description]);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.title || !formData.school || !formData.schoolYear) {
            alert('Please fill in all required fields (Title, School, School Year).');
            return;
        }

        // Find source for template data
        const source = sourceGoalId ? goals.find(g => g.id === sourceGoalId) : null;

        const newGoalId = addGoal({
            ...formData,
            status: 'Draft',
            evidence: evidence,
            situationAnalysis: source ? source.situationAnalysis : undefined,
            hypotheses: source ? source.hypotheses : undefined,
            fromTemplate: !!source
        });

        navigate(`/goals/${newGoalId}`);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleAddEvidence = (evData) => {
        const newEvidence = {
            ...evData,
            id: Math.random().toString(36).substr(2, 9),
            contextType: 'goal',
            dateAdded: new Date().toISOString()
        };
        setEvidence(prev => [...prev, newEvidence]);
    };

    const handleRemoveEvidence = (id) => {
        setEvidence(prev => prev.filter(e => e.id !== id));
    };

    return (
        <V3PageLayout title="Create Goal">
            <form onSubmit={handleSubmit} className="form-container" style={{ maxWidth: '800px', margin: '0 auto' }}>
                <div className="form-section" style={{ border: 'none', padding: 0 }}>
                    {/* Goal Title */}
                    <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                        <label className="form-label" style={{ fontWeight: '500', color: '#444' }}>Goal Title *</label>
                        <input
                            type="text"
                            name="title"
                            className="form-input"
                            placeholder="What do you want to achieve?"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            style={{ border: '1px solid #e0e0e0', borderRadius: '6px', padding: '0.75rem' }}
                        />
                    </div>

                    {/* School + School Year Row */}
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
                                style={{ border: '1px solid #e0e0e0', borderRadius: '6px', padding: '0.75rem' }}
                            >
                                <option value="">Select year...</option>
                                {SCHOOL_YEARS.map(y => (
                                    <option key={y} value={y}>{y}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Description (Auto-grow Textarea) */}
                    <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                        <label className="form-label" style={{ fontWeight: '500', color: '#444' }}>Description (Optional)</label>
                        <textarea
                            ref={textareaRef}
                            name="description"
                            className="form-textarea"
                            placeholder="Add a brief description..."
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

                    {/* Attachments Section - Evaluation Plan Phase 1 removed */}

                    {/* Attachments Section */}
                    <div className="form-group" style={{ marginBottom: '2rem' }}>
                        <label className="form-label" style={{ fontWeight: '500', color: '#444', display: 'block', marginBottom: '0.75rem' }}>Attachments (Optional)</label>
                        <EvidenceList
                            evidence={evidence}
                            allowedToAdd={true}
                            onAdd={() => setIsUploadModalOpen(true)}
                            onRemove={(id) => handleRemoveEvidence(id)}
                        />
                    </div>
                </div>

                <div style={{ marginTop: '2.5rem', display: 'flex', gap: '1rem', borderTop: '1px solid #f0f0f0', paddingTop: '1.5rem' }}>
                    <button type="submit" className="btn-primary" style={{ padding: '0.75rem 2rem', borderRadius: '6px', fontWeight: '600' }}>
                        Create goal
                    </button>
                    <button type="button" className="btn-secondary" onClick={() => navigate('/goals')} style={{ padding: '0.75rem 2.1rem', borderRadius: '6px', border: 'none', background: 'transparent' }}>
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
        </V3PageLayout>
    );
};

export default GoalCreateV3;
