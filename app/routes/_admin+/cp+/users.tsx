import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/cloudflare";
import userDB from "~/db/user/user.server";
import glossary from "~/lib/glossary";
import ChartGray from "~/assets/images/chart-gray.png";
import ChartGreen from "~/assets/images/chart-green.png";
import ChartRed from "~/assets/images/chart-red.png";
import { Icon } from "~/components/icon";
import { Link, useFetcher, useLoaderData, useNavigate } from "@remix-run/react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
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
import { AcceptenceState, QUser } from "~/types/types";
import { useMemo, useState } from "react";
import { sendEmail } from "~/lib/send-email.server";
import EditConfirmationDialog from "../components/editConfirmationDialog";
import { Input } from "~/components/ui/input";
import { createToastHeaders } from "~/lib/toast.server";

const columnHelper = createColumnHelper<QUser>();

export async function loader({ request, context }: LoaderFunctionArgs) {
  return userDB
    .getAllUsers(context.cloudflare.env.DATABASE_URL)
    .then((res) => {
      return res;
    })
    .catch((error) => {
      return error;
    });
}

export async function action({ request, context }: ActionFunctionArgs) {
  const formData = await request.formData();
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
          text:
            formData.get("status") === "accepted"
              ? glossary.email.acceptence_message
              : glossary.email.rejection_message,
        },
        context.cloudflare.env.RESEND_API,
        context.cloudflare.env.MAIN_EMAIL
      )}).
    then(async ()=>{
      return Response.json(
        { success: true },
        {
          headers: await createToastHeaders({
            description:"",
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
            description:"",
            title: glossary.cp.user.edit_status_failure,
            type: "error",
          }),
        }
      );
    });

  
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
      <div className={`border w-fit mr-4 px-5 rounded-full p-2 ${styles}`}>
        {glossary.cp.user[status]}
      </div>
    );
  };
  const { data } = useLoaderData<any>();

  const fetcher = useFetcher();
  const [selectedUser, setSelectedUser] = useState<QUser | null>(null);
  const [globalFilter, setGlobalFilter] = useState<any>([]);
  const navigate = useNavigate();

  const editUserProgramStatus = (
    id: string,
    email: string,
    status: AcceptenceState
  ) => {
    fetcher.submit({ status, id, email }, { method: "POST" });
  };

  const handleEditUserClick = (status: "accepted" | "denied", user: QUser,e:any) => {
    e.preventDefault()
    e.stopPropagation()
    setSelectedUser({ ...user, acceptenceState: status });
  };

  const columns = useMemo(
    () => [
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
            onClick={(e)=>{
              e.stopPropagation()
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
            row.original.acceptenceState !== "idle" && (
              <div className="flex gap-x-4">
                <button
                  onClick={(e) => handleEditUserClick("accepted", row.original,e)}
                  disabled={row.original.acceptenceState === "accepted"}
                  className={`button p-2 text-[#1A7F37] border border-[#1A7F37] rounded-lg disabled:border-gray-300  disabled:text-gray-300 disabled:cursor-not-allowed`}
                >
                  قبول
                </button>

                <button
                  onClick={(e) => handleEditUserClick("denied", row.original,e)}
                  disabled={row.original.acceptenceState === "denied"}
                  className={`button p-2 rounded-lg text-[#D1242F] border border-[#D1242F] disabled:border-gray-300  disabled:text-gray-300 disabled:cursor-not-allowed`}
                >
                  رفض
                </button>
              </div>
            )
          );
        },
      },
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: "includesString",
  });

  return (
    <div>
      <div className="flex w-full px-12 gap-x-8">
        <div className="analytics-box-filled flex-1 flex flex-col justify-center">
          <p className="text-lg font-bold">{glossary.cp.registered} </p>
          <h4 className="text-white mt-3">{data.length}</h4>
          <img alt="chart" className="mr-auto " src={ChartGray} />
        </div>
        <div className="analytics-box flex-1 flex flex-col justify-center">
          <p className="text-lg font-bold">{glossary.cp.accepted} </p>
          <h4 className=" mt-3">
            {
              data.filter((user: any) => user.acceptenceState === "accepted")
                .length
            }
          </h4>
          <img alt="chart" className="mr-auto " src={ChartGreen} />
        </div>

        <div className="analytics-box flex-1 flex flex-col justify-center">
          <p className="text-lg font-bold">{glossary.cp.rejected} </p>
          <h4 className=" mt-3">
            {
              data.filter((user: any) => user.acceptenceState === "denied")
                .length
            }
          </h4>
          <img alt="chart" className="mr-auto " src={ChartRed} />
        </div>
      </div>

      <div className="w-full"></div>
      <div className="relative w-1/3 mr-auto mt-12">
        <Icon className="absolute left-2 top-3" name="search" size="sm" />

        <Input
          onChange={(e) => table.setGlobalFilter(String(e.target.value))}
          className="rounded-xl"
          placeholder="ابحث هنا"
          value={globalFilter}
        />
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
    </div>
  );
};

export default Users;
