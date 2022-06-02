import json

from jupyter_server.base.handlers import APIHandler
from jupyter_server.utils import url_path_join
import os
import nbformat as nbf
import tornado

class RouteHandler(APIHandler):
    # The following decorator should be present on all verb methods (head, get, post,
    # patch, put, delete, options) to ensure only authorized user can request the
    # Jupyter server
    @tornado.web.authenticated
    def get(self):

        nb = nbf.v4.new_notebook()
        text = """
        # My first automatic Jupyter Notebook
        This is an auto-generated notebook."""

        code = """
        %pylab inline
        hist(normal(size=2000), bins=50);"""

        nb['cells'] = [ nbf.v4.new_markdown_cell(text), nbf.v4.new_code_cell(code) ]
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
