import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/lib/store';

export const useStore = () => {
  const dispatch = useDispatch<AppDispatch>();
  return { dispatch };
};
