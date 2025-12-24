import { ReactNode } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { Role } from "./roles";

interface ShowIfRoleProps {
  roles: Role[];
  children: ReactNode;
}

export const ShowIfRole = ({ roles, children }: ShowIfRoleProps) => {
  const userRole = useSelector((state: RootState) => state.auth.user?.role);

  if (!userRole) return null;

  return roles.includes(userRole) ? <>{children}</> : null;
};
