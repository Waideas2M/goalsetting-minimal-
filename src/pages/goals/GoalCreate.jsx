import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useGoals } from '../../context/GoalsContext';
import './goals.css';

const GoalCreate = () => {
    const navigate = useNavigate();
    const { addGoal } = useGoals();

    const [formData, setFormData] = useState({
        title: '',
        scope: 'Class-related',
        className: 'Grade 6',
        subject: 'General',
        description: '',
        startDate: '',
        endDate: '',
        // Updated: Array for multiple files
        evidenceFiles: []
    });

    // Temporary state for the file input simulation
    const [tempFileName, setTempFileName] = useState('');
    const [tempFileDesc, setTempFileDesc] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const addFile = () => {
        if (!tempFileName) return;

        const newFile = {
            id: Math.random().toString(36).substr(2, 5),
            type: 'file',
            url: tempFileName, // We use 'url' to store filename to match schema
            description: tempFileDesc,
            dateAdded: new Date().toISOString().split('T')[0]
        };

        setFormData(prev => ({
            ...prev,
            evidenceFiles: [...prev.evidenceFiles, newFile]
        }));
        setTempFileName('');
        setTempFileDesc('');
    };

    const removeFile = (id) => {
        setFormData(prev => ({
            ...prev,
            evidenceFiles: prev.evidenceFiles.filter(f => f.id !== id)
        }));
    };

    const createGoal = (status) => {
        const newId = addGoal({
            title: formData.title || 'Untitled Draft',
            scope: formData.scope,
            className: formData.scope === 'Class-related' ? formData.className : '',
            subject: formData.scope === 'Class-related' ? formData.subject : '',
            description: formData.description,
            period: { startDate: formData.startDate, endDate: formData.endDate },
            status: status,
            initialEvidence: formData.evidenceFiles // Pass the array of files
        });
        navigate(`/goals/${newId}`);
    }

    const handleSaveDraft = (e) => {
        e.preventDefault();
        createGoal('Draft');
    };

    const handleContinue = (e) => {
        e.preventDefault();
        createGoal('Draft');
    };

    return (
        <div className="goals-container">
            <Link to="/goals" className="back-link">← Back to Goals</Link>
            <div className="goals-header">
                <h1 className="goals-title">Create New Goal</h1>
            </div>

            <form className="form-section">

                {/* STEP 1: Goal Details */}
                <h3 style={{ borderBottom: '1px solid #ccc', paddingBottom: '0.5rem', marginBottom: '1.5rem', fontSize: '1.1rem' }}>Step 1: Goal Details</h3>

                <div className="form-group">
                    <label className="form-label">Goal Title</label>
                    <input
                        type="text"
                        name="title"
                        className="form-input"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="e.g. Improve class attendance"
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Goal Scope</label>
                    <div className="radio-options">
                        <label className="radio-label">
                            <input type="radio" name="scope" value="Class-related" checked={formData.scope === 'Class-related'} onChange={handleChange} />
                            Class-related
                        </label>
                        <label className="radio-label">
                            <input type="radio" name="scope" value="General" checked={formData.scope === 'General'} onChange={handleChange} />
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
                    <label className="form-label">Goal Description</label>
                    <textarea
                        name="description"
                        className="form-textarea"
                        rows={5}
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Describe the goal..."
                    />
                </div>

                {/* STEP 2: Goal Evidence (Multi-file) */}
                <h3 style={{ borderBottom: '1px solid #ccc', paddingBottom: '0.5rem', marginBottom: '1.5rem', marginTop: '2.5rem', fontSize: '1.1rem' }}>Step 2: Attach Evidence (Goal-level)</h3>

                <div className="form-group">
                    <label className="form-label">Baseline Documents / Plans</label>
                    <div style={{ background: '#f9f9f9', padding: '1rem', borderRadius: '4px', border: '1px dashed #ccc' }}>

                        {/* List of added files */}
                        {formData.evidenceFiles.length > 0 && (
                            <div style={{ marginBottom: '1rem' }}>
                                {formData.evidenceFiles.map(file => (
                                    <div key={file.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white', padding: '0.5rem', marginBottom: '0.5rem', border: '1px solid #eee' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <span style={{ fontSize: '1.2rem' }}>📄</span>
                                            <div>
                                                <div style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{file.url}</div>
                                                {file.description && <div style={{ fontSize: '0.8rem', color: '#666' }}>{file.description}</div>}
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removeFile(file.id)}
                                            style={{ border: 'none', background: 'none', color: '#d00', fontWeight: 'bold', cursor: 'pointer' }}
                                        >✕</button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Add File Inputs */}
                        <div style={{ display: 'grid', gap: '0.5rem', gridTemplateColumns: '1fr 1fr auto' }}>
                            <input
                                className="form-input"
                                value={tempFileName}
                                onChange={(e) => setTempFileName(e.target.value)}
                                placeholder="Filename (e.g. plan.pdf)..."
                            />
                            <input
                                className="form-input"
                                value={tempFileDesc}
                                onChange={(e) => setTempFileDesc(e.target.value)}
                                placeholder="Description (optional)..."
                            />
                            <button type="button" className="btn-secondary" onClick={addFile}>+ Add</button>
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#666', marginTop: '0.5rem' }}>
                            Supported: PDF, Images (JPG, PNG), Documents (DOC/DOCX). No links.
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
                    <button type="button" className="btn-secondary" onClick={handleSaveDraft}>
                        Save as Draft
                    </button>
                    <button type="button" className="btn-primary" onClick={handleContinue}>
                        Create Goal
                    </button>
                </div>
            </form>
        </div>
    );
};

export default GoalCreate;
