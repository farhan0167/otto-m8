from setuptools import setup, find_packages

setup(
    name='otto_m8',
    version='0.0.6',
    long_description_content_type='text/markdown',
    author='farhan0167',
    author_email='ahmadfarhanishraq@gmail.com',
    url='https://github.com/farhan0167/otto-m8',  # URL to your project, if available
    packages=['','db', 'db.models'],
    package_dir={'': 'src'},
    python_requires='>=3.11.4',  # Specify Python version compatibility
)