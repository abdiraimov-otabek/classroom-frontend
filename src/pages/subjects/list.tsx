import React, { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { useTable } from "@refinedev/react-table";
import { ColumnDef } from "@tanstack/react-table";

import { DEPARTMENT_OPTIONS } from "@/contstants";
import { ListView } from "../../components/refine-ui/views/list-view.tsx";
import { Breadcrumb } from "../../components/refine-ui/layout/breadcrumb.tsx";
import { Input } from "../../components/ui/input.tsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select.tsx";
import { CreateButton } from "../../components/refine-ui/buttons/create.tsx";
import { DataTable } from "../../components/refine-ui/data-table/data-table.tsx";
import { ShowButton } from "../../components/refine-ui/buttons/show.tsx";
import { Badge } from "../../components/ui/badge.tsx";

const SubjectListPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all");

  /**
   * Columns (fixed deep accessor + safer rendering)
   */
  const subjectColumns = useMemo<ColumnDef<Subject>[]>(
    () => [
      {
        id: "code",
        accessorKey: "code",
        size: 100,
        header: () => <p className="column-title ml-2">Code</p>,
        cell: ({ getValue }) => <Badge>{getValue<string>() || "-"}</Badge>,
      },
      {
        id: "name",
        accessorKey: "name",
        size: 200,
        header: () => <p className="column-title">Name</p>,
        cell: ({ getValue }) => (
          <span className="text-foreground">{getValue<string>() || "-"}</span>
        ),
        filterFn: "includesString",
      },
      {
        id: "department",
        accessorKey: "department",
        size: 150,
        header: () => <p className="column-title">Department</p>,
        cell: ({ getValue }) => (
          <Badge variant="secondary">{getValue<string>() || "-"}</Badge>
        ),
      },
      {
        id: "description",
        accessorKey: "description",
        size: 300,
        header: () => <p className="column-title">Description</p>,
        cell: ({ getValue }) => (
          <span className="truncate line-clamp-2">
            {getValue<string>() || "-"}
          </span>
        ),
      },
      {
        id: "details",
        size: 140,
        header: () => <p className="column-title">Details</p>,
        cell: ({ row }) => {
          const id = row.original?.id;
          if (!id) return null;

          return (
            <ShowButton
              resource="subjects"
              recordItemId={id}
              variant="outline"
              size="sm"
            >
              View
            </ShowButton>
          );
        },
      },
    ],
    [],
  );

  /**
   * Filters (more robust + explicit)
   */
  const filters = useMemo(() => {
    const f: any[] = [];

    if (selectedDepartment !== "all") {
      f.push({
        field: "department",
        operator: "eq",
        value: selectedDepartment,
      });
    }

    if (searchQuery.trim()) {
      f.push({
        field: "name",
        operator: "contains",
        value: searchQuery.trim(),
      });
    }

    return f;
  }, [selectedDepartment, searchQuery]);

  /**
   * Table hook
   */
  const subjectTable = useTable<Subject>({
    columns: subjectColumns,
    refineCoreProps: {
      resource: "subjects",
      pagination: {
        pageSize: 10,
        mode: "server",
      },
      filters: {
        permanent: filters,
      },
      sorters: {
        initial: [
          {
            field: "id",
            order: "desc",
          },
        ],
      },
    },
  });

  return (
    <ListView>
      <Breadcrumb />

      <h1 className="page-title">Subjects</h1>

      <div className="intro-row">
        <p>Quick access to essential metrics and management tools.</p>

        <div className="actions-row">
          {/* Search */}
          <div className="search-field">
            <Search className="search-icon" />

            <Input
              type="text"
              placeholder="Search by name..."
              className="pl-10 w-full"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
            />
          </div>

          {/* Filters + Actions */}
          <div className="flex gap-2 w-full sm:w-auto">
            <Select
              value={selectedDepartment}
              onValueChange={(val) => setSelectedDepartment(val)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by department" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>

                {DEPARTMENT_OPTIONS?.map((department) => (
                  <SelectItem key={department.value} value={department.value}>
                    {department.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <CreateButton resource="subjects" />
          </div>
        </div>
      </div>

      <DataTable table={subjectTable} />
    </ListView>
  );
};

export default SubjectListPage;
