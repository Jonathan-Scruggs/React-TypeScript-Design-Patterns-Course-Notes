import { ReactNode } from "react"
// Discriminated Union
type HintBoxProps = {
    mode: 'hint';
    children: ReactNode
}


interface WarningBoxProps {
    mode: 'warning',
    children: ReactNode,
    severity: 'low' | 'medium' | 'high';
};
type InfoBoxProps = HintBoxProps | WarningBoxProps;


export default function InfoBox(props: InfoBoxProps){ // info, warning
    const {children, mode} = props;
    if (mode === 'hint'){
        return (
            <aside className="infobox infobox-hint">
                <p>{children}</p>
            </aside> 
        );
    }
    const {severity} = props;
    return (
        <aside className={`infobox infobox-warning warning--${severity}`}>
            {mode === 'warning' ? <h2>Warning</h2>: null}
            <p>{children}</p>
        </aside>
    )
}