import RotActionScheduler from 'rot-js/lib/scheduler/action';

/**
 * Scheduler.
 */
export class Scheduler {
  /**
   * Action cost scheduler.
   */
  protected readonly scheduler = new RotActionScheduler<string>();

  /**
   * Add item to scheduler
   *
   * @param item Item.
   * @param repeat Repeat flag.
   * @param delay Initial delay.
   */
  public add(item: string, repeat = false, delay = 1): this {
    this.scheduler.add(item, repeat, delay);
    return this;
  }

  /**
   * Clear the scheduler.
   */
  public clear(): this {
    this.scheduler.clear();
    return this;
  }

  /**
   * Next item in the scheduler.
   */
  public next(): string {
    return this.scheduler.next();
  }

  /**
   * Remove item from scheduler.
   *
   * @param item Item.
   */
  public remove(item: string): boolean {
    return this.scheduler.remove(item);
  }

  /**
   * Run the scheduler.
   *
   * @param act Called on each item in the scheduler.
   */
  public async run(act: (item: string, scheduler: Scheduler) => Promise<void> | void): Promise<void> {
    while (true) {
      const scheduledItem = this.next();

      if (!scheduledItem) {
        break;
      }

      await act(scheduledItem, this);
    }
  }

  /**
   * Set duration for current item.
   *
   * @param duration Duration.
   */
  public setDuration(duration: number): this {
    this.scheduler.setDuration(duration);
    return this;
  }
}
