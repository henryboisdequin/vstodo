import * as vscode from "vscode";
import { apiBaseUrl } from "./constants";
import * as polka from "polka";
import { TokenManager } from "./TokenManager";

export const authenticate = (cb: () => void) => {
  const app = polka();
  app.get(`/auth/:token`, async (req, res) => {
    const { token } = req.params;
    if (!token) {
      res.end(`<h1>ERROR</h1>`);
      return;
    }

    await TokenManager.setToken(token);
    cb();

    res.end(
      `<h1>Successfully logged in with GitHub. You may close this tab.</h1>`
    );

    (app as any).server.close();
  });

  app.listen(54321, (err: Error) => {
    if (err) {
      vscode.window.showErrorMessage(err.message);
    } else {
      vscode.commands.executeCommand(
        "vscode.open",
        vscode.Uri.parse(`${apiBaseUrl}/auth/github`)
      );
    }
  });
};
