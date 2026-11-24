import { useState } from 'react';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';

import ImageUploadField from '../ui/image-upload-field';
import { supabase } from '../../lib/supabase';
import { PET_SPECIES } from '../../utils/constants';
import { uploadImage } from '../../utils/upload-image';

const INITIAL_FORM = { pet_name: '', species: '강아지', location: '', lost_date: '', contact: '', description: '' };

/**
 * LostPetFormDialog 컴포넌트
 * 실종동물 등록 폼을 다이얼로그로 보여준다.
 *
 * Props:
 * @param {boolean} isOpen - 다이얼로그 열림 여부 [Required]
 * @param {function} onClose - 닫기 시 실행 [Required]
 * @param {function} onCreated - 등록 완료 시 실행 [Required]
 *
 * Example usage:
 * <LostPetFormDialog isOpen={open} onClose={handleClose} onCreated={reload} />
 */
function LostPetFormDialog({ isOpen, onClose, onCreated }) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [file, setFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (key) => (event) => setForm((prev) => ({ ...prev, [key]: event.target.value }));

  const handleClose = () => {
    setForm(INITIAL_FORM);
    setFile(null);
    setErrorMessage('');
    onClose();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');
    try {
      const imageUrl = file ? await uploadImage(file, 'lost-pets') : null;
      const { error } = await supabase.from('lost_pets').insert({ ...form, image_url: imageUrl });
      if (error) {
        throw error;
      }
      onCreated();
      handleClose();
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={ isOpen } onClose={ handleClose } fullWidth maxWidth="sm">
      <form onSubmit={ handleSubmit }>
        <DialogTitle sx={{ fontWeight: 700 }}>🔍 실종동물 등록</DialogTitle>
        <DialogContent>
          <Stack spacing={ 2 } sx={{ pt: 1 }}>
            { errorMessage && <Alert severity="error">{ errorMessage }</Alert> }
            <ImageUploadField file={ file } onChange={ setFile } />
            <TextField label="이름" required value={ form.pet_name } onChange={ handleChange('pet_name') } />
            <TextField select label="종류" value={ form.species } onChange={ handleChange('species') }>
              { PET_SPECIES.map((species) => <MenuItem key={ species } value={ species }>{ species }</MenuItem>) }
            </TextField>
            <TextField label="실종 장소" required value={ form.location } onChange={ handleChange('location') } />
            <TextField label="실종 날짜" type="date" required value={ form.lost_date } onChange={ handleChange('lost_date') } slotProps={{ inputLabel: { shrink: true } }} />
            <TextField label="연락처" required value={ form.contact } onChange={ handleChange('contact') } />
            <TextField label="특징 / 상세 설명" multiline minRows={ 3 } value={ form.description } onChange={ handleChange('description') } />
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

export default LostPetFormDialog;
