import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
} from "@/components/ui/drawer";
import { Cctv } from "lucide-react";

export default function BrowserCheckDrawer() {

    return (
        <Drawer open={true}>
            <DrawerContent data-vaul-no-drag showHandle={false}>
                <DrawerHeader>
                    <div className="bg-blue-50 mt-2 rounded-[30px] mx-auto mb-[20px] size-[70px] flex items-center justify-center">
                        <Cctv className="text-kwaici-primary" size={32} />
                    </div>
                    <DrawerTitle>Checking Camera Permission</DrawerTitle>
                    <DrawerDescription>Please allow camera and microphone permissions. The system requires access to both for video and audio recording.</DrawerDescription>
                </DrawerHeader>
                <DrawerFooter>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    )
}
