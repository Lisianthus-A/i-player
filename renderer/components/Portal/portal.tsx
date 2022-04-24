import { useEffect } from "react";
import { createPortal } from "react-dom";
import type { ReactNode } from "react";

interface Props {
    children: ReactNode;
}

function Portal({ children }: Props) {
    const div = document.createElement("div");
    document.body.appendChild(div);

    useEffect(() => {
        return () => {
            document.body.removeChild(div);
        };
    }, []);

    return createPortal(children, div);
}

export default Portal;
