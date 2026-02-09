"use client";
import CSVUpload from "@/features/uploads/components/CSVUpload";
import DashboardDrawer from "@/components/general/DashboardDrawer";
import DrawerTabs from "@/components/general/DrawerTabs";
import UserForm from "@/features/users/components/UserForm";
import {
  useCreateUser,
  useDeleteUser,
  useDeleteMultipleUsers,
  useGetUsers,
  useGetUsersStats,
  useUpdateUser,
} from "@/features/users/services/users.api";
import { Tab } from "@/interfaces/general";
import React, { useState } from "react";
import DataTable from "@/components/general/DataTable";
import { UserItem } from "@/features/users/types";
import FilterContainer from "@/components/filters/FilterContainer";
import SortFilter from "@/components/filters/SortFilter";
import SearchBox from "@/components/filters/SearchBox";
import { useDebounce } from "@/hooks/useDebounce";
import StatsContainer from "@/components/general/StatsContainer";
import FormDropdown from "@/components/general/FormDropdown";
import StatsSkeleton from "@/components/general/StatsSkeleton";
import TableTag from "@/components/general/TableTag";
import RoleFilter from "@/components/filters/RoleFilter";
import { Image } from "lucide-react";

const UserPage = () => {
  const [page, setPage] = useState<number>(1);
  const [open, setOpen] = useState<boolean>(false);
  const [query, setQuery] = useState<string>("");
  const [role, setRole] = useState<string>("");
  const debouncedQuery = useDebounce(query);

  const { mutateAsync: updateUser, isPending: updating } = useUpdateUser();
  const { mutateAsync: createUser, isPending: creating } = useCreateUser();
  const { mutateAsync: deleteUser, isPending: deleting } = useDeleteUser();
  const {
    mutateAsync: deleteMultipleUsers,
    isPending: deletingMultiple,
    status,
  } = useDeleteMultipleUsers();

  const [selectedUser, setSelectedUser] = useState<UserItem | undefined>(
    undefined,
  );
  const [selectedUsers, setSelectedUsers] = useState<UserItem[] | []>([]);

  const { data: stats, isPending: isStatsPending } = useGetUsersStats();
  const {
    data,
    isPending: isUsersPending,
    isRefetching,
    refetch,
  } = useGetUsers({ search: debouncedQuery, role });
  const users = data?.data;

  const handleCreate = async (values: any) => {
    console.log({ finalValues: values });
    if (selectedUser) {
      await updateUser(values);
    } else {
      await createUser(values);
    }
    // close drawer on success
    setOpen(false);
    setSelectedUser(undefined);
  };

  const handleBulkDelete = async (selectedUsers: UserItem[]) => {
    const idsToDelete = selectedUsers.map((user) => user?.id);
    await deleteMultipleUsers({ userIds: idsToDelete });
  };

  const handleDelete = async () => {
    await deleteUser({ id: selectedUser?.id ?? "" });
    setOpen(false);
    setSelectedUser(undefined);
  };
  const displayStats = [
    { value: stats?.totalUsers ? `${stats?.totalUsers}` : "0", label: "Users" },
    {
      value: stats?.deactivatedUsers ? `${stats?.deactivatedUsers}` : "0",
      label: "Archived",
    },
  ];

  const tabs: Tab[] = [
    {
      value: "manual",
      label: "Manual",
      heading: `${selectedUser ? "Edit" : "Enter"} user details`,
      content: (
        <UserForm
          user={selectedUser}
          handleSubmitForm={handleCreate}
          loading={creating || updating}
          closeDialog={() => setOpen(false)}
        />
      ),
      ...(selectedUser
        ? { actionDropdown: <FormDropdown deleteAction={handleDelete} /> }
        : {}),
    },
    {
      value: "bulk",
      label: "Bulk Import",
      // heading: "Upload user details",
      content: (
        <CSVUpload
          catalog={"user"}
          onCTAClick={() => setOpen(!open)}
          onDownload={() => {
            console.log("download");
          }}
        />
      ),
    },
  ];

  const getTagStyles = (value: string = "ADMIN") => {
    if (value === "SUPER_ADMIN") {
      return {
        styles: `border-border-brand-stroke bg-tag-added text-brand-primary`,
        text: `S. admin`,
      };
    } else if (value === "PROCUREMENT_OFFICER") {
      return {
        styles: `border-border-accent bg-tag-queue text-brand-signal`,
        text: `Procurement`,
      };
    } else if (value === "WHOLESALER") {
      return {
        styles: `border-border-main bg-tag-active text-success-500`,
        text: `Wholesaler`,
      };
    } else {
      return {
        styles: `border-border-main bg-tag-draft text-body-passive`,
        text: `Admin`,
      };
    }
  };

  return (
    <div className="flex flex-col gap-5">
      {isStatsPending ? (
        <StatsSkeleton count={3} />
      ) : (
        users?.length != 0 && <StatsContainer stats={displayStats} />
      )}

      <div className="px-xl pt-xl pb-1 flex flex-col gap-7">
        <div className="flex justify-between flex-wrap gap-6">
          <FilterContainer label="Filter">
            <RoleFilter
              value={role}
              onChange={(value) => setRole(value)}
              isUsers
            />
          </FilterContainer>
          <div className="flex items-center gap-6 flex-wrap">
            <SearchBox
              value={query}
              onChange={(value) => {
                setPage(1);
                setQuery(value);
              }}
            />
            <DashboardDrawer
              showTrigger
              openDrawer={(isOpen) => {
                if (isOpen) {
                  setSelectedUser(undefined);
                }
                setOpen(isOpen);
              }}
              isOpen={open}
              submitFormId={"user-form"}
              submitLoading={updating || creating || deleting}
              submitLabel="Save record"
              children={<DrawerTabs tabs={tabs} />}
              showFooter
            />
          </div>
        </div>
        <DataTable
          onRowClick={(row) => {
            setSelectedUser(row);
            setOpen(!open);
          }}
          withCheckbox
          getRowId={(row) => row.id}
          onSelectionChange={(selectedRows) => {
            console.log("Selected rows:", selectedRows);
            setSelectedUsers(selectedRows);
          }}
          onDelete={(selectedRows) => {
            console.log("Delete these:", selectedRows);
            handleBulkDelete(selectedRows);
          }}
          loading={isUsersPending || isRefetching}
          deletingMultiple={deletingMultiple}
          deletingMultipleStatus={status}
          data={users ?? []}
          refetch={refetch}
          columns={[
            {
              key: "avatar",
              label: (
                <div className="flex justify-center">
                  <Image
                    strokeWidth={2.5}
                    className="w-5 h-5 text-border-accent"
                  />
                </div>
              ),
              render: (item) => (
                <div className="w-7.5 h-7.5 flex justify-center items-center rounded-full bg-brand-secondary border border-border-main text-[13px] font-semibold tracking-[0.05] text-brand-accent-2 mx-auto">{`${item?.firstName?.[0]}${item?.lastName?.[0]}`}</div>
              ),
            },
            { key: "firstName", label: "First Name", activeColor: true },
            { key: "lastName", label: "Last Name", activeColor: true },
            { key: "email", label: "Email" },
            {
              key: "phone",
              label: "Phone no.",
            },
            {
              key: "role",
              label: "Role",
              render: (item) => (
                <TableTag
                  className={`${getTagStyles(item?.role)?.styles}`}
                  text={getTagStyles(item?.role)?.text}
                />
              ),
            },
            // {
            //   key: "role",
            //   label: <div className="flex justify-end">Role</div>,
            //   render: (item) => (
            //     <div className="flex justify-end">
            //       <TableTag
            //         className={`${getTagStyles(item?.role)?.styles}`}
            //         text={getTagStyles(item?.role)?.text}
            //       />
            //     </div>
            //   ),
            // },
          ]}
          page={page}
          pageSize={20}
          totalCount={data?.meta?.totalItems}
          hasNext={data?.meta?.hasNextPage}
          hasPrevious={data?.meta?.hasPreviousPage}
          onPageChange={setPage}
          header="Create user"
          description="No user record yet. Add records to see user list"
          image={"/dashboard/import-csv.svg"}
          cta="Add User"
        />
      </div>
    </div>
  );
};

export default UserPage;
