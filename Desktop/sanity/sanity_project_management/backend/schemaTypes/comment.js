import {defineField, defineType} from 'sanity'
import {user} from './user'

export const comment = defineType({
  name: 'comment',
  title: 'Comment',
  type: 'document',
  fields: [
    defineField({
      name: 'commenttext',
      type: 'text',
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: 'datecreated',
      type: 'date',
      options: {
        dateFormat: 'DD-MM-YYYY',
        calendarTodayLabel: 'Today',
      },
    }),

    defineField({
      name: 'createdby',
      type: 'reference',

      to: [
        {
          type: 'user',
        },
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'task',
      type: 'reference',

      to: [
        {
          type: 'task',
        },
      ],
      validation: (rule) => rule.required(),
      options: {
        disableNew: true,
      },
    }),
  ],
})
