import { supabase } from '../lib/supabase';

const BUCKET = 'images';

/**
 * 이미지를 Supabase Storage 에 업로드하고 공개 URL 을 반환한다
 * @param {File} file - 업로드할 이미지 파일
 * @param {string} folder - 저장할 폴더명
 * @returns {Promise<string>} 공개 URL
 */
export async function uploadImage(file, folder) {
  const ext = file.name.split('.').pop();
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, file);
  if (error) {
    throw error;
  }
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}
