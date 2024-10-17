import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
} from "@/components/ui/drawer";
import { Chrome, CircleOff } from "lucide-react";
import { Button } from "@/components/ui/button"

interface BrowserNotSupportDrawerProps {
    onClose: () => void;
}

export default function BrowserNotSupportDrawer({ onClose } : BrowserNotSupportDrawerProps) {
  return (
    <Drawer open={true} >
        <DrawerContent className="outline-none">
            <DrawerHeader>
                <div className="bg-red-50 mt-2 rounded-[30px] mx-auto mb-[20px] size-[70px] flex items-center justify-center">
                    <CircleOff className="text-kwaici-red" size={32} />
                </div>
                <DrawerTitle>Browser Not Supported</DrawerTitle>
                <DrawerDescription>
                    {`This browser doesn't support camera and microphone access. You can use the following browser:`}
                    <div className="w-full mt-5">
                        <button 
                            className="relative rounded-lg px-[14px] py-[20px] shadow-green-50 shadow-md flex items-center w-full border-green-100 border bg-green-50">
                            <Chrome className="text-kwaici-green" />
                            <div className="ml-3 flex flex-col items-start">
                                <h3 className="font-semibold -mt-[4px] text-kwaici-black">Chrome Browser</h3>
                                <p className="text-kwaici-paragraph text-sm">Open or Install Chrome Browser</p>
                                {/* <span className="text-kwaici-black-700 text-sm">Step {step}</span> */}
                            </div>
                        </button>
                    </div>
                </DrawerDescription>
            </DrawerHeader>
            <DrawerFooter>
                {/* <div className="mx-auto w-1/2">
                    <Button variant={'default'} className="w-full" onClick={onClose}>Close</Button>
                </div> */}
            </DrawerFooter>
        </DrawerContent>
    </Drawer>
  )
}
