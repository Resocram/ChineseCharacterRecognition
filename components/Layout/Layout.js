import { useRouter } from 'next/router';

export default function Layout({ children }) {
    const router = useRouter();

    return (
        <div id="main" className="flex flex-col min-h-screen">
            <main>
                {children}
            </main>
        </div>
    );
}
