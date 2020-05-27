interface IConfig {
  [key: string]: object;
}

export default (): IConfig => ({
  cors: {
    methods: ['get'],
  },
});
