import { useState, useEffect, useRef } from "react";
import { useGetAllTeachersQuery } from "../../redux/api/user";
import { debounce } from "../../lib/utils";
import { X, Search, ChevronDown, Users } from "lucide-react";
import { Avatar, Spinner } from "@heroui/react";

/**
 * @param {Object} props
 * @param {(teacherIds: Number[]|Number)=>void} props.onChange
 * @param {Number|Number[]} props.initialValue
 * @param {String} props.label
 * @param {String} props.placeholder
 * @param {Number} props.limit - API limit per request (default 20)
 * @param {Boolean} props.isDisabled - API limit per request (default 20)
 * @param {Boolean} props.isMultiple - Enable multiple selection (default false)
 */
const TeacherSelect = ({
    onChange,
    initialValue,
    label,
    placeholder = "Select teacher...",
    limit = 20,
    isDisabled = false,
    isMultiple = false,
    courseTeacherId,
}) => {
    const [searchValue, setSearchValue] = useState("");
    const [selectedIds, setSelectedIds] = useState(Array.isArray(initialValue) ? initialValue : (initialValue ? [initialValue] : []));
    const [selectedTeachers, setSelectedTeachers] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);
    const listRef = useRef(null);

    const { data = { user: [], total: 0 }, isFetching: isLoading } = useGetAllTeachersQuery({
        page: 1,
        limit,
        search: searchValue,
        initialValue
    });

    // Find initial teacher(s) from the list by matching ID
    useEffect(() => {
        if (initialValue !== undefined && initialValue !== null && initialValue !== '' && data.user?.length > 0 && selectedTeachers.length === 0) {
            const ids = Array.isArray(initialValue) ? initialValue : [initialValue];
            const found = data.user.filter(t => ids.includes(t.id));
            if (found.length > 0) {
                setSelectedIds(ids);
                setSelectedTeachers(found);
            }
        }
    }, [data.user, initialValue]);

    useEffect(() => {
        if (initialValue !== undefined && initialValue !== null && initialValue !== '') {
            const newIds = Array.isArray(initialValue) ? initialValue : [initialValue];
            setSelectedIds(newIds);
        } else {
            setSelectedIds([]);
            setSelectedTeachers([]);
        }
    }, [initialValue]);



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
        debounce(() => setSearchValue(value), 500);
    };

    const toggleTeacher = (teacher) => {
        if (isMultiple) {
            const isSelected = selectedIds.includes(teacher.id);
            let newSelectedIds, newSelectedTeachers;

            if (isSelected) {
                newSelectedIds = selectedIds.filter(id => id !== teacher.id);
                newSelectedTeachers = selectedTeachers.filter(t => t.id !== teacher.id);
            } else {
                newSelectedIds = [...selectedIds, teacher.id];
                newSelectedTeachers = [...selectedTeachers, teacher];
            }

            setSelectedIds(newSelectedIds);
            setSelectedTeachers(newSelectedTeachers);
            onChange?.(isMultiple ? newSelectedIds.map(Number) : newSelectedIds[0]);
        } else {
            setSelectedIds([teacher.id]);
            setSelectedTeachers([teacher]);
            onChange?.(Number(teacher.id));
            setIsOpen(false);
        }
    };

    const removeTeacher = (teacherId, e) => {
        e.stopPropagation();
        const newSelectedIds = selectedIds.filter(id => id !== teacherId);
        const newSelectedTeachers = selectedTeachers.filter(t => t.id !== teacherId);
        setSelectedIds(newSelectedIds);
        setSelectedTeachers(newSelectedTeachers);
        onChange?.(isMultiple ? newSelectedIds.map(Number) : newSelectedIds[0]);
    };

    const clearAll = (e) => {
        e.stopPropagation();
        setSelectedIds([]);
        setSelectedTeachers([]);
        onChange?.(isMultiple ? [] : null);
    };

    // Show assigned teacher in dropdown even if it's currently selected, as requested
    const filteredTeachers = data.user?.filter(
        teacher => !selectedIds.includes(Number(teacher.id)) || Number(teacher.id) === Number(courseTeacherId)
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
                onClick={() => !isDisabled && setIsOpen(!isOpen)}
            >
                <div className="flex flex-wrap gap-2 items-center">
                    {selectedTeachers.length > 0 ? (
                        selectedTeachers.map((teacher) => (
                            <span
                                key={teacher.id}
                                className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-lg transition-all duration-200 hover:bg-blue-200"
                            >
                                <span>{`${teacher.firstName} ${teacher.lastName}`}</span>
                                <button
                                    disabled={isDisabled}
                                    onClick={(e) => removeTeacher(teacher.id, e)}
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
                        {selectedTeachers.length > 0 && (
                            <button
                                onClick={clearAll}
                                disabled={isDisabled}
                                className="px-2 py-1 text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
                                type="button"
                            >
                                {isMultiple ? 'Clear all' : 'Clear'}
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
                        ) : filteredTeachers?.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                                <Users className="w-8 h-8 mb-2 opacity-50" />
                                <span className="text-sm">{searchValue ? 'No teachers found' : 'No teachers available'}</span>
                            </div>
                        ) : (
                            <div className="py-1">
                                {filteredTeachers?.map((teacher) => (
                                    <div
                                        key={teacher.id}
                                        onClick={() => toggleTeacher(teacher)}
                                        className={`px-3 py-2.5 hover:bg-green-50 cursor-pointer transition-colors duration-150 flex items-center gap-3 group ${selectedIds.includes(Number(teacher.id)) ? 'bg-green-50' : ''}`}
                                    >
                                        <div className="w-10 h-10 rounded-full bg-linear-to-br from-green-400 to-[#406c65] flex items-center justify-center text-white text-sm font-medium shadow-sm">
                                            {/* {teacher.firstName?.charAt(0)}{teacher.lastName?.charAt(0)} */}
                                            <Avatar className="w-10 h-10 rounded-full" src={teacher.avatar} />
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <p className="text-sm font-medium text-gray-900 truncate">
                                                    {`${teacher.firstName} ${teacher.lastName}`}
                                                </p>
                                                {teacher.id === Number(courseTeacherId) && (
                                                    <span className="px-1.5 py-0.5 text-[10px] bg-green-600 text-white font-bold rounded-sm uppercase tracking-wider">
                                                        Course's Teacher
                                                    </span>
                                                )}
                                            </div>
                                            {teacher.email && (
                                                <p className="text-xs text-gray-500 truncate">
                                                    {teacher.email}
                                                </p>
                                            )}
                                            {teacher.zoomUserId && (
                                                <p className="text-xs text-green-600 truncate">
                                                    Connected with Zoom
                                                </p>
                                            )}
                                        </div>

                                        <div className={`w-5 h-5 rounded border-2 transition-colors flex items-center justify-center ${selectedIds.includes(Number(teacher.id)) ? 'border-[#406c65] bg-[#406c65]/10' : 'border-gray-200 group-hover:border-[#406c65]'}`}>
                                            <div className={`w-3 h-3 rounded-sm bg-[#406c65] transition-opacity ${selectedIds.includes(Number(teacher.id)) ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {data.total > 0 && (
                            <div className="px-3 py-2 bg-gray-50 border-t border-gray-100 text-xs text-gray-500 text-center">
                                {data.total <= limit
                                    ? `All ${data.total} teachers loaded`
                                    : `Showing ${limit} of ${data.total} teachers - refine your search`
                                }
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default TeacherSelect;
