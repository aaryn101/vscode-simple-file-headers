const vscode = require("vscode");
const { Position } = vscode;

exports.insertIntoEditor = insertIntoEditor;

function insertIntoEditor(editor) {
  let config = vscode.workspace.getConfiguration("simplefileheaders");
  editor.edit(editBuilder => {
    let position = getPositionToInsertAt(editor, config);
    let text = getTextToInsert(editor, config);

    if (text) {
      editBuilder.insert(position, text);
    }
  });
}

function getPositionToInsertAt(editor, config) {
  let insertAt = config.get("insertAt");
  let position;

  switch (insertAt) {
    case "cursor":
      position = editor.selection.start;
      break;
    case "startOfFile":
      position = new Position(0, 0);
      break;
  }

  return position;
}

function getTextToInsert(editor, config) {
  let languageId = editor.document.languageId;
  let template = getTemplateByLanguageId(languageId, config);
  let lineEnd = editor.document.eol === vscode.EndOfLine.CRLF ? "\r\n" : "\n";

  if (!template) {
    let msgText = [
      `No Simple File Header template defined for language with id: ${languageId}!`,
      "You can define one using the simplefileheaders.templates setting.",
      "See the extension documentation for more information."
    ];
    vscode.window.showWarningMessage(msgText.join(" "));
    return null;
  }

  let text = replaceVariables(template.text.join(lineEnd) + lineEnd, config);

  return text;
}

function getTemplateByLanguageId(id, config) {
  let templates = config.get("templates");
  let template = templates.find(t => t.useWith.indexOf(id) !== -1);

  if (!template) {
    template = templates.find(t => t.useWith.indexOf("*") !== -1);
  }

  return template;
}

function replaceVariables(text, config) {
  let variables = config.get("variables");

  for (let v in variables) {
    text = text.replace(new RegExp(`\{${v}\}`, "g"), variables[v]);
  }

  return text;
}
