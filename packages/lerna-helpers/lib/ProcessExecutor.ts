import { ChildProcess, exec, execSync } from 'child_process';

export class ProcessExecutor {
  public static execute(command: string): string {
    return execSync(command, { encoding: 'utf-8' });
  }

  public static executeChild(command: string): ChildProcess {
    return exec(command);
  }
}
