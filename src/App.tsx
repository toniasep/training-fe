import { Route, Routes } from 'react-router-dom';
import UsersPage from './app/users/page';
import { AppShell } from './common/components/app-shell';

function App() {
  return (
    <AppShell>
      <Routes>
        <Route path="/users" element={<UsersPage />} />
      </Routes>
    </AppShell>
  )
}

export default App;
