import { Routes, Route, Navigate, Link } from 'react-router-dom';
import GoalsList from './pages/goals/GoalsList';
import GoalCreate from './pages/goals/GoalCreate';
import GoalDetail from './pages/goals/GoalDetail';
import GoalEdit from './pages/goals/GoalEdit';
import Settings from './pages/Settings';

// V2 Lifecycle Pages
import GoalOverviewV2 from './pages/goals/v2/GoalOverviewV2';
import GoalCausesV2 from './pages/goals/v2/GoalCausesV2';
import GoalInterventionsV2 from './pages/goals/v2/GoalInterventionsV2';
import GoalInterventionDetailV2 from './pages/goals/v2/GoalInterventionDetailV2';
import GoalEvaluationV2 from './pages/goals/v2/GoalEvaluationV2';
import GoalGuard from './pages/goals/GoalGuard';

import './App.css';
import { GoalsProvider } from './context/GoalsContext';

function App() {
  return (
    <GoalsProvider>
      <div className="app-main">
        <Routes>
          <Route path="/" element={<Navigate to="/goals" replace />} />
          <Route path="/goals" element={<GoalsList />} />
          <Route path="/goals/new" element={<GoalCreate />} />
          <Route path="/goals/:id" element={<GoalDetail />} />
          <Route path="/goals/:id/edit" element={<GoalEdit />} />

          {/* V2 Specific Lifecycle Routes */}
          <Route path="/goals/:id/overview" element={<GoalGuard><GoalOverviewV2 /></GoalGuard>} />
          <Route path="/goals/:id/causes" element={<GoalGuard><GoalCausesV2 /></GoalGuard>} />
          <Route path="/goals/:id/interventions" element={<GoalGuard><GoalInterventionsV2 /></GoalGuard>} />
          <Route path="/goals/:id/interventions/:interventionId" element={<GoalGuard><GoalInterventionDetailV2 /></GoalGuard>} />
          <Route path="/goals/:id/evaluation" element={<GoalGuard><GoalEvaluationV2 /></GoalGuard>} />

          <Route path="/settings" element={<Settings />} />
        </Routes>
        <footer style={{ marginTop: '4rem', padding: '2rem 0', borderTop: '1px solid #eee', fontSize: '0.8rem', color: '#999', display: 'flex', gap: '1rem' }}>
          <span>© 2026 Goal Setter</span>
          <Link to="/settings" style={{ color: '#666', textDecoration: 'none' }}>System Settings</Link>
        </footer>
      </div>
    </GoalsProvider>
  );
}

export default App;
