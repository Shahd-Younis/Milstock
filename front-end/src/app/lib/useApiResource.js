import { useEffect, useState } from "react";
const useApiResource = (loader, deps = []) => {
  const [state, setState] = useState({
    data: [],
    loading: true,
    error: ""
  });
  useEffect(() => {
    let mounted = true;
    setState((current) => ({ ...current, loading: true, error: "" }));
    loader().then((response) => {
      if (!mounted) return;
      const payload = response;
      setState({ data: payload.data || [], loading: false, error: "" });
    }).catch((error) => {
      if (!mounted) return;
      setState({ data: [], loading: false, error: error.message || "Unable to load data" });
    });
    return () => {
      mounted = false;
    };
  }, deps);
  return state;
};
export {
  useApiResource
};
