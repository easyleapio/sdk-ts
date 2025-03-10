import { useSharedState } from "../contexts/SharedState";

export const useMode = () => {
  const state = useSharedState();

  return state.mode;
};

