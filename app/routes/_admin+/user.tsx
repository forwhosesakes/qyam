import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/cloudflare";
import userDB from "~/db/user/user.server";
import {
  Link,
  useFetcher,
  useLoaderData,
} from "@remix-run/react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { QUser } from "~/types/types";
import { useMemo } from "react";
import { sendEmail } from "~/lib/send-email.server";

const columnHelper = createColumnHelper<QUser>();

export async function loader({ request, context }: LoaderFunctionArgs) {
  return userDB
    .getAllUsers(context.cloudflare.env.DATABASE_URL)
    .then((res) => {
      // console.log("userss", res);

      return res;
    })
    .catch((error) => {
      return error;
    });
}

export async function action({ request, context }: ActionFunctionArgs) {
  const formData = await request.formData();
      userDB.editUserRegisteration(
      formData.get("id") as string,
      formData.get("status") as "denied"|"accepted",
      context.cloudflare.env.DATABASE_URL
    ).then((res)=>{
      sendEmail(
   {     to:   formData.get("email") as string,
        subject: "Verify your email addressQyam program status",
        text:"you have been accepted into qyam program"}
        , context.cloudflare.env.RESEND_API, context.cloudflare.env.MAIN_EMAIL)

    }).catch((error)=>{
      console.log("error",error);
      

    })

    return null
  
}

const Users = () => {
  const { data } = useLoaderData<any>();

  const fetcher = useFetcher();
  const isLoading = fetcher.state !== "idle";

  const editUserProgramStatus = (id: string,email:string,status:"accepted"|"denied") => {
    fetcher.submit({ status, id ,email}, { method: "POST" });
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
        cell: (info) => (
          <span className="rounded-lg border-red-900 p-3">
            {info.getValue()}
          </span>
        ),
      }),
      columnHelper.accessor("cvKey", {
        header: "السيرة الذاتية",
        cell: (info) => (
          <button className="button p-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700">
            {" "}
            <Link
              to={`/download/${info.getValue()}`}
              reloadDocument
              download={info.getValue()}
            >
              Download
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
                  onClick={() => editUserProgramStatus(row.original.id,row.original.email,"accepted")}
                  className="button p-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700"
                >
                  قبول
                </button>

                <button
                  onClick={() => editUserProgramStatus(row.original.id,row.original.email,"denied")}
                  className="button p-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700"
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
  });

  return (
    <section className="pt-48 px-24 mx-auto min-h-screen">
      <Table className="mx-auto">
        <TableCaption>A list of all users.</TableCaption>
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
            <TableRow key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </section>
  );
};

export default Users;
