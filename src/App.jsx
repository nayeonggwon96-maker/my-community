import { HashRouter, Route, Routes } from 'react-router-dom';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';

import AuthNotice from './components/common/auth-notice';
import AuthProvider from './components/common/auth-provider';
import Header from './components/common/header';
import ProtectedRoute from './components/common/protected-route';
import LoginPage from './pages/login-page';
import LostPetPage from './pages/lost-pet-page';
import PostDetailPage from './pages/post-detail-page';
import PostListPage from './pages/post-list-page';
import PostWritePage from './pages/post-write-page';
import ReviewPage from './pages/review-page';

/**
 * App 컴포넌트
 * 라우팅과 전체 페이지 레이아웃(중앙 정렬)을 담당한다.
 * GitHub Pages 새로고침 404 를 막기 위해 HashRouter 를 사용한다.
 */
function App() {
  return (
    <AuthProvider>
      <HashRouter>
        <AuthNotice />
        <Header />
        <Box sx={{
          width: '100%',
          flexGrow: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          py: { xs: 2, md: 4 },
        }}>
          <Container maxWidth="md" sx={{ py: 4, px: { xs: 2, md: 3 } }}>
            <Routes>
              <Route path="/" element={ <PostListPage /> } />
              <Route path="/login" element={ <LoginPage /> } />
              <Route path="/posts/:id" element={ <PostDetailPage /> } />
              <Route path="/write" element={ <ProtectedRoute><PostWritePage /></ProtectedRoute> } />
              <Route path="/posts/:id/edit" element={ <ProtectedRoute><PostWritePage /></ProtectedRoute> } />
              <Route path="/lost-pets" element={ <LostPetPage /> } />
              <Route path="/reviews" element={ <ReviewPage /> } />
            </Routes>
          </Container>
        </Box>
      </HashRouter>
    </AuthProvider>
  );
}

export default App;
