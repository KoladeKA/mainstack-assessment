import { useEffect, useRef } from "react"
import closeIcon from "../../assets/svg/close.svg"
// import { X } from "lucide-react"

interface ModalProps {
    isOpen: boolean
    onClose?: null| (() => void)
    title?: string
    children: React.ReactNode
    size?:string
    justifyModal?:string
    justifyTitle?:string
    minHeight?:string
    maxHeight?:string
}

export function ModalComp({ isOpen, onClose, title, children, size, justifyModal, justifyTitle, minHeight, maxHeight }: ModalProps) {
    const overlayRef = useRef<HTMLDivElement>(null)
    const modalRef = useRef<HTMLDivElement>(null)

    // Handle ESC key press
    // useEffect(() => {
    //     const handleKeyDown = (e: KeyboardEvent) => {
    //         if (e.key === "Escape" && isOpen) {
    //             onClose()
    //         }
    //     }

    //     window.addEventListener("keydown", handleKeyDown)
    //     return () => window.removeEventListener("keydown", handleKeyDown)
    // }, [isOpen, onClose])

    // Handle click outside
    useEffect(() => {
        const handleOutsideClick = (e: MouseEvent) => {
            if (
                overlayRef.current &&
                modalRef.current &&
                overlayRef.current.contains(e.target as Node) &&
                !modalRef.current.contains(e.target as Node)
            ) { 
                onClose?.()
            }
        }

        if (isOpen) {
            document.addEventListener("mousedown", handleOutsideClick)
            // Prevent scrolling when modal is open
            document.body.style.overflow = "hidden"
        }

        return () => {
            document.removeEventListener("mousedown", handleOutsideClick)
            document.body.style.overflow = ""
        }
    }, [isOpen, onClose])

    // Focus trap
    useEffect(() => {
        if (!isOpen) return

        const modalElement = modalRef.current
        if (!modalElement) return

        const focusableElements = modalElement.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        )

        const firstElement = focusableElements[0] as HTMLElement
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement

        const handleTabKey = (e: KeyboardEvent) => {
            if (e.key === "Tab") {
                if (e.shiftKey && document.activeElement === firstElement) {
                    e.preventDefault()
                    lastElement?.focus()
                } else if (!e.shiftKey && document.activeElement === lastElement) {
                    e.preventDefault()
                    firstElement?.focus()
                }
            }
        }

        modalElement.addEventListener("keydown", handleTabKey)
        firstElement?.focus()

        return () => {
            modalElement.removeEventListener("keydown", handleTabKey)
        }
    }, [isOpen])

    if (!isOpen) return null

    return(
        <div
            className={`fixed inset-0 z-50 flex items-center ${justifyModal || "justify-center"} bg-gray-700/50 p-3`}
            role="dialog"
            aria-modal="true"
            ref={overlayRef}
        >
            <div
                ref={modalRef}
                className={` bg-white relative ${maxHeight || "max-h-[90vh]"} ${minHeight} w-full ${size || "max-w-md"} overflow-auto rounded-xl bg-background py-6 px-5 md:px-10 shadow-lg `}
            >
                <div className={`flex items-center ${justifyTitle || "justify-center"} `}>

                    {title && <h2 className="text-md font-semibold">{title}</h2>}

                    {onClose &&
                        <button onClick={onClose} aria-label="Close modal"
                            className={` hover:bg-[#F8F8FA] text-[#EF4444] p-2 rounded-full absolute right-4 top-5 `}
                        >
                            <img src={closeIcon} className="w-[15px] me-2" alt="Close icon" />
                            {/* <X className="h-5 w-5" /> */}
                            {/* <span className="sr-only">Close</span> */}
                        </button>
                    }
                </div>
                <div className="mt-4">{children}</div>
            </div>
        </div>
    )
}

