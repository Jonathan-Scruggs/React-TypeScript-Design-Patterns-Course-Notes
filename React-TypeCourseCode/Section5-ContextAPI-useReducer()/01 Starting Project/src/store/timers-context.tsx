import { createContext, ReactNode, useContext, useReducer } from "react";
export type Timer = {
    name: string;
    duration: number;
};
type TimersState = {
    isRunning: boolean;
    timers: Timer[];

};
const initialState: TimersState = {
    isRunning: true,
    timers: []
}


// Second object contains methods for this state.
type TimersContextValue = TimersState & {
    addTimer: (timerData: Timer) => void,
    startTimers: () => void,
    stopTimers: () => void,
}
const TimersContext = createContext<TimersContextValue | null>(null);


export function useTimersContext(){
    const timersCtx = useContext(TimersContext);
    if (timersCtx === null){
        throw new Error('TimersContext is null - that should not be the case!');
    }
    return timersCtx;
}

type TimersContextProviderProps = {
    children: ReactNode
};
type StartTimersAction = {
    type: 'START_TIMERS'
}
type StopTimersAction = {
    type: 'STOP_TIMERS'
}
type AddTimerAction = {
    type: 'ADD_TIMER',
    payload: Timer
}

type Action = StartTimersAction | StopTimersAction | AddTimerAction;



function timersReducer(state: TimersState, action: Action): TimersState{
    if (action.type === 'START_TIMERS'){
        return {
            ...state,
            isRunning: true // Since action is start timers.
        }
    } else if (action.type === 'STOP_TIMERS') {
        return {
            ...state,
            isRunning: false
        }
    } else if (action.type === 'ADD_TIMER') {
        return {
            ...state,
            timers: [
                ...state.timers,
                // Since we used discriminated union TypeScript knows that action.payload will be defined here.
                {
                    name: action.payload.name,
                    duration: action.payload.duration
                }
            ]
        }
    }
    return state; // In rare case that no valid action is passed we still return a state no matter what.

}


export default function TimersContextProvider({children}: TimersContextProviderProps){
    
    const [timersState, dispatch] = useReducer(timersReducer, initialState)// Hook To Use When State Is a bit more complex
    const ctx: TimersContextValue = {

        // Stateful values that end up in context.
        timers: timersState.timers,
        isRunning: timersState.isRunning,

        addTimer(timerData) {
            dispatch({type:'ADD_TIMER', payload: timerData});
        },
        startTimers() {
            dispatch({type: 'START_TIMERS'});
        },
        stopTimers() {
            dispatch({type:'STOP_TIMERS'});
        },

    }
    return <TimersContext.Provider value={ctx}>
        {children}
    </TimersContext.Provider>
}