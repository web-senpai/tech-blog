import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Layout({ children }) {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.pageYOffset > 300) {
        setShowButton(true);
      } else {
        setShowButton(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleScrollTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };
  return (
    <div className='flex flex-col min-h-screen'>
      <header className='bg-slate-900 text-white font-mono  py-4 sticky top-0'>
        <div className='container mx-auto flex justify-center'>
          <Link href='/' >
            <a className="ml-4">💻</a>
          </Link>
          <span className='mx-auto'>Samir&apos;s late night thoughts</span>{' '}
        </div>
      </header>
      <main className='container font-mono mx-auto flex-1'>{children}</main>
      <footer className='bg-slate-900 text-white mt-8 py-4'>
        <div className='container font-mono mx-auto flex justify-center'>
          &copy; {new Date().getFullYear()} samir-shuvo
        </div>
      </footer>

      {showButton && (
        <button
          onClick={handleScrollTop}
          className='fixed right-4 bottom-4 p-2 bg-gray-800 text-white rounded-full'
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='h-6 w-6'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M5 10l7-7m0 0l7 7m-7-7v18'
            />
          </svg>
        </button>
      )}
    </div>
  );
}
