type CleanupFunction = () => Promise<void> | void;

class ShutdownManager {
  private static _instance: ShutdownManager;
  private registeredTasks: Set<CleanupFunction>; // stores all cleanup functions
  private _isShuttingDown: boolean; // prevents duplicate shutdown execution

  private constructor() {
    this.registeredTasks = new Set();
    this._isShuttingDown = false;

    // Listen to shutdown signals
    process.on('SIGINT', () => this.executeShutdown('SIGINT'));
    process.on('SIGTERM', () => this.executeShutdown('SIGTERM'));
    process.on('SIGUSR2', () => this.executeShutdown('SIGUSR2'));
  }

  /**
   * Executes all registered cleanup tasks in parallel.
   * @param signal - The OS signal that triggered the shutdown
   */
  private async executeShutdown(signal: string): Promise<void> {
    if (this._isShuttingDown) return;
    this._isShuttingDown = true;

    console.log(`Graceful shutdown initiated by signal: ${signal}`);

    const tasks = Array.from(this.registeredTasks).map((task) =>
      Promise.resolve().then(() => task())
    );

    const results = await Promise.allSettled(tasks);

    results.forEach((result, index) => {
      if (result.status === 'rejected') {
        console.error(`Cleanup task #${index} failed:`, result.reason);
      }
    });

    process.exit(0);
  }

  /**
   * Registers a new cleanup task to be executed on shutdown.
   * @param task - A function to perform cleanup
   */
  public registerCleanupTask(task: CleanupFunction): void {
    this.registeredTasks.add(task);
  }

  /**
   * Unregisters a cleanup task so it won't be executed on shutdown.
   * @param task - The cleanup function to remove
   */
  public unregisterCleanupTask(task: CleanupFunction): void {
    this.registeredTasks.delete(task);
  }

  /**
   * Returns the singleton instance of ShutdownManager
   */
  public static getInstance(): ShutdownManager {
    if (!ShutdownManager._instance) {
      ShutdownManager._instance = new ShutdownManager();
    }
    return ShutdownManager._instance;
  }
}

// Export the singleton for use in other modules
export const shutdownManager = ShutdownManager.getInstance();
