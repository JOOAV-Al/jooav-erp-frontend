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
} from "@/features/users/services/users.api";
import React, { useRef, useState } from "react";
import { UserItem } from "@/features/users/types";
import FilterContainer from "@/components/filters/FilterContainer";
import SearchBox from "@/components/filters/SearchBox";
import { useDebounce } from "@/hooks/useDebounce";
// import StatsContainer from "@/components/general/StatsContainer";
import FormDropdown from "@/components/general/FormDropdown";
// import StatsSkeleton from "@/components/general/StatsSkeleton";
import TableTag from "@/components/general/TableTag";
import RoleFilter from "@/components/filters/RoleFilter";
import DrawerBoxContent from "@/components/general/DrawerBoxContent";
import CopyLinkBox from "@/components/general/CopyLinkBox";
import GroupedDataTable from "@/components/general/GroupedDataTable";
import Image from "next/image";

// ─── Role grouping config ─────────────────────────────────────────────────────
// Order here controls the visual order of the cards on the page.

const ROLE_GROUPS = [
  { role: "SUPER_ADMIN", label: "Super-admin accounts" },
  { role: "ADMIN", label: "Admin accounts" },
  { role: "PROCUREMENT_OFFICER", label: "Procurement accounts" },
  { role: "WHOLESALER", label: "Wholesaler accounts" },
] as const;

// ─────────────────────────────────────────────────────────────────────────────

const UserPage = () => {
  const [page, setPage] = useState<number>(1);
  const [open, setOpen] = useState<boolean>(false);
  const [query, setQuery] = useState<string>("");
  const [role, setRole] = useState<string>("");
  const [resetLink, setResetLink] = useState<string>("");
  const [showLink, setShowLink] = useState<boolean>(false);
  const debouncedQuery = useDebounce(query);

  const [selectedUser, setSelectedUser] = useState<UserItem | undefined>(
    undefined,
  );
  const [selectedUsers, setSelectedUsers] = useState<UserItem[]>([]);
  const usersFormResetRef = useRef<(() => void) | null>(null);

  const { mutateAsync: updateUser, isPending: updating } = useUpdateUser();
  const { mutateAsync: createUser, isPending: creating } = useCreateUser();
  const { mutateAsync: deleteUser, isPending: deleting } = useDeleteUser();
  const {
    mutateAsync: deleteMultipleUsers,
    isPending: deletingMultiple,
    status,
  } = useDeleteMultipleUsers();

  const { data: stats, isPending: isStatsPending } = useGetUsersStats();
  const {
    data,
    isPending: isUsersPending,
    isRefetching,
    refetch,
  } = useGetUsers({
    search: debouncedQuery,
    role,
  });

  const users: UserItem[] = data?.data ?? [];

  // Split the flat list into per-role groups — one query, zero extra network calls
  const groups = ROLE_GROUPS.map(({ role: r, label }) => ({
    label,
    data: users.filter((u) => u.role === r),
  }));

  // ── Handlers ─────────────────────────────────────────────────────────────────

  const handleCreate = async (values: any) => {
    if (selectedUser) {
      await updateUser(values);
      setOpen(false);
    } else {
      const res = await createUser(values);
      setResetLink(res?.data?.data?.resetUrl);
      setShowLink(true);
    }
    setSelectedUser(undefined);
  };

  const handleBulkDelete = async (rows: UserItem[]) => {
    await deleteMultipleUsers({ userIds: rows.map((u) => u.id) });
  };

  const handleDelete = async () => {
    await deleteUser({ id: selectedUser?.id ?? "" });
    setOpen(false);
    setSelectedUser(undefined);
  };

  // ── Display helpers ───────────────────────────────────────────────────────────

  const displayStats = [
    { value: `${stats?.totalUsers ?? 0}`, label: "Users" },
    { value: `${stats?.archived ?? 0}`, label: "Archived" },
  ];

  const getTagStyles = (value = "ADMIN") => {
    switch (value) {
      case "SUPER_ADMIN":
        return {
          styles: "border-border-brand-stroke bg-tag-added text-brand-primary",
          text: "S. admin",
        };
      case "PROCUREMENT_OFFICER":
        return {
          styles: "border-border-accent bg-tag-queue text-brand-signal",
          text: "Procurement",
        };
      case "WHOLESALER":
        return {
          styles: "border-border-main bg-tag-active text-success-500",
          text: "Wholesaler",
        };
      default:
        return {
          styles: "border-border-main bg-tag-draft text-body-passive",
          text: "Admin",
        };
    }
  };

  // No `label` needed — GroupedDataTable has no column header row
  const columns = [
    {
      key: "avatar",
      render: (item: UserItem) => (
        <div className="w-7.5 h-7.5 flex justify-center items-center rounded-full bg-brand-secondary border border-border-main text-[13px] font-semibold tracking-[0.05em] text-brand-accent-2">
          {`${item?.firstName?.[0] ?? ""}${item?.lastName?.[0] ?? ""}`}
        </div>
      ),
    },
    { key: "firstName", activeColor: true },
    { key: "lastName", activeColor: true },
    { key: "email" },
    { key: "phone" },
    {
      key: "role",
      render: (item: UserItem) => (
        <TableTag
          className={getTagStyles(item?.role).styles}
          text={getTagStyles(item?.role).text}
        />
      ),
    },
  ];

  // ── Render ────────────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col gap-5">
      {/* {isStatsPending ? (
        <StatsSkeleton count={2} />
      ) : (
        <StatsContainer stats={displayStats} />
      )} */}

      <div className="px-xl pt-xl pb-1 flex flex-col gap-7">
        {/* Toolbar */}
        <div className="flex justify-between flex-wrap gap-6">
          <FilterContainer label="Filter">
            <RoleFilter value={role} onChange={setRole} isUsers />
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
              isCustomWidth
              customWidthStyle="aspect-460/958 max-w-md mdl:max-w-md lg:max-w-[460px]"
              showTrigger
              openDrawer={(isOpen) => {
                setShowLink(false);
                if (isOpen) setSelectedUser(undefined);
                setOpen(isOpen);
              }}
              isOpen={open}
              submitFormId="user-form"
              submitLoading={updating || creating || deleting}
              submitLabel="Save user"
              showFooter={!showLink}
            >
              {showLink ? (
                <DrawerBoxContent
                  heading="Share link with user"
                  description="Send link to user. They can login to their dashboard using link."
                  content={
                    <CopyLinkBox
                      link={resetLink}
                      onShare={() => console.log("share")}
                      shareBtnIcon={
                        <Image
                          src="/dashboard/whatsApp.svg"
                          width={16}
                          height={16}
                          alt="WhatsApp"
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

        {/* Grouped table — replaces all the old DataTable instances */}
        <GroupedDataTable<UserItem>
          groups={groups}
          columns={columns}
          loading={isUsersPending || isRefetching}
          onRowClick={(row) => {
            setSelectedUser(row);
            setOpen(true);
          }}
          withCheckbox
          getRowId={(row) => row.id}
          onSelectionChange={setSelectedUsers}
          onDelete={handleBulkDelete}
          deletingMultiple={deletingMultiple}
          deletingMultipleStatus={status}
          emptyHeader="Create user"
          emptyDescription="No user record yet. Add records to see user list"
          emptyImage="/dashboard/import-csv.svg"
          emptyCta="Add User"
          onEmptyCta={refetch}
        />
      </div>
    </div>
  );
};

export default UserPage;
