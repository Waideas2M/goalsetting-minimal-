import React from 'react';
import { useGoals } from '../context/GoalsContext';
import { Link } from 'react-router-dom';

const Settings = () => {
    const { isV1Unlocked, setIsV1Unlocked, setVersion, version } = useGoals();

    const toggleV1Access = () => {
        const newValue = !isV1Unlocked;
        setIsV1Unlocked(newValue);
        // If we disable V1 access, force version back to V2
        if (!newValue && version === 'V1') {
            setVersion('V2');
        }
    };

    return (
        <div className="goals-container">
            <Link to="/goals" className="back-link">← Back to Goals</Link>

            <div className="goals-header">
                <h1 className="goals-title">Settings</h1>
            </div>

            <div className="form-section">
                <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Experimental Features</h2>

                <div style={{ background: '#f5f5f5', padding: '1.5rem', border: '1px solid #ccc' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <h3 style={{ margin: 0, fontSize: '1rem' }}>Enable V1 Goals Experience (Legacy)</h3>
                            <p style={{ margin: '0.2rem 0 0', fontSize: '0.85rem', color: '#666' }}>
                                Unlock the version switch in the main header to access frozen goals.
                            </p>
                        </div>
                        <button
                            className={`btn-${isV1Unlocked ? 'primary' : 'secondary'}`}
                            onClick={toggleV1Access}
                            style={{ minWidth: '120px' }}
                        >
                            {isV1Unlocked ? 'Disable Access' : 'Enable Access'}
                        </button>
                    </div>
                </div>
            </div>

            <div style={{ marginTop: '2rem', fontSize: '0.8rem', color: '#999' }}>
                System Version: 1.2.0-beta.v2
            </div>
        </div>
    );
};

export default Settings;
