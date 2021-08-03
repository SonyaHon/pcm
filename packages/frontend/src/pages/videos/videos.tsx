import React from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from '../../store/user.slice';

export const VideosPage: React.FC = () => {
  const user = useSelector(selectUser);

  return (
    <div>
      User:
      {user && user.username}
    </div>
  );
};
