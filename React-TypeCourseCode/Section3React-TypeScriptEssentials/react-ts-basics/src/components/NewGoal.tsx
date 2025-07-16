import { useRef, type FormEvent } from "react";


interface NewGoalProps {
    onAddGoal: (goal: string, summary: string) => void;
};

export default function NewGoal({onAddGoal}: NewGoalProps){
    const goal = useRef<HTMLInputElement>(null) // useRef is also a generic
    const summary = useRef<HTMLInputElement>(null)

    function handleSubmit(event: FormEvent<HTMLFormElement>){
        event?.preventDefault();
        const enteredGoal = goal.current!.value; // Tells TypeScript that this will never be null
        const eneteredSummary = summary.current!.value;
        onAddGoal(enteredGoal,eneteredSummary);

        // Resetting the Form
        event.currentTarget.reset();
        
    }


    return <form onSubmit={handleSubmit}>
        <p>
            <label htmlFor="goal">Your goal</label>
            <input id="goal" type="text" ref={goal}/>
        </p>
         <p>
            <label htmlFor="summary">Short summary</label>
            <input id="summary" type="text" ref={summary}/>
        </p>
        <p>
            {/* By Default submits form */}
            <button>Add Goal</button> 
        </p>
    </form>
}