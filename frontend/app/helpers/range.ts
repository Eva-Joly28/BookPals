import { helper } from '@ember/component/helper';

export default helper(function range([start, end]:[number,number]) {
  return Array.from({ length: end - start }, (_, i) => i + start);
});