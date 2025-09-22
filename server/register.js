import { register } from 'module';
import { pathToFileURL } from 'url';
register('tsx/esm', pathToFileURL('./'));
