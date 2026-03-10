import { useState, useEffect, useRef, useMemo } from "react";
import { useGetAllUserForSelectQuery } from "../../redux/api/user";
import { debounce } from "../../lib/utils";
import { X, Search, ChevronDown, Users } from "lucide-react";
import { Spinner } from "@heroui/react";

/**
 * @param {Object} props
 * @param {(userIds: Number[])=>void} props.onChange
 * @param {Number} props.courseId
 * @param {Number[]} props.initialValues
 * @param {String} props.label
 * @param {String} props.placeholder
 * @param {Number} props.limit - API limit per request (default 20). If total <= limit, loads all at once.
 */
const UserSelect = ({ onChange, courseId, initialValues = [], label, placeholder = "Select students...", limit = 20 }) => {
    const [searchValue, setSearchValue] = useState("");
    const [selectedIds, setSelectedIds] = useState(initialValues);
    const [isOpen, setIsOpen] = useState(false);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const containerRef = useRef(null);
    const listRef = useRef(null);

    const { data = { users: [], total: 0 }, isFetching: isLoading } = useGetAllUserForSelectQuery({
        page: 1,
        limit,
        search: searchValue,
        courseId,
    }, { skip: !courseId });

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
        onChange?.(newSelectedIds?.map(Number));
    };

    const removeUser = (userId, e) => {
        e.stopPropagation();
        const newSelectedIds = selectedIds.filter(id => id !== userId);
        const newSelectedUsers = selectedUsers.filter(u => u.id !== userId);
        setSelectedIds(newSelectedIds);
        setSelectedUsers(newSelectedUsers);
        onChange?.(newSelectedIds?.map(Number));
    };

    const clearAll = (e) => {
        e.stopPropagation();
        setSelectedIds([]);
        setSelectedUsers([]);
        onChange?.([]);
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
                    ${!courseId ? 'opacity-50 cursor-not-allowed' : ''}
                `}
                onClick={() => courseId && setIsOpen(!isOpen)}
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
                       {isLoading?
                       <Spinner size="sm" color="success"/>
                       : <ChevronDown
                            className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                        />}
                    </div>
                </div>
            </div>

            {isOpen && (
                <div className="absolute z-50 w-full mt-1.5 bg-white border border-gray-200 rounded-xl shadow-xl shadow-gray-200/50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                    <div className="relative p-2 border-b border-gray-100">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            className="w-full pl-9 pr-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#406c65] transition-all"
                            placeholder="Search..."
                            onChange={onInputChange}
                            onClick={(e) => e.stopPropagation()}
                        />
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
                                <span className="text-sm">{searchValue ? 'No users found' : 'No users available'}</span>
                            </div>
                        ) : (
                            <div className="py-1">
                                {filteredUsers?.map((user) => (
                                    <div
                                        key={user.id}
                                        onClick={() => toggleUser(user)}
                                        className="px-3 py-2.5 hover:bg-green-50 cursor-pointer transition-colors duration-150 flex items-center gap-3 group"
                                    >
                                        <div className="w-8 h-8 rounded-full bg-linear-to-br from-green-400 to-[#406c65] flex items-center justify-center text-white text-sm font-medium shadow-sm">
                                            {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                                        </div>

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
                            </div>
                        )}

                        {data.total > 0 && (
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

            {/* Helper text */}
            {!courseId && (
                <p className="mt-1.5 text-xs text-amber-600">
                    Please select a course first
                </p>
            )}
        </div>
    );
};

export default UserSelect;
