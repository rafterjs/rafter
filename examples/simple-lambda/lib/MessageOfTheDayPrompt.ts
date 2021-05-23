import { question } from 'readline-sync';

export class MessageOfTheDayPrompt {
  public prompt(): boolean {
    const enteredChar = question(`Press 'y' to see another message.`);
    return enteredChar === 'y';
  }
}

export default MessageOfTheDayPrompt;
