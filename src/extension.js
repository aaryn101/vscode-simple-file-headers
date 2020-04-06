const vscode = require("vscode");
const { insertIntoEditor } = require("./util");

function activate(context) {
  let disposable = vscode.commands.registerCommand(
    "extension.insertFileHeader",
    () => {
      let editor = vscode.window.activeTextEditor;
      if (!editor) return;
      insertIntoEditor(editor);
    }
  );

  context.subscriptions.push(disposable);
}
exports.activate = activate;

function deactivate() {}
exports.deactivate = deactivate;