import { useEffect, useRef } from "react";
import { fetchCurrentUser } from "../../auth/authSlice";
import { useAppDispatch } from "../../store/store";

export const AppInitializer = () => {
  const dispatch = useAppDispatch();
  const hasFetched = useRef(false);

  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      dispatch(fetchCurrentUser());
    }
  }, [dispatch]);

  return null;
};
