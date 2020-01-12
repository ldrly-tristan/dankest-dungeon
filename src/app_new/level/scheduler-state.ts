/**
 * Scheduler state interface.
 */
export interface SchedulerState {
  /**
   * Current.
   */
  _current: any;

  /**
   * Default duration.
   */
  _defaultDuration: number;

  /**
   * Duration.
   */
  _duration: number;

  /**
   * Queue.
   */
  _queue: {
    /**
     * Event times.
     */
    _eventTimes: number[];

    /**
     * Events.
     */
    _events: string[];

    /**
     * Time.
     */
    _time: number;
  };

  /**
   * Repeat.
   */
  _repeat: string[];
}
