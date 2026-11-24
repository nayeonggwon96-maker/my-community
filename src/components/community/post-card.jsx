import { Link as RouterLink } from 'react-router-dom';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import Chip from '@mui/material/Chip';
import ChatBubbleOutlineRoundedIcon from '@mui/icons-material/ChatBubbleOutlineRounded';
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded';

import { getCategoryLabel, POST_CATEGORIES } from '../../utils/constants';
import { formatDate } from '../../utils/format-date';

/**
 * PostCard 컴포넌트
 * 게시물 목록의 카드 하나를 보여준다.
 *
 * Props:
 * @param {object} post - 게시물 데이터 (users, comments, likes 집계 포함) [Required]
 *
 * Example usage:
 * <PostCard post={post} />
 */
function PostCard({ post }) {
  const commentCount = post.comments?.[0]?.count ?? 0;
  const likeCount = post.likes?.[0]?.count ?? 0;

  return (
    <Card sx={{ height: '100%' }}>
      <CardActionArea component={ RouterLink } to={ `/posts/${post.id}` } sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}>
        { post.image_url ? (
          <Box component="img" src={ post.image_url } alt={ post.title } sx={{ width: '100%', height: 180, objectFit: 'cover', display: 'block' }} />
        ) : (
          <Box sx={{ height: 180, bgcolor: 'primary.light', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', opacity: 0.6 }}>
            🐾
          </Box>
        ) }
        <Box sx={{ p: 2, flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Chip size="small" label={ getCategoryLabel(POST_CATEGORIES, post.category) } color="primary" variant="outlined" sx={{ alignSelf: 'flex-start' }} />
          <Box sx={{ fontWeight: 700, fontSize: { xs: '1rem', md: '1.05rem' }, lineHeight: 1.4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            { post.title }
          </Box>
          <Box sx={{ fontSize: '0.875rem', color: 'text.secondary', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            { post.content }
          </Box>
          <Box sx={{ mt: 'auto', pt: 1, display: 'flex', alignItems: 'center', gap: 1.5, fontSize: '0.8rem', color: 'text.secondary' }}>
            <Box component="span" sx={{ flexGrow: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              { post.users?.name ?? '알 수 없음' } · { formatDate(post.created_at) }
            </Box>
            <Box component="span" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'secondary.main' }}>
              <FavoriteBorderRoundedIcon sx={{ fontSize: 16 }} />{ likeCount }
            </Box>
            <Box component="span" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'primary.main' }}>
              <ChatBubbleOutlineRoundedIcon sx={{ fontSize: 16 }} />{ commentCount }
            </Box>
          </Box>
        </Box>
      </CardActionArea>
    </Card>
  );
}

export default PostCard;
