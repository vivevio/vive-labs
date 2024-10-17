import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
} from "@/components/ui/drawer";
import { CameraOff } from "lucide-react";
import { Button } from "@/components/ui/button"

interface PermissionFailedDrawerProps {
    description: string;
    onClose: () => void;
}

export default function PermissionFailedDrawer({ description='', onClose } : PermissionFailedDrawerProps) {
  return (
    <Drawer open={true} >
        <DrawerContent className="outline-none">
            <DrawerHeader>
                <div className="bg-red-50 mt-2 rounded-[30px] mx-auto mb-[20px] size-[70px] flex items-center justify-center">
                    <CameraOff className="text-kwaici-red" size={32} />
                </div>
                <DrawerTitle>Camera Permission Failed</DrawerTitle>
                <DrawerDescription>{description}</DrawerDescription>
            </DrawerHeader>
            <DrawerFooter>
                <div className="mx-auto w-1/2">
                    <Button variant={'default'} className="w-full" onClick={onClose}>Close</Button>
                </div>
            </DrawerFooter>
        </DrawerContent>
    </Drawer>
  )
}
