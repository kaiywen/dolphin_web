"""
    This file is used to verify that uWSGI has been successfully installed
    Run "uwsgi --http :9000 --wsgi-file test.py" in the shell and open the browser
    IYou should see "hello world" at the site http://localhost:9000
"""
def application(env, start_response):
    start_response('200 OK', [('Content-Type','text/html')])
    return ["Hello World"]