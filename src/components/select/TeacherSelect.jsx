import { Autocomplete, AutocompleteItem } from "@heroui/react";
import { useState, useMemo, useEffect } from "react";
import { useGetAllTeachersQuery } from "../../redux/api/user";
import { debounce } from "../../lib/utils";


/**
 * @param {Object} props
 * @param {(teacherId: Number)=>void} props.onChange
 * @param {Number?} props.initialValue
 * @param {String} props.label
 */
const TeacherSelect = ({ onChange, initialValue, label = undefined }) => {
    const [searchValue, setSearchValue] = useState("");
    const [selectedId, setSelectedId] = useState(String(initialValue) || "");
    const [total, setTotal] = useState(0);

    const { data: teachersData = { user: [], total: 0 }, isFetching: isLoading } = useGetAllTeachersQuery({
        page: 1,
        limit: 20,
        search: searchValue,
    });

    useEffect(() => {
        if (!total) {
            setTotal(teachersData.total);
        }
    }, [teachersData.total]);

    const onInputChange = (value) => {
        debounce(() => setSearchValue(value), 500);
    };

    const onSelectionChange = (selected) => {
        setSelectedId(selected);
        onChange?.(Number(selected));
    };

    return (
        <Autocomplete
            label={label}
            placeholder="Search a teacher"
            title="Search a teacher"
            labelPlacement="outside"
            variant="bordered"
            size="lg"
            defaultSelectedKey={selectedId}
            // value={searchValue}
            isLoading={isLoading}
            onInputChange={total > 10 ? onInputChange : undefined}
            onSelectionChange={onSelectionChange}
            defaultItems={teachersData.user}
            endContent={total > 10 && `+${total - 10}`}
        >
            {(item) => (
                <AutocompleteItem key={String(item.id)}>
                    {`${item.firstName} ${item.lastName}`}
                </AutocompleteItem>
            )}
        </Autocomplete>
    );
};

export default TeacherSelect;