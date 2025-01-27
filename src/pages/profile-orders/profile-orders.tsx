import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { getUserOrders } from '../../slices/feedSlice';

export const ProfileOrders: FC = () => {
  const { orders } = useSelector((state) => state.orders.feed);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getUserOrders());
  }, [getUserOrders]);

  return <ProfileOrdersUI orders={orders} />;
};
