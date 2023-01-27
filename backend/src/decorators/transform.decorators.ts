import { Transform } from 'class-transformer';
import { isArray, map, trim } from 'lodash';

// trim spaces from start and end, replace multiple spaces with one.
export function Trim(): PropertyDecorator {
  return Transform((params) => {
    const value = params.value as string[] | string;

    if (isArray(value)) {
      return map(value, (v) => trim(v).replace(/\s\s+/g, ' '));
    }

    return trim(value).replace(/\s\s+/g, ' ');
  });
}
