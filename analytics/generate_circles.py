'''Generates circle centers on [0,1], [0,1] with buffer on borders'''
import numpy as np

def generate_circles(number, radius, inner_radius):
    ''' number: number of points to return
        inner_radius: won't return anything with radius [0, inner_radius]
        radius: won't return anything with radius [radius, \inf]
        returns x, y coordinates
        '''
    r = np.random.uniform(inner_radius, radius, number)
    theta = np.random.uniform(0, 2*np.pi, number)
    x, y = r*np.cos(theta) + 0.5, r*np.sin(theta) + 0.5
    return [list(e) for e in zip(x,y)]


def generate_isis(number, lamb):
    return 100*np.random.poisson(lamb, number)
