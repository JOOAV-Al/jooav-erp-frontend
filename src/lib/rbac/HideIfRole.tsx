import { ReactNode } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { Role } from "./roles";

interface HideIfRoleProps {
  roles: Role[];
  children: ReactNode;
}

export const HideIfRole = ({ roles, children }: HideIfRoleProps) => {
  const userRole = useSelector((state: RootState) => state.auth.user?.role);

  if (!userRole) return null;

  return roles.includes(userRole) ? null : <>{children}</>;
};
