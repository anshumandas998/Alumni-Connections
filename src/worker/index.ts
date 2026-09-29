import { Hono } from "hono";

type Env = {
  DB: any;
  R2_BUCKET: any;
  EMAILS: any;
};

const app = new Hono<{ Bindings: Env }>();

export default app;
