import { Routes, Route, Navigate, Link } from 'react-router-dom';
import GoalsList from './pages/goals/GoalsList';
import GoalCreate from './pages/goals/GoalCreate';
import GoalDetail from './pages/goals/GoalDetail';
import GoalEdit from './pages/goals/GoalEdit';
import Settings from './pages/Settings';

// V2 Lifecycle Pages (FROZEN - read-only reference)
import GoalOverviewV2 from './pages/goals/v2/GoalOverviewV2';
import GoalCausesV2 from './pages/goals/v2/GoalCausesV2';
import GoalInterventionsV2 from './pages/goals/v2/GoalInterventionsV2';
import GoalInterventionDetailV2 from './pages/goals/v2/GoalInterventionDetailV2';
import GoalEvaluationV2 from './pages/goals/v2/GoalEvaluationV2';

// V3 Lifecycle Pages (ACTIVE - all new changes here)
import GoalOverviewV3 from './pages/goals/v3/GoalOverviewV3';
import GoalCausesV3 from './pages/goals/v3/GoalCausesV3';
import GoalInterventionsV3 from './pages/goals/v3/GoalInterventionsV3';
import GoalInterventionDetailV3 from './pages/goals/v3/GoalInterventionDetailV3';
import GoalEvaluationV3 from './pages/goals/v3/GoalEvaluationV3';

import GoalGuard from './pages/goals/GoalGuard';

import './App.css';
import { GoalsProvider, useGoals } from './context/GoalsContext';

// Version Switcher Component
const VersionSwitcher = () => {
  const { version, setVersion } = useGoals();

  return (
    <div style={{
      position: 'fixed',
      top: '1rem',
      right: '1rem',
      background: 'white',
      border: '1px solid #ddd',
      borderRadius: '8px',
      padding: '0.5rem',
      display: 'flex',
      gap: '0.25rem',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      zIndex: 1000
    }}>
      {['V1', 'V2', 'V3'].map((v) => (
        <button
          key={v}
          onClick={() => setVersion(v)}
          style={{
            padding: '0.4rem 0.75rem',
            border: version === v ? '2px solid #1B3AEC' : '1px solid #ccc',
            borderRadius: '4px',
            background: version === v ? '#e8f0fe' : 'white',
            color: version === v ? '#1B3AEC' : '#666',
            fontWeight: version === v ? '600' : '400',
            cursor: 'pointer',
            fontSize: '0.8rem'
          }}
        >
          {v}
        </button>
      ))}
    </div>
  );
};

function AppContent() {
  const { version } = useGoals();

  return (
    <div className="app-main">
      <VersionSwitcher />
      <Routes>
        <Route path="/" element={<Navigate to="/goals" replace />} />
        <Route path="/goals" element={<GoalsList />} />
        <Route path="/goals/new" element={<GoalCreate />} />
        <Route path="/goals/:id" element={<GoalDetail />} />
        <Route path="/goals/:id/edit" element={<GoalEdit />} />

        {/* V2 Specific Lifecycle Routes (FROZEN) */}
        {version === 'V2' && (
          <>
            <Route path="/goals/:id/overview" element={<GoalGuard><GoalOverviewV2 /></GoalGuard>} />
            <Route path="/goals/:id/causes" element={<GoalGuard><GoalCausesV2 /></GoalGuard>} />
            <Route path="/goals/:id/interventions" element={<GoalGuard><GoalInterventionsV2 /></GoalGuard>} />
            <Route path="/goals/:id/interventions/:interventionId" element={<GoalGuard><GoalInterventionDetailV2 /></GoalGuard>} />
            <Route path="/goals/:id/evaluation" element={<GoalGuard><GoalEvaluationV2 /></GoalGuard>} />
          </>
        )}

        {/* V3 Specific Lifecycle Routes (ACTIVE) */}
        {version === 'V3' && (
          <>
            <Route path="/goals/:id/overview" element={<GoalGuard><GoalOverviewV3 /></GoalGuard>} />
            <Route path="/goals/:id/causes" element={<GoalGuard><GoalCausesV3 /></GoalGuard>} />
            <Route path="/goals/:id/interventions" element={<GoalGuard><GoalInterventionsV3 /></GoalGuard>} />
            <Route path="/goals/:id/interventions/:interventionId" element={<GoalGuard><GoalInterventionDetailV3 /></GoalGuard>} />
            <Route path="/goals/:id/evaluation" element={<GoalGuard><GoalEvaluationV3 /></GoalGuard>} />
          </>
        )}

        <Route path="/settings" element={<Settings />} />
      </Routes>
      <footer style={{ marginTop: '4rem', padding: '2rem 0', borderTop: '1px solid #eee', fontSize: '0.8rem', color: '#999', display: 'flex', gap: '1rem' }}>
        <span>© 2026 Goal Setter</span>
        <Link to="/settings" style={{ color: '#666', textDecoration: 'none' }}>System Settings</Link>
      </footer>
    </div>
  );
}

function App() {
  return (
    <GoalsProvider>
      <AppContent />
    </GoalsProvider>
  );
}

export default App;
