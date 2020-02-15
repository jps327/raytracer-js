// @flow
type TimerInfo = {
  state: 'started' | 'stopped',
  lastStartTime: number,
  totalTime: number,
  n: number,
};

/**
 * A very basic stopwatch class to track execution time of code that is called
 * repeatedly. It keeps track of the total time spent on a given block, and the
 * average time spent on it.
 *
 * If you're not dealing with logic that is called repeatedly, and you're just
 * trying to get the execution time of a single run, then you're better off just
 * using console.time() instead.
 *
 * All times are reported in ms.
 */
const Stopwatch = {
  timers: new Map<string, TimerInfo>(),
  start(key: string): void {
    const timer = Stopwatch.timers.get(key);
    if (timer) {
      if (timer.state === 'started') {
        throw new Error(
          `'${key}' needs to be stopped before it can be started again.`,
        );
      }

      timer.state = 'started';
      timer.lastStartTime = window.performance.now();
      timer.n += 1;
    } else {
      Stopwatch.timers.set(key, {
        state: 'started',
        lastStartTime: window.performance.now(),
        totalTime: 0,
        n: 1,
      });
    }
  },

  stop(key: string): void {
    const timer = Stopwatch.timers.get(key);
    if (timer) {
      if (timer.state === 'stopped') {
        throw new Error(
          `'${key}' needs to be started before it can be stopped again.`,
        );
      }

      timer.state = 'stopped';
      timer.totalTime += window.performance.now() - timer.lastStartTime;
    } else {
      throw new Error(`'${key}' has never been started.`);
    }
  },

  print(key: string): void {
    const timer = Stopwatch.timers.get(key);
    if (timer) {
      if (timer.state === 'started') {
        throw new Error(
          `'${key}' needs to be stopped before we can print statistics.`,
        );
      }

      console.log(key, {
        totalTime: timer.totalTime,
        averageTime: timer.totalTime / timer.n,
      });
    } else {
      throw new Error(`'${key}' has never been started.`);
    }
  },
};

export default Stopwatch;
