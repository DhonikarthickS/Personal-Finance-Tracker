import { useMemo, useState } from "react";
import { useFinancialRecords } from "../../contexts/financial-record-context.jsx";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";

const columnHelper = createColumnHelper();

const EditableCell = ({
  getValue,
  row,
  column,
  table,
  updateRecord,
  editable,
}) => {
  const initialValue = getValue();
  const [value, setValue] = useState(initialValue);
  const [isEditing, setIsEditing] = useState(false);

  const onBlur = () => {
    setIsEditing(false);
    const id = row.original._id;
    updateRecord(id || "", { ...row.original, [column.id]: value });
  };

  return (
    <div
      onClick={() => editable && setIsEditing(true)}
      style={{ cursor: editable ? "pointer" : "default" }}
    >
      {isEditing ? (
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          autoFocus
          onBlur={onBlur}
          style={{ width: "100%" }}
        />
      ) : typeof value === "string" ? (
        value
      ) : (
        String(value)
      )}
    </div>
  );
};

export const FinancialRecordList = () => {
  const { records, updateRecord, deleteRecord } = useFinancialRecords();

  const columns = useMemo(
    () => [
      columnHelper.accessor("description", {
        header: "Description",
        cell: (props) => (
          <EditableCell
            {...props}
            updateRecord={(id, newRecord) => updateRecord(id, newRecord)}
            editable={true}
          />
        ),
      }),
      columnHelper.accessor("amount", {
        header: "Amount",
        cell: (props) => (
          <EditableCell
            {...props}
            updateRecord={(id, newRecord) => updateRecord(id, newRecord)}
            editable={true}
          />
        ),
      }),
      columnHelper.accessor("category", {
        header: "Category",
        cell: (props) => (
          <EditableCell
            {...props}
            updateRecord={(id, newRecord) => updateRecord(id, newRecord)}
            editable={true}
          />
        ),
      }),
      columnHelper.accessor("paymentMethod", {
        header: "Payment Method",
        cell: (props) => (
          <EditableCell
            {...props}
            updateRecord={(id, newRecord) => updateRecord(id, newRecord)}
            editable={true}
          />
        ),
      }),
      columnHelper.accessor("date", {
        header: "Date",
        cell: (props) => (
          <EditableCell
            {...props}
            updateRecord={(id, newRecord) => updateRecord(id, newRecord)}
            editable={false}
          />
        ),
      }),
      columnHelper.display({
        id: "delete",
        header: "Delete",
        cell: (props) => (
          <button
            onClick={() => deleteRecord(props.row.original._id || "")}
            className="button"
          >
            Delete
          </button>
        ),
      }),
    ],
    [records]
  );

  const table = useReactTable({
    data: records,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="table-container">
      <table className="table">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
