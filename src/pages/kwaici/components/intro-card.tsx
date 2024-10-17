import { CircleCheck, CircleX, LoaderCircle } from "lucide-react";
import { ReactNode } from "react"

interface IntroCardProps {
    icon: ReactNode;
    title: string;
    step: number;
    disabled?: boolean;
    state?: 'loading' | 'valid' | 'invalid' | null
}

export default function IntroCard({
    icon,
    title,
    step,
    disabled=false,
    state= null
} : IntroCardProps) {
  return (
    <div className={`${disabled ? 'bg-[#f9f9f9]' : 'bg-white'} relative rounded-lg px-[14px] py-[15px] md:py-[20px] shadow-sm flex items-center`}>
        {icon}
        <div className="ml-3">
            <span className="text-kwaici-black-700 text-sm">Step {step}</span>
            <h3 className="font-semibold -mt-[4px]">{title}</h3>

            <div className="absolute right-[20px] top-[30px]">
              {
                state === 'loading' && <LoaderCircle className="animate-spin text-kwaici-black-700" />
              }

              {
                state === 'valid' && <CircleCheck className="text-kwaici-green" />
              }

              {
                state === 'invalid' && <CircleX className="text-kwaici-red" />
              }
            </div>
        </div>
    </div>
  )
}
