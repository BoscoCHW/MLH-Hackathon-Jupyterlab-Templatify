import json
from pathlib import Path

from jupyter_server.base.handlers import APIHandler
from jupyter_server.utils import url_path_join
import nbformat as nbf
import tornado

HERE = Path(__file__).parent.resolve()

class RouteHandler(APIHandler):
    # The following decorator should be present on all verb methods (head, get, post,
    # patch, put, delete, options) to ensure only authorized user can request the
    # Jupyter server
    @tornado.web.authenticated
    def post(self):
        req_body = self.get_json_body()

        with (HERE / "code_blocks.json").open() as f:
            code_blocks = json.load(f)
        
        cells = []
        for category, category_config in req_body.items():
            if category == "filename"
            for key, val in category_config.items():
                if val == True:
                    cells.extend(code_blocks[category][key])
            
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
