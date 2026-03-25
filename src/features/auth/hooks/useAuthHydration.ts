import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { api } from "@/lib/api/axiosInstance";
import { logout, setCredentials } from "@/redux/slices/authSlice";
import Cookies from "js-cookie"
import { useRouter } from "next/navigation";

export const useAuthHydration = ({isMarketPlace=false}: {isMarketPlace?: boolean}) => {
  const dispatch = useDispatch();
  const router = useRouter()

  useEffect(() => {
    const hydrate = async () => {
      try {
        const res = await api.get("/auth/profile");

        dispatch(
          setCredentials({
            user: res.data.data,
            token: Cookies.get("authToken")!, // reuse stored token
          })
        );
      } catch {
        if(!isMarketPlace) {
          dispatch(logout());
          router.push("/login")
        }
      }
    };

    hydrate();
  }, [dispatch]);
};
