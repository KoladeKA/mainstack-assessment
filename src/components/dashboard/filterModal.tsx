// import { useState } from "react";
import { DatePicker } from "../ui/datePicker/datepicker";
import { ModalComp } from "../ui/modal";
import type { Option } from '../ui/multiselect/types';
import { MultiSelect } from "../ui/multiselect/multiselect";
import { useState } from "react";


interface FilterProps {
    closeModal: () => void;
    filterModal: boolean;
    startDate?: Date | null;
    endDate?: Date | null;
    typeValues?: string[];
    statusValues?: string[];
    changeFilterData?: (startDate: Date | null, endDate: Date | null, type: string[], status: string[]) => void;
    filterData?: () => void;
    clearFilterData?: () => void;
}
export default function DashboardFilterComp({ closeModal, filterModal, startDate, endDate, typeValues, statusValues, changeFilterData, filterData, clearFilterData }: FilterProps) {
    const [error, setError] = useState("")

    const timeframe = [
        "Today", "Last 7 days", "This Month", "Last 3 Months"
    ]
    const typeOptions: Option[] = [
        { value: 'withdrawal', label: 'Withdrawal' },
        { value: 'deposit', label: 'Deposit' },
        { value: 'get_tipped', label: 'Get Tipped' },
        { value: 'store_transaction', label: 'Store Transaction' },
        { value: 'chargebacks', label: 'Chargebacks' },
        { value: 'cashback', label: 'Cashback' },
        { value: 'refer_and_earn', label: 'Refer and Earn' },
    ];
    const statusOptions: Option[] = [
        { value: 'successful', label: 'Successful' },
        { value: 'failed', label: 'Failed' },
        { value: 'pending', label: 'Pending' },
    ];

    const handleStartDateChange = (date: Date | null): void => {
        changeFilterData?.(date, endDate || null, typeValues || [], statusValues || []);
        // setSelectedStartDate(date);
    };

    const handleEndDateChange = (date: Date | null): void => {
        changeFilterData?.(startDate || null, date, typeValues || [], statusValues || []);
        // setSelectedEndDate(date);
        console.log('Selected end date:', date);
    };

    const customFormat = (date: Date): string => {
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const handleFilter = () => {
        if(!startDate && !endDate && typeValues?.length === 0 && statusValues?.length === 0) return;
         if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
            setError('Start date cannot be greater than end date');
            return
        }
        filterData?.();
        closeModal();
    };
    const handleClearFilter = () => {
        clearFilterData?.();
        closeModal();
    };


    return (
        <div>
            <ModalComp isOpen={filterModal} title="Filter" justifyModal="justify-end" justifyTitle="justify-start" onClose={() => closeModal()} size={"max-w-md"}
                minHeight="min-h-[97vh]" maxHeight="max-h-[99vh]"
            >

                <div className="flex flex-col justify-between">
                    <div className="mt-5  min-h-[70vh]">
                        <div className="flex gap-2">
                            {timeframe?.map((val, index) => (
                                <button key={index} onClick={() => closeModal()} className="px-3 py-2 border border-gray-300 rounded-full text-[13px] font-medium ">
                                    {val}
                                </button>
                            ))}
                        </div>
                        <div className="text-start">
                            <h5 className="mt-5 text-sm font-medium">Date Range</h5>
                            <div className="mt-1 grid md:grid-cols-2 gap-2">
                                <div >
                                    <DatePicker
                                        value={startDate}
                                        onChange={handleStartDateChange}
                                        placeholder="Choose start date"
                                        minDate={new Date('2022-01-01')}
                                        maxDate={new Date().toISOString().split('T')[0]}
                                        format={customFormat}
                                        startOfWeek={1} // Monday as start of week
                                    />
                                    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
                                </div>
                                <div >
                                    <DatePicker
                                        className="w-full"
                                        alignPopup="right-0"
                                        value={endDate}
                                        onChange={handleEndDateChange}
                                        placeholder="Choose end date"
                                        minDate={new Date('2022-01-01')}
                                        maxDate={new Date().toISOString().split('T')[0]}
                                        format={customFormat}
                                        startOfWeek={1} // Monday as start of week
                                    />
                                    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
                                </div>
                            </div>
                        </div>
                        <div className="text-start">
                            <h5 className="mt-5 text-sm font-medium">Transaction Type</h5>
                            <div className="mt-1">
                                <MultiSelect
                                    className="w-full"
                                    options={typeOptions}
                                    selectedValues={typeValues || []}
                                    // onChange={setSelectedTypeValues}
                                    onChange={(e) => changeFilterData?.(startDate || null, endDate || null, e, statusValues || [])}
                                    placeholder="Select types"
                                // searchable={true}
                                // maxSelected={3}
                                />
                            </div>
                        </div>
                        <div className="text-start">
                            <h5 className="mt-5 text-sm font-medium">Transaction Status</h5>
                            <div className="mt-1">
                                <MultiSelect
                                    className="w-full"
                                    options={statusOptions}
                                    selectedValues={statusValues || []}
                                    onChange={(e) => changeFilterData?.(startDate || null, endDate || null, typeValues || [], e)}
                                    placeholder="Select status..."
                                // searchable={true}
                                // maxSelected={3}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="mt-10 grid grid-cols-2 gap-2">
                        <button className="px-4 py-2 border border-gray-300 rounded-full text-sm font-medium "
                            onClick={handleClearFilter}
                        >
                            Clear
                        </button>
                        <button className="px-4 py-2 bg-black text-white rounded-full text-sm font-medium disabled:opacity-20 "
                            onClick={handleFilter} disabled={!startDate && !endDate && typeValues?.length === 0 && statusValues?.length === 0}
                        >
                            Apply
                        </button>
                    </div>
                </div>

            </ModalComp>
        </div>
    )
}
