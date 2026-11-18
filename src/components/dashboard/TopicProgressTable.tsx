import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import type { PracticeProgress } from "../../types/topic";

// Tabla de avance y estado de las prácticas del tema seleccionado.
const helper = createColumnHelper<PracticeProgress>();

const columns: ColumnDef<PracticeProgress>[] = [
  helper.accessor("titulo", { header: "Práctica" }),
  helper.accessor("progreso", {
    header: "Avance",
    cell: (i) => `${i.getValue()}%`,
  }),
  helper.accessor("completada", {
    header: "Estado",
    cell: (i) => (i.getValue() ? "Completada" : "En progreso"),
  }),
];

export default function TopicProgressTable({ data }: { data: PracticeProgress[] }) {
  const table = useReactTable({ data, columns, getCoreRowModel: getCoreRowModel() });

  return (
    <div className="overflow-x-auto w-full">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-gray-200 text-gray-600">
          {table.getHeaderGroups().map((hg) => (
            <tr key={hg.id}>
              {hg.headers.map((h) => (
                <th key={h.id} className="px-3 py-2 font-semibold">
                  {flexRender(h.column.columnDef.header, h.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="border-b border-gray-100 last:border-0">
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-3 py-2 text-gray-800">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}