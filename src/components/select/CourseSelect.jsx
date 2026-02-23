import { Autocomplete, AutocompleteItem } from "@heroui/react";
import { useState, useEffect } from "react";
import { debounce } from "../../lib/utils";
import { useGetAllCoursesForSelectQuery } from "../../redux/api/courses";


/**
 * @param {Object} props
 * @param {(teacherId: Number)=>void} props.onChange
 * @param {Number?} props.initialValue
 * @param {String} props.label
 */
const CourseSelect = ({ initialValue, onChange, label = undefined }) => {
    const [searchValue, setSearchValue] = useState("");
    const [selectedId, setSelectedId] = useState(String(initialValue) || "");
    const [total, setTotal] = useState(0);
    const { data = { total: 0, courses: [] }, isFetching: isLoading, isError, error } = useGetAllCoursesForSelectQuery({ page: 1, limit: 20, search: searchValue });


    useEffect(() => {
        if (!total) {
            setTotal(data?.total);
        }
    }, [data?.total]);

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
            placeholder="Select a Course"
            title="Select a Course"
            labelPlacement="outside"
            variant="bordered"
            size="lg"
            defaultSelectedKey={selectedId}
            // value={searchValue}
            isLoading={isLoading}
            onInputChange={total > 10 ? onInputChange : undefined}
            onSelectionChange={onSelectionChange}
            defaultItems={data.courses}
            endContent={total > 10 && `+${total - 10}`}
        >
            {(item) => (
                <AutocompleteItem key={String(item.id)}>
                    {item.courseName}
                </AutocompleteItem>
            )}
        </Autocomplete>
    );
};

export default CourseSelect;