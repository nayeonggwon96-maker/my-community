import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import AddRoundedIcon from '@mui/icons-material/AddRounded';

import LostPetCard from '../components/community/lost-pet-card';
import LostPetFormDialog from '../components/community/lost-pet-form-dialog';
import EmptyState from '../components/ui/empty-state';
import { useAuth } from '../hooks/use-auth';
import { supabase } from '../lib/supabase';

/**
 * LostPetPage 컴포넌트
 * 실종동물 목록과 등록 기능을 제공한다.
 *
 * Example usage:
 * <LostPetPage />
 */
function LostPetPage() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [pets, setPets] = useState([]);
  const [filter, setFilter] = useState('missing');
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const loadPets = useCallback(async () => {
    setIsLoading(true);
    let query = supabase.from('lost_pets').select('*, users(name)').order('created_at', { ascending: false });
    if (filter !== 'all') {
      query = query.eq('status', filter);
    }
    const { data } = await query;
    setPets(data ?? []);
    setIsLoading(false);
  }, [filter]);

  useEffect(() => {
    loadPets();
  }, [loadPets]);

  const handleOpenDialog = () => {
    if (!profile) {
      navigate('/login');
      return;
    }
    setIsDialogOpen(true);
  };

  const handleToggleStatus = async (pet) => {
    const nextStatus = pet.status === 'found' ? 'missing' : 'found';
    await supabase.from('lost_pets').update({ status: nextStatus }).eq('id', pet.id);
    loadPets();
  };

  const handleDelete = async (pet) => {
    if (!window.confirm('실종 정보를 삭제할까요?')) {
      return;
    }
    await supabase.from('lost_pets').delete().eq('id', pet.id);
    loadPets();
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: { xs: 'flex-start', sm: 'center' }, justifyContent: 'space-between', gap: 2, mb: 3, flexDirection: { xs: 'column', sm: 'row' } }}>
        <Box>
          <Box component="h1" sx={{ m: 0, fontSize: { xs: '1.5rem', md: '2rem' }, lineHeight: 1.3 }}>
            실종동물 찾기 🔍
          </Box>
          <Box sx={{ color: 'text.secondary', fontSize: { xs: '0.9rem', md: '1rem' }, mt: 0.5 }}>
            소중한 가족이 집으로 돌아올 수 있도록 함께 찾아주세요
          </Box>
        </Box>
        <Button variant="contained" color="secondary" startIcon={ <AddRoundedIcon /> } onClick={ handleOpenDialog }>
          실종 등록
        </Button>
      </Box>

      <ToggleButtonGroup
        exclusive
        size="small"
        color="primary"
        value={ filter }
        onChange={ (_event, value) => value && setFilter(value) }
        sx={{ mb: 3 }}
      >
        <ToggleButton value="missing">찾고 있어요</ToggleButton>
        <ToggleButton value="found">찾았어요</ToggleButton>
        <ToggleButton value="all">전체</ToggleButton>
      </ToggleButtonGroup>

      { isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : pets.length === 0 ? (
        <EmptyState emoji="🏡" message="등록된 실종동물이 없어요." />
      ) : (
        <Grid container spacing={ 2 }>
          { pets.map((pet) => (
            <Grid key={ pet.id } size={{ xs: 12, sm: 6, md: 4 }}>
              <LostPetCard
                pet={ pet }
                isOwner={ profile?.id === pet.user_id }
                onToggleStatus={ () => handleToggleStatus(pet) }
                onDelete={ () => handleDelete(pet) }
              />
            </Grid>
          )) }
        </Grid>
      ) }

      <LostPetFormDialog isOpen={ isDialogOpen } onClose={ () => setIsDialogOpen(false) } onCreated={ loadPets } />
    </Box>
  );
}

export default LostPetPage;
