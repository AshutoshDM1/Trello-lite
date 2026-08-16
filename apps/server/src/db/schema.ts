import { pgTable, text, timestamp, integer, index } from 'drizzle-orm/pg-core';
import { defineRelations } from 'drizzle-orm';

export * from './auth-schema.js';

export const boards = pgTable('boards', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const columns = pgTable(
  'columns',
  {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    boardId: text('board_id')
      .notNull()
      .references(() => boards.id, { onDelete: 'cascade' }),
    position: integer('position').notNull().default(0),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index('columns_board_id_idx').on(table.boardId)],
);

export const tasks = pgTable(
  'tasks',
  {
    id: text('id').primaryKey(),
    title: text('title').notNull(),
    description: text('description'),
    columnId: text('column_id')
      .notNull()
      .references(() => columns.id, { onDelete: 'cascade' }),
    priority: text('priority').notNull().default('Medium'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index('tasks_column_id_idx').on(table.columnId),
    index('tasks_priority_idx').on(table.priority),
  ],
);

export const taskflowRelations = defineRelations({ boards, columns, tasks }, (r) => ({
  boards: {
    columns: r.many.columns(),
  },
  columns: {
    board: r.one.boards({
      from: r.columns.boardId,
      to: r.boards.id,
    }),
    tasks: r.many.tasks(),
  },
  tasks: {
    column: r.one.columns({
      from: r.tasks.columnId,
      to: r.columns.id,
    }),
  },
}));
