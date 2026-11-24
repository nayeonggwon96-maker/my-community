/**
 * 게시물 카테고리 목록
 */
export const POST_CATEGORIES = [
  { value: 'daily', label: '반려동물 일상', emoji: '🐾' },
  { value: 'health', label: '건강 정보', emoji: '💊' },
  { value: 'tips', label: '양육 팁', emoji: '📚' },
  { value: 'photo', label: '사진', emoji: '📷' },
];

/**
 * 리뷰 대상 카테고리 목록
 */
export const REVIEW_CATEGORIES = [
  { value: 'hospital', label: '동물병원' },
  { value: 'product', label: '용품' },
  { value: 'food', label: '사료/간식' },
  { value: 'place', label: '펫 동반 장소' },
];

/**
 * 동물 종류 목록
 */
export const PET_SPECIES = ['강아지', '고양이', '기타'];

/**
 * 카테고리 값으로 라벨을 찾는다
 * @param {Array} list - 카테고리 목록
 * @param {string} value - 카테고리 값
 * @returns {string} 라벨
 */
export function getCategoryLabel(list, value) {
  return list.find((item) => item.value === value)?.label ?? value;
}
