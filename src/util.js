const vscode = require("vscode");
const { Position, window } = vscode;

exports.insertIntoEditor = insertIntoEditor;

async function insertIntoEditor(editor) {
  let config = vscode.workspace.getConfiguration("simplefileheaders");
  let text = await getTextToInsert(editor, config);

  if (text) {
    editor.edit(async (editBuilder) => {
      let position = getPositionToInsertAt(editor, config);
      editBuilder.insert(position, text);
    });
  }
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

async function getTextToInsert(editor, config) {
  let languageId = editor.document.languageId;
  let templates = getTemplatesByLanguageId(languageId, config);
  let lineEnd = editor.document.eol === vscode.EndOfLine.CRLF ? "\r\n" : "\n";

  let templateToUse;

  if (templates.length === 0) {
    let msgText = [
      `No Simple File Header template defined for language with id: ${languageId}!`,
      "You can define one using the simplefileheaders.templates setting.",
      "See the extension documentation for more information.",
    ];
    vscode.window.showWarningMessage(msgText.join(" "));
    return;
  } else if (templates.length === 1) {
    templateToUse = templates[0];
  } else {
    const selection = await window.showQuickPick(
      templates.map((t, i) => ({
        index: i,
        label: t.name || `Template ${i + 1}`,
        description: t.useWith.map((u) => (u === "*" ? "all" : u)).join(", "),
        picked: i === 0,
      }))
    );

    if (!selection) {
      return;
    }

    templateToUse = templates[selection.index];
  }

  return replaceVariables(templateToUse.text.join(lineEnd) + lineEnd, config);
}

function getTemplatesByLanguageId(id, config) {
  let configTemplates = config.get("templates");

  return configTemplates
    .filter((t) => t.useWith.includes(id) || t.useWith.includes("*"))
    .sort((a, b) => {
      const getRelevance = (template) => {
        let relevance;

        if (template.useWith.length === 1 && template.useWith[0] === id) {
          relevance = 5;
        } else if (template.useWith.includes(id)) {
          relevance = 3;
        } else if (template.useWith.includes("*")) {
          relevance = 1;
        }

        if (template.name) {
          relevance++;
        }

        return relevance;
      };

      const relevanceOfA = getRelevance(a);
      const relevanceOfB = getRelevance(b);

      if (relevanceOfA === relevanceOfB && a.name && b.name) {
        return a.name.localeCompare(b.name);
      } else {
        return relevanceOfB - relevanceOfA;
      }
    });
}

function replaceVariables(text, config) {
  let variables = config.get("variables");

  for (let v in variables) {
    text = text.replace(new RegExp(`\{${v}\}`, "g"), variables[v]);
  }

  return text;
}
