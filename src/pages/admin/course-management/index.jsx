import { DashHeading } from "../../../components/dashboard-components/DashHeading";
import {
  Button,
  Input,
  Pagination,
  Select,
  SelectItem,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { ListFilterIcon, Plus, Trash2 } from "lucide-react";
import CourseForm from "../../../components/dashboard-components/forms/CourseForm";
import { use, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDeleteCourseMutation, useGetAllCategoriesQuery, useGetAllCoursesQuery } from "../../../redux/api/courses";
import { errorMessage } from "../../../lib/toast.config";
import { debounce } from "../../../lib/utils";
import Swal from "sweetalert2";

const CourseManagement = () => {


  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [status, setStatus] = useState('all');
  const [search, setSearch] = useState('');
  const [categoryId, setCategoryId] = useState(null);

  // Query/Fetch
  const { data, isFetching: isLoading, isError, error, refetch } = useGetAllCoursesQuery({ page, categoryId, limit, status, search });
  const { data: categoriesData, isError: categoriesError, error: categoriesErrorData } = useGetAllCategoriesQuery();
  // Mutation/Action
  const [deleteProduct] = useDeleteCourseMutation();

  useEffect(() => {
    if (isError) {
      errorMessage(error.data.error, error.status);
    } else if (categoriesError) {
      errorMessage(categoriesErrorData.data.error, categoriesErrorData.status);
    }
  }, [isError, categoriesError]);

  const statuses = [
    { key: "all", label: "All Status" },
    { key: "draft", label: "Draft" },
    { key: "published", label: "Published" },
  ];
  const filters = [{ key: "all", label: "Filter" }];
  const limits = [
    { key: "6", label: "6" },
    { key: "10", label: "10" },
    { key: "20", label: "20" },
    { key: "30", label: "30" },
    { key: "40", label: "40" },
    { key: "50", label: "50" },
  ];
  const [open, setOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const navigate = useNavigate();
  const handleDelete = async (id) => {
    const { isConfirmed } = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#06574C",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    })
    if (!isConfirmed) return;
    setOpen(true);
    setDeleteLoading(true);
    setDeletingId(id);

    try {
      const res = await deleteProduct(id);
      if (res.error) {
        throw new Error(res.error.message || "Failed to delete course");
      }
      setOpen(false);
    } catch (error) {
      console.error("Delete error:", error);
      errorMessage(error?.message);
    } finally {
      setDeleteLoading(false);
      setDeletingId(null);
    }
  };

  const handleEdit = (id) => {
    navigate(`/admin/courses-management/builder?tab=info&id=${id}`);
  };
  if (error) {
    return <QueryError
      height="300px"
      error={error}
      onRetry={refetch}
      showLogo={false}
      isLoading={isLoading}
    />
  }
  return (
    <div className="bg-white sm:bg-linear-to-t from-[#F1C2AC]/50 to-[#95C4BE]/50 px-2 sm:px-3">
      <DashHeading desc={"Manage and monitor course catalog"} />
      <div className="bg-[#EBD4C9] flex-wrap gap-2 p-2 sm:p-4 rounded-lg my-3 flex justify-between items-center">
        <div className="flex max-md:flex-wrap items-center gap-2">
          <Select
            className=" min-w-[120px]"
            radius="sm"
            defaultSelectedKeys={["all"]}
            onSelectionChange={(k) => {
              const keys = [...k];
              setStatus(keys[0]);
            }}
            placeholder="Select an status"
          >
            {statuses.map((status) => (
              <SelectItem key={status.key}>{status.label}</SelectItem>
            ))}
          </Select>
          <Select
            className="min-w-40"
            radius="sm"
            defaultSelectedKeys={["all"]}
            onSelectionChange={(k) => {
              const keys = [...k];
              setCategoryId(keys[0]); // can be string can be number it is going through searchParams anyway
            }}
            placeholder="Select a category"
          >
            <SelectItem key="all">All Category</SelectItem>
            {categoriesData?.categories?.map((item) => (
              <SelectItem title={item.categoryName} key={String(item.id)} value={String(item.id)}>
                {item.categoryName}</SelectItem>
            ))}
          </Select>
          <Input
            type="search"
            placeholder="Search..."
            radius="sm"
            defaultValue={search}
            onChange={(e) =>
              debounce(() => {
                setSearch(e.target.value);
              }, 400)
            }
          />
        </div>
        {/* <CourseForm /> */}
        <Button as={Link} to={'/admin/courses-management/builder'} radius="md" size="md" startContent={<Plus color="white" size={15} />} className="bg-[#06574C] max-sm:w-full text-white py-4 px-3 sm:px-8">
          Create Course
        </Button>
      </div>
      <div className="">
        <div className="overflow-x-auto no-scrollbar bg-white rounded-lg">
          <Table
            aria-label="Pending approvals table"
            removeWrapper
            align="center"
            classNames={{
              base: "table-fixed w-full bg-white rounded-lg min-h-[500px] overflow-y-auto",
              th: "font-bold p-4 text-sm text-[#333333] capitalize tracking-widest bg-[#EBD4C936] cursor-default",
              td: "py-3 align-center",
              tr: "border-b border-default-200 last:border-b-0 hover:bg-[#EBD4C936]",
            }}
          >
            <TableHeader>
              <TableColumn className="w-1/4">Course</TableColumn>
              <TableColumn className="w-2/6 text-center">Type</TableColumn>
              <TableColumn className="w-1/6 text-center">Category</TableColumn>
              <TableColumn className="w-1/6">Teacher</TableColumn>
              <TableColumn className="w-1/12 text-center">Price</TableColumn>
              <TableColumn className="w-1/12 text-center">Enrolled</TableColumn>
              <TableColumn className="w-1/12 text-center">Status</TableColumn>
              <TableColumn className="w-1/6">Rating</TableColumn>
              <TableColumn className="w-24">Actions</TableColumn>
            </TableHeader>

            <TableBody
              loadingContent={<Spinner color="success" />}
              emptyContent={"  No Course Found."}
              loadingState={isLoading ? "loading" : "idle"}
            >
              {data?.courses?.map((classItem) => (
                <TableRow key={classItem.id}>
                  <TableCell>
                    <div className="min-w-0">
                      <div className="font-medium text-gray-900 truncate">
                        {classItem?.courseName}
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5 whitespace-normal max-w-[220px] line-clamp-1">
                        {classItem?.description}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="p-2 text-center w-full capitalize text-xs rounded-md text-[#06574C] bg-[#95C4BE]/20">
                      {classItem?.type?.replace("_", "")}
                    </p>
                  </TableCell>
                  <TableCell>
                    <p className="p-2 w-full text-center text-xs rounded-md text-[#06574C] bg-[#95C4BE]/20">
                      {classItem?.category_name}
                    </p>
                  </TableCell>
                  <TableCell>
                    <div className="min-w-0">
                      <div className="font-medium truncate">
                        {classItem?.first_name} {classItem?.last_name}
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5 truncate max-w-[150px]">
                        {classItem?.email}
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="text-center">
                    <span className="font-medium">
                      ${classItem?.coursePrice}
                    </span>
                  </TableCell>

                  <TableCell className="text-center">
                    <span className="font-medium">
                      {classItem?.studentCourseCount}
                    </span>
                  </TableCell>

                  <TableCell className="text-center">
                    <p className="p-2 capitalize w-full text-xs text-center rounded-md text-[#06574C] bg-[#95C4BE]/20">
                      {classItem.status}
                    </p>
                  </TableCell>

                  <TableCell>
                    <div className="min-w-0 flex items-center">
                      <Link to={'/admin/help/reviews?id=' + classItem?.id} className="font-medium truncate max-w-[220px] block">
                        {classItem?.rating || "No ratings"}
                      </Link>
                    </div>
                  </TableCell>

                  <TableCell className="flex items-center gap-2 justify-end">
                    {/* <CourseForm initialData={classItem} /> */}

                    <Button
                      variant="bordered"
                      color="success"
                      onPress={() => handleEdit(classItem.id)}
                    >
                      Edit
                    </Button>
                    <Button
                      color="success"
                      isLoading={deletingId === classItem.id}
                      isDisabled={deletingId === classItem.id}
                      onPress={() => handleDelete(classItem.id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="flex flex-wrap items-center p-4 gap-2 justify-between overflow-hidden">
        <div className="flex text-sm items-center gap-1">
          <span>Limit</span>
          <Select
            radius="sm"
            className="w-[70px]"
            defaultSelectedKeys={["10"]}
            onSelectionChange={(k) => {
              const keys = [...k];
              setLimit(Number(keys[0]))
            }}
            placeholder="1"
          >
            {limits.map((limit) => (
              <SelectItem key={limit.key}>{limit.label}</SelectItem>
            ))}
          </Select>
          <span className="min-w-56">Out of {data?.total}</span>
        </div>
        <Pagination
          className=""
          showControls
          variant="ghost"
          initialPage={1}
          total={data?.totalPages}
          onChange={setPage}
          classNames={{
            item: "rounded-sm hover:bg-bg-[#06574C]/50",
            cursor: "bg-[#06574C] rounded-sm text-white",
            prev: "rounded-sm bg-white/80",
            next: "rounded-sm bg-white/80",
          }}
        />
      </div>
    </div>
  );
};

export default CourseManagement;
