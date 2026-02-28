"use client";
import DashboardDrawer from "@/components/general/DashboardDrawer";
import UserForm from "@/features/users/components/UserForm";
import {
  useCreateUser,
  useDeleteUser,
  useDeleteMultipleUsers,
  useGetUsers,
  useGetUsersStats,
  useUpdateUser,
  // useRegenerateResetToken,
} from "@/features/users/services/users.api";
import React, { useRef, useState } from "react";
import DataTable from "@/components/general/DataTable";
import { UserItem } from "@/features/users/types";
import FilterContainer from "@/components/filters/FilterContainer";
import SearchBox from "@/components/filters/SearchBox";
import { useDebounce } from "@/hooks/useDebounce";
import StatsContainer from "@/components/general/StatsContainer";
import FormDropdown from "@/components/general/FormDropdown";
import StatsSkeleton from "@/components/general/StatsSkeleton";
import TableTag from "@/components/general/TableTag";
import RoleFilter from "@/components/filters/RoleFilter";
import { ImageIcon, Wheat } from "lucide-react";
import DrawerBoxContent from "@/components/general/DrawerBoxContent";
import CopyLinkBox from "@/components/general/CopyLinkBox";
import Image from "next/image";
import { normalizePhone } from "@/lib/utils";

const UserPage = () => {
  const [page, setPage] = useState<number>(1);
  const [open, setOpen] = useState<boolean>(false);
  const [query, setQuery] = useState<string>("");
  const [role, setRole] = useState<string>("");
  const [resetLink, setResetLink] = useState<string>("");
  const [showLink, setShowLink] = useState<boolean>(false);
  const [messageObject, setMessageObject] = useState<{
    phone: string;
    role: string;
  }>({
    phone: "",
    role: "",
  });
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
  const usersFormResetRef = useRef<(() => void) | null>(null);
  const { data: stats, isPending: isStatsPending } = useGetUsersStats();
  const {
    data,
    isPending: isUsersPending,
    isRefetching,
    refetch,
  } = useGetUsers({ search: debouncedQuery, role });
  const users = data?.data;

  console.log(messageObject);
  const handleCreate = async (values: any) => {
    console.log({ finalValues: values });
    const waPhone = normalizePhone(values.phone);
    setMessageObject({ phone: waPhone, role: values.role });
    if (selectedUser) {
      await updateUser(values);

      setOpen(false);
    } else {
      const res = await createUser(values);
      setResetLink(res?.data?.data?.resetUrl);
      setShowLink(true);
    }
    // show link on success
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
      value: stats?.archived ? `${stats?.archived}` : "0",
      label: "Archived",
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
        <StatsContainer stats={displayStats} />
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
              isCustomWidth={true}
              customWidthStyle={
                "aspect-460/958 max-w-md mdl:max-w-md lg:max-w-[460px]"
              }
              showTrigger
              openDrawer={(isOpen) => {
                setShowLink(false);
                if (isOpen) {
                  setSelectedUser(undefined);
                }
                setOpen(isOpen);
              }}
              isOpen={open}
              submitFormId={"user-form"}
              submitLoading={updating || creating || deleting}
              submitLabel="Save user"
              showFooter={!showLink}
            >
              {showLink ? (
                <DrawerBoxContent
                  heading={`Share link with user`}
                  description={`Send link to user. They can login to their dashboard using link.`}
                  content={
                    <CopyLinkBox
                      onShare={() => {
                        console.log("share");
                        window.open(
                          `https://wa.me/${messageObject?.phone}?text=Hi%20${messageObject?.role}%2C%20Use%20this%20link%20to%20reset%20your%20password%3A%0A${resetLink}`,
                          "_blank",
                        );
                      }}
                      link={resetLink}
                      shareBtnIcon={
                        <Image
                          src={"/dashboard/whatsApp.svg"}
                          width={18}
                          height={18}
                          alt="Whatsapp"
                        />
                      }
                    />
                  }
                />
              ) : (
                <DrawerBoxContent
                  heading={`${selectedUser ? "Edit" : "Enter"} user details`}
                  content={
                    <UserForm
                      user={selectedUser}
                      handleSubmitForm={handleCreate}
                      loading={creating || updating}
                      closeDialog={() => {
                        setOpen(false);
                        setShowLink(false);
                      }}
                      onResetReady={(fn) => {
                        usersFormResetRef.current = fn;
                      }}
                    />
                  }
                  actionDropdown={
                    selectedUser ? (
                      <FormDropdown
                        deleteAction={handleDelete}
                        onReset={() => usersFormResetRef.current?.()}
                      />
                    ) : undefined
                  }
                />
              )}
            </DashboardDrawer>
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
                  <ImageIcon
                    strokeWidth={2}
                    className="w-5 h-5 text-border-accent"
                  />
                </div>
              ),
              render: (item) => (
                <div className="w-7.5 h-7.5 flex justify-center items-center rounded-full bg-brand-secondary border border-border-main text-[13px] font-semibold tracking-[0.05em] text-brand-accent-2 mx-auto">{`${item?.firstName?.[0]}${item?.lastName?.[0]}`}</div>
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
