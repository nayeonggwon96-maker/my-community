import { useState } from 'react';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Toolbar from '@mui/material/Toolbar';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import ForumRoundedIcon from '@mui/icons-material/ForumRounded';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import PetsRoundedIcon from '@mui/icons-material/PetsRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import StarRoundedIcon from '@mui/icons-material/StarRounded';

import { useAuth } from '../../hooks/use-auth';

const NAV_ITEMS = [
  { to: '/', label: '커뮤니티', icon: <ForumRoundedIcon /> },
  { to: '/lost-pets', label: '실종동물 찾기', icon: <SearchRoundedIcon /> },
  { to: '/reviews', label: '리뷰', icon: <StarRoundedIcon /> },
];

/**
 * Header 컴포넌트
 * 사이트 로고, 메뉴, 로그인 상태를 보여준다.
 *
 * Example usage:
 * <Header />
 */
function Header() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { session, profile, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const isActive = (to) => (to === '/' ? location.pathname === '/' || location.pathname.startsWith('/posts') : location.pathname.startsWith(to));

  const handleSignOut = async () => {
    await signOut();
    setIsDrawerOpen(false);
    navigate('/');
  };

  return (
    <AppBar
      position="sticky"
      elevation={ 0 }
      sx={{ bgcolor: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(8px)', borderBottom: '1px solid', borderColor: 'primary.light', color: 'text.primary' }}
    >
      <Container maxWidth="md">
        <Toolbar disableGutters sx={{ gap: 1 }}>
          <Box
            component={ RouterLink }
            to="/"
            sx={{ display: 'flex', alignItems: 'center', gap: 1, textDecoration: 'none', color: 'primary.main', flexGrow: 1 }}
          >
            <PetsRoundedIcon />
            <Box component="span" sx={{ fontFamily: '"Jua", sans-serif', fontSize: { xs: '1.5rem', md: '1.75rem' }, lineHeight: 1.2 }}>
              포우포우
            </Box>
          </Box>

          { isMobile ? (
            <IconButton aria-label="메뉴 열기" onClick={ () => setIsDrawerOpen(true) }>
              <MenuRoundedIcon />
            </IconButton>
          ) : (
            <>
              { NAV_ITEMS.map((item) => (
                <Button
                  key={ item.to }
                  component={ RouterLink }
                  to={ item.to }
                  color={ isActive(item.to) ? 'primary' : 'inherit' }
                  sx={{ bgcolor: isActive(item.to) ? 'rgba(61,190,155,0.12)' : 'transparent' }}
                >
                  { item.label }
                </Button>
              )) }
              { session ? (
                <>
                  <Box sx={{ fontSize: '0.875rem', color: 'text.secondary', ml: 1 }}>
                    { profile?.name ?? '회원' }님
                  </Box>
                  <Button variant="outlined" size="small" onClick={ handleSignOut }>로그아웃</Button>
                </>
              ) : (
                <Button variant="contained" component={ RouterLink } to="/login">로그인</Button>
              ) }
            </>
          ) }
        </Toolbar>
      </Container>

      <Drawer anchor="right" open={ isDrawerOpen } onClose={ () => setIsDrawerOpen(false) }>
        <Box sx={{ width: 260, pt: 2 }}>
          <Box sx={{ px: 2, pb: 2, color: 'text.secondary', fontSize: '0.9rem' }}>
            { session ? `${profile?.name ?? '회원'}님, 반가워요! 🐶` : '로그인하고 함께해요! 🐱' }
          </Box>
          <Divider />
          <List>
            { NAV_ITEMS.map((item) => (
              <ListItemButton
                key={ item.to }
                component={ RouterLink }
                to={ item.to }
                selected={ isActive(item.to) }
                onClick={ () => setIsDrawerOpen(false) }
              >
                <ListItemIcon sx={{ color: 'primary.main' }}>{ item.icon }</ListItemIcon>
                <ListItemText primary={ item.label } />
              </ListItemButton>
            )) }
          </List>
          <Divider />
          <Box sx={{ p: 2 }}>
            { session ? (
              <Button fullWidth variant="outlined" onClick={ handleSignOut }>로그아웃</Button>
            ) : (
              <Button fullWidth variant="contained" component={ RouterLink } to="/login" onClick={ () => setIsDrawerOpen(false) }>
                로그인
              </Button>
            ) }
          </Box>
        </Box>
      </Drawer>
    </AppBar>
  );
}

export default Header;
