import { useState } from "react";
import {
  type ColumnDef,
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
  type VisibilityState,
} from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";

import { Button } from "../../../components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";
import { Input } from "../../../components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import type { IService } from "../../../types/service";
import DeleteServiceDialog from "./DeleteServiceDialog";
import UpdateServiceDialog from "./UpdateServiceDialog";
import { useAppSelector } from "../../../lib/reduxHook";

const DataTable = () => {
  const { services } = useAppSelector((state) => state.service);
  const { currentMember } = useAppSelector((state) => state.member);

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const columns: ColumnDef<Partial<IService>>[] = [
    {
      id: "name",
      accessorKey: "name",
      header: "Service Name",
      cell: ({ row }) => <div>{row.original.name}</div>,
    },
    {
      accessorKey: "service_type",
      header: "Service Type",
      cell: ({ row }) => <div>{row.original.service_type}</div>,
    },
    {
      accessorKey: "service_status",
      header: "Status",
      cell: ({ row }) => <div>{row.original.service_status}</div>,
    },
    {
      accessorKey: "action",
      header: "Actions",
      cell: ({ row }) => {
        const [isDeleteOpen, setIsDeleteOpen] = useState(false);
        const [isUpdateOpen, setIsUpdateOpen] = useState(false);

        const service = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => setIsUpdateOpen(true)}>
                Edit
              </DropdownMenuItem>
              {currentMember?.member_type === "ADMIN" && (
                <DropdownMenuItem onClick={() => setIsDeleteOpen(true)}>
                  Delete
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
            <UpdateServiceDialog
              service={service}
              isUpdateOpen={isUpdateOpen}
              setIsUpdateOpen={setIsUpdateOpen}
            />
            <DeleteServiceDialog
              id={service.id || 0}
              isDeleteOpen={isDeleteOpen}
              setIsDeleteOpen={setIsDeleteOpen}
            />
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    data: services || [],
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
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter services..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
      </div>
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
  );
};

export default DataTable;
