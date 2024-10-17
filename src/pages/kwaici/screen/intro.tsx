import { Chrome, FileVideo2, NotepadText, ShieldCheck } from "lucide-react";
import Header from "../components/header";
import IntroCard from "../components/intro-card";
import BrowserCheckDrawer from "../components/browser-check-drawer";
import { useState } from "react";
import { cameraPermissionCheck } from "@/utils/kwaici-helper";
import PermissionFailedDrawer from "../components/permission-failed-drawer";
import BrowserNotSupportDrawer from "../components/browser-not-support-drawer";

interface IntroProps {
  onContinue: () => void;
}

type DrawerState = 'browser-check' | 'permission-error' | null;

export default function Intro({ onContinue } : IntroProps) {
  const [drawerState, setDrawerState] = useState<DrawerState>(null);

  const onStartRegistration = () => {
    setDrawerState('browser-check');
    cameraPermissionCheck()
    .then((res) => {
      if(res.status) {
        onContinue();
        return;
      }
      
      console.log('ok but error', res);
      setDrawerState('permission-error');
    })
    .catch(error => {
      console.log(error);
      // if(error.)
      setDrawerState('permission-error');
    });
  }

  return (
    <div className="flex flex-col min-h-screen md:min-h-full">
        <Header />
        <div className="mt-auto relative h-fit pb-4 px-2">
            <h2 className='section-title text-center mb-1 md:mb-2'>Registration</h2>
            <p className="text-center text-kwaici-paragraph leading-6">Let's get you set up quickly and securely. We'll guide you through a few steps to confirm your identity and complete your registration.</p>
            
            <div className="flex flex-col gap-2 mt-6">
                <IntroCard title="Browser Check" step={1} icon={<Chrome className="text-kwaici-black" />} state={drawerState === 'browser-check' ? 'loading' : null} />
                <IntroCard title="Script Review" step={2} icon={<NotepadText className="text-kwaici-black-600" />} disabled />
                <IntroCard title="Recording" step={3} icon={<FileVideo2 className="text-kwaici-black-600" />} disabled />
                <IntroCard title="Registration Result" step={4} icon={<ShieldCheck className="text-kwaici-black-600" />} disabled />
            </div>

            <div className="mt-8 md:mt-[40px] w-fit mx-auto flex flex-col items-center gap-3 pb-5">
              <p className="text-kwaici-paragraph text-center max-w-[80%]">The entire process should take just a few minutes. Ready to begin?</p>
              <button className="bg-kwaici-primary rounded-lg py-[14px] px-[25px] text-sm text-white font-medium w-fit" onClick={onStartRegistration}>Start Registration</button>
            </div>
        </div>

        { drawerState === 'browser-check' ? <BrowserCheckDrawer /> : null }

        <BrowserCheckDrawer />
        {/* <PermissionFailedDrawer 
          onClose={() => {}}
          description="We couldn't access your camera and microphone. Please enable permissions to continue"
        /> */}

        {/* <BrowserNotSupportDrawer onClose={() => {}} /> */}
    </div>
  )
}
