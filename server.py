import os

import tornado.ioloop
import tornado.options
import tornado.web

from src.finance import get_quotes, read_quotes

from tornado.options import define, options
define("port", default=8000, help="run on the given port", type=int)


class Application(tornado.web.Application):
    def __init__(self):
        handlers = [
            (r"/", IndexHandler),
            (r"/(\w+)", ErrorHandler),
            (r"/html/home", HomeHandler),
            (r"/html/cs", CandlestickHandler),
        ]
        settings = dict(
            template_path=os.path.join(os.path.dirname(__file__), "templates"),
            static_path=os.path.join(os.path.dirname(__file__), "static"),
            debug=True,
        )
        tornado.web.Application.__init__(self, handlers, **settings)


class IndexHandler(tornado.web.RequestHandler):
    def get(self):
        self.render("index.html")


class HomeHandler(tornado.web.RequestHandler):
    def get(self):
        self.render("modules/home.html")


class CandlestickHandler(tornado.web.RequestHandler):
    def get(self):
        self.render("modules/cs.html")
    def post(self):
        symbol = self.get_argument('symbol')
        data = get_quotes(symbol)
        # data = read_quotes()
        self.set_header('Content-Type', 'application/json')
        self.write(data)


class ErrorHandler(tornado.web.RequestHandler):
    def get(self, req):
        self.render("error.html", req=req)


def main():
    tornado.options.parse_command_line()
    app = Application()
    app.listen(options.port)
    print "server up and running on port %d" % options.port
    tornado.ioloop.IOLoop.instance().start()

if __name__ == "__main__":
    main()
