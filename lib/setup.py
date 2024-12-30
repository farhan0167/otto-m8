from setuptools import setup, find_namespace_packages

setup(
    name='otto_m8_backend',
    version='0.0.7',
    long_description_content_type='text/markdown',
    author='farhan0167',
    author_email='ahmadfarhanishraq@gmail.com',
    url='https://github.com/farhan0167/otto-m8',
    packages=find_namespace_packages(include=[ 'otto_backend.db', 'otto_backend.db.*', 'otto_backend.core.*']),
    python_requires='>=3.11.4',
)