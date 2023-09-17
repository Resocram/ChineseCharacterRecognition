import styles from '../../styles/Home.module.css'
import Header from './Header';
import Footer from './Footer';

import { useRouter } from 'next/router';

export default function Layout({ children }) {
    const router = useRouter();

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className={styles.main}>
                {children}
            </main>
            <Footer />
        </div>
    );
}
