import json
from pathlib import Path

from jupyter_server.base.handlers import APIHandler
from jupyter_server.utils import url_path_join
import nbformat as nbf
import tornado

HERE = Path(__file__).parent.resolve()
PLACEHOLDER = 'STRING_PLACEHOLDER'


def replace_placeholders(list_of_str: list[str], *replacements: str):
    """Given a list of strings and an unspecified number of replacement strings,
        replace 'STRING_PLACEHOLDER' in the list in order of the replacement strings given.
    """
    replacement_strings = list(replacements)
    while len(replacement_strings) > 0:
        for index, string in enumerate(list_of_str):
            if PLACEHOLDER in string:
                replaced_string = string.replace(
                    PLACEHOLDER, replacement_strings.pop(0))
                list_of_str[index] = replaced_string


class RouteHandler(APIHandler):
    # The following decorator should be present on all verb methods (head, get, post,
    # patch, put, delete, options) to ensure only authorized user can request the
    # Jupyter server
    @tornado.web.authenticated
    def post(self):
        """Handle POST request for the path /templatify/addNotebook"""
        req_body = self.get_json_body()
        filePath: str = req_body.get("filePath", None)
        if filePath != None or filePath != "":
            filename = filePath.split('\\')[-1]
            del req_body['filePath']

        with (HERE / "code_blocks.json").open() as f:
            code_blocks = json.load(f)

        cells = []
        for category, category_config in req_body.items():
            for key, val in category_config.items():
                blocks = code_blocks[category][key]
                if val == True:
                    if key == 'importData':
                        if filePath != None:
                            replace_placeholders(blocks[1]['text'], filename)
                else:
                    if key == 'importLibraries':
                        if 'all' not in val:
                            import_lines = []
                            for library in val:
                                import_lines.extend(
                                    list(filter(lambda string: library in string, blocks[1]['text'])))
                            if 'pyplot' in val:
                                import_lines.append("%matplotlib inline")
                            blocks[1]['text'] = import_lines
                    if key == 'scatterPlots' or key == 'featureToFeatureCorr':
                        if val:
                            replace_placeholders(blocks[1]['text'], val)

                cells.extend(blocks)

        nb = nbf.v4.new_notebook()

        nb['cells'] = []
        for cell in cells:
            if (cell["type"] == "md"):
                text = "\n".join(cell["text"])
                nb["cells"].append(nbf.v4.new_markdown_cell(text))
            elif (cell["type"] == "code"):
                code = "\n".join(cell["text"])
                nb["cells"].append(nbf.v4.new_code_cell(code))

        nbf.write(nb, "test.ipynb")

        self.finish(json.dumps({
            "path": "test.ipynb"
        }))


def setup_handlers(web_app):
    host_pattern = ".*$"

    base_url = web_app.settings["base_url"]
    route_pattern = url_path_join(base_url, "templatify", "addNotebook")
    handlers = [(route_pattern, RouteHandler)]
    web_app.add_handlers(host_pattern, handlers)
