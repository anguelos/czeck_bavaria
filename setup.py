#!/usr/bin/env python

import setuptools
from distutils.core import setup

setup(
    name='grouting',
    version='0.0.1dev',
    packages=[],
    scripts=['bin/grouting'],
    license='GNU Lesser General Public License v3.0',
    long_description=open('README.md').read(),
    author='Anguelos Nicolaou',
    author_email='anguelos.nicolaou@gmail.com',
    url='https://github.com/anguelos/czeck_bavaria',
    package_data={'scenethecizer': ["data/backgrounds/paper_texture.jpg","data/corpora/01_the_ugly_duckling.txt"]},
    install_requires=[
        'cherrypy','opencv-python','tqdm','jinja2'
    ],
)