export function getPipeName(char: string): string {
  switch (char) {
    case '┗':
    case '┏':
    case '┓':
    case '┛':
      return 'pipe1_0';
    case '┃':
    case '━':
      return 'pipe2_0';
    case '╋':
      return 'pipe3_0';
    case '┳':
    case '┫':
    case '┻':
    case '┣':
      return 'pipe4_0';
    case '╹':
    case '╺':
    case '╻':
    case '╸':
      return 'pipe5_0';
    default:
      return 'pipe1_0';
  }
}

export function getPipeRotation(char: string): number {
  switch (char) {
    case '┗':
      return 0;
    case '┏':
      return -(Math.PI / 2);
    case '┓':
      return -Math.PI;
    case '┛':
      return Math.PI / 2;
    case '┃':
      return 0;
    case '━':
      return -(Math.PI / 2);
    case '╋':
      return 0;
    case '┳':
      return 0;
    case '┫':
      return -(Math.PI / 2);
    case '┻':
      return -Math.PI;
    case '┣':
      return Math.PI / 2;
    case '╹':
      return 0;
    case '╺':
      return -(Math.PI / 2);
    case '╻':
      return -Math.PI;
    case '╸':
      return Math.PI / 2;
    default:
      return 0;
  }
}
