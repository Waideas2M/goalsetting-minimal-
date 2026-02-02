import React from 'react';
import { useGoals } from '../context/GoalsContext';

const GoalVersionSwitch = () => {
    const { version, setVersion, isV1Unlocked } = useGoals();

    return (
        <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '0.5rem 1rem', position: 'absolute', right: 0, top: 0 }}>
            <div className="version-switch-container" style={{ margin: 0, fontSize: '0.75rem', color: '#999' }}>
                <span
                    style={{
                        cursor: isV1Unlocked ? 'pointer' : 'default',
                        fontWeight: version === 'V1' ? '700' : '400',
                        color: version === 'V1' ? '#333' : '#ccc',
                        opacity: isV1Unlocked ? 1 : 0.5
                    }}
                    onClick={() => isV1Unlocked && setVersion('V1')}
                >
                    V1
                </span>
                <span style={{ margin: '0 0.5rem', userSelect: 'none' }}>|</span>
                <span
                    style={{
                        cursor: 'pointer',
                        fontWeight: version === 'V2' ? '700' : '400',
                        color: version === 'V2' ? '#333' : '#ccc'
                    }}
                    onClick={() => setVersion('V2')}
                >
                    V2
                </span>
            </div>
        </div>
    );
};

export default GoalVersionSwitch;
