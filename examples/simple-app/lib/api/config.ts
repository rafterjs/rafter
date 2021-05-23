export type HomeControllerConfig = {
  controller: {
    home: string;
  };
};

export default (): HomeControllerConfig => ({
  controller: {
    home: 'This is a merged config :D',
  },
});
