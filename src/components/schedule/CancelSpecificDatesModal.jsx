import { useEffect, useMemo, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Checkbox,
  Textarea,
} from "@heroui/react";
import { useCancelSpecificDatesMutation } from "../../redux/api/schedules";
import {
  formatTime12Hour,
  getScheduleStart,
  getScheduleEnd,
} from "../../utils/scheduleHelpers";
import { dateFormatter } from "../../lib/utils";
import { errorMessage, successMessage } from "../../lib/toast.config";

const normalizeDateKey = (date) => {
  if (!date) return "";
  const value = String(date);
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  if (value.includes("T")) return value.split("T")[0];
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? value : parsed.toISOString().split("T")[0];
};

const getTodayStr = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
};

const CancelSpecificDatesModal = ({ schedule, isOpen, onClose, onSuccess }) => {
  const [selectedDates, setSelectedDates] = useState(new Set());
  const [reason, setReason] = useState("");
  const [cancelSpecificDates, { isLoading }] = useCancelSpecificDatesMutation();

  useEffect(() => {
    if (!isOpen) {
      setSelectedDates(new Set());
      setReason("");
    }
  }, [isOpen]);

  const dateOptions = useMemo(() => {
    if (!schedule) return [];

    const todayStr = getTodayStr();
    const cancelSet = new Set(
      (schedule.cancelSpecific || schedule.cancel_specific || []).map(normalizeDateKey),
    );
    const occurrences = schedule.scheduleOccurrences || [];
    const seen = new Set();

    return occurrences
      .filter((occ) => {
        const dateKey = normalizeDateKey(occ.date);
        const sourceKey = normalizeDateKey(occ.sourceDate || occ.source_date);
        return dateKey >= todayStr || sourceKey >= todayStr;
      })
      .map((occ) => {
        const dateKey = normalizeDateKey(occ.date);
        const sourceKey = normalizeDateKey(occ.sourceDate || occ.source_date);
        const alreadyCancelled =
          cancelSet.has(dateKey) || (sourceKey && cancelSet.has(sourceKey));
        const startTime =
          occ.startTime || occ.start_time || formatTime12Hour(getScheduleStart(schedule, dateKey));
        const endTime =
          occ.endTime || occ.end_time || formatTime12Hour(getScheduleEnd(schedule, dateKey));

        return {
          dateKey,
          alreadyCancelled,
          label: `${dateFormatter(dateKey)} (${formatTime12Hour(startTime)} - ${formatTime12Hour(endTime)})`,
        };
      })
      .filter((option) => {
        if (seen.has(option.dateKey)) return false;
        seen.add(option.dateKey);
        return true;
      });
  }, [schedule]);

  const toggleDate = (dateKey, alreadyCancelled) => {
    if (alreadyCancelled) return;
    setSelectedDates((prev) => {
      const next = new Set(prev);
      if (next.has(dateKey)) next.delete(dateKey);
      else next.add(dateKey);
      return next;
    });
  };

  const handleSubmit = async () => {
    const dates = [...selectedDates].filter((dateKey) => {
      const option = dateOptions.find((o) => o.dateKey === dateKey);
      return option && !option.alreadyCancelled;
    });

    if (!dates.length) {
      errorMessage("Select at least one date to cancel");
      return;
    }

    try {
      await cancelSpecificDates({
        id: schedule.id,
        dates,
        reason: reason.trim() || undefined,
      }).unwrap();
      successMessage("Selected dates cancelled successfully");
      onSuccess?.();
      onClose();
    } catch (error) {
      errorMessage(error?.data?.message || "Failed to cancel dates");
    }
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={(open) => !open && onClose()} size="lg">
      <ModalContent>
        <ModalHeader className="text-[#06574C]">
          Cancel Specific Dates
          {schedule?.title ? `: ${schedule.title}` : ""}
        </ModalHeader>
        <ModalBody>
          {dateOptions.length === 0 ? (
            <p className="text-gray-500 text-sm">No upcoming dates available to cancel.</p>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-gray-600">
                Select the class date(s) to cancel. Enrolled students will be notified by email.
              </p>
              <div className="max-h-64 overflow-y-auto space-y-2 border rounded-lg p-3">
                {dateOptions.map((option) => (
                  <Checkbox
                    key={option.dateKey}
                    isSelected={option.alreadyCancelled || selectedDates.has(option.dateKey)}
                    isDisabled={option.alreadyCancelled}
                    onValueChange={() => toggleDate(option.dateKey, option.alreadyCancelled)}
                  >
                    <span className={option.alreadyCancelled ? "text-gray-400" : ""}>
                      {option.label}
                      {option.alreadyCancelled ? " (Already cancelled)" : ""}
                    </span>
                  </Checkbox>
                ))}
              </div>
              <Textarea
                label="Reason (optional)"
                placeholder="Optional note for students"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                variant="bordered"
                minRows={2}
              />
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <Button variant="flat" onPress={onClose} isDisabled={isLoading}>
            Close
          </Button>
          <Button
            color="danger"
            onPress={handleSubmit}
            isLoading={isLoading}
            isDisabled={!dateOptions.length}
          >
            Cancel Selected Dates
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CancelSpecificDatesModal;
