export type Exercise={id:string;title:string;seconds:number;cue:string;steps:string[];visual:'tongue-up'|'tongue-slide'|'cheek-press'|'vowel'|'swallow'|'jaw'};
const library:Record<string,Exercise>={
  suction:{id:'suction',title:'Zunge ansaugen',seconds:90,cue:'Die ganze Zunge liegt breit am Gaumen.',steps:['Lippen locker schließen.','Zungenspitze hinter die oberen Schneidezähne legen.','Zunge flächig ansaugen, 5 Sekunden halten, lösen.'],visual:'tongue-up'},
  slide:{id:'slide',title:'Zunge nach hinten ziehen',seconds:90,cue:'Langsam und kontrolliert – der Kiefer bleibt ruhig.',steps:['Zungenspitze am vorderen Gaumen starten.','Mit sanftem Druck am Gaumen nach hinten gleiten.','Vorne neu ansetzen und wiederholen.'],visual:'tongue-slide'},
  cheek:{id:'cheek',title:'Wangen-Gegendruck',seconds:90,cue:'Nur mittlerer Druck, ohne Schmerzen.',steps:['Zeigefinger außen an die rechte Wange legen.','Mit der Zunge von innen dagegen drücken.','Seite nach 5 Wiederholungen wechseln.'],visual:'cheek-press'},
  vowels:{id:'vowels',title:'Vokale kräftigen',seconds:90,cue:'Deutlich artikulieren, nicht schreien.',steps:['Aufrecht sitzen und ruhig einatmen.','A–E–I–O–U langsam und deutlich sprechen.','Jeden Laut etwa 2 Sekunden halten.'],visual:'vowel'},
  swallow:{id:'swallow',title:'Bewusst schlucken',seconds:120,cue:'Die Zungenspitze bleibt oben; Lippen entspannt.',steps:['Einen kleinen Schluck Wasser nehmen.','Zungenspitze am Gaumen positionieren.','Schlucken, ohne die Lippen zusammenzupressen.'],visual:'swallow'},
  jaw:{id:'jaw',title:'Kiefer stabilisieren',seconds:90,cue:'Kleine Bewegung, kein Knacken erzwingen.',steps:['Mund leicht öffnen.','Unterkiefer langsam gerade nach vorn führen.','Kurz halten und kontrolliert zurückführen.'],visual:'jaw'},
};
const focus=['Basis & Wahrnehmung','Zungenkraft','Gaumenkontakt','Wangen & Lippen','Koordination','Ausdauer','Schluckmuster','Stabilität','Präzision','Ausdauer plus','Alltagstransfer','Festigen'];
const patterns=[['suction','slide','vowels','swallow'],['suction','cheek','slide','jaw'],['slide','vowels','swallow','cheek'],['suction','jaw','vowels','swallow']];
export const weeks=focus.map((name,i)=>({week:i+1,name,days:Array.from({length:7},(_,d)=>patterns[(i+d)%patterns.length].map(id=>library[id]))}));
export const sessionFor=(week:number,day:number)=>weeks[Math.min(11,Math.max(0,week-1))].days[day%7];
export const totalSeconds=(xs:Exercise[])=>xs.reduce((n,x)=>n+x.seconds,0);
