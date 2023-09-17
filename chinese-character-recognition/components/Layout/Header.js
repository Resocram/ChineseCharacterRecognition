import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
    const [active, setActive] = useState(false);

    const handleClick = () => {
        setActive(!active);
    };

    return (
        <nav>
            <div className="container mx-auto px-14 md: px-20 lg:px-24 flex items-center flex-wrap p-3">
                <Link href="/">
                    Home 
                </Link>
                <Link href="/daily">
                    Daily Challenge
                </Link>
            </div>
        </nav>
    );
}
