import {defineField, defineType} from 'sanity'
import {user} from './user'

export const project = defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      type: 'text',
    }),
    defineField({
      name: 'startdate',
      type: 'date',
      options: {
        dateFormat: 'DD-MM-YYYY',
        calendarTodayLabel: 'Today',
      },
    }),
    defineField({
      name: 'enddate',
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
  ],
})
