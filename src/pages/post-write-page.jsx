import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';

import ImageUploadField from '../components/ui/image-upload-field';
import { supabase } from '../lib/supabase';
import { POST_CATEGORIES } from '../utils/constants';
import { uploadImage } from '../utils/upload-image';

/**
 * PostWritePage 컴포넌트
 * 게시물을 작성하거나 수정한다. (URL 에 id 가 있으면 수정 모드)
 *
 * Example usage:
 * <PostWritePage />
 */
function PostWritePage() {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', content: '', category: 'daily' });
  const [imageUrl, setImageUrl] = useState('');
  const [file, setFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isEditMode) {
      return;
    }
    supabase.from('posts').select('*').eq('id', Number(id)).maybeSingle().then(({ data }) => {
      if (data) {
        setForm({ title: data.title, content: data.content, category: data.category });
        setImageUrl(data.image_url ?? '');
      }
    });
  }, [id, isEditMode]);

  const handleChange = (key) => (event) => setForm((prev) => ({ ...prev, [key]: event.target.value }));

  const handleImageChange = (nextFile) => {
    setFile(nextFile);
    if (!nextFile) {
      setImageUrl('');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');
    try {
      const nextImageUrl = file ? await uploadImage(file, 'posts') : imageUrl || null;
      const payload = { ...form, image_url: nextImageUrl };
      const { data, error } = isEditMode
        ? await supabase.from('posts').update(payload).eq('id', Number(id)).select('id').single()
        : await supabase.from('posts').insert(payload).select('id').single();
      if (error) {
        throw error;
      }
      navigate(`/posts/${data.id}`, { replace: true });
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Paper sx={{ p: { xs: 2, md: 4 } }}>
      <Box component="h1" sx={{ m: 0, mb: 3, fontSize: { xs: '1.5rem', md: '2rem' }, lineHeight: 1.3 }}>
        { isEditMode ? '✏️ 게시물 수정' : '📝 새 이야기 쓰기' }
      </Box>
      <Box component="form" onSubmit={ handleSubmit }>
        <Stack spacing={ 2 }>
          { errorMessage && <Alert severity="error">{ errorMessage }</Alert> }
          <TextField select label="카테고리" value={ form.category } onChange={ handleChange('category') }>
            { POST_CATEGORIES.map((item) => (
              <MenuItem key={ item.value } value={ item.value }>{ `${item.emoji} ${item.label}` }</MenuItem>
            )) }
          </TextField>
          <TextField label="제목" required value={ form.title } onChange={ handleChange('title') } slotProps={{ htmlInput: { maxLength: 100 } }} />
          <ImageUploadField file={ file } previewUrl={ imageUrl } onChange={ handleImageChange } />
          <TextField label="내용" required multiline minRows={ 8 } value={ form.content } onChange={ handleChange('content') } />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
            <Button color="inherit" onClick={ () => navigate(-1) }>취소</Button>
            <Button type="submit" variant="contained" disabled={ isSubmitting }>
              { isEditMode ? '수정하기' : '등록하기' }
            </Button>
          </Box>
        </Stack>
      </Box>
    </Paper>
  );
}

export default PostWritePage;
