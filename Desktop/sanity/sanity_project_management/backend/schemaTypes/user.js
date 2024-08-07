import {defineField, defineType} from 'sanity'

export const user = defineType({
  name: 'user',
  title: 'User',
  type: 'document',
  fields: [
    defineField({
      name: 'firstname',
      type: 'string',
    }),
    defineField({
      name: 'lastname',
      type: 'string',
    }),
    defineField({
      name: 'email',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'password',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
  ],
})
