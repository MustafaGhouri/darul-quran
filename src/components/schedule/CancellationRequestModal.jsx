import { useState, useEffect } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Textarea, RadioGroup, Radio, CheckboxGroup, Checkbox } from "@heroui/react";

export const CancellationRequestModal = ({
    isOpen,
    onClose,
    schedule,
    onSubmit,
    isSubmitting
}) => {
    const [cancellationType, setCancellationType] = useState("whole"); // "whole" or "specific"
    const [selectedDates, setSelectedDates] = useState([]);
    const [reason, setReason] = useState("");
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (isOpen && schedule) {
            setCancellationType("whole");
            setSelectedDates([]);
            setReason("");
            setErrors({});
        }
    }, [isOpen, schedule]);

    const validateForm = () => {
        const newErrors = {};

        if (cancellationType === "specific" && selectedDates.length === 0) {
            newErrors.dates = "Please select at least one date";
        }

        if (!reason || reason.trim().length < 5) {
            newErrors.reason = "Please provide a reason (at least 5 characters)";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (!validateForm()) return;

        onSubmit({
            scheduleId: schedule.id,
            cancellationType,
            cancellationDates: cancellationType === "specific" ? selectedDates : null,
            reason
        });
    };

    const availableDates = schedule?.scheduleDates || [];

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            size="lg"
            scrollBehavior="inside"
            classNames={{
                base: "rounded-xl",
                header: "border-b border-gray-100 pb-4",
                body: "py-6",
                footer: "border-t border-gray-100 pt-4"
            }}
        >
            <ModalContent>
                <ModalHeader className="flex flex-col gap-1">
                    <h2 className="text-xl font-semibold text-[#8B0000]">Request Cancellation</h2>
                    <p className="text-sm text-gray-500 font-normal">
                        Submit a request to cancel your scheduled classes
                    </p>
                </ModalHeader>

                <ModalBody>
                    {schedule && (
                        <div className="bg-[#8B0000]/10 rounded-lg p-4 mb-4">
                            <h3 className="font-semibold text-[#8B0000] mb-2">Current Schedule</h3>
                            <div className="space-y-1 text-sm">
                                <p className="text-gray-700"><strong>Class:</strong> {schedule.title}</p>
                                <p className="text-gray-700"><strong>Type:</strong> {schedule.scheduleType}</p>
                            </div>
                        </div>
                    )}

                    <RadioGroup
                        label="Cancellation Options"
                        value={cancellationType}
                        onValueChange={setCancellationType}
                        className="mb-4"
                    >
                        <Radio value="whole">Cancel Whole Schedule</Radio>
                        {schedule?.scheduleType !== "once" && (
                             <Radio value="specific">Cancel Specific Dates</Radio>
                        )}
                    </RadioGroup>

                    {cancellationType === "specific" && availableDates.length > 0 && (
                        <div className="mb-4">
                            <label className="text-sm font-medium text-gray-700 mb-2 block">
                                Select Dates to Cancel:
                            </label>
                            <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-lg p-3">
                                <CheckboxGroup
                                    value={selectedDates}
                                    onValueChange={setSelectedDates}
                                    isInvalid={!!errors.dates}
                                    errorMessage={errors.dates}
                                >
                                    {availableDates.map((date) => (
                                        <Checkbox key={date} value={date}>
                                            {new Date(date).toLocaleDateString()}
                                        </Checkbox>
                                    ))}
                                </CheckboxGroup>
                            </div>
                        </div>
                    )}

                    <Textarea
                        label="Reason for Cancellation"
                        placeholder="Please explain why you need to cancel..."
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        isInvalid={!!errors.reason}
                        errorMessage={errors.reason}
                        minRows={3}
                        required
                        classNames={{
                            label: "text-sm font-medium text-gray-700"
                        }}
                    />

                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mt-4">
                        <p className="text-sm text-amber-800">
                            <strong>ℹ Note:</strong> Your request will be sent to the teacher for review.
                        </p>
                    </div>
                </ModalBody>

                <ModalFooter className="flex gap-2">
                    <Button
                        variant="flat"
                        onPress={onClose}
                        isDisabled={isSubmitting}
                        className="text-gray-700"
                    >
                        Close
                    </Button>
                    <Button
                        color="danger"
                        onPress={handleSubmit}
                        isLoading={isSubmitting}
                        className="bg-[#8B0000] text-white"
                    >
                        {isSubmitting ? "Submitting..." : "Submit Cancellation Request"}
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default CancellationRequestModal;
