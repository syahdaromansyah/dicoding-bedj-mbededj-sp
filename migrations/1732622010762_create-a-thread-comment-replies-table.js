/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
  pgm.createTable('thread_comment_replies', {
    id: {
      type: 'VARCHAR(27)',
      primaryKey: true,
    },
    content: {
      type: 'TEXT',
      notNull: true,
    },
    date: {
      type: 'TIMESTAMPTZ',
      default: pgm.func('CURRENT_TIMESTAMP'),
    },
    is_delete: {
      type: 'BOOLEAN',
      default: 'FALSE',
    },
    thread_comment_id: {
      type: 'VARCHAR(29)',
      notNull: true,
    },
    owner_id: {
      type: 'VARCHAR(35)',
      notNull: true,
    },
  });

  pgm.addConstraint(
    'thread_comment_replies',
    'fk__thread_comment_replies.thread_comment_id__thread_comments.id',
    'FOREIGN KEY(thread_comment_id) REFERENCES thread_comments(id) ON DELETE CASCADE',
  );

  pgm.addConstraint(
    'thread_comment_replies',
    'fk__thread_comment_replies.owner_id__users.id',
    'FOREIGN KEY(owner_id) REFERENCES users(id) ON DELETE CASCADE',
  );
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  pgm.dropTable('thread_comment_replies');
};
