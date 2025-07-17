import { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";

// Polymorphic Component
type ContainerProps<T extends ElementType> = {
    as?: T; // Receive identifier of component
    children: ReactNode;
} & ComponentPropsWithoutRef<T>;
export default function Container<T extends ElementType>({as, children}: ContainerProps<T>){
    const Component = as ||'div';
    return <Component className="container">{children}</Component>
}