import { useAuth, useUser } from "@clerk/clerk-react";
import { useEffect } from "react";
import { Navigate, useLocation, useNavigate } from "react-router";
import { logInUser } from "../redux/user";
import { useAppDispatch, useAppSelector } from "../lib/reduxHook";
import { Spinner } from "./spinner";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useAppDispatch();
  const { isSignedIn, isLoaded } = useAuth();
  const { user } = useUser();
  const location = useLocation();
  const navigate = useNavigate();

  const { isUserLoading, user: currentUser } = useAppSelector(
    (state) => state.user
  );

  useEffect(() => {
    const userSignIn = async () => {
      if (!currentUser && user && user.emailAddresses?.length > 0) {
        const response: any = await dispatch(
          logInUser({
            Email: user.emailAddresses[0].emailAddress,
            Name: user.fullName,
          })
        );

        const { Organisations } = response?.payload?.data;

        if (Organisations && Organisations?.length > 0) {
          navigate("/select-organisation");
        } else {
          navigate("/create-organisation");
        }
      }
    };
    userSignIn();
  }, [isSignedIn, isLoaded, user]);

  useEffect(() => {
    if (!isSignedIn) localStorage.clear();
  }, [isSignedIn]);

  if (isUserLoading) {
    return <Spinner />;
  }

  if (!currentUser && location.pathname !== "/") {
    return <Navigate to="/" replace />;
  }

  if (currentUser && location.pathname === "/") {
    return <Navigate to="/select-organisation" replace />;
  }

  return children;
};
