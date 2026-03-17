import { useEffect, useState } from "react";
import { parseInterval } from "../../../lib/utils";
import { Tooltip } from "@heroui/react";
import { InfoIcon } from "lucide-react";
import { successMessage } from "../../../lib/toast.config";

/**
 * @param {Object} props
 * @param {String} props.initialValue
 * @param {(intervalValue: String)=>void} props.onUpdate
 * @param {String} props.label
 * @param {import("react").JSX.Element?} props.toolTipContent
 * @param {Number} props.inputWidth
 * @param {String} props.className
 * @param {String[]} props.units
 * @param {Boolean} props.releasedImmediately
 */
const DEFAULT_UNITS = ["hour", "day", "month", 'year'];

/**
 * @param {Object} props
 * @param {String} props.initialValue
 * @param {(intervalValue: String)=>void} props.onUpdate
 * @param {String} props.label
 * @param {import("react").JSX.Element?} props.toolTipContent
 * @param {Number} props.inputWidth
 * @param {String} props.className
 * @param {String[]} props.units
 * @param {Boolean} props.releasedImmediately
 */
export const IntervalInput = ({
    initialValue,
    onUpdate,
    label = "Released Interval",
    toolTipContent,
    inputWidth = 80,
    className = 'flex flex-col sm:flex-row sm:items-center gap-2',
    units = DEFAULT_UNITS,
    releasedImmediately = true,
}) => {
    const [initialNumber, setInitialNumber] = useState({ number: 0, unit: '' });
    const [numberValue, setNumberValue] = useState(0);
    const [unitValue, setUnitValue] = useState(releasedImmediately ? "released_immediately" : units[0]);

    useEffect(() => {
        if (initialValue) {
            const { number, unit } = parseInterval(initialValue);
            // Only update if it's different from current state to avoid resetting user input
            if (number !== numberValue || unit !== unitValue) {
                setInitialNumber({ number, unit });
                setNumberValue(number || 0);
                setUnitValue(unit || (releasedImmediately ? "released_immediately" : units[0]));
            }
        }
    }, [initialValue]);
    
    const handleUpdate = () => {
        if (unitValue === "released_immediately") {
            onUpdate("null");
            return;
        }
        if (!numberValue || !unitValue) return;
        if ((numberValue === initialNumber.number) && (unitValue === initialNumber.unit)) return;
        
        const unit = numberValue > 1 ? `${unitValue}s` : unitValue;
        const interval = `${numberValue} ${unit}`;
        onUpdate(interval);
    };

    return (
        <div className={className}>

            <label htmlFor="period_unit" className="text-[16px] flex items-center gap-2 font-normal text-gray-700 sms-36">
                {label}
                <Tooltip color="warning" isDisabled={!toolTipContent} content={toolTipContent} >
                    {toolTipContent && <InfoIcon className="cursor-pointer" size={'1rem'} />}
                </Tooltip>
            </label>


            <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 flex-1">
                <input
                    type="number"
                    style={{ width: `${inputWidth}px` }}
                    className="p-2 border disabled:opacity-45 disabled:cursor-not-allowed border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#406c65] focus:border-[#406c65] transition-colors text-sm"
                    value={numberValue}
                    min={1}
                    placeholder="Period Value"
                    title="Period Value"
                    max={unitValue === "hour" ? 24 : 31}
                    onChange={(e) => setNumberValue(Number(e.target.value))}
                    onBlur={handleUpdate}
                />

                <select
                    className="p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#406c65] focus:border-[#406c65] transition-colors"
                    value={unitValue}
                    id="period_unit"
                    placeholder="Period Unit Type"
                    title="Period Unit Type"
                    onChange={(e) => {
                        setUnitValue(e.target.value);
                    }}
                    onBlur={handleUpdate}
                >
                    {units.map((unit) => (
                        <option key={unit} value={unit}>
                            {unit}(s)
                        </option>
                    ))}
                    {releasedImmediately && <option className="capitalize" value={'released_immediately'}>
                        Released immediately
                    </option>}
                </select>
            </div>
        </div>

    );
};