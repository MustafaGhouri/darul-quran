import { Button, DatePicker, Form, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Pagination, Select, SelectItem, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Textarea, useDisclosure } from '@heroui/react'
import { parseDate } from '@internationalized/date';
import { Edit, Plus, SaveIcon } from 'lucide-react'
import { useState } from 'react';

const CreateCourse = ({ initialData = {} }) => {

    const [date, setDate] = useState('') // "2025-11-27"
    const teachers = [
        { key: 'John Davis', label: "John Davis" },
    ];
    const categories = [
        { key: "Web Development", label: "Web Development" },
        { key: "all", label: "All Category" },
    ];
    const { isOpen, onOpen, onClose } = useDisclosure();
    const handleOpen = () => {
        onOpen();
    };

    const handleCalendarChange = (date) => {
        const dbFormatDate = `${date.year}-${String(date.month).padStart(2, "0")}-${String(date.day).padStart(2, "0")}`;
        setDate(dbFormatDate)
        console.log(dbFormatDate); // → "2025-11-27"
    };

    const handleSubmit = async (formData) => {
        const payload = {
            name: formData.get("name")?.toString() || "",
            desc: formData.get("desc")?.toString() || "",
            price: formData.get("price")?.toString() || 0,
            category: formData.get("category")?.toString() || "",
            teacher: formData.get("teacher")?.toString() || "",
            enrollment_limit: formData.get("enrollment_limit")?.toString() || 0,
            date: date || "",
        };
        if (initialData?.id) {
            // const res = await dispatch(editCourse(initialData?.id, payload));
            // if (res?.success) ;

        }
        else {
            // const res = await dispatch(createCourse(payload));
            // if (res?.success) ;
        }
        // console.log(payload);
        //  output = {
        //     "name": "React Hooks Deep Dive",
        //     "desc": "Advanced JavaScript Course",
        //     "price": "199",
        //     "category": "Web Development",
        //     "teacher": "John Davis",
        //     "enrollment_limit": "1300",
        //     "date": "2025-01-15"
        // }
    };
    return (
        <>
            {initialData?.id ?
                <Button  onPress={handleOpen} radius="sm" size="sm" variant="bordered" className="border-[#06574C]" startContent={<Edit  size={18} color="#06574C" />}>
                    Edit
                </Button> :
                <Button onPress={handleOpen} radius="sm" size="sm" startContent={<Plus color="white" size={15} />} className="bg-[#06574C] text-white py-4 px-3 sm:px-8">
                    Create Course
                </Button>
            }
            <Modal scrollBehavior="inside" className="rounded-sm" isOpen={isOpen} size={'4xl'} onClose={onClose} backdrop={"blur"}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">
                                <h1 className="text-2xl font-bold">{initialData?.id ? "Edit Course" : "Create Course"}</h1>
                            </ModalHeader>
                            <ModalBody>
                                <Form action={(formData) => handleSubmit(formData)}>
                                    <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
                                        <Input
                                            label="Course Name"
                                            name="name"
                                            labelPlacement="outside"
                                            variant="bordered"
                                            radius="sm"
                                            isRequired
                                            defaultValue={initialData.name}
                                            placeholder="Enter course name"
                                            type="text"
                                            errorMessage={'Course name is required'}
                                        />
                                        <Select
                                            isRequired
                                            className="md:min-w-[120px]"
                                            radius="sm"
                                            label="Category"
                                            name="category"
                                            selectedKeys={[initialData.category]}
                                            labelPlacement="outside"
                                            placeholder="Select category"
                                        >
                                            {categories.filter(i => i.key !== 'all').map((category) => (
                                                <SelectItem key={category.key}>{category.label}</SelectItem>
                                            ))}
                                        </Select>
                                    </div>
                                    <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
                                        <Input
                                            label="Price"
                                            name="price"
                                            labelPlacement="outside"
                                            placeholder="0.00"
                                            variant="bordered"
                                            isRequired
                                            defaultValue={initialData.price}
                                            radius="sm"
                                            errorMessage={'Price is required'}
                                            startContent={
                                                <div className="pointer-events-none flex items-center">
                                                    <span className="text-default-400 text-small">$</span>
                                                </div>
                                            }
                                            type="number"
                                        />
                                        <Input
                                            label="Enrollment Limit"
                                            name="enrollment_limit"
                                            labelPlacement="outside"
                                            placeholder="0.00"
                                            variant="bordered"
                                            radius="sm"
                                            defaultValue={initialData.enrollment_limit}
                                            isRequired
                                            errorMessage={'Enrollment Limit is required'}
                                            endContent={
                                                <img src="/icons/updown-arrow.png" className="h-4" alt="updown-arrow" />
                                            }
                                            type="numeric"
                                        />
                                    </div>
                                    <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
                                        <Select
                                            isRequired
                                            radius="sm"
                                            label="Teacher"
                                            name="teacher"
                                            labelPlacement="outside"
                                            selectedKeys={[initialData.teacher]}
                                            placeholder="Select teacher"
                                        >
                                            {teachers.map((teacher) => (
                                                <SelectItem key={teacher.key}>{teacher.label}</SelectItem>
                                            ))}
                                        </Select>
                                        <DatePicker
                                            radius="sm"
                                            labelPlacement="outside"
                                            label="Date"
                                            onChange={handleCalendarChange}
                                            name="date"
                                            defaultValue={initialData?.date?parseDate(initialData?.date):undefined}
                                            isRequired
                                        />
                                    </div>
                                    <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
                                        <Textarea
                                            label="Course Description"
                                            labelPlacement="outside"
                                            radius="sm"
                                            name='desc'
                                            defaultValue={initialData.desc}
                                            rows={4}
                                            placeholder="Brief description of the course"
                                        />
                                    </div>
                                    <div className="flex items-center w-full my-4 justify-end gap-2">
                                        <Button startContent={<SaveIcon color="#06574C" />} variant="bordered" className="border-[#06574C] rounded-sm " onPress={onClose}>
                                            Save Draft
                                        </Button>
                                        <Button type={'submit'} startContent={<Plus color="white" size={15} />} className="bg-[#06574C] text-white rounded-sm py-4 px-3 sm:px-8">
                                            {initialData?.id ? "Update Course" : "Create Course"}
                                        </Button>
                                    </div>
                                </Form>
                            </ModalBody>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    )
}

export default CreateCourse;
