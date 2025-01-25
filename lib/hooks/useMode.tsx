import { useSharedState } from "./SharedState";

const useMode = () => {
  const state = useSharedState();

  return state.mode;
};

export default useMode;