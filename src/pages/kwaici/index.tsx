import { useState } from 'react';
import Intro from './screen/intro';
import ScriptReview from './screen/script-review';

type ActiveScreen = 'intro' | 'script-review' | 'video-recording' | 'result';
export default function KwaiciIndex() {

  const [activeScreen, setActiveScreen] = useState<ActiveScreen>('intro');

  const SCREENS:Record<ActiveScreen, JSX.Element> = {
    'intro': <Intro onContinue={() => setActiveScreen('script-review')} />,
    'script-review': <ScriptReview />,
    'video-recording': <ScriptReview />,
    'result': <ScriptReview />,
  }

  return (
    <div className="kwaici-container w-full md:w-[393px] shadow-none md:shadow-md min-h-screen md:min-h-full rounded-none md:rounded-md mt-0 md:mt-2 relative mx-auto inset-0 bg-[#F8F8F9]">
        {SCREENS[activeScreen]}
    </div>
  )
}
