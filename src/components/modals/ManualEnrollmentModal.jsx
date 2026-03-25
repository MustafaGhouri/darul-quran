import { 
    Modal, 
    ModalContent, 
    ModalHeader, 
    ModalBody, 
    ModalFooter, 
    Button
} from "@heroui/react";
import { useCreateManualEnrollmentMutation } from "../../redux/api/enrollmentAdmin";
import { successMessage, errorMessage } from "../../lib/toast.config";

const ManualEnrollmentModal = ({ isOpen, onOpenChange, unenrolledStudents, courseId, onEnrollmentSuccess }) => {
    const [createManualEnrollment, { isLoading }] = useCreateManualEnrollmentMutation();

    const handleEnroll = async () => {
        try {
            let successCount = 0;
            for (const student of unenrolledStudents) {
                // The API call returns an object formatted as { success: true, message: "..." }
                const res = await createManualEnrollment({ userId: student.id, courseId: Number(courseId) }).unwrap();
                if (res.success) {
                    successCount++;
                }
            }
            if (successCount > 0) {
                successMessage(`${successCount} student(s) enrolled successfully`);
                onEnrollmentSuccess?.();
            }
            onOpenChange(false);
        } catch (error) {
            console.error(error);
            errorMessage(error?.data?.message || "Failed to enroll students manually");
        }
    };

    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} backdrop="blur" placement="center" size="md">
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1 text-[#06574C]">Manual Enrollment Required</ModalHeader>
                        <ModalBody>
                            <p className="text-sm text-gray-600 mb-4">
                                The following student(s) are not enrolled in this course. They must be enrolled before a one-on-one session can be scheduled.
                            </p>
                            <div className="space-y-2 max-h-[30vh] overflow-y-auto pr-1">
                                {unenrolledStudents?.map((student) => (
                                    <div key={student.id} className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                                        <p className="font-medium text-gray-900">{student.firstName} {student.lastName}</p>
                                        <p className="text-xs text-gray-500">{student.email}</p>
                                    </div>
                                ))}
                            </div>
                            <p className="mt-4 text-xs font-semibold text-amber-600">
                                Manual enrollment will be completed at $0 cost.
                            </p>
                            <p className="mt-4 text-xs font-semibold text-gray-500">
                                From now on this student can access course and all schedules of this course. 
                            </p>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="danger" variant="flat" onPress={onClose}>
                                Cancel
                            </Button>
                            <Button className="bg-[#06574C] text-white" onPress={handleEnroll} isLoading={isLoading}>
                                Confirm Manual Enrollment
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
};

export default ManualEnrollmentModal;
