import os
import sys

from genshi.template import TemplateLoader

template_dir = os.path.join(os.path.dirname(__file__), '..', 'templates')
loader = TemplateLoader(template_dir)

def render(names, target_dir):
    for name in names:
        tmpl = loader.load(name)
        to_file = open(target_dir + os.sep + name, 'w')
        to_file.write(tmpl.generate().render('xhtml'))

if __name__ == '__main__':
    names = [f for f in os.listdir(template_dir) if not f.startswith('.') and f.endswith('html')]
    render(names, sys.argv[1])
