import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Rating from '@mui/material/Rating';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';

import { getCategoryLabel, REVIEW_CATEGORIES } from '../../utils/constants';
import { formatDate } from '../../utils/format-date';

/**
 * ReviewCard 컴포넌트
 * 리뷰 하나를 별점과 함께 보여준다.
 *
 * Props:
 * @param {object} review - 리뷰 데이터 [Required]
 * @param {boolean} isOwner - 작성자 본인 여부 [Optional, 기본값: false]
 * @param {function} onDelete - 삭제 버튼 클릭 시 실행 [Optional]
 *
 * Example usage:
 * <ReviewCard review={review} isOwner onDelete={handleDelete} />
 */
function ReviewCard({ review, isOwner = false, onDelete }) {
  return (
    <Card sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column', gap: 1 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Chip size="small" color="primary" variant="outlined" label={ getCategoryLabel(REVIEW_CATEGORIES, review.category) } />
        <Box sx={{ flexGrow: 1 }} />
        { isOwner && (
          <IconButton size="small" aria-label="리뷰 삭제" onClick={ onDelete }>
            <DeleteOutlineRoundedIcon fontSize="small" />
          </IconButton>
        ) }
      </Box>
      <Box sx={{ fontWeight: 700, fontSize: { xs: '1rem', md: '1.1rem' } }}>{ review.place_name }</Box>
      <Rating value={ review.rating } readOnly size="small" />
      <Box sx={{ fontSize: '0.9rem', lineHeight: 1.6, whiteSpace: 'pre-wrap', wordBreak: 'break-word', flexGrow: 1 }}>
        { review.content }
      </Box>
      <Box sx={{ fontSize: '0.8rem', color: 'text.secondary' }}>
        { review.users?.name ?? '알 수 없음' } · { formatDate(review.created_at) }
      </Box>
    </Card>
  );
}

export default ReviewCard;
