import { store } from "../store";
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

/**
 *
 * @returns
 */
export const useAppDispatch = () => useDispatch<AppDispatch>();

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;