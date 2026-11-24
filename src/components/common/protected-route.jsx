import { Navigate, useLocation } from 'react-router-dom';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

import { useAuth } from '../../hooks/use-auth';

/**
 * ProtectedRoute 컴포넌트
 * 로그인하지 않은 사용자는 로그인 페이지로 보낸다.
 *
 * Props:
 * @param {node} children - 로그인 후 보여줄 화면 [Required]
 *
 * Example usage:
 * <ProtectedRoute><PostWritePage /></ProtectedRoute>
 */
function ProtectedRoute({ children }) {
  const { session, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!session) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return children;
}

export default ProtectedRoute;
