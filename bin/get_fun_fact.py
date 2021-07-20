import json
import random

import cherrypy

"""
A cherrpy application that fetches 'fun facts' about gardens and returns them in json
"""
class FunFactController(object):

    def __init__():
        self.facts = open('fun_facts.txt')
    
    @cherrypy.expose
    def index():
        cherrypy.response.headers['Content-type'] = 'application/json'
        return json.dumps(get_fun_fact())

    def get_fun_fact():
        fact = facts[random.randint(0, len(facts) - 1)]
        return line_to_object(fact)

    def line_to_object(line):
        if line is None or line == "":
            return None

        (header, type, content, gardens) = line.strip().split('|')
        gardens = gardens.split(',')

        # JSON:
            # header
            # type
                # image OR
                # text
            # content
                # if image, url of that image
            # gardens (ids)
        return {
            'header': header,
            'type': text,
            'content': content,
            'gardens': gardens
        }

cherrypy.quickstart(FunFactController(), config='test.conf')

# In JS: 
    # 1. make request to this
    # 2. put bits in a template (optionally, do image bit)
    # 3. have a timer to update (every minute)
    # 4. buttons to get new facts
