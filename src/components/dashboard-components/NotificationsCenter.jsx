"use client";
import  { useEffect, useState } from "react";
import { Button, Form, Input, Pagination, Skeleton } from "@heroui/react";
import { RiCheckDoubleLine } from "react-icons/ri";
import { motion, useReducedMotion } from "framer-motion";
import { useGetNotificationsQuery, useMarkAsReadMutation } from "@/redux/api/notifications";
import { BiSolidMessageRoundedError } from "react-icons/bi";
import { FiSearch, FiX } from "react-icons/fi";
import Swal from "sweetalert2";
import {Link} from "react-router-dom";
import NotificationType from "./NotificationsType";

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.08, delayChildren: 0.05 },
    },
};
const item = {
    hidden: { opacity: 0, y: 18, scale: 0.98, filter: "blur(6px)" },
    show: (i = 0) => ({
        opacity: 1,
        y: 0,
        scale: 1,
        filter: "blur(0px)",
        transition: {
            type: "spring",
            stiffness: 340,
            damping: 26,
            delay: i * 0.03,
        },
    }),
};
const NotificationsCenter = () => {
    const prefersReduced = useReducedMotion();
    const [page, setPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const [isReadSort, setIsReadSort] = useState('');
    const [type, setType] = useState('');

    const isFilter = page > 1 || searchQuery || isReadSort || type;

    useEffect(() => {
        setPage(1)
    }, [isReadSort, searchQuery, type])

    const { data: notificationsData, isLoading, isFetching, refetch } = useGetNotificationsQuery({
        search: searchQuery,
        page,
        is_read: isReadSort,
        type,
    });

    const [markAsRead, { isLoading: markLoading }] = useMarkAsReadMutation();
    const [deleteReadNotifications, { isLoading: deleteLoading }] = useMarkAsReadMutation();

    const notifications = notificationsData?.notifications || [];
    const pagination = notificationsData?.pagination || { totalPages: 1 };

    useEffect(() => {
        refetch();
        if (isFilter) {
            window.scrollTo(0, 0);
        }
    }, [page, isReadSort, searchQuery, type]);

    const onDelete = async () => {
        const { isConfirmed } = await Swal.fire({
            title: "Confirm Delete",
            text: "Are you sure you want to delete all read notifications?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete",
            cancelButtonText: "Cancel",
            confirmButtonColor: "red",
            cancelButtonColor: '#406c65',
            buttonsStyling: false,
            customClass: {
                confirmButton: "z-0 cursor-pointer group relative inline-flex items-center justify-center box-border appearance-none select-none whitespace-nowrap font-normal  bg-[#406c65] border-1 rounded-md text-white px-4 min-w-20 h-10 text-small mr-2 ",
                cancelButton: "z-0 group cursor-pointer relative inline-flex items-center justify-center box-border appearance-none select-none px-4 min-w-20 h-10 text-small gap-2  whitespace-nowrap font-normal  bg-white border-1 rounded-md text-[#406c65] border-[#406c65]"
            }

        });

        if (!isConfirmed) return;
        deleteReadNotifications({ mark_all_read: false, delete_read: true });
    }

    return (
        <div className="py-3">
            <motion.div
                initial={{ opacity: 0, y: -10, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ type: "spring", stiffness: 300, damping: 22 }}
                className="flex flex-col md:flex-row md:items-center justify-between gap-3"
            >
                {/* <DashHeading title="Notifications" desc="Stay updated with your notifications" /> */}
                <div className="flex max-sm:flex-col gap-3 md:gap-x-4 md:justify-center items-start">
                    <Form
                        onSubmit={(e) => {
                            e.preventDefault();
                            const formData = new FormData(e.currentTarget);
                            setSearchQuery(formData.get('search'))
                        }}
                    >
                        <Input
                            type="text"
                            placeholder="Search Notifications"
                            size="md"
                            aria-label="Search Notifications"
                            radius="md"
                            variant="bordered"
                            className="w-full sm:w-[260px]"
                            classNames={{
                                input: "text-sm",
                                inputWrapper: "bg-white border border-gray-300 pr-1 shadow-none",
                            }}
                            defaultValue={searchQuery}
                            name='search'
                            onBlur={(e) => setSearchQuery(e.target.value)}
                            endContent={
                                searchQuery ? (
                                    <Button
                                        color="danger"
                                        isIconOnly
                                        variant="light"
                                        size="sm"
                                        onPress={() => {
                                            setSearchQuery("");
                                        }}
                                    >
                                        <FiX size={16} />
                                    </Button>
                                ) : (
                                    <span className="mx-2">
                                        <FiSearch color="#406c65" size={16} />
                                    </span>
                                )
                            }
                        />
                    </Form>
                    {notifications?.some(n => !n.is_read) && (
                        <motion.div whileTap={{ scale: 0.98 }}>
                            <Button
                                startContent={<RiCheckDoubleLine color="#8CB59F" size={25} />}
                                className="bg-white border-1 rounded-md text-[#8CB59F] border-[#8CB59F]"
                                onPress={() => markAsRead({ is_read: true })}
                            >
                                Mark all read
                            </Button>
                        </motion.div>
                    )}
                    <Button
                        isLoading={deleteLoading}
                        color="success"
                        radius="sm"
                        title="Delete Read"
                        onPress={onDelete}
                    >
                        Delete Read
                    </Button>

                </div>
            </motion.div>
            <div className="flex max-sm:flex-col my-2 item-center gap-2">
                <select
                    name="noti_sort"
                    aria-label="Select a read or unread"
                    onChange={(e) => setIsReadSort(e.target.value)}
                    className="max-w-[180px] px-3 py-1 text-[14px] text-[#406c65] border-2 border-[#8CB59F] rounded-md focus:outline-none focus:ring-0 transition-all"
                >
                    <option value="">Latest</option>
                    <option value="true">Read</option>
                    <option value="false">Unread</option>
                </select>
            </div>
            <motion.div
                variants={prefersReduced ? undefined : container}
                initial="hidden"
                animate="show"
                className="w-full flex min-h-[450px]  flex-col overflow-hidden px-2 justify-start"
            >
                {(isLoading || isFetching) && !isFilter ?
                    Array.from({ length: 6 }).map((i, _) => (
                        <Skeleton className="w-full rounded-md mt-2 h-56 sm:h-24" key={_}></Skeleton>
                    ))
                    :
                    notifications?.length > 0 ?
                        notifications?.map((i, idx) => (
                            <motion.div
                                key={i.id}
                                custom={idx}
                                initial={{ opacity: 0, y: 18, scale: 0.98, filter: "blur(6px)" }}
                                animate={{
                                    opacity: 1,
                                    y: 0,
                                    scale: 1,
                                    filter: "blur(0px)",
                                    transition: {
                                        type: "spring",
                                        stiffness: 340,
                                        damping: 26,
                                        delay: idx * 0.03,
                                    },
                                }}
                                className="relative rounded-md mt-2"
                            >
                                <div className="bubble-glow pointer-events-none" />
                                <div className="bg-white shadow-sm flex flex-row justify-center sm:justify-between w-full relative rounded-md z-10 p-4">
                                    <div className="flex max-sm:flex-col items-center gap-2">
                                        <NotificationType type={i.type} />

                                        <div className="flex flex-col px-4 max-sm:w-full max-sm:items-center max-sm:text-center">
                                            <p className="text-black text-sm sm:text-xl">
                                                {i.title}
                                            </p>

                                            <span className="text-[12px] text-[#8A8A8A]">
                                                {i.content}
                                            </span>

                                            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 max-sm:flex-col max-sm:justify-center">
                                                {i?.url && (
                                                    <Link
                                                        target="_blank"
                                                        href={i.url}
                                                        className="underline text-[12px] text-[#406c65] hover:opacity-80 transition-opacity"
                                                    >
                                                        View
                                                    </Link>
                                                )}
                                                {!i.is_read && (
                                                    <Button
                                                        size="sm"
                                                        className="h-auto p-0 text-blue-500 underline bg-transparent shadow-none min-w-0"
                                                        onPress={() => markAsRead({ id: i.id, is_read: true })}
                                                    >
                                                        Mark as read
                                                    </Button>
                                                )}
                                                <div className="flex items-center text-[12px] text-[#8A8A8A]">
                                                    <span className="hidden sm:inline mr-2">•</span>
                                                    {i.is_read ? "Read" : "Unread"}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="max-sm:hidden text-[12px] flex gap-3 justify-center items-center text-[#8A8A8A]">
                                        {i.created_at
                                            ? `${formatDistanceToNow(new Date(i.created_at), { addSuffix: true })}`
                                            : "Just now"}
                                    </div>
                                </div>
                            </motion.div>
                        )) : <div className="w-full h-full flex flex-col justify-center items-center gap-3">
                            <BiSolidMessageRoundedError size={60} color="#406C65" />
                            <span className="text-gray-500 text-md font-semibold">No notifications</span>
                        </div>
                }

            </motion.div>
            <Pagination
                showControls
                total={pagination.totalPages}
                size="sm"
                variant="faded"
                page={page}
                onChange={setPage}
                color="success"
                className="max-w-[300px] my-2"
            />
        </div >
    );
};
export default NotificationsCenter;