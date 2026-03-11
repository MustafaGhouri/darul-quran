/**
 * WhatsApp-style date label in the middle of the chat (sticky when scrolling).
 */
export default function DateSeparator({ label }) {
  return (
    <div
      className="flex justify-center py-0 sticky top-2"
    >
      <div className="bg-[#bcd3cd]  rounded-full max-w-[120px] mx-auto w-full flex justify-center pt-0">

        <span className="px-3 py-1 rounded-full bg-[#bcd3cd] text-xs font-medium text-gray-600">
          {label}
        </span>
      </div>
    </div>
  );
}
