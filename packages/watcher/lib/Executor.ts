import { ChildProcess, exec, execSync } from 'child_process';

export function execute(command: string): string {
  return execSync(command, { encoding: 'utf-8' });
}

export function executeChild(command: string): ChildProcess {
  return exec(command);
}
