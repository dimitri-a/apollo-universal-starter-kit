import { returnId } from '../../sql/helpers';
import knex from '../../sql/connector';

export default class Chat {
  message(id) {
    return knex
      .select('id', 'text', 'userId', 'uuid', 'created_at as createdAt', 'reply')
      .from('message')
      .where('id', '=', id)
      .first();
  }

  image(id) {
    return knex
      .select('id', 'name', 'type', 'size', 'path')
      .from('attachment')
      .where('id', '=', id)
      .first();
  }

  messagesPagination(limit, after) {
    return knex
      .select(
        'm.id',
        'm.text',
        'm.attachment_id',
        'm.userId',
        'm.uuid',
        'u.username',
        'a.name',
        'a.path',
        'm.created_at as createdAt',
        'm.reply'
      )
      .from('message as m')
      .leftJoin('user as u', 'u.id', 'm.userId')
      .leftJoin('attachment as a', 'a.id', 'm.attachment_id')
      .orderBy('m.id', 'desc')
      .limit(limit)
      .offset(after);
  }

  getTotal() {
    return knex('message')
      .countDistinct('id as count')
      .first();
  }

  addMessage({ text, userId, uuid, reply }) {
    return returnId(knex('message')).insert({ text, userId, uuid, reply });
  }

  addMessageWithAttachment({ text, userId, uuid, reply, attachment }) {
    return knex
      .transaction(trx => {
        knex('attachment')
          .transacting(trx)
          .insert(attachment)
          .then(resp => {
            const id = resp[0];
            return returnId(knex('message'))
              .transacting(trx)
              .insert({ text, userId, uuid, reply, attachment_id: id });
          })
          .then(trx.commit)
          .catch(trx.rollback);
      })
      .then(resp => resp)
      .catch(err => console.error(err));
  }

  deleteMessage(id) {
    return knex('message')
      .where('id', '=', id)
      .del();
  }

  editMessage({ id, text, userId }) {
    return knex('message')
      .where('id', '=', id)
      .update({
        text: text,
        userId: userId
      });
  }
}