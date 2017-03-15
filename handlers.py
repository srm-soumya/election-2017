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
        data = pd.read_json('data/opinion-data.json')
        self.write(data[state].to_json())


class ExitHandler(tornado.web.RequestHandler):
    def get(self):
        self.render('exit-poll.html')


class ExitDataHandler(tornado.web.RequestHandler):
    def get(self):
        state = self.get_argument('state', 'goa')
        data = pd.read_json('data/exit-data.json')
        self.write(data[state].to_json())


class VoterTOHandler(tornado.web.RequestHandler):
    def get(self):
        self.render('voter-turnout.html')


class TurnoutHandler(tornado.web.RequestHandler):
    def get(self):
        self.render('turnout-change.html')
