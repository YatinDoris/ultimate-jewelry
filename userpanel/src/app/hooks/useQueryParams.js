// hooks/useQueryParams.js
import { useLocation } from "react-router-dom";

const useQueryParams = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  // Convert the query parameters into an object
  const queryParams = Object.fromEntries(params.entries());

  return queryParams;
};

export default useQueryParams;
