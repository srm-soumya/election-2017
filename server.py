import os
import tornado.web
from tornado.ioloop import IOLoop
from handlers import BaseHandler, OpinionHandler, OpinionDataHandler


class Application(tornado.web.Application):

    def __init__(self):
        handlers = [
            (r'/', BaseHandler),
            (r'/opinion-poll/?', OpinionHandler),
            (r'/opinion-poll/data/?', OpinionDataHandler)
        ]

        settings = {
            'template_path': os.path.join(os.path.dirname(__file__), 'templates'),
            'static_path': os.path.join(os.path.dirname(__file__), 'static'),
            'debug': True
        }

        super(Application, self).__init__(handlers, **settings)


def main():
    app = Application()
    app.listen(80)
    IOLoop.instance().start()


if __name__ == '__main__':
    main()

