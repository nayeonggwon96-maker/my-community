import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Rating from '@mui/material/Rating';
import RateReviewRoundedIcon from '@mui/icons-material/RateReviewRounded';

import ReviewCard from '../components/community/review-card';
import ReviewFormDialog from '../components/community/review-form-dialog';
import EmptyState from '../components/ui/empty-state';
import { useAuth } from '../hooks/use-auth';
import { supabase } from '../lib/supabase';
import { REVIEW_CATEGORIES } from '../utils/constants';

/**
 * ReviewPage 컴포넌트
 * 동물병원, 용품, 장소 등의 별점 리뷰 목록과 작성 기능을 제공한다.
 *
 * Example usage:
 * <ReviewPage />
 */
function ReviewPage() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [category, setCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const loadReviews = useCallback(async () => {
    setIsLoading(true);
    const { data } = await supabase.from('reviews').select('*, users(name)').order('created_at', { ascending: false });
    setReviews(data ?? []);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadReviews();
  }, [loadReviews]);

  const filteredReviews = useMemo(
    () => (category === 'all' ? reviews : reviews.filter((review) => review.category === category)),
    [reviews, category],
  );

  const averageRating = useMemo(() => {
    if (filteredReviews.length === 0) {
      return 0;
    }
    return filteredReviews.reduce((sum, review) => sum + review.rating, 0) / filteredReviews.length;
  }, [filteredReviews]);

  const handleOpenDialog = () => {
    if (!profile) {
      navigate('/login');
      return;
    }
    setIsDialogOpen(true);
  };

  const handleDelete = async (review) => {
    if (!window.confirm('리뷰를 삭제할까요?')) {
      return;
    }
    await supabase.from('reviews').delete().eq('id', review.id);
    loadReviews();
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: { xs: 'flex-start', sm: 'center' }, justifyContent: 'space-between', gap: 2, mb: 3, flexDirection: { xs: 'column', sm: 'row' } }}>
        <Box>
          <Box component="h1" sx={{ m: 0, fontSize: { xs: '1.5rem', md: '2rem' }, lineHeight: 1.3 }}>
            별점 리뷰 ⭐
          </Box>
          <Box sx={{ color: 'text.secondary', fontSize: { xs: '0.9rem', md: '1rem' }, mt: 0.5 }}>
            동물병원, 용품, 사료, 펫 동반 장소 후기를 나눠요
          </Box>
        </Box>
        <Button variant="contained" startIcon={ <RateReviewRoundedIcon /> } onClick={ handleOpenDialog }>
          리뷰 쓰기
        </Button>
      </Box>

      <Paper sx={{ p: 2, mb: 3, display: 'flex', alignItems: 'center', gap: 2, bgcolor: 'rgba(168,230,207,0.25)' }}>
        <Box sx={{ fontSize: { xs: '2rem', md: '2.5rem' }, fontWeight: 700, color: 'primary.dark', lineHeight: 1.2 }}>
          { averageRating.toFixed(1) }
        </Box>
        <Box>
          <Rating value={ averageRating } precision={ 0.1 } readOnly />
          <Box sx={{ fontSize: '0.85rem', color: 'text.secondary' }}>리뷰 { filteredReviews.length }개 평균</Box>
        </Box>
      </Paper>

      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 3 }}>
        <Chip label="전체" color="primary" variant={ category === 'all' ? 'filled' : 'outlined' } onClick={ () => setCategory('all') } />
        { REVIEW_CATEGORIES.map((item) => (
          <Chip
            key={ item.value }
            label={ item.label }
            color="primary"
            variant={ category === item.value ? 'filled' : 'outlined' }
            onClick={ () => setCategory(item.value) }
          />
        )) }
      </Box>

      { isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : filteredReviews.length === 0 ? (
        <EmptyState emoji="⭐" message="아직 리뷰가 없어요. 첫 리뷰를 남겨주세요!" />
      ) : (
        <Grid container spacing={ 2 }>
          { filteredReviews.map((review) => (
            <Grid key={ review.id } size={{ xs: 12, sm: 6 }}>
              <ReviewCard review={ review } isOwner={ profile?.id === review.user_id } onDelete={ () => handleDelete(review) } />
            </Grid>
          )) }
        </Grid>
      ) }

      <ReviewFormDialog isOpen={ isDialogOpen } onClose={ () => setIsDialogOpen(false) } onCreated={ loadReviews } />
    </Box>
  );
}

export default ReviewPage;
