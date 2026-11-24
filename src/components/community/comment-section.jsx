import { useCallback, useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';

import { useAuth } from '../../hooks/use-auth';
import { supabase } from '../../lib/supabase';
import { formatDate } from '../../utils/format-date';

/**
 * CommentSection 컴포넌트
 * 게시물의 댓글 목록과 작성 폼을 보여준다.
 *
 * Props:
 * @param {number} postId - 게시물 번호 [Required]
 *
 * Example usage:
 * <CommentSection postId={1} />
 */
function CommentSection({ postId }) {
  const { profile } = useAuth();
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadComments = useCallback(async () => {
    const { data } = await supabase
      .from('comments')
      .select('id, content, created_at, user_id, users(name)')
      .eq('post_id', postId)
      .order('created_at', { ascending: true });
    setComments(data ?? []);
  }, [postId]);

  useEffect(() => {
    loadComments();
  }, [loadComments]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!content.trim()) {
      return;
    }
    setIsSubmitting(true);
    const { error } = await supabase.from('comments').insert({ post_id: postId, content: content.trim() });
    setIsSubmitting(false);
    if (!error) {
      setContent('');
      loadComments();
    }
  };

  const handleDelete = async (commentId) => {
    if (!window.confirm('댓글을 삭제할까요?')) {
      return;
    }
    await supabase.from('comments').delete().eq('id', commentId);
    loadComments();
  };

  return (
    <Paper sx={{ p: { xs: 2, md: 3 }, mt: 3 }}>
      <Box component="h3" sx={{ m: 0, mb: 2, fontSize: { xs: '1.05rem', md: '1.15rem' } }}>
        💬 댓글 { comments.length }
      </Box>

      { profile ? (
        <Box component="form" onSubmit={ handleSubmit } sx={{ display: 'flex', gap: 1, mb: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
          <TextField
            fullWidth
            size="small"
            placeholder="따뜻한 댓글을 남겨주세요 🐾"
            value={ content }
            onChange={ (event) => setContent(event.target.value) }
            multiline
            maxRows={ 4 }
          />
          <Button type="submit" variant="contained" disabled={ isSubmitting || !content.trim() } sx={{ flexShrink: 0 }}>
            등록
          </Button>
        </Box>
      ) : (
        <Box sx={{ mb: 2, p: 2, bgcolor: 'background.default', borderRadius: 2, fontSize: '0.9rem', color: 'text.secondary' }}>
          댓글을 작성하려면 <Box component={ RouterLink } to="/login" sx={{ color: 'primary.main', fontWeight: 700 }}>로그인</Box> 해주세요.
        </Box>
      ) }

      { comments.map((comment, index) => (
        <Box key={ comment.id }>
          { index > 0 && <Divider /> }
          <Box sx={{ display: 'flex', gap: 1.5, py: 1.5 }}>
            <Avatar sx={{ bgcolor: 'primary.light', color: 'primary.dark', width: 36, height: 36, fontSize: '0.95rem' }}>
              { comment.users?.name?.[0] ?? '?' }
            </Avatar>
            <Box sx={{ flexGrow: 1, minWidth: 0 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, fontSize: '0.85rem' }}>
                <Box component="span" sx={{ fontWeight: 700 }}>{ comment.users?.name ?? '알 수 없음' }</Box>
                <Box component="span" sx={{ color: 'text.secondary' }}>{ formatDate(comment.created_at, true) }</Box>
              </Box>
              <Box sx={{ mt: 0.5, fontSize: '0.95rem', lineHeight: 1.6, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                { comment.content }
              </Box>
            </Box>
            { profile?.id === comment.user_id && (
              <IconButton size="small" aria-label="댓글 삭제" onClick={ () => handleDelete(comment.id) }>
                <DeleteOutlineRoundedIcon fontSize="small" />
              </IconButton>
            ) }
          </Box>
        </Box>
      )) }
    </Paper>
  );
}

export default CommentSection;
