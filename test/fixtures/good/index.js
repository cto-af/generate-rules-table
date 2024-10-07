export default {
  rules: {
    foo: {
      meta: {
        docs: {
          description: 'Foo test',
          recommended: true,
        },
      },
    },
    bar: {
      meta: {
        docs: {
          description: 'Bar test',
          recommended: false,
        },
      },
    },
    bad: {},
  },
};
