import tornado.web
import pandas as pd


class BaseHandler(tornado.web.RequestHandler):
    def get(self):
        self.render('index.html')


class OpinionHandler(tornado.web.RequestHandler):
    def get(self):
        self.render('opinion-poll.html')


class OpinionDataHandler(tornado.web.RequestHandler):
    def get(self):
        state = self.get_argument('state', 'goa')
        data = pd.read_json('data/data.json')
        self.write(data[state].to_json())
