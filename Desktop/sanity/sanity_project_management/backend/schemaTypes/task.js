import {defineField, defineType} from 'sanity'
import {user} from './user'
import {project} from './project'

export const task = defineType({
  name: 'task',
  title: 'Task',
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
    defineField({
      name: 'assigned_employee',
      type: 'reference',

      to: [
        {
          type: 'user',
        },
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'project',
      type: 'reference',

      to: [
        {
          type: 'project',
        },
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          {title: 'todo', value: 'todo'},
          {title: 'inprogress', value: 'inprogress'},
          {title: 'completed', value: 'completed'},
        ],
        layout: 'dropdown',
      },
      description: 'The current status of the task',
      initialValue: 'todo',
    }),
  ],
})
