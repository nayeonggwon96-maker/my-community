import { useEffect, useState } from 'react';
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';

import CommentSection from '../components/community/comment-section';
import LikeButton from '../components/community/like-button';
import EmptyState from '../components/ui/empty-state';
import { useAuth } from '../hooks/use-auth';
import { supabase } from '../lib/supabase';
import { getCategoryLabel, POST_CATEGORIES } from '../utils/constants';
import { formatDate } from '../utils/format-date';

/**
 * PostDetailPage 컴포넌트
 * 게시물 제목, 작성자, 작성일, 본문, 사진과 댓글을 보여준다.
 *
 * Example usage:
 * <PostDetailPage />
 */
function PostDetailPage() {
  const { id } = useParams();
  const postId = Number(id);
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadPost = async () => {
      setIsLoading(true);
      const { data } = await supabase
        .from('posts')
        .select('*, users!posts_user_id_fkey(name)')
        .eq('id', postId)
        .maybeSingle();
      setPost(data);
      setIsLoading(false);
    };
    loadPost();
  }, [postId]);

  const handleDelete = async () => {
    if (!window.confirm('게시물을 삭제할까요?')) {
      return;
    }
    const { error } = await supabase.from('posts').delete().eq('id', postId);
    if (!error) {
      navigate('/', { replace: true });
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!post) {
    return <EmptyState emoji="😿" message="게시물을 찾을 수 없어요." />;
  }

  const isOwner = profile?.id === post.user_id;
  const isEdited = post.updated_at && post.updated_at !== post.created_at;

  return (
    <Box>
      <Button startIcon={ <ArrowBackRoundedIcon /> } component={ RouterLink } to="/" color="inherit" sx={{ mb: 2 }}>
        목록으로
      </Button>

      <Paper sx={{ p: { xs: 2, md: 4 } }}>
        <Chip size="small" color="primary" label={ getCategoryLabel(POST_CATEGORIES, post.category) } sx={{ mb: 1.5 }} />
        <Box component="h1" sx={{ m: 0, fontSize: { xs: '1.5rem', md: '2rem' }, lineHeight: 1.3, wordBreak: 'break-word' }}>
          { post.title }
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mt: 2 }}>
          <Avatar sx={{ bgcolor: 'primary.light', color: 'primary.dark' }}>{ post.users?.name?.[0] ?? '?' }</Avatar>
          <Box sx={{ flexGrow: 1 }}>
            <Box sx={{ fontWeight: 700, fontSize: '0.95rem' }}>{ post.users?.name ?? '알 수 없음' }</Box>
            <Box sx={{ fontSize: '0.8rem', color: 'text.secondary' }}>
              { formatDate(post.created_at, true) }{ isEdited ? ` · 수정됨 ${formatDate(post.updated_at, true)}` : '' }
            </Box>
          </Box>
          { isOwner && (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button size="small" variant="outlined" component={ RouterLink } to={ `/posts/${post.id}/edit` }>수정</Button>
              <Button size="small" color="inherit" onClick={ handleDelete }>삭제</Button>
            </Box>
          ) }
        </Box>

        <Divider sx={{ my: 3 }} />

        { post.image_url && (
          <Box component="img" src={ post.image_url } alt={ post.title } sx={{ width: '100%', maxHeight: 520, objectFit: 'contain', borderRadius: 3, bgcolor: 'background.default', display: 'block', mb: 3 }} />
        ) }

        <Box sx={{ fontSize: { xs: '1rem', md: '1.05rem' }, lineHeight: 1.6, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
          { post.content }
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <LikeButton postId={ post.id } />
        </Box>
      </Paper>

      <CommentSection postId={ post.id } />
    </Box>
  );
}

export default PostDetailPage;
