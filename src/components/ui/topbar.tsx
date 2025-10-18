import { useEffect } from "react"
import logo from "../../assets/svg/logo.svg"
import { useUserStore } from "../../store/user/userStore"
import { Dropdown, DropdownItem } from "./dropdown"
import homeIcon from "../../assets/svg/home.svg"
import analyticsIcon from "../../assets/svg/analytics.svg"
import revenueIcon from "../../assets/svg/revenue.svg"
import crmIcon from "../../assets/svg/crm.svg"
import appsIcon from "../../assets/svg/apps.svg"
import notificationIcon from "../../assets/svg/notifications.svg"
import chatIcon from "../../assets/svg/chat.svg"
import menuIcon from "../../assets/svg/menu.svg"
export default function TopbarComp() {

    const { getUserInfo, userData, isLoading } = useUserStore()

    useEffect(() => {
        getUserInfo()
    }, [])

    const topbarNavData = [
        { title: "Home", icon: homeIcon, href: "#" },
        { title: "Analytics", icon: analyticsIcon, href: "#" },
        { title: "Revenue", icon: revenueIcon, href: "/" },
        { title: "CRM", icon: crmIcon, href: "#" },
        { title: "Apps", icon: appsIcon, href: "#" },
    ]
    const dropdownNavData = [
        { title: "Settings", icon: "", href: "#" },
        { title: "Purchase History", icon: "", href: "#" },
        { title: "Refer and Earn", icon: "", href: "#" },
        { title: "Integrations", icon: "", href: "#" },
        { title: "Report Bug", icon: "", href: "#" },
        { title: "Switch Account", icon: "", href: "#" },
        { title: "Sign Out", icon: "", href: "#" },
    ]

    return (
        <div className=" fixed top-0 left-2 right-2 md:left-5 md:right-5 bg-white  flex items-center px-5 py-4 justify-between z-40 rounded-[50px] drop-shadow-xl">
            {/* Logo Section */}
            <div className="">
                <a href="/">
                    <img src={logo} className="w-[30px]" alt="logo" />
                </a>
            </div>

            {/* center Section - Navigation */}
            <div className=" hidden md:flex items-center gap-8">
                <nav className="flex items-center gap-6">
                    {topbarNavData.map((val, i) => (
                        <a href={val?.href} key={i} className={`flex text-sm  font-medium text-gray-700 hover:text-gray-900 
                            ${val.title?.toLowerCase() === "revenue" ? "px-4 py-2 bg-black text-white rounded-full hover:bg-gray-800" : ""}
                        `}> 
                            <img src={val?.icon} className="w-[15px] me-2" alt={val?.icon} />
                            {val.title}
                        </a>
                    ))}
                </nav>
            </div>

            {/* Right Section - Icons */}
            <div className="flex items-center gap-4">
                <button className="p-2 hover:bg-gray-100 rounded-lg transition">
                    <img src={notificationIcon} className="w-[15px]" alt="notification icon" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition">
                    <img src={chatIcon} className="w-[15px]" alt="chat icon" />
                </button>

                <Dropdown align='right' minWidth="min-w-sm" maxWidth='max-w-lg'
                    trigger={
                        <div className="bg-gray-100 hover:bg-gray-200 flex p-1 rounded-3xl cursor-pointer">
                            <div className="w-6 h-6 bg-black text-white rounded-full flex items-center justify-center text-sm font-semibold">
                                {!isLoading && <> {`${userData?.first_name?.charAt(0)}${userData?.last_name?.charAt(0)}`} </>}
                            </div>
                            <button className="px-2 rounded-lg transition">
                                <img src={menuIcon} className="w-[20px]" alt="menu icon" />
                            </button>
                        </div>
                    }
                >
                    <div className='p-3'>
                        <div className='flex gap-2 items-center text-start'>
                            <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm font-semibold">
                                {!isLoading && <> {`${userData?.first_name?.charAt(0)}${userData?.last_name?.charAt(0)}`} </>}
                            </div>
                            <div>
                                <h5 className="text-sm font-medium" > {`${userData?.first_name}  ${userData?.last_name}`}</h5>
                                <p className="text-sm font-light">{userData?.email}</p>
                            </div>

                        </div>
                    </div>
                    <div className="md:hidden ">
                        {topbarNavData?.map((val, i) => (
                            <DropdownItem key={i }>
                                <div className={`w-full flex cursor-pointer`}>
                                    {/* <Info className='h-5 w-5 me-2 mt-1 self-start text-gray-500' /> */}
                                    <p className='font-medium text-md'>{val?.title}</p>
                                </div>
                            </DropdownItem>
                        ))}
                    </div>
                    {dropdownNavData?.map((val, i) => (
                        <DropdownItem key={i }>
                            <div className={`w-full flex cursor-pointer`}>
                                {/* <Info className='h-5 w-5 me-2 mt-1 self-start text-gray-500' /> */}
                                <p className='font-medium text-md'>{val?.title}</p>
                            </div>
                        </DropdownItem>
                    ))}
                </Dropdown>
            </div>
        </div>
    )
}
