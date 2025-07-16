import type { ReactNode } from "react";

interface HeaderProps {
    image: {src: string, alt: string},
    children: ReactNode
}

export default function Header({image: {src, alt}, children}: HeaderProps){
    return <header>
        <img src={src} alt={alt}/>
        {children}
    </header>

}