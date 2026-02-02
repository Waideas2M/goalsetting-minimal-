import React from 'react';
import './GoalStatusModal.css';

const GoalStatusModal = ({ isOpen, onClose, onReopen, title, message }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2 className="modal-title">{title || "This goal is closed"}</h2>
                <p className="modal-message">
                    {message || "To continue working on this goal, you must reopen it."}
                </p>
                <div className="modal-actions">
                    <button className="btn-secondary" onClick={onClose}>Cancel</button>
                    <button className="btn-primary" onClick={onReopen}>Reopen goal</button>
                </div>
            </div>
        </div>
    );
};

export default GoalStatusModal;
