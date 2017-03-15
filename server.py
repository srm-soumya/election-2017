import os
import tornado.web
from tornado.ioloop import IOLoop
from handlers import BaseHandler, OpinionHandler, OpinionDataHandler, ExitHandler, ExitDataHandler, VoterTOHandler, TurnoutHandler, TableHandler, FetchResults


class Application(tornado.web.Application):

    def __init__(self):
        handlers = [
            (r'/', BaseHandler),
            (r'/opinion-poll/?', OpinionHandler),
            (r'/opinion-poll/data/?', OpinionDataHandler),
            (r'/exit-poll/?', ExitHandler),
            (r'/exit-poll/data/?', ExitDataHandler),
            (r'/voter-turnout/?', VoterTOHandler),
            (r'/turnout-change/?', TurnoutHandler),
            (r'/table/?', TableHandler),
            (r'/results/?', FetchResults),
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

