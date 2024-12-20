/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.createTable('user_thread_comment_likes', {
    id: {
      type: 'VARCHAR(25)',
      primaryKey: true,
    },
    user_id: {
      type: 'VARCHAR(35)',
      notNull: true,
    },
    thread_comment_id: {
      type: 'VARCHAR(29)',
      notNull: true,
    },
  });

  pgm.addConstraint(
    'user_thread_comment_likes',
    'unique__user_id__thread_comment_id',
    'UNIQUE(user_id, thread_comment_id)',
  );

  pgm.addConstraint(
    'user_thread_comment_likes',
    'fk__user_thread_comment_likes.user_id__users.id',
    'FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE',
  );
  pgm.addConstraint(
    'user_thread_comment_likes',
    'fk__user_thread_comment_likes.thread_comment_id__thread_comments.id',
    'FOREIGN KEY(thread_comment_id) REFERENCES thread_comments(id) ON DELETE CASCADE',
  );
};

exports.down = (pgm) => {
  pgm.dropTable('user_thread_comment_likes');
};
