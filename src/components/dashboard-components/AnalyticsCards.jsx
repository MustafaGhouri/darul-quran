/**
 * AnalyticsCards Component
 *
 * Renders horizontal scrollable statistic cards on mobile
 * and a full-width responsive grid on larger screens.
 *
 * @param {Object} props
 * @param {Array<{
 *   title: string,
 *   value: string | number,
 *   icon: string,
 *   changeText: string,
 *   changeColor: string
 * }>} props.data - Array of card objects to display.
 *
 * @example
 * const cardsData = [
 *   {
 *     title: "Total Enrollments",
 *     value: "12,847",
 *     icon: "/icons/user-medal.png",
 *     changeText: "+12.5% from last month",
 *     changeColor: "text-[#38A100]",
 *   }
 * ];
 *
 * <AnalyticsCards data={cardsData} />
 */
const AnalyticsCards = ({ data = [] }) => {
    return (
        <div className="py-4 gap-5  overflow-x-auto grid sm:grid-cols-3">
            {data.map((item, index) => (
                <div
                    key={index}
                    className="bg-[#F1E0D9] sm:bg-white min-w-[15em] sm:min-w-0 flex-1 space-y-4 rounded-lg p-4"
                >
                    <h1 className="font-semibold text-[#333333]">{item.title}</h1>

                    <div className="flex items-center gap-2 justify-start">
                        <div className="rounded-full p-4 bg-[#95C4BE]/20">
                            <div className="">
                                {item.icon}
                            </div>
                        </div>
                        <div>
                            <p className="text-2xl font-semibold">{item.value}</p>
                            <p className={item.changeColor}>{item.changeText}</p>
                        </div>
                    </div>

                    
                </div>
            ))}
        </div>
    );
};

export default AnalyticsCards;
