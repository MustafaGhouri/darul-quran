import React, { useMemo, useState } from "react";
import {
  Button,
  Input,
  Spinner,
  Textarea,
} from "@heroui/react";
import { Calendar, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import {
  useGetPublicAppointmentSlotsQuery,
  useSubmitAppointmentRequestMutation,
} from "../redux/api/appointments";
import { errorMessage, successMessage } from "../lib/toast.config";

const formatDayLabel = (dateStr) => {
  const date = new Date(`${dateStr}T12:00:00`);
  return {
    weekday: date.toLocaleDateString([], { weekday: "short" }).toUpperCase(),
    day: date.getDate(),
    month: date.toLocaleDateString([], { month: "short" }),
  };
};

const BookAppointment = () => {
  const { data, isLoading } = useGetPublicAppointmentSlotsQuery();
  const [submitRequest, { isLoading: submitting }] =
    useSubmitAppointmentRequestMutation();

  const slots = data?.slots || [];
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlotId, setSelectedSlotId] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const dates = useMemo(() => {
    const unique = [...new Set(slots.map((s) => s.date))];
    return unique.sort();
  }, [slots]);

  const timesForDate = useMemo(
    () => slots.filter((s) => s.date === selectedDate),
    [slots, selectedDate]
  );

  React.useEffect(() => {
    if (dates.length > 0 && !selectedDate) {
      setSelectedDate(dates[0]);
    }
  }, [dates, selectedDate]);

  React.useEffect(() => {
    setSelectedSlotId(null);
  }, [selectedDate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      errorMessage("Please enter your name and email");
      return;
    }
    if (!selectedSlotId) {
      errorMessage("Please select a date and time");
      return;
    }

    try {
      const res = await submitRequest({
        slotId: selectedSlotId,
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim() || undefined,
        message: message.trim() || undefined,
      }).unwrap();
      successMessage(res.message || "Appointment request submitted");
      setSubmitted(true);
    } catch (err) {
      errorMessage(err?.data?.message || "Failed to submit request");
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-t from-[#F1C2AC]/40 to-[#95C4BE]/40 p-4">
        <div className="bg-white rounded-2xl shadow-lg max-w-md w-full p-8 text-center">
          <CheckCircle2 size={48} className="text-[#06574C] mx-auto mb-4" />
          <h1 className="text-xl font-semibold text-[#06574C] mb-2">
            Request submitted
          </h1>
          <p className="text-gray-600 text-sm mb-6">
            Thank you! We received your appointment request and will be in touch soon.
          </p>
          <Button as={Link} to="/" className="bg-[#06574C] text-white" radius="full">
            Back to login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-t from-[#F1C2AC]/40 to-[#95C4BE]/40 p-4">
      <div className="bg-[#faf9f6] rounded-2xl shadow-xl max-w-lg w-full overflow-hidden">
        <div className="bg-[#06574C] px-6 py-5 text-white">
          <div className="flex items-center gap-3">
            <Calendar size={22} />
            <div>
              <h1 className="text-lg font-semibold">Book an Appointment</h1>
              <p className="text-xs text-white/80 mt-0.5">
                A friendly chat with our team · 20 minutes · online
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {isLoading ? (
            <div className="flex justify-center py-10">
              <Spinner color="success" />
            </div>
          ) : slots.length === 0 ? (
            <p className="text-center text-gray-500 py-8 text-sm">
              No appointment slots are available right now. Please check back later.
            </p>
          ) : (
            <>
              <div>
                <p className="text-sm font-medium text-[#06574C] mb-3">
                  Choose a day
                </p>
                <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                  {dates.map((date) => {
                    const { weekday, day, month } = formatDayLabel(date);
                    const active = selectedDate === date;
                    return (
                      <button
                        key={date}
                        type="button"
                        onClick={() => setSelectedDate(date)}
                        className={`shrink-0 w-[72px] rounded-xl border-2 py-3 text-center transition-colors ${
                          active
                            ? "border-[#06574C] bg-white"
                            : "border-gray-200 bg-white hover:border-[#06574C]/40"
                        }`}
                      >
                        <p className="text-[10px] text-gray-400">{weekday}</p>
                        <p className="text-xl font-bold text-[#06574C]">{day}</p>
                        <p className="text-[10px] text-gray-400">{month}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-[#06574C] mb-3">
                  Choose a time
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {timesForDate.map((slot) => (
                    <button
                      key={slot.id}
                      type="button"
                      onClick={() => setSelectedSlotId(slot.id)}
                      className={`rounded-xl border-2 py-2.5 text-sm font-medium transition-colors ${
                        selectedSlotId === slot.id
                          ? "border-[#06574C] bg-[#06574C] text-white"
                          : "border-gray-200 bg-white text-gray-700 hover:border-[#06574C]/40"
                      }`}
                    >
                      {slot.time}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          <div className="space-y-3 pt-2 border-t border-gray-200">
            <Input
              label="Your name"
              labelPlacement="outside"
              radius="sm"
              value={name}
              onChange={(e) => setName(e.target.value)}
              isRequired
            />
            <Input
              type="email"
              label="Email"
              labelPlacement="outside"
              radius="sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              isRequired
            />
            <Input
              type="tel"
              label="Phone (optional)"
              labelPlacement="outside"
              radius="sm"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <Textarea
              label="Message (optional)"
              labelPlacement="outside"
              radius="sm"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Anything you'd like us to know..."
            />
          </div>

          <Button
            type="submit"
            radius="full"
            className="w-full bg-linear-to-r from-[#C9A227] to-[#8B6914] text-white font-semibold"
            size="lg"
            isLoading={submitting}
            isDisabled={slots.length === 0}
          >
            Confirm appointment
          </Button>

          <p className="text-center text-xs text-gray-400">
            <Link to="/" className="text-[#06574C] hover:underline">
              Back to login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default BookAppointment;
