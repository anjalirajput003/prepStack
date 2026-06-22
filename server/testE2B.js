import dotenv from "dotenv";
dotenv.config();

import { Sandbox } from "@e2b/code-interpreter";

async function test() {
  try {
    const sandbox = await Sandbox.create({
      apiKey: process.env.E2B_API_KEY,
    });

    const result = await sandbox.runCode(`
print("Hello from E2B")
print(2 + 3)
`);

    console.log(result);

    await sandbox.kill();
  } catch (err) {
    console.error(err);
  }
}

test();
