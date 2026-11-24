import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';

import { useAuth } from '../../hooks/use-auth';
import { supabase } from '../../lib/supabase';

/**
 * LikeButton 컴포넌트
 * 게시물 좋아요 수를 보여주고 좋아요/취소를 처리한다.
 *
 * Props:
 * @param {number} postId - 게시물 번호 [Required]
 *
 * Example usage:
 * <LikeButton postId={1} />
 */
function LikeButton({ postId }) {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [count, setCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isBusy, setIsBusy] = useState(false);

  const loadLikes = useCallback(async () => {
    const { data } = await supabase.from('likes').select('user_id').eq('post_id', postId);
    const rows = data ?? [];
    setCount(rows.length);
    setIsLiked(Boolean(profile && rows.some((row) => row.user_id === profile.id)));
  }, [postId, profile]);

  useEffect(() => {
    loadLikes();
  }, [loadLikes]);

  const handleClick = async () => {
    if (!profile) {
      navigate('/login');
      return;
    }
    setIsBusy(true);
    if (isLiked) {
      await supabase.from('likes').delete().eq('post_id', postId).eq('user_id', profile.id);
    } else {
      await supabase.from('likes').insert({ post_id: postId });
    }
    await loadLikes();
    setIsBusy(false);
  };

  return (
    <Button
      variant={ isLiked ? 'contained' : 'outlined' }
      color="secondary"
      disabled={ isBusy }
      onClick={ handleClick }
      startIcon={ isLiked ? <FavoriteRoundedIcon /> : <FavoriteBorderRoundedIcon /> }
    >
      좋아요 { count }
    </Button>
  );
}

export default LikeButton;
