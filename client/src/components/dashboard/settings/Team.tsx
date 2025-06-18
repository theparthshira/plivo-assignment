import { Button } from "../../ui/button";
import { useState } from "react";
import { useAppSelector } from "../../../lib/reduxHook";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../ui/table";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table";
import type { MembersList } from "../../../types/organisation";
import { formatDate } from "../../../utils/date";
import TeamForm from "./TeamForm";
import { Trash2 } from "lucide-react";
import DeleteMemberDialog from "./DeleteServiceDialog";
import { UpdateTeamRoleText } from "../../../utils/constant";

const TeamSetting = () => {
  const { teamMembers, currentMember } = useAppSelector(
    (state) => state.member
  );

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const columns: ColumnDef<MembersList>[] = [
    {
      id: "email",
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => <div>{row.original.Email}</div>,
    },
    {
      accessorKey: "member_type",
      header: "Member role",
      cell: ({ row }) => (
        <div>
          {UpdateTeamRoleText(row.original.MemberType as "ADMIN" | "MANAGER")}
        </div>
      ),
    },
    {
      accessorKey: "created_at",
      header: "Created",
      cell: ({ row }) => {
        const formattedDate = formatDate(row.original.CreatedAt);

        return <div>{formattedDate}</div>;
      },
    },
  ];

  if (currentMember?.member_type === "ADMIN") {
    columns.push({
      accessorKey: "delete",
      header: "Delete user",
      cell: ({ row }) => {
        const user_id = row.original.ID;

        return (
          <DeleteMemberDialog id={user_id}>
            <Trash2 className="cursor-pointer" />
          </DeleteMemberDialog>
        );
      },
    });
  }

  const table = useReactTable({
    data: teamMembers || [],
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Team</h2>
          <p className="text-gray-600">Teeam settings for the organisation.</p>
        </div>
        <div>
          {currentMember?.member_type === "ADMIN" && (
            <TeamForm>
              <Button className="bg-gray-900 hover:bg-gray-800 text-white self-start sm:self-auto">
                Add new member
              </Button>
            </TeamForm>
          )}
        </div>
      </div>

      <div className="space-y-6">
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default TeamSetting;
