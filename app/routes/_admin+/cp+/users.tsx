import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/cloudflare";
import userDB from "~/db/user/user.server";
import glossary from "~/lib/glossary";
import { Icon } from "~/components/icon";
import { Link, useFetcher, useLoaderData, useNavigate } from "@remix-run/react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  RowSelectionState,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import statisticsDB from "~/lib/statistics.server";

import { AcceptenceState, QUser } from "~/types/types";
import {
  HTMLProps,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";
import { sendBatchEmail, sendEmail } from "~/lib/send-email.server";
import EditConfirmationDialog from "../components/editConfirmationDialog";
import { Input } from "~/components/ui/input";
import { createToastHeaders } from "~/lib/toast.server";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/tw-merge";

const columnHelper = createColumnHelper<QUser>();

export async function loader({ request, context }: LoaderFunctionArgs) {
  const [usersResult, statsResult] = await Promise.all([
    userDB
      .getAllUsers(context.cloudflare.env.DATABASE_URL)
      .catch((error) => ({ error })),
    statisticsDB
      .getStatistics(context.cloudflare.env.DATABASE_URL)
      .catch((error) => ({ error })),
  ]);

  return {
    users: "error" in usersResult ? null : usersResult,
    stats: "error" in statsResult ? null : statsResult,
  };
}

export async function action({ request, context }: ActionFunctionArgs) {
  const formData = await request.formData();

  if (formData.get("type") === "updateStatistics") {
    try {
      await statisticsDB.updateStatistics(
        {
          registeredUsers: Number(formData.get("registeredUsers")),
          curriculums: Number(formData.get("curriculums")),
          trainingHours: Number(formData.get("trainingHours")),
        },
        context.cloudflare.env.DATABASE_URL
      );
      return Response.json(
        { success: true },
        {
          headers: await createToastHeaders({
            description: "",
            title: "تم تحديث الإحصائيات بنجاح",
            type: "success",
          }),
        }
      );
    } catch (e) {
      return Response.json(
        { success: false },
        {
          headers: await createToastHeaders({
            description: "",
            title: "فشل تحديث الإحصائيات",
            type: "error",
          }),
        }
      );
    }
  }

  if (formData.get("id")) {
    return userDB
      .editUserRegisteration(
        formData.get("id") as string,
        formData.get("status") as "denied" | "accepted",
        context.cloudflare.env.DATABASE_URL
      )
      .then(() => {
        return sendEmail(
          {
            to: formData.get("email") as string,
            subject: glossary.email.program_status_subject,
            template:"program-status",
            props:{
              status: formData.get("status"),
              name:""
            },
            text:
              formData.get("status") === "accepted"
                ? glossary.email.acceptence_message
                : glossary.email.rejection_message,
          },
          context.cloudflare.env.RESEND_API,
          context.cloudflare.env.MAIN_EMAIL
        );
      })
      .then(async () => {
        return Response.json(
          { success: true },
          {
            headers: await createToastHeaders({
              description: "",
              title: glossary.cp.user.edit_status_success,
              type: "success",
            }),
          }
        );
      })
      .catch(async () => {
        return Response.json(
          { success: false },
          {
            headers: await createToastHeaders({
              description: "",
              title: glossary.cp.user.edit_status_failure,
              type: "error",
            }),
          }
        );
      });
  } else if (formData.get("ids")) {
    const ids = JSON.parse(formData.get("ids") as string) as string[];
    const emails = JSON.parse(formData.get("emails") as string) as string[];

    return userDB
      .bulkEditUserRegisteration(
        ids,
        formData.get("status") as "accepted" | "denied",
        context.cloudflare.env.DATABASE_URL
      )
      .then(() => {
        return sendBatchEmail(
          {
            to: emails,
            subject: glossary.email.program_status_subject,
            template:"program-status",},
          context.cloudflare.env.RESEND_API,
          context.cloudflare.env.MAIN_EMAIL
        );
      })
      .then(async () => {
        return Response.json(
          { success: true },
          {
            headers: await createToastHeaders({
              description: "",
              title: glossary.cp.user.bulk_edit_status_success,
              type: "success",
            }),
          }
        );
      })
      .catch(async () => {
        return Response.json(
          { success: false },
          {
            headers: await createToastHeaders({
              description: "",
              title: glossary.cp.user.bulk_edit_status_failure,
              type: "error",
            }),
          }
        );
      });
  } else {
    return Response.json(
      { success: false },
      {
        headers: await createToastHeaders({
          description: "",
          title: glossary.cp.user.edit_status_failure,
          type: "error",
        }),
      }
    );
  }
}

const Users = () => {
  const AcceptectStatus = ({ status }: { status: AcceptenceState }) => {
    let styles = `text-[#D1242F] border-[#D1242F]`;
    switch (status) {
      case "accepted":
        styles = `text-[#1A7F37] border-[#1A7F37]`;
        break;
      case "denied":
        styles = "text-[#D1242F] border-[#D1242F]";
        break;
      case "pending":
        styles = "text-[#9A6700] border-[#9A6700]";
        break;
      default:
        break;
    }

    return (
      <div className={`border w-fit mr-4 px-5 text-nowrap rounded-full p-2 ${styles}`}>
        {glossary.cp.user[status]}
      </div>
    );
  };
  const { users, stats } = useLoaderData<{ users: any[]; stats: any }>();
  const data = users.data;

  const fetcher = useFetcher();
  const [localStats, setLocalStats] = useState({
    registeredUsers: stats.registeredUsers,
    curriculums: stats.curriculums,
    trainingHours: stats.trainingHours,
  });
  const updateStats = () => {
    const formData = new FormData();
    formData.append("type", "updateStatistics");
    formData.append("registeredUsers", localStats.registeredUsers.toString());
    formData.append("curriculums", localStats.curriculums.toString());
    formData.append("trainingHours", localStats.trainingHours.toString());
    fetcher.submit(formData, { method: "POST" });
  };
  const [selectedUser, setSelectedUser] = useState<QUser | null>(null);
  const [globalFilter, setGlobalFilter] = useState<any>([]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({}); //
  const navigate = useNavigate();
  const [bulkAction, setBulkAction] = useState({
    status: "",
    triggered: false,
  });

  const acceptedCount = data.filter(
    (user: any) => user.acceptenceState === "accepted"
  ).length;
  const rejectedCount = data.filter(
    (user: any) => user.acceptenceState === "denied"
  ).length;

  const editUserProgramStatus = (
    id: string,
    email: string,
    status: AcceptenceState
  ) => {
    fetcher.submit({ status, id, email }, { method: "POST" });
  };

  const bulkEditUserProgramStatus = (status: AcceptenceState) => {
    const ids = JSON.stringify(Object.keys(rowSelection));
    const emails = JSON.stringify(
      table.getSelectedRowModel().rows.map((row) => row.original.email)
    );
    fetcher.submit({ status, ids, emails }, { method: "POST" });
  };

  const handleEditUserClick = (
    status: AcceptenceState,
    user: QUser,
    e: any
  ) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedUser({ ...user, acceptenceState: status });
  };

  const columns = useMemo(
    () => [
      {
        id: "select",
        header: ({ table }: any) => (
          <IndeterminateCheckbox
            {...{
              checked: table.getIsAllRowsSelected(),
              indeterminate: table.getIsSomeRowsSelected(),
              onChange: table.getToggleAllRowsSelectedHandler(),
            }}
          />
        ),
        cell: ({ row }: any) => (
          <div className="px-1">
            <IndeterminateCheckbox
              {...{
                checked: row.getIsSelected(),
                disabled: !row.getCanSelect(),
                indeterminate: row.getIsSomeSelected(),
                onChange: row.getToggleSelectedHandler(),
              }}
            />
          </div>
        ),
      },
      columnHelper.accessor("name", {
        header: () => "الاسم",
        cell: (info) => info.getValue(),
      }),

      columnHelper.accessor("email", {
        header: () => "البريد الالكتروني",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("phone", {
        header: () => "رقم الجوال",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("region", {
        header: () => "المنطقة",
        cell: (info) =>
          info.getValue() === "none" ? "غير محدد" : info.getValue(),
      }),
      columnHelper.accessor("acceptenceState", {
        header: "حالة التسجيل في البرنامج",
        cell: (info) => <AcceptectStatus status={info.getValue()} />,
      }),
      columnHelper.accessor("cvKey", {
        header: "السيرة الذاتية",
        cell: (info) => (
          <button className="button p-3">
            {" "}
            <Link
              onClick={(e) => {
                e.stopPropagation();
              }}
              to={`/download/${info.getValue()}`}
              reloadDocument
              download={info.getValue()}
            >
              <Icon name="download" size={"lg"} />
            </Link>
          </button>
        ),
      }),

      {
        id: "actions",
        header: () => "الإجراء",
        cell: ({ row }: any) => {
          return (
            row.original.acceptenceState !== "idle" ? (
              <div className="flex gap-x-4">
                <button
                  onClick={(e) =>
                    handleEditUserClick("accepted", row.original, e)
                  }
                  disabled={row.original.acceptenceState === "accepted"}
                  className={`button p-2 text-[#1A7F37] border border-[#1A7F37] rounded-lg disabled:border-gray-300  disabled:text-gray-300 disabled:cursor-not-allowed`}
                >
                  قبول
                </button>

                <button
                  onClick={(e) =>
                    handleEditUserClick("denied", row.original, e)
                  }
                  disabled={row.original.acceptenceState === "denied"}
                  className={`button p-2 rounded-lg text-[#D1242F] border border-[#D1242F] disabled:border-gray-300  disabled:text-gray-300 disabled:cursor-not-allowed`}
                >
                  رفض
                </button>



                <button
                  onClick={(e) =>
                    handleEditUserClick("idle", row.original, e)
                  }
                  disabled={row.original.acceptenceState === "idle"}
                  className={`button  p-2 rounded-lg text-[#e16f4cf7] border border-[#e16f4cf7] disabled:border-gray-300  disabled:text-gray-300 disabled:cursor-not-allowed`}
                >
                تعطيل
                </button>
              </div>
            ):    <button
            onClick={(e) =>
              handleEditUserClick("accepted", row.original, e)
            }
            disabled={row.original.acceptenceState === "accepted"}
            className={`button p-2 rounded-lg text-[#e16f4cf7] border border-[#e16f4cf7] disabled:border-gray-300  disabled:text-gray-300 disabled:cursor-not-allowed`}
          >
          إعادة تنشيط
          </button>
          );
        },
      },
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    enableMultiRowSelection: true,
    onRowSelectionChange: setRowSelection, //hoist up the row selection state to your own scope
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getRowId: (row) => row.id,
    state: {
      globalFilter,
      rowSelection, //pass the row selection state back to the table instance
    },
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: "includesString",
  });

  return (
    <div >
      <div className="flex w-full px-12 gap-x-8">
        <div className="analytics-box-filled flex-1 flex">
          <p className="text-lg font-bold">
            {glossary.cp.registered + ":  "}
            {data.length}{" "}
          </p>
        </div>
        <div className="analytics-box flex-1 flex">
          <p className="text-lg font-bold">
            {glossary.cp.accepted + ":  "} {acceptedCount}
          </p>
        </div>

        <div className="analytics-box flex-1 flex">
          <p className="text-lg font-bold">
            {glossary.cp.rejected + ":  "} {rejectedCount}{" "}
          </p>
        </div>
      </div>

      <div className="flex lg:flex-row flex-col  w-full px-24 lg:gap-x-8 gap-y-5 my-5 p-3 bg-gray-100/50 rounded-md justify-between">
        <div className="flex flex-col justify-center items-center gap-4">
          <h5 className="font-bold ">الإحصائيات</h5>
          <Button onClick={updateStats} className="hidden lg:flex">
            حفظ الإحصائيات
          </Button>
        </div>
        <div>
          <h6 className="text-[#344054] text-center my-2 xl:text-lg text-base">المسجلين</h6>
          <Input
            type="number"
            className="admin-stats-box text-center"
            value={localStats.registeredUsers}
            onChange={(e)=>setLocalStats(prev=>({...prev,registeredUsers:Number(e.target.value)}))}
          />
        </div>

        <div>
          <h6 className="text-[#344054] text-center my-2 xl:text-lg text-base">المناهج</h6>
          <Input
            type="number"
            className="admin-stats-box text-center"
            value={localStats.curriculums}
            onChange={(e)=>setLocalStats(prev=>({...prev, curriculums:Number(e.target.value)}))}
          />
        </div>

        <div>
          <h6 className="text-[#344054] text-center my-2 xl:text-lg text-base">الساعات التدريبية</h6>
          <Input
            type="number"
            className="admin-stats-box text-center"
            value={localStats.trainingHours}
            onChange={(e)=>setLocalStats(prev=>({...prev,trainingHours:Number(e.target.value)}))}
          />
        </div>
        <div className="flex lg:hidden  justify-center items-center">
        <Button onClick={updateStats} className="">
            حفظ الإحصائيات
          </Button>
        </div>
      </div>

      <div className="flex justify-between mb-5  items-center w-full">
        <div className="flex items-center gap-x-2">
          <p>عدد المختارين :{Object.keys(rowSelection).length}</p>

          {Object.keys(rowSelection).length > 0 && (
            <div className="flex gap-x-4">
              <Button
                onClick={() =>
                  setBulkAction({ triggered: true, status: "accepted" })
                }
                className="bg-white hover:bg-gray-50 text-[#12B76A] border hover:shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05),0px_0px_0px_4px_#F2F4F7] rounded-lg border-solid border-[#D0D5DD]"
              >
                <span>قبول</span>
                <Icon name="accept" size="md" />
              </Button>

              <Button
                onClick={() =>
                  setBulkAction({ triggered: true, status: "denied" })
                }
                className="bg-white hover:bg-gray-50 text-[#D1242F] border hover:shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05),0px_0px_0px_4px_#F2F4F7] rounded-lg border-solid border-[#D0D5DD]"
              >
                <span>رفض</span>
                <Icon name="reject" size="md" />
              </Button>
            </div>
          )}
        </div>

        <div className="relative w-1/2 lg:w-1/3">
          <Icon className="absolute right-2 top-3" name="search" size="sm" />
          <div className="absolute gap-x-2 flex left-2 top-1">
            <button
              onClick={() =>
                table.getState().globalFilter === "accepted"
                  ? table.resetGlobalFilter()
                  : table.setGlobalFilter("accepted")
              }
              className={cn(
                "rounded-lg hover:bg-gray-50  font-bold text-sm text-[#475467] p-1 border border-[#E5E7EA] ",
                table.getState().globalFilter === "accepted"
                  ? "bg-gray-200"
                  : ""
              )}
            >
              مقبول
            </button>
            <button
              onClick={() =>
                table.getState().globalFilter === "denied"
                  ? table.resetGlobalFilter()
                  : table.setGlobalFilter("denied")
              }
              className={cn(
                "rounded-lg hover:bg-gray-50  font-bold text-sm text-[#475467] p-1 border border-[#E5E7EA] ",
                table.getState().globalFilter === "denied" ? "bg-gray-200" : ""
              )}
            >
              مرفوض
            </button>
            <button
              onClick={() =>
                table.getState().globalFilter === "idle"
                  ? table.resetGlobalFilter()
                  : table.setGlobalFilter("idle")
              }
              className={cn(
                "rounded-lg hover:bg-gray-50  font-bold text-sm text-[#475467] p-1 border border-[#E5E7EA] ",
                table.getState().globalFilter === "idle" ? "bg-gray-200" : ""
              )}
            >
              غير نشط
            </button>
          </div>

          <Input
            onChange={(e) => table.setGlobalFilter(String(e.target.value))}
            className="rounded-xl pr-8"
            placeholder="ابحث هنا"
            value={globalFilter}
          />
        </div>
      </div>

      <Table className="mx-auto  text-[#027163]">
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow onClick={() => navigate(row.original.id)} key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {selectedUser && (
        <EditConfirmationDialog
          isOpen={selectedUser !== null}
          onClose={() => setSelectedUser(null)}
          onConfirm={() =>
            selectedUser &&
            editUserProgramStatus(
              selectedUser?.id,
              selectedUser?.email,
              selectedUser.acceptenceState
            )
          }
          user={selectedUser}
        ></EditConfirmationDialog>
      )}

      {Object.keys(rowSelection).length > 0 && bulkAction.triggered && (
        <EditConfirmationDialog
          acceptenceState={bulkAction.status as "accepted" | "denied"}
          isOpen={Object.keys(rowSelection).length > 0 && bulkAction.triggered}
          onClose={() => {
            setBulkAction({ triggered: false, status: "" });
            setRowSelection({});
          }}
          onConfirm={() =>
            bulkEditUserProgramStatus(
              bulkAction.status as "accepted" | "denied"
            )
          }
          // user={selectedUser}
        ></EditConfirmationDialog>
      )}
    </div>
  );
};

function IndeterminateCheckbox({
  indeterminate,
  className = "",
  ...rest
}: { indeterminate?: boolean } & HTMLProps<HTMLInputElement>) {
  const ref = useRef<HTMLInputElement>(null!);

  useEffect(() => {
    if (typeof indeterminate === "boolean") {
      ref.current.indeterminate = !rest.checked && indeterminate;
    }
  }, [ref, indeterminate]);

  return (
    <input
      type="checkbox"
      ref={ref}
      onClick={(e: any) => {
        e.stopPropagation();
      }}
      className={className + " cursor-pointer"}
      {...rest}
    />
  );
}
export default Users;
