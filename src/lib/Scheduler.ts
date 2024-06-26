/**
 * 
 * 
 */

interface Schedule {
  name: string;
  func: Function;
  time: number;
}

export class Scheduler {
  private schedule:Schedule[] = [];
  private t:number = 0;
  private started:boolean = false;

  constructor() {

  }

  public run() {
    if (this.schedule.length === 0)
      return;
    if (this.started)
      return;
    const s:Schedule = <Schedule> this.schedule.pop();
    this.started = true;
    const interval = setInterval(() => {
      s.func();
      this.t += 50;
      if (s.time <= this.t) {
        clearInterval(interval);
        this.t = 0;
        this.started = false;
        this.run();
      }
    }, 10);
  }

  public push(name:string, func:Function, time: number)  {
    this.schedule.push({name: name, func: func, time: time});
  }
}