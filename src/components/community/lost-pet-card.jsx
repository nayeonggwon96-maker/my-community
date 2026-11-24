import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';
import LocationOnRoundedIcon from '@mui/icons-material/LocationOnRounded';
import PhoneRoundedIcon from '@mui/icons-material/PhoneRounded';

import { formatDate } from '../../utils/format-date';

/**
 * LostPetCard 컴포넌트
 * 실종동물 정보 카드를 보여준다.
 *
 * Props:
 * @param {object} pet - 실종동물 데이터 [Required]
 * @param {boolean} isOwner - 작성자 본인 여부 [Optional, 기본값: false]
 * @param {function} onToggleStatus - 상태 변경 버튼 클릭 시 실행 [Optional]
 * @param {function} onDelete - 삭제 버튼 클릭 시 실행 [Optional]
 *
 * Example usage:
 * <LostPetCard pet={pet} isOwner onToggleStatus={handleToggle} onDelete={handleDelete} />
 */
function LostPetCard({ pet, isOwner = false, onToggleStatus, onDelete }) {
  const isFound = pet.status === 'found';

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', opacity: isFound ? 0.75 : 1 }}>
      <Box sx={{ position: 'relative' }}>
        { pet.image_url ? (
          <Box component="img" src={ pet.image_url } alt={ pet.pet_name } sx={{ width: '100%', height: 200, objectFit: 'cover', display: 'block', filter: isFound ? 'grayscale(0.6)' : 'none' }} />
        ) : (
          <Box sx={{ height: 200, bgcolor: 'primary.light', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3.5rem' }}>
            { pet.species === '고양이' ? '🐱' : pet.species === '강아지' ? '🐶' : '🐾' }
          </Box>
        ) }
        <Chip
          label={ isFound ? '찾았어요 💚' : '찾고 있어요' }
          color={ isFound ? 'primary' : 'secondary' }
          sx={{ position: 'absolute', top: 12, left: 12, fontWeight: 700 }}
        />
      </Box>
      <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1, flexGrow: 1 }}>
        <Box sx={{ fontWeight: 700, fontSize: { xs: '1.05rem', md: '1.15rem' } }}>
          { pet.pet_name } <Box component="span" sx={{ fontSize: '0.85rem', color: 'text.secondary', fontWeight: 400 }}>({ pet.species })</Box>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, fontSize: '0.875rem', color: 'text.secondary' }}>
          <LocationOnRoundedIcon sx={{ fontSize: 18, color: 'primary.main' }} />{ pet.location }
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, fontSize: '0.875rem', color: 'text.secondary' }}>
          <CalendarMonthRoundedIcon sx={{ fontSize: 18, color: 'primary.main' }} />{ formatDate(pet.lost_date) } 실종
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, fontSize: '0.875rem', color: 'text.secondary' }}>
          <PhoneRoundedIcon sx={{ fontSize: 18, color: 'primary.main' }} />{ pet.contact }
        </Box>
        { pet.description && (
          <Box sx={{ fontSize: '0.9rem', lineHeight: 1.6, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{ pet.description }</Box>
        ) }
        <Box sx={{ mt: 'auto', pt: 1, fontSize: '0.8rem', color: 'text.secondary' }}>
          등록: { pet.users?.name ?? '알 수 없음' }
        </Box>
        { isOwner && (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button size="small" variant="outlined" onClick={ onToggleStatus }>
              { isFound ? '다시 찾는 중으로' : '찾았어요로 변경' }
            </Button>
            <Button size="small" color="inherit" onClick={ onDelete }>삭제</Button>
          </Box>
        ) }
      </Box>
    </Card>
  );
}

export default LostPetCard;
