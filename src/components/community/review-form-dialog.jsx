import { useState } from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import MenuItem from '@mui/material/MenuItem';
import Rating from '@mui/material/Rating';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';

import { supabase } from '../../lib/supabase';
import { REVIEW_CATEGORIES } from '../../utils/constants';

const INITIAL_FORM = { place_name: '', category: 'hospital', rating: 5, content: '' };

/**
 * ReviewFormDialog 컴포넌트
 * 별점 리뷰 작성 폼을 다이얼로그로 보여준다.
 *
 * Props:
 * @param {boolean} isOpen - 다이얼로그 열림 여부 [Required]
 * @param {function} onClose - 닫기 시 실행 [Required]
 * @param {function} onCreated - 등록 완료 시 실행 [Required]
 *
 * Example usage:
 * <ReviewFormDialog isOpen={open} onClose={handleClose} onCreated={reload} />
 */
function ReviewFormDialog({ isOpen, onClose, onCreated }) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (key) => (event) => setForm((prev) => ({ ...prev, [key]: event.target.value }));

  const handleClose = () => {
    setForm(INITIAL_FORM);
    setErrorMessage('');
    onClose();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');
    const { error } = await supabase.from('reviews').insert(form);
    setIsSubmitting(false);
    if (error) {
      setErrorMessage(error.message);
      return;
    }
    onCreated();
    handleClose();
  };

  return (
    <Dialog open={ isOpen } onClose={ handleClose } fullWidth maxWidth="sm">
      <form onSubmit={ handleSubmit }>
        <DialogTitle sx={{ fontWeight: 700 }}>⭐ 리뷰 작성</DialogTitle>
        <DialogContent>
          <Stack spacing={ 2 } sx={{ pt: 1 }}>
            { errorMessage && <Alert severity="error">{ errorMessage }</Alert> }
            <TextField select label="분류" value={ form.category } onChange={ handleChange('category') }>
              { REVIEW_CATEGORIES.map((item) => <MenuItem key={ item.value } value={ item.value }>{ item.label }</MenuItem>) }
            </TextField>
            <TextField label="이름 (병원명, 상품명, 장소명)" required value={ form.place_name } onChange={ handleChange('place_name') } />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box component="span" sx={{ fontSize: '0.95rem', color: 'text.secondary' }}>별점</Box>
              <Rating
                value={ form.rating }
                onChange={ (_event, value) => setForm((prev) => ({ ...prev, rating: value ?? 1 })) }
                size="large"
              />
            </Box>
            <TextField label="리뷰 내용" required multiline minRows={ 4 } value={ form.content } onChange={ handleChange('content') } />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={ handleClose } color="inherit">취소</Button>
          <Button type="submit" variant="contained" disabled={ isSubmitting }>등록하기</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default ReviewFormDialog;
