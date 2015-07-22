'''Generates circle centers on [0,1], [0,1] with buffer on borders'''
import numpy as np

def generate(number, center_void, border_buffer):
    ''' number: number of points to return
        center_void: tuple of dimension size and center region to avoid
        border_buffer: single number for border in all dimensions from both sides of 0 and 1
        '''
    while True:
        np.random.uniform(0, 1, 
    numbers = np.concatenate((np.random.uniform(0 + border_buffer, center_void[0], size=number/2), \
        np.random.uniform(center_void[1], 1 - border_buffer, size=number/2 + (number % 2 == 1) * 1)))
    return numbers
