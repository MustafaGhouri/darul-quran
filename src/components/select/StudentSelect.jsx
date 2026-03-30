import { useState, useEffect, useRef } from "react";
import { useGetStudentsQuery } from "../../redux/api/user";
import { debounce } from "../../lib/utils";
import { X, Search, ChevronDown, Users, Plus } from "lucide-react";
import { Avatar, Spinner, Button, useDisclosure } from "@heroui/react";
import AddStudentModal from "../modals/AddStudentModal";

/**
 * @param {Object} props
 * @param {(userIds: Number[])=>void} props.onChange
 * @param {Number[]} props.initialValues
 * @param {String} props.label
 * @param {String} props.placeholder
 * @param {Number} props.limit - API limit per request (default 20). If total <= limit, loads all at once.
 */
const StudentSelect = ({ onChange, initialValues = [], label, placeholder = "Select students...", limit = 20 }) => {
    const [searchValue, setSearchValue] = useState("");
    const [selectedIds, setSelectedIds] = useState(initialValues);
    const [isOpen, setIsOpen] = useState(false);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const containerRef = useRef(null);
    const listRef = useRef(null);
    const { isOpen: isAddModalOpen, onOpen: onAddModalOpen, onClose: onAddModalClose } = useDisclosure();

    const { data = { users: [], total: 0 }, isFetching: isLoading, refetch } = useGetStudentsQuery({
        page: 1,
        limit,
        search: searchValue,
    });

    useEffect(() => {
        if (initialValues?.length > 0 && data.users) {
            const initialSelected = data.users?.filter(u => initialValues.includes(u.id));
            if (initialSelected?.length > 0) {
                setSelectedUsers(initialSelected);
            }
        }
    }, [data.users]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);


    const onInputChange = (e) => {
        const value = e.target.value;
        debounce(() => setSearchValue(value), 500)
    };

    const toggleUser = (user) => {
        const isSelected = selectedIds.includes(user.id);
        let newSelectedIds, newSelectedUsers;

        if (isSelected) {
            newSelectedIds = selectedIds?.filter(id => id !== user.id);
            newSelectedUsers = selectedUsers?.filter(u => u.id !== user.id);
        } else {
            newSelectedIds = [...selectedIds, user.id];
            newSelectedUsers = [...selectedUsers, user];
        }

        setSelectedIds(newSelectedIds);
        setSelectedUsers(newSelectedUsers);
        onChange?.(newSelectedIds?.map(Number), newSelectedUsers);
    };

    const removeUser = (userId, e) => {
        e.stopPropagation();
        const newSelectedIds = selectedIds.filter(id => id !== userId);
        const newSelectedUsers = selectedUsers.filter(u => u.id !== userId);
        setSelectedIds(newSelectedIds);
        setSelectedUsers(newSelectedUsers);
        onChange?.(newSelectedIds?.map(Number), newSelectedUsers);
    };

    const clearAll = (e) => {
        e.stopPropagation();
        setSelectedIds([]);
        setSelectedUsers([]);
        onChange?.([], []);
    };

    const filteredUsers = data.users?.filter(
        user => !selectedIds.includes(user.id)
    );

    return (
        <div className="w-full relative" ref={containerRef}>
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    {label}
                </label>
            )}
            <div
                className={`
                    relative w-full min-h-12 px-3 py-2 bg-white border-2 rounded-xl cursor-pointer
                    transition-all duration-200 ease-out
                    ${isOpen
                        ? 'border-[#406c65] ring-4 ring-[#406c65]/10 shadow-lg shadow-blue-500/20'
                        : 'border-gray-200 hover:border-gray-300'
                    }
                `}
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="flex flex-wrap gap-2 items-center">
                    {selectedUsers?.length > 0 ? (
                        selectedUsers?.map((user) => (
                            <span
                                key={user.id}
                                className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-lg transition-all duration-200 hover:bg-blue-200"
                            >
                                <span>{`${user.firstName} ${user.lastName}`}</span>
                                <button
                                    onClick={(e) => removeUser(user.id, e)}
                                    className="p-0.5 hover:bg-blue-200 rounded-full transition-colors"
                                    type="button"
                                >
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            </span>
                        ))
                    ) : (
                        <span className="text-gray-400 text-sm py-1.5">{placeholder}</span>
                    )}

                    <div className="ml-auto flex items-center gap-2">
                        {selectedUsers?.length > 0 && (
                            <button
                                onClick={clearAll}
                                className="px-2 py-1 text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
                                type="button"
                            >
                                Clear all
                            </button>
                        )}
                        {isLoading ?
                            <Spinner size="sm" color="success" />
                            : <ChevronDown
                                className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                            />}
                    </div>
                </div>
            </div>

            {isOpen && (
                <div className="absolute z-50 w-full mt-1.5 bg-white border border-gray-200 rounded-xl shadow-xl shadow-gray-200/50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                    <div className="relative p-2 border-b border-gray-100 flex items-center gap-2">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                className="w-full pl-9 pr-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#406c65] transition-all"
                                placeholder="Search..."
                                onChange={onInputChange}
                                onClick={(e) => e.stopPropagation()}
                            />
                        </div>
                        <Button 
                            isIconOnly
                            size="sm" 
                            variant="flat" 
                            color="success" 
                            className="rounded-lg"
                            onPress={onAddModalOpen}
                            title="Add new student"
                        >
                            <Plus size={18} />
                        </Button>
                    </div>

                    <div
                        ref={listRef}
                        className="max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent hover:scrollbar-thumb-gray-300"
                    >
                        {isLoading ? (
                            <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                                <div className="w-6 h-6 border-2 border-[#406c65] border-t-transparent rounded-full animate-spin mb-2" />
                                <span className="text-sm">Loading...</span>
                            </div>
                        ) : filteredUsers?.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                                <Users className="w-8 h-8 mb-2 opacity-50" />
                                <span className="text-sm mb-4">{searchValue ? 'No users found' : 'No users available'}</span>
                                <Button
                                    size="sm"
                                    color="success"
                                    variant="flat"
                                    startContent={<Plus size={16} />}
                                    onPress={onAddModalOpen}
                                >
                                    Add Student
                                </Button>
                            </div>
                        ) : (
                            <div className="py-1">
                                {filteredUsers?.map((user) => (
                                    <div
                                        key={user.id}
                                        onClick={() => toggleUser(user)}
                                        className="px-3 py-2.5 hover:bg-green-50 cursor-pointer transition-colors duration-150 flex items-center gap-3 group"
                                    >
                                        <Avatar className="w-10 h-10 rounded-full" src={user.avatar} />

                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900 truncate">
                                                {`${user.firstName} ${user.lastName}`}
                                            </p>
                                            {user.email && (
                                                <p className="text-xs text-gray-500 truncate">
                                                    {user.email}
                                                </p>
                                            )}
                                        </div>

                                        <div className="w-5 h-5 rounded border-2 border-gray-200 group-hover:border-[#406c65] transition-colors flex items-center justify-center">
                                            <div className="w-3 h-3 rounded-sm bg-[#406c65] opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </div>
                                    </div>
                                ))}
                                <div className="p-1 border-t border-gray-50">
                                    <button
                                        onClick={onAddModalOpen}
                                        className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-[#406c65] font-medium hover:bg-green-50 rounded-lg transition-colors group"
                                    >
                                        <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center group-hover:bg-green-100 transition-colors">
                                            <Plus size={20} />
                                        </div>
                                        <span>Add new student</span>
                                    </button>
                                </div>
                            </div>
                        )}

                        {data.total > 0 && filteredUsers?.length > 0 && (
                            <div className="px-3 py-2 bg-gray-50 border-t border-gray-100 text-xs text-gray-500 text-center">
                                {data.total <= limit
                                    ? `All ${data.total} users loaded`
                                    : `Showing ${limit} of ${data.total} users - refine your search`
                                }
                            </div>
                        )}
                    </div>
                </div>
            )}

            <AddStudentModal 
                isOpen={isAddModalOpen} 
                onClose={() => {
                    onAddModalClose();
                    refetch();
                }} 
            />
        </div>
    );
};

export default StudentSelect;
