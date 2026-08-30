export type AppState={startedAt:string;completed:string[];reminderEnabled:boolean;reminderTime:string;onboarded:boolean};
const KEY='leise-state-v1';
export const todayKey=(d=new Date())=>d.toLocaleDateString('sv-SE');
export const initialState:AppState={startedAt:todayKey(),completed:[],reminderEnabled:false,reminderTime:'20:30',onboarded:false};
export function loadState():AppState{try{return {...initialState,...JSON.parse(localStorage.getItem(KEY)||'{}')}}catch{return initialState}}
export function saveState(state:AppState){localStorage.setItem(KEY,JSON.stringify(state))}
export function dayNumber(state:AppState){const start=new Date(state.startedAt+'T12:00:00'); const now=new Date(todayKey()+'T12:00:00'); return Math.max(1,Math.min(84,Math.floor((now.getTime()-start.getTime())/86400000)+1))}
export function streak(completed:string[]){let count=0; const d=new Date(); while(completed.includes(todayKey(d))){count++; d.setDate(d.getDate()-1)} return count}
