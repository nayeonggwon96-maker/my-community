import Box from '@mui/material/Box';

/**
 * EmptyState 컴포넌트
 * 데이터가 없을 때 귀여운 안내 문구를 보여준다.
 *
 * Props:
 * @param {string} message - 안내 문구 [Required]
 * @param {string} emoji - 함께 보여줄 이모지 [Optional, 기본값: '🐾']
 *
 * Example usage:
 * <EmptyState message="아직 게시물이 없어요" />
 */
function EmptyState({ message, emoji = '🐾' }) {
  return (
    <Box sx={{ textAlign: 'center', py: { xs: 6, md: 8 }, color: 'text.secondary' }}>
      <Box sx={{ fontSize: '3rem', mb: 1 }}>{ emoji }</Box>
      <Box sx={{ fontSize: { xs: '0.95rem', md: '1rem' }, lineHeight: 1.6 }}>{ message }</Box>
    </Box>
  );
}

export default EmptyState;
