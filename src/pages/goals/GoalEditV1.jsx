import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useGoals } from '../../context/GoalsContext';
import GoalVersionSwitch from '../../components/GoalVersionSwitch';
import './goals.css';

const GoalEditV1 = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { goals, updateGoal } = useGoals();

    const [formData, setFormData] = useState(null);

    useEffect(() => {
        const found = goals.find(g => g.id === id);
        if (!found) {
            navigate('/goals');
            return;
        }
        setFormData({
            title: found.title,
            scope: found.scope || 'Class-related',
            className: found.className || '',
            subject: found.subject || '',
            description: found.description,
            startDate: found.period.startDate,
            endDate: found.period.endDate
        });
    }, [id, goals, navigate]);

    if (!formData) return <div>Loading...</div>;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = (e) => {
        e.preventDefault();
        updateGoal(id, {
            title: formData.title,
            scope: formData.scope,
            className: formData.scope === 'Class-related' ? formData.className : '',
            subject: formData.scope === 'Class-related' ? formData.subject : '',
            description: formData.description,
            period: { startDate: formData.startDate, endDate: formData.endDate }
        });
        navigate(`/goals/${id}`);
    };

    return (
        <div className="goals-container">
            <Link to={`/goals/${id}`} className="back-link">← Cancel</Link>
            <div className="goals-header">
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <h1 className="goals-title">Edit Goal</h1>
                    <GoalVersionSwitch />
                </div>
            </div>

            <form onSubmit={handleSave} className="form-section">
                <div className="form-group">
                    <label className="form-label" htmlFor="title">Goal Title</label>
                    <input
                        type="text"
                        name="title"
                        className="form-input"
                        value={formData.title}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Goal Scope</label>
                    <div className="radio-options">
                        <label className="radio-label">
                            <input
                                type="radio"
                                name="scope"
                                value="Class-related"
                                checked={formData.scope === 'Class-related'}
                                onChange={handleChange}
                            />
                            Class-related
                        </label>
                        <label className="radio-label">
                            <input
                                type="radio"
                                name="scope"
                                value="General"
                                checked={formData.scope === 'General'}
                                onChange={handleChange}
                            />
                            General
                        </label>
                    </div>
                </div>

                {formData.scope === 'Class-related' && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginTop: '1rem', paddingLeft: '1rem', borderLeft: '2px solid #eee' }}>
                        <div className="form-group">
                            <label className="form-label">Class</label>
                            <select name="className" className="form-select" value={formData.className} onChange={handleChange}>
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(g => (
                                    <option key={g} value={`Grade ${g}`}>Grade {g}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Subject</label>
                            <select name="subject" className="form-select" value={formData.subject} onChange={handleChange}>
                                <option value="General">General / N/A</option>
                                <option value="Mathematics">Mathematics</option>
                                <option value="Swedish">Swedish</option>
                                <option value="English">English</option>
                                <option value="Science">Science</option>
                            </select>
                        </div>
                    </div>
                )}

                <div className="form-group" style={{ marginTop: '1.5rem' }}>
                    <label className="form-label">Period</label>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <input type="date" name="startDate" className="form-input" value={formData.startDate} onChange={handleChange} />
                        <span>—</span>
                        <input type="date" name="endDate" className="form-input" value={formData.endDate} onChange={handleChange} />
                    </div>
                </div>

                <div className="form-group">
                    <label className="form-label">Description</label>
                    <textarea
                        name="description"
                        className="form-textarea"
                        value={formData.description}
                        onChange={handleChange}
                        rows={4}
                    />
                </div>

                <button type="submit" className="btn-primary">
                    Save Changes
                </button>
            </form>
        </div>
    );
};

export default GoalEditV1;
