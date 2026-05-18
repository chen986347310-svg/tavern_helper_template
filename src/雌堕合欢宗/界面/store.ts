import { Schema } from '../schema';
import { defineMvuDataStore } from '@util/mvu';

export const useDataStore = defineMvuDataStore(Schema, {
  type: 'message',
  message_id: getCurrentMessageId(),
});
