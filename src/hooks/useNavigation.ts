import React from 'react';
import { useNavigate } from 'react-router-dom';

const useNavigation = () => {
  const navigate = useNavigate();

  const goTo = (path: string) => {
    navigate(path);
  };

  return { goTo };
};

export default useNavigation;
