type IConfig = Record<string, unknown>;

export default (): IConfig => ({
  cors: {
    methods: ['get'],
  },
});
