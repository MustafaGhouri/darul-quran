import React, { useState } from "react";
import { DashHeading } from "../../../components/dashboard-components/DashHeading";
import { Avatar, Button, Chip, Pagination, Progress, Spinner, User } from "@heroui/react";
import { Link, useSearchParams } from "react-router-dom";
import { useGetReviewsQuery, useDeleteReviewMutation } from "../../../redux/api/courses";
import { Trash2 } from "lucide-react";
import { errorMessage, successMessage } from "../../../lib/toast.config";
import RatingStars from "../../../components/RatingStar";
import { useEffect } from "react";

const Review = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const id = searchParams.get("id") || '';
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [isDeleting, setIsDeleting] = useState(null);
  const [ratingForSearch, setRatingForSearch] = useState(null);
  const [overview, setOverview] = useState(null);
  const [shouldFetchOverview, setShouldFetchOverview] = useState(true);

  const { data, isFetching, isError, error } = useGetReviewsQuery(
    {
      courseId: (id !== 'null' && id !== 'undefined') ? id : '',
      page,
      limit,
      includeOverview: shouldFetchOverview,
      rating: ratingForSearch ? ratingForSearch : undefined,
    }
  );

  useEffect(() => {
    if (data?.agg && shouldFetchOverview) {
      setOverview(data.agg);
      setShouldFetchOverview(false);
    }
  }, [data, shouldFetchOverview]);
  const [deleteReview] = useDeleteReviewMutation();

  const handleDelete = async (reviewId) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;

    try {
      setIsDeleting(reviewId);
      const result = await deleteReview(reviewId).unwrap();
      if (result.success) {
        successMessage(result.message || "Review deleted successfully");
      }
    } catch (err) {
      errorMessage(err?.data?.message || err?.message || "Failed to delete review");
    } finally {
      setIsDeleting(null);
    }
  };

  if (isError) {
    return (
      <div className="text-center text-red-500 py-8">
        Error: {error?.data?.message || error?.message || "Failed to load reviews"}
      </div>
    );
  }

  const reviews = data?.reviews || [];
  const totalPages = data?.totalPages || 0;
  const totalReviews = data?.total || 0;

  return (
    <div className="bg-white sm:bg-linear-to-t from-[#F1C2AC]/50 to-[#95C4BE]/50 px-2 sm:px-3 py-6">
      <DashHeading
        title={"Reviews"}
        desc={"See what students are saying about this course"}
      />
      <div className="bg-white mb-3 p-5 rounded-xl">
        <h3 className="text-base font-semibold mb-4">Student Reviews</h3>

        <div className="flex gap-6">
          {/* Rating */}
          <div className="min-w-[100px]">
            <p className="text-3xl font-bold">{overview?.avg}</p>

            <div className="flex gap-1 text-yellow-400 my-1">
              <RatingStars rating={overview?.avg} />
            </div>

            <p className="text-xs text-gray-500">({overview?.total?.toFixed(0)} Reviews)</p>
          </div>

          {/* Progress Bars */}
          <div className="flex-1 space-y-3">
            {[
              { star: 5, value: (overview?.five / overview?.total) * 100, count: overview?.five },
              { star: 4, value: ((overview?.four / overview?.total) * 100), count: overview?.four },
              { star: 3, value: ((overview?.three / overview?.total) * 100), count: overview?.three },
              { star: 2, value: ((overview?.two / overview?.total) * 100), count: overview?.two },
              { star: 1, value: ((overview?.one / overview?.total) * 100), count: overview?.one },
            ].map((item) => (
              <div onClick={() => setRatingForSearch(item.star)} key={item.star} className="flex hover:opacity-50 cursor-pointer items-center gap-2">
                <span className="w-12 text-xs text-gray-500">
                  {item.star} stars
                </span>

                <Progress
                  value={item.value}
                  size="sm"
                  radius="full"
                  className="flex-1"
                  classNames={{
                    indicator: "bg-yellow-400",
                    track: "bg-gray-100",
                  }}
                />

                <span className="w-6 text-xs text-gray-500 text-right">
                  {item.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
      {(id || ratingForSearch) &&
        <Chip
          color="success"
          onClick={() => {
            setSearchParams({ id: '' });
            setRatingForSearch(null);
          }}
          endContent={<>&times;</>}
          className="mb-3 pr-2 cursor-pointer"
          variant="flat">
          Clear Filters
        </Chip>
      }
      {isFetching ? (
        <div className="flex min-h-[50vh] justify-center items-center py-12">
          <Spinner size="lg" color="success" />
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-12 min-h-[50vh] bg-white rounded-lg">
          <p className="text-gray-500 text-lg">No reviews found for this course.</p>
        </div>
      ) : (
        <>
          <div className="space-y-4  min-h-[48vh]">
            {reviews.map((item) => (
              <div
                className="p-4 bg-white  rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
                key={item.id}
              >
                <div className="flex justify-between items-start gap-3">
                  <div className="flex gap-3 flex-1">
                    <Avatar
                      className="shadow-lg"
                      name={item.username || "User"}
                      size="lg"
                      color="success"
                      src={item.avatar}
                    />
                    <div className="flex flex-col gap-1">
                      <div className="flex max-sm:flex-wrap items-center gap-2 flex-wrap">
                        <h1 className="text-md font-bold text-gray-800">
                          {item.username || "Anonymous"}
                        </h1>
                        <RatingStars rating={item.rating || 0} /> ({item.rating || 0})
                        {item?.courseName && <Link to={'/admin/help/reviews?id=' + item?.courseId?.toString()} className="text-sm text-gray-600"><strong>Course:</strong> {item?.courseName}</Link>}
                      </div>
                      <p className="text-sm text-gray-500">{item.email}</p>
                    </div>
                  </div>
                  <Button
                    isIconOnly
                    size="sm"
                    variant="light"
                    color="danger"
                    onPress={() => handleDelete(item.id)}
                    isLoading={isDeleting === item.id}
                    isDisabled={isDeleting === item.id}
                    className="text-red-500 hover:bg-red-50"
                  >
                    <Trash2 size={18} />
                  </Button>
                </div>
                <div className="mt-3 mgl-14">
                  <p className="text-[#06574C] text-md">{item.description || "No description provided"}</p>
                  <p className="text-xs text-gray-400 mt-2">
                    {new Date(item.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="my-6 w-full flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-lg shadow-sm">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Show:</span>
                <select
                  value={limit}
                  onChange={(e) => {
                    setLimit(Number(e.target.value));
                    setPage(1);
                  }}
                  className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:border-[#06574C]"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
                <span className="text-sm text-gray-600 ml-2">
                  ({totalReviews} total reviews)
                </span>
              </div>
              <Pagination
                className=""
                showControls
                variant="ghost"
                initialPage={1}
                page={page}
                total={totalPages}
                onChange={setPage}
                classNames={{
                  item: "rounded-sm hover:bg-[#06574C]/10",
                  cursor: "bg-[#06574C] rounded-sm text-white",
                  prev: "rounded-sm bg-white/80",
                  next: "rounded-sm bg-white/80",
                }}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Review;