import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import EditRoundedIcon from '@mui/icons-material/EditRounded';

import PostCard from '../components/community/post-card';
import EmptyState from '../components/ui/empty-state';
import { useAuth } from '../hooks/use-auth';
import { supabase } from '../lib/supabase';
import { POST_CATEGORIES } from '../utils/constants';

/**
 * PostListPage 컴포넌트
 * 카테고리별 게시물 목록을 보여준다.
 *
 * Example usage:
 * <PostListPage />
 */
function PostListPage() {
  const { session } = useAuth();
  const [category, setCategory] = useState('all');
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isCancelled = false;
    const loadPosts = async () => {
      setIsLoading(true);
      let query = supabase
        .from('posts')
        .select('id, title, content, category, image_url, created_at, users!posts_user_id_fkey(name), comments(count), likes(count)')
        .order('created_at', { ascending: false });
      if (category !== 'all') {
        query = query.eq('category', category);
      }
      const { data } = await query;
      if (!isCancelled) {
        setPosts(data ?? []);
        setIsLoading(false);
      }
    };
    loadPosts();
    return () => {
      isCancelled = true;
    };
  }, [category]);

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: { xs: 'flex-start', sm: 'center' }, justifyContent: 'space-between', gap: 2, mb: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
        <Box>
          <Box component="h1" sx={{ m: 0, fontSize: { xs: '1.5rem', md: '2rem' }, lineHeight: 1.3 }}>
            우리 아이 이야기 🐾
          </Box>
          <Box sx={{ color: 'text.secondary', fontSize: { xs: '0.9rem', md: '1rem' }, mt: 0.5 }}>
            반려동물과의 소중한 일상을 나눠보세요
          </Box>
        </Box>
        <Button
          variant="contained"
          startIcon={ <EditRoundedIcon /> }
          component={ RouterLink }
          to={ session ? '/write' : '/login' }
        >
          글쓰기
        </Button>
      </Box>

      <Tabs
        value={ category }
        onChange={ (_event, value) => setCategory(value) }
        variant="scrollable"
        scrollButtons="auto"
        allowScrollButtonsMobile
        sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}
      >
        <Tab value="all" label="전체" />
        { POST_CATEGORIES.map((item) => (
          <Tab key={ item.value } value={ item.value } label={ `${item.emoji} ${item.label}` } />
        )) }
      </Tabs>

      { isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : posts.length === 0 ? (
        <EmptyState message="아직 게시물이 없어요. 첫 이야기를 들려주세요!" />
      ) : (
        <Grid container spacing={ 2 }>
          { posts.map((post) => (
            <Grid key={ post.id } size={{ xs: 12, sm: 6, md: 4 }}>
              <PostCard post={ post } />
            </Grid>
          )) }
        </Grid>
      ) }
    </Box>
  );
}

export default PostListPage;
