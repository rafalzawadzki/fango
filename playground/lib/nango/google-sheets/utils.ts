export const columnToLabel = (columnIndex: number) => {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let label = '';

  while (columnIndex >= 0) {
    label = alphabet[columnIndex % 26] + label;
    columnIndex = Math.floor(columnIndex / 26) - 1;
  }

  return label;
};

export const labelToColumn = (label: string) => {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let column = 0;

  for (let i = 0; i < label.length; i++) {
    column +=
      (alphabet.indexOf(label[i]) + 1) * Math.pow(26, label.length - i - 1);
  }

  return column - 1;
};

export function objectToArray(obj: { [x: string]: any }) {
  const maxIndex = Math.max(
    ...Object.keys(obj).map((key) => labelToColumn(key))
  );
  const arr = new Array(maxIndex + 1);
  for (const key in obj) {
    arr[labelToColumn(key)] = obj[key];
  }
  return arr;
}

export function isString(str: unknown): str is string {
  return str != null && typeof str === 'string'
}

export function isNil<T>(value: T | null | undefined): value is null | undefined {
  return value === null || value === undefined
}

export function stringifyArray(object: unknown[]): string[] {
  return object.map((val: any) => {
    if (isString(val)) {
      return val;
    }
    return JSON.stringify(val);
  });
}