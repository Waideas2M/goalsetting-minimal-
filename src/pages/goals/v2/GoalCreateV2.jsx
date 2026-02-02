import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useGoals, MOCK_USERS, SCHOOLS, SCHOOL_YEARS, DATA_BASIS_OPTIONS } from '../../../context/GoalsContext';
import V2PageLayout from './V2PageLayout';
import EvidenceUploadModal from '../../../components/EvidenceUploadModal';
import EvidenceChartModal from '../../../components/EvidenceChartModal';
import EvidenceList from '../../../components/EvidenceList';
import '../goals.css';

const HAS_SKOLANALYS_ACCESS = true;

const GoalCreateV2 = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { addGoal } = useGoals();

    const prefilled = location.state?.prefilled || {};

    const [formData, setFormData] = useState({
        title: prefilled.title || '',
        school: prefilled.school || '',
        schoolYear: prefilled.schoolYear || '',
        goalLead: prefilled.goalLead || '',
        improvementFocus: prefilled.improvementFocus || '',
        dataBasis: prefilled.dataBasis || [], // Array
        scope: prefilled.scope || '',
        className: prefilled.className || '',
        intendedDirection: prefilled.intendedDirection || '',
    });

    const [evidence, setEvidence] = useState([]);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [isChartModalOpen, setIsChartModalOpen] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();

        const required = ['title', 'school', 'schoolYear', 'improvementFocus'];
        const missing = required.filter(f => !formData[f]);

        if (missing.length > 0 || formData.dataBasis.length === 0) {
            alert('Please fill in all required fields:\n- Goal Title\n- School\n- School Year\n- Improvement Focus\n- At least one Data Basis option');
            return;
        }

        const newGoalId = addGoal({
            ...formData,
            status: 'Draft',
            evidence: evidence
        });

        navigate(`/goals/${newGoalId}/overview`);
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

    const handleAddEvidence = (evData) => {
        const newEvidence = {
            ...evData,
            id: Math.random().toString(36).substr(2, 9),
            phase: 'baseline',
            contextType: 'goal',
            dateAdded: new Date().toISOString()
        };
        setEvidence([...evidence, newEvidence]);
    };

    return (
        <V2PageLayout title="Create Goal">
            <form onSubmit={handleSubmit} className="form-container">
                <div className="form-section" style={{ border: 'none', padding: 0 }}>
                    <div className="form-group">
                        <label className="form-label">Goal Title *</label>
                        <input
                            type="text"
                            name="title"
                            className="form-input"
                            placeholder="e.g. Improve verbal communication in Grade 4"
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
                            >
                                <option value="">Select year...</option>
                                {SCHOOL_YEARS.map(y => (
                                    <option key={y} value={y}>{y}</option>
                                ))}
                            </select>
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
                        <p style={{ fontSize: '0.75rem', color: '#888', marginTop: '0.4rem' }}>
                            The primary contact person for this goal.
                        </p>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Improvement Focus *</label>
                        <textarea
                            name="improvementFocus"
                            className="form-textarea"
                            placeholder="Identify the area for improvement..."
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
                            evidence={evidence}
                            allowedToAdd={false}
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
                                    placeholder="Class name (e.g. Grade 4)"
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
                            placeholder="Describe the desired outcome or target state..."
                            rows="3"
                            value={formData.intendedDirection}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', borderTop: '1px solid #eee', paddingTop: '1.5rem' }}>
                    <button type="submit" className="btn-primary">
                        Create goal
                    </button>
                    <button type="button" className="btn-secondary" onClick={() => navigate('/goals')}>
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
        </V2PageLayout>
    );
};

export default GoalCreateV2;
