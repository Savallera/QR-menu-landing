import { deleteAsync } from 'del';
import path from '../config/path.js';

export default () => {
  return deleteAsync(path.root);
};
