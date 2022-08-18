import Link from 'next/link';

export default function Layout({ children }) {
  return (
    <div className='flex flex-col min-h-screen'>
      <header className='bg-slate-900 text-white font-mono mb-8 py-4'>
        <div className='container mx-auto flex justify-center'>
          <Link href='/'>
            <a>💻</a>
          </Link>
          <span className='mx-auto'>Samir&apos;s late night thoughts</span>{' '}
        </div>
      </header>
      <main className='container font-mono mx-auto flex-1'>{children}</main>
      <footer className='bg-slate-900 text-white mt-8 py-4'>
        <div className='container font-mono mx-auto flex justify-center'>
          &copy; 2022 Websenpai-samir
        </div>
      </footer>
    </div>
  );
}
