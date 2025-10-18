
import panelAIcon from "../../assets/svg/panelA.svg"
import panelBIcon from "../../assets/svg/panelB.svg"
import panelCIcon from "../../assets/svg/panelC.svg"
import panelDIcon from "../../assets/svg/panelD.svg"
import { TooltipComp } from "./tooltip"


export default function SidePanelComp() {

    const panelItems = [
        {title: "Link in Bio", icon: panelAIcon},
        {title: "Store", icon: panelBIcon},
        {title: "Media", icon: panelCIcon},
        {title: "Invoicing", icon: panelDIcon},
    ]
    return (
        <div className=" fixed left-5 h-[90vh] hidden md:flex items-center justify-center z-40  drop-shadow-md">

            <div className=" bg-white px-1 py-3 rounded-[50px] ">
                <nav className=" flex flex-col items-center justify-center gap-3">
                    {panelItems?.map((item, index) => (
                        <TooltipComp key={index} content={item?.title} position="right" 
                            className="relative p-2 rounded-full grayscale hover:grayscale-0 hover:bg-gray-200 transition ">
                            <a href="#"  className=" flex self-center">
                                <img src={item?.icon} className="w-[20px]" alt={`panel icon ${index + 1}`} />
                            </a>
                        </TooltipComp>
                    ))}
                    {/* <a href="#" className="text-sm font-medium text-gray-700 hover:text-gray-900">
                        H
                    </a>
                    <a href="#" className="text-sm font-medium text-gray-700 hover:text-gray-900">
                        A
                    </a>
                    <button className="px-4 py-2 bg-black text-white rounded-full text-sm font-medium hover:bg-gray-800">
                        R
                    </button>
                    <a href="#" className="text-sm font-medium text-gray-700 hover:text-gray-900">
                        C
                    </a>
                    <a href="#" className="text-sm font-medium text-gray-700 hover:text-gray-900">
                        A
                    </a> */}
                </nav>
            </div>
        </div>
    )
}
