import { useTimersContext } from "../store/timers-context";


export default function Timers() {
  const {timers} = useTimersContext()
  return <ul>{timers.map(timer => <li key={timer.name}>{timer.duration}</li>)}</ul>;
}
