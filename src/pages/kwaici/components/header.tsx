import KwaiciLogo from '@/assets/kwaici/kwaici-logo.svg';
import { Ellipsis } from 'lucide-react';

export default function Header() {
  return (
    <header className='flex justify-between p-3 mb-3'>
        <img src={KwaiciLogo} alt='kwaici-logo' />
        <Ellipsis className='text-slate-400' />
    </header>
  )
}
