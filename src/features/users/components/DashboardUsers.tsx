import EmptyState from "@/components/general/EmptyState";
import TableTag from "@/components/general/TableTag";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
// import { InitialsAvatar } from "@/features/orders/components/OrderCard";
import { Order } from "@/features/orders/types";
import InitialsAvatar from "@/features/users/components/InitialsAvatar";
import { User } from "@/interfaces/authentication";
import {
  formatCurrency,
  formatOrderDate,
  getOrderStatusStyles,
  getUserTagStyles,
} from "@/lib/utils";
import Image from "next/image";
import { useRouter } from "next/navigation";

const DashboardUsers = ({
  users,
  onOrderClick,
}: {
  users?: User[];
  onOrderClick?: (order: User) => void;
}) => {
  const router = useRouter();
  return (
    <div className="flex flex-col h-full">
      {users && users?.length > 0 ? (
        <div className="flex flex-col gap-3 h-full">
          <div className="flex justify-between items-center py-sm px-lg border-b border-border-main">
            <h4>Recent users</h4>
            <div
              onClick={() => {
                router.push(`/dashboard/users`);
              }}
              className="py-sm rounded-lg cursor-pointer hover:underline"
            >
              <span className="py-4 px-2 text-body-passive tracking-[0.02em] font-semibold text-[15px]">
                View users
              </span>
            </div>
          </div>
          <ScrollArea isSidebar className="h-[70vh]">
            <div className="px-md flex flex-col gap-5">
              {users?.map((user, idx) => {
                const userInitials =
                  (user?.firstName ?? "") + " " + (user?.lastName ?? "");
                const userStatusStyles = getUserTagStyles(user.status);
                const isLast = idx === users.length - 1;
                return (
                  <div
                    key={idx}
                    className={`grid grid-cols-4 gap-[8px] min-h-[42px] ${isLast ? "" : "border-b border-border-main"} py-sm hover:bg-storey-foreground rounded-lg`}
                  >
                    <div className="px-sm">
                      <InitialsAvatar name={userInitials || "—"} />
                    </div>
                    <p className="px-sm justify-self-start font-medium text-sm leading-[1.5] tracking-[0.04em] text-body">
                      {user?.firstName}
                    </p>
                    <p className="px-sm font-medium text-sm leading-[1.5] tracking-[0.04em] text-body">
                      {user?.lastName}
                    </p>
                    <div className="ml-auto px-sm">
                      <TableTag
                        className={`${userStatusStyles?.styles}`}
                        text={userStatusStyles?.text}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </div>
      ) : (
        <div className="flex-1 flex justify-center items-center">
          <EmptyState
            header="No user summaries"
            description="You will see a summary of recent users here once user are initiated."
          />
        </div>
      )}
    </div>
  );
};

export default DashboardUsers;
