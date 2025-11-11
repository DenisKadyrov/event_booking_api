export default interface Config {
  dbUrl: string;
  port: number;
  nodeEnv: "development" | "production" | "test";
}