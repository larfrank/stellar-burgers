import { FC, useMemo } from 'react';
import { TConstructorIngredient, TIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import { useLocation, useNavigate } from 'react-router-dom';
import { createOrder, resetOrderData } from '../../slices/feedSlice';
import { resetConstructor } from '../../slices/ingredientsSlice';

export const BurgerConstructor: FC = () => {
  const constructorItems = useSelector(
    (state) => state.ingredients.constructor
  );

  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const orderRequest = useSelector((state) => state.orders.isLoading);

  const orderModalData = useSelector((state) => state.orders.order);

  const onOrderClick = () => {
    if (!user) {
      navigate('/login', { state: { from: location.pathname } });
    } else {
      const ids = constructorItems.ingredients.map((item) => item._id);
      dispatch(createOrder(ids));
    }
    if (!constructorItems?.bun || orderRequest) return;
  };
  const closeOrderModal = () => {
    dispatch(resetOrderData());
    dispatch(resetConstructor());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun?.price * 2 : 0) +
      (constructorItems.ingredients.reduce((s, v) => s + v.price, 0) ?? 0),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
