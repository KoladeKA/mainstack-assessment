// import { MoreVertical, Download } from "lucide-react"

import { useEffect, useState } from "react"
import { useTransactionsStore } from "../../store/transactions/useTransactionsStore"
import { useWalletStore } from "../../store/wallet/walletStore"
import { localeDigitSeparator } from "../../components/utils"
import DashboardFilterComp from "../../components/dashboard/filterModal"
import infoIcon from "../../assets/svg/info.svg"
import downloadIcon from "../../assets/svg/download.svg"
import arrowDownIcon from "../../assets/svg/arrowDown.svg"
import inflowIcon from "../../assets/svg/call_received.svg"
import outflowIcon from "../../assets/svg/call_made.svg"
import emptyStateIcon from "../../assets/svg/empty_state.svg"
import { format } from "date-fns"
import { DashboardGraph } from "../../components/dashboard/graph"

export function DashboardPage() {
    const [selectedStartDate, setSelectedStartDate] = useState<Date | null>(null);
    const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(null);
    const [selectedTypeValues, setSelectedTypeValues] = useState<string[]>([]);
    const [selectedStatusValues, setSelectedStatusValues] = useState<string[]>([]);
    const [filteredTransactionData, setFilteredTransactionData] = useState<ITransaction[]>([]);
    const [filterModal, setFilterModal] = useState(false)


    const {getAllTransaction, isLoading, transactionData} = useTransactionsStore()
    const {getWalletInfo, walletData} = useWalletStore()

    useEffect(() => {
        getAllTransaction()
        getWalletInfo()
    }, [])
    useEffect(() => {
        handleTransactionFilter()
    }, [transactionData])

    interface ITransaction {
        amount: number,
        metadata: {
            name: string,
            type: string,
            email: string,
            quantity: number,
            country: string,
            product_name: string
        },
        payment_reference: string,
        status: string,
        type: string,
        date: string
    }

    const changeFilterData = (startDate:Date | null, endDate:Date | null, type:string[], status:string[]) => {
        setSelectedStartDate(startDate);
        setSelectedEndDate(endDate);
        setSelectedTypeValues(type);
        setSelectedStatusValues(status);
    }

    const handleTransactionFilter = () => {
        const filtered = transactionData?.filter((val:ITransaction) => {
            return (
                (!selectedStartDate || new Date(val.date) >= selectedStartDate) &&
                (!selectedEndDate || new Date(val.date) <= selectedEndDate) &&
                (selectedTypeValues.length === 0 || selectedTypeValues.includes(val.type)) &&
                (selectedStatusValues.length === 0 || selectedStatusValues.includes(val.status))
            );
        });
        setFilteredTransactionData(filtered);
    };

    const getFilterCount = () => {
        let count: number = 0;

        if (selectedStartDate || selectedEndDate) {
            count = count + 1;
        }

        if (selectedTypeValues && selectedTypeValues.length > 0) {
            count = count + 1;
        }

        if (selectedStatusValues && selectedStatusValues.length > 0) {
            count = count + 1;
        }

        return count;
    }

    const handleClearFilter = () => {
        changeFilterData(null, null, [], []);
        getAllTransaction()
    }

    return (
        <div className="md:p-8">
            {filterModal && 
                <DashboardFilterComp filterModal={filterModal} closeModal={() => setFilterModal(false)} filterData={handleTransactionFilter} changeFilterData={changeFilterData} 
                    startDate={selectedStartDate} endDate={selectedEndDate} typeValues={selectedTypeValues} statusValues={selectedStatusValues}
                />
            }

            <div className="grid md:grid-cols-3 gap-20 mb-8">
                <div className="md:col-span-2">
                    <div className="flex flex-col md:flex-row gap-4 text-start">
                        <div>
                            <p className="font-light text-sm text-gray-500">Available Balance</p>
                            <h3 className="text-xl font-bold text-gray-900" >USD {localeDigitSeparator(walletData?.balance)}</h3>
                        </div>
                        <button className="bg-black font-light text-white rounded-full px-10 py-2 text-sm">Withdraw</button>
                    </div>
                    {/* Chart Section */}
                    {/* <div className="bg-white my-8">
                        <div className="h-50 flex items-center justify-center text-gray-400">
                            <svg viewBox="0 0 800 300" className="w-full h-full">
                                <path d="M 100 200 Q 200 100 300 150 T 500 100 T 700 200" stroke="#ff6b35" strokeWidth="2" fill="none" />
                            </svg>
                        </div>
                        <div className="flex justify-between text-sm text-gray-400 mt-2 border-t border-t-gray-400 pt-2">
                            <span>Apr 1, 2022</span>
                            <span>Apr 30, 2022</span>
                        </div>
                    </div> */}
                    <div className="my-10">
                        {!isLoading && <DashboardGraph graphData={filteredTransactionData} />}
                    </div>
                </div>
                {/* Stats Section */}
                <div className="grid grid-cols-1 gap-6 mb-8">
                    <div className="bg-white flex justify-between items-start text-start gap-4">
                        <div>
                            <p className="font-light text-sm text-gray-500">Ledger Balance</p>
                            <h3 className="text-xl font-bold text-gray-900" >USD {localeDigitSeparator(walletData?.ledger_balance)}</h3>
                        </div>
                        <img src={infoIcon} className="w-[20px] mt-2" alt="info icon" />
                    </div>
                    <div className="bg-white flex justify-between items-start text-start gap-4">
                        <div>
                            <p className="font-light text-sm text-gray-500">Total Payout</p>
                            <h3 className="text-xl font-bold text-gray-900" >USD {localeDigitSeparator(walletData?.total_payout)}</h3>
                        </div>
                        <img src={infoIcon} className="w-[20px] mt-2" alt="info icon" />
                    </div>
                    <div className="bg-white flex justify-between items-start text-start gap-4">
                        <div>
                            <p className="font-light text-sm text-gray-500">Total Revenue</p>
                            <h3 className="text-xl font-bold text-gray-900" >USD {localeDigitSeparator(walletData?.total_revenue)}</h3>
                        </div>
                        <img src={infoIcon} className="w-[20px] mt-2" alt="info icon" />
                    </div>
                    <div className="bg-white flex justify-between items-start text-start gap-4">
                        <div>
                            <p className="font-light text-sm text-gray-500">Pending Payout</p>
                            <h3 className="text-xl font-bold text-gray-900" >USD {localeDigitSeparator(walletData?.pending_payout)}</h3>
                        </div>
                        <img src={infoIcon} className="w-[20px] mt-2" alt="info icon" />
                    </div>
                </div>

            </div>

            {/* Transactions Section */}
            <div className="bg-white">
                <div className="gap-4 flex flex-col md:flex-row justify-around md:justify-between md:items-center mb-5 pb-5  text-start  border-b border-gray-200">
                    <div>
                        <h3 className="text-lg font-bold text-gray-900">{filteredTransactionData?.length} Transactions</h3>
                        <p className="text-sm text-gray-600">Your transactions for the last 7 days</p>
                    </div>
                    <div className="flex gap-4">
                        <button className="cursor-pointer px-4 py-2 bg-gray-200 rounded-3xl text-sm font-medium hover:bg-gray-100 flex items-center gap-2"
                            onClick={()=>setFilterModal(true)}
                        >
                            Filter
                            {getFilterCount() > 0 && ( <span className="text-white bg-black h-5 w-5 rounded-full">{getFilterCount()}</span> )}
                            <img src={arrowDownIcon} className="w-[12px]" alt="arrow down icon" />
                        </button>
                        <button className="cursor-pointer px-4 py-2 bg-gray-200 rounded-3xl text-sm font-medium hover:bg-gray-50 flex items-center gap-2">
                            Export list
                            <img src={downloadIcon} className="w-[12px]" alt="download icon" />
                        </button>
                    </div>
                </div>

                {/* Transaction List */}

                {!isLoading &&
                    <div className="space-y-4">
                        {filteredTransactionData?.map((transaction:ITransaction, idx:number) => (
                            <div key={idx} className="flex items-center justify-between py-4 border-b border-gray-100 last:border-b-0">
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center 
                                        ${transaction?.type?.toLowerCase() === "deposit" ? "bg-[#E3FCF2]" : "bg-[#F9E3E0]" }`
                                    }>
                                        <span
                                            className={`text-lg ${transaction?.type?.toLowerCase() === "deposit" ? "text-[#075132]" : "text-[#961100]"}`}
                                        >
                                            {transaction?.type?.toLowerCase() === "deposit" && <img src={inflowIcon} className="w-[12px]" alt="inflow icon" />}
                                            {transaction?.type?.toLowerCase() === "withdrawal" && <img src={outflowIcon} className="w-[12px]" alt="outflow icon" />}
                                        </span>
                                    </div>
                                    {transaction?.type?.toLowerCase() === "deposit" &&
                                        <div className="text-start">
                                            <p className="font-medium text-gray-900">
                                                <>{transaction?.metadata?.product_name || transaction?.metadata?.type || "--"}</>
                                                
                                            </p>
                                            <p className="text-sm text-gray-600">{transaction?.metadata?.name || "--"}</p>
                                        </div>
                                    }
                                    {transaction?.type?.toLowerCase() === "withdrawal" &&
                                        <div className="text-start">
                                            <p className="font-medium text-gray-900">Cash withdrawal</p>
                                            <p className={`text-sm text-gray-600 
                                                ${transaction?.status === "successful" ? "text-green-600" : transaction?.status === "pending" ? "text-amber-400" : "text-orange-600"}`}
                                            >
                                                {transaction?.status}
                                            </p>
                                        </div>
                                    }
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-gray-900">USD {transaction?.amount || "0.00"}</p>
                                    <p className="text-sm text-gray-600">{transaction?.date ? format(transaction?.date, "PP") : "--"}</p>
                                </div>
                            </div>
                        ))}

                        {filteredTransactionData?.length <1 &&
                            <div className="max-w-100 mx-auto text-gray-700 text-sm  mt-5">
                                <img src={emptyStateIcon} className="w-[50px] mb-4 mx-auto" alt="info icon" />
                                <h5 className="font-bold">No matching transaction found for the selected filter</h5>
                                <p className="font-light">Change your filters to see more results, or add a new product.</p>
                                <button className=" mt-4 px-4 py-2 cursor-pointer bg-gray-200 rounded-3xl text-sm font-medium hover:bg-gray-100" 
                                    onClick={handleClearFilter}
                                >
                                    Clear Filter
                                </button>
                            </div>
                        }

                    </div>
                }
            </div>
        </div>
    )
}
