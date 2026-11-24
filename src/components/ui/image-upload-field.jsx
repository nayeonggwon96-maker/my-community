import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import AddPhotoAlternateRoundedIcon from '@mui/icons-material/AddPhotoAlternateRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';

/**
 * ImageUploadField 컴포넌트
 * 이미지 파일을 선택하고 미리보기를 보여준다.
 *
 * Props:
 * @param {File} file - 선택된 파일 [Optional]
 * @param {string} previewUrl - 기존 이미지 URL [Optional]
 * @param {function} onChange - 파일 변경 시 실행 (file | null) [Required]
 *
 * Example usage:
 * <ImageUploadField file={file} onChange={setFile} />
 */
function ImageUploadField({ file, previewUrl, onChange }) {
  const [objectUrl, setObjectUrl] = useState('');

  useEffect(() => {
    if (!file) {
      setObjectUrl('');
      return undefined;
    }
    const url = URL.createObjectURL(file);
    setObjectUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const shownUrl = objectUrl || previewUrl;

  return (
    <Box>
      { shownUrl ? (
        <Box sx={{ position: 'relative', borderRadius: 3, overflow: 'hidden', bgcolor: 'background.default' }}>
          <Box component="img" src={ shownUrl } alt="미리보기" sx={{ width: '100%', maxHeight: 280, objectFit: 'cover', display: 'block' }} />
          <IconButton
            aria-label="사진 삭제"
            onClick={ () => onChange(null) }
            sx={{ position: 'absolute', top: 8, right: 8, bgcolor: 'rgba(255,255,255,0.85)', '&:hover': { bgcolor: '#fff' } }}
          >
            <CloseRoundedIcon />
          </IconButton>
        </Box>
      ) : (
        <Button
          component="label"
          variant="outlined"
          fullWidth
          startIcon={ <AddPhotoAlternateRoundedIcon /> }
          sx={{ py: 3, borderStyle: 'dashed', borderRadius: 3 }}
        >
          반려동물 사진 추가
          <input
            hidden
            type="file"
            accept="image/*"
            onChange={ (event) => onChange(event.target.files?.[0] ?? null) }
          />
        </Button>
      ) }
    </Box>
  );
}

export default ImageUploadField;
