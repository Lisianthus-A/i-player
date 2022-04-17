import { useState, useCallback, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { AppDispatch, RootState } from "../store/index";
import type { TypedUseSelectorHook } from "react-redux";

export const useSetState = <T extends object>(
    initialState: T = {} as T
): [T, (patch: Partial<T> | ((prevState: T) => Partial<T>)) => void] => {
    const [state, set] = useState<T>(initialState);
    const setState = useCallback((patch) => {
        set((prevState) =>
            Object.assign(
                {},
                prevState,
                patch instanceof Function ? patch(prevState) : patch
            )
        );
    }, []);

    return [state, setState];
};

export const useInterval = (callback: Function, delay?: number | null) => {
    const savedCallback = useRef<Function>(() => {});

    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    useEffect(() => {
        if (delay !== null) {
            const interval = setInterval(() => savedCallback.current(), delay);
            return () => clearInterval(interval);
        }
    }, [delay]);
};

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
