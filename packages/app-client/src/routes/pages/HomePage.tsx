import { FC, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '@app/client/auth';

export const HomePage: FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (!isAuthenticated) navigate('/signin', { replace: true });
    else navigate('/labels', { replace: true });
  }, [isAuthenticated]);
  return null;
};
