import { useState, useEffect, useRef } from "react";
import { useGetAllUsersQuery } from "../../redux/api/user";
import { debounce } from "../../lib/utils";
import { X, Search, ChevronDown, Users } from "lucide-react";
import { Avatar, Spinner } from "@heroui/react";

/**
 * Searchable multi-user picker (all roles).
 * @param {(userIds: number[], users: object[]) => void} props.onChange
 * @param {number[]} props.initialValues
 */
const MultiUserSelect = ({
  onChange,
  initialValues = [],
  label,
  placeholder = "Search and select users...",
  limit = 20,
}) => {
  const [searchValue, setSearchValue] = useState("");
  const [selectedIds, setSelectedIds] = useState(
    (initialValues || []).map(Number).filter(Boolean),
  );
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  const { data = { users: [], total: 0 }, isFetching: isLoading } =
    useGetAllUsersQuery({
      page: 1,
      limit,
      search: searchValue,
      role: "all",
      initialValues: (initialValues || []).join(","),
    });

  useEffect(() => {
    if (initialValues?.length > 0 && data.users?.length) {
      const initialSelected = data.users.filter((u) =>
        initialValues.map(Number).includes(Number(u.id)),
      );
      if (initialSelected.length > 0) {
        setSelectedUsers((prev) => {
          const byId = new Map(prev.map((u) => [Number(u.id), u]));
          initialSelected.forEach((u) => byId.set(Number(u.id), u));
          return Array.from(byId.values()).filter((u) =>
            selectedIds.includes(Number(u.id)),
          );
        });
      }
    }
  }, [data.users, initialValues, selectedIds]);

  useEffect(() => {
    if (initialValues?.length > 0) {
      setSelectedIds(initialValues.map(Number));
    } else {
      setSelectedIds([]);
      setSelectedUsers([]);
    }
  }, [initialValues?.join?.(",")]);

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

  const toggleUser = (user) => {
    const id = Number(user.id);
    const isSelected = selectedIds.includes(id);
    let newSelectedIds;
    let newSelectedUsers;

    if (isSelected) {
      newSelectedIds = selectedIds.filter((x) => Number(x) !== id);
      newSelectedUsers = selectedUsers.filter((u) => Number(u.id) !== id);
    } else {
      newSelectedIds = [...selectedIds, id];
      newSelectedUsers = [...selectedUsers, user];
    }

    setSelectedIds(newSelectedIds);
    setSelectedUsers(newSelectedUsers);
    onChange?.(newSelectedIds.map(Number), newSelectedUsers);
  };

  const removeUser = (userId, e) => {
    e.stopPropagation();
    const id = Number(userId);
    const newSelectedIds = selectedIds.filter((x) => Number(x) !== id);
    const newSelectedUsers = selectedUsers.filter((u) => Number(u.id) !== id);
    setSelectedIds(newSelectedIds);
    setSelectedUsers(newSelectedUsers);
    onChange?.(newSelectedIds.map(Number), newSelectedUsers);
  };

  const clearAll = (e) => {
    e.stopPropagation();
    setSelectedIds([]);
    setSelectedUsers([]);
    onChange?.([], []);
  };

  const filteredUsers = (data.users || []).filter(
    (user) => !selectedIds.some((id) => Number(id) === Number(user.id)),
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
          ${
            isOpen
              ? "border-[#406c65] ring-4 ring-[#406c65]/10 shadow-lg"
              : "border-gray-200 hover:border-gray-300"
          }
        `}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex flex-wrap gap-2 items-center">
          {selectedUsers.length > 0 ? (
            selectedUsers.map((user) => (
              <span
                key={user.id}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#95C4BE33] text-[#06574C] text-sm font-medium rounded-lg"
              >
                <span>
                  {`${user.firstName || ""} ${user.lastName || ""}`.trim() ||
                    user.email}
                </span>
                <button
                  onClick={(e) => removeUser(user.id, e)}
                  className="p-0.5 hover:bg-[#95C4BE55] rounded-full"
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
            {selectedUsers.length > 0 && (
              <button
                onClick={clearAll}
                className="px-2 py-1 text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
                type="button"
              >
                Clear all
              </button>
            )}
            {isLoading ? (
              <Spinner size="sm" color="success" />
            ) : (
              <ChevronDown
                className={`w-5 h-5 text-gray-400 transition-transform ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            )}
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1.5 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden">
          <div className="relative p-2 border-b border-gray-100">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              className="w-full pl-9 pr-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#406c65]"
              placeholder="Search by name or email..."
              onChange={onInputChange}
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          <div className="max-h-64 overflow-y-auto">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                <Spinner size="sm" color="success" />
                <span className="text-sm mt-2">Loading...</span>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                <Users className="w-8 h-8 mb-2 opacity-50" />
                <span className="text-sm">
                  {searchValue ? "No users found" : "No users available"}
                </span>
              </div>
            ) : (
              <div className="py-1">
                {filteredUsers.map((user) => (
                  <div
                    key={user.id}
                    onClick={() => toggleUser(user)}
                    className="px-3 py-2.5 hover:bg-green-50 cursor-pointer flex items-center gap-3"
                  >
                    <Avatar className="w-9 h-9 rounded-full" src={user.avatar} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {`${user.firstName || ""} ${user.lastName || ""}`.trim() ||
                          "Unnamed"}
                      </p>
                      {user.email && (
                        <p className="text-xs text-gray-500 truncate">
                          {user.email}
                        </p>
                      )}
                    </div>
                    {user.role && (
                      <span className="text-[10px] uppercase tracking-wide text-[#06574C] bg-[#95C4BE33] px-1.5 py-0.5 rounded">
                        {user.role}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MultiUserSelect;
