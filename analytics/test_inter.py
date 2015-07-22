import numpy as np
import pylab as py

import scipy.interpolate as spi
import numpy.random as npr
import numpy.linalg as npl

npr.seed(0)

class Signal(object):

    def __init__(self, x, y):
        self.x = x
        self.y = y

    def plot(self, title):
        self._plot(title)
        py.plot(self.x, self.y ,'bo-')
        py.ylim([-1.8,1.8])
        py.plot(hires.x,hires.y, 'k-', alpha=.5)

    def _plot(self, title):
        py.grid()
        py.title(title)
        py.xlim([0.0,1.0])

    def sinc_resample(self, xnew):
        m,n = (len(self.x), len(xnew))
        T = 1./n
        A = np.zeros((m,n))

        for i in range(0,m):
            A[i,:] = np.sinc((self.x[i] - xnew)/T)

        return Signal(xnew, npl.lstsq(A,self.y)[0])

    def spline_resample(self, xnew):
        s = spi.splrep(self.x, self.y)
        return Signal(xnew, spi.splev(xnew, s))

class Error(Signal):

    def __init__(self, a, b):
        self.x = a.x
        self.y = np.abs(a.y - b.y)

    def plot(self, title):
        self._plot(title)
        py.plot(self.x, self.y, 'bo-')
        py.ylim([0.0,.5])

def grid(n): return np.linspace(0.0,1.0,n)
def sample(f, x): return Signal(x, f(x))

def random_offsets(n, amt=.5):
    return (amt/n) * (npr.random(n) - .5)

def jittered_grid(n, amt=.5):
    return np.sort(grid(n) + random_offsets(n,amt))

def f(x):
    t = np.pi * 2.0 * x
    return np.sin(t) + .5 * np.sin(14.0*t)

n = 30
m = n + 1

# Signals
#even   = sample(f, np.r_[1:n+1] / float(n))
events = {"mouseCoor":[[1437582399747,"move",0.09113607990012484,0.19627329192546583],[1437582399762,"move",0.09488139825218476,0.19875776397515527],[1437582399779,"move",0.10112359550561797,0.20248447204968945],[1437582399796,"move",0.1111111111111111,0.20745341614906831],[1437582399813,"move",0.12359550561797752,0.21366459627329193],[1437582399830,"move",0.14232209737827714,0.21987577639751552],[1437582399847,"move",0.1647940074906367,0.22608695652173913],[1437582399864,"move",0.18102372034956304,0.22981366459627328],[1437582399882,"move",0.20224719101123595,0.2372670807453416],[1437582399898,"move",0.21598002496878901,0.24472049689440994],[1437582399914,"move",0.23096129837702872,0.2546583850931677],[1437582399933,"move",0.2484394506866417,0.2670807453416149],[1437582399949,"move",0.26591760299625467,0.2795031055900621],[1437582399966,"move",0.28714107365792757,0.2906832298136646],[1437582399983,"move",0.2983770287141074,0.2956521739130435],[1437582400001,"move",0.3021223470661673,0.2968944099378882],[1437582400017,"move",0.32209737827715357,0.30807453416149067],[1437582400034,"move",0.33208489388264667,0.315527950310559],[1437582400052,"move",0.3383270911360799,0.3204968944099379],[1437582400069,"move",0.37203495630461925,0.34658385093167704],[1437582400085,"move",0.383270911360799,0.35403726708074534],[1437582400103,"move",0.3945068664169788,0.36149068322981365],[1437582400122,"move",0.40574282147315854,0.3701863354037267],[1437582400136,"move",0.41198501872659177,0.3739130434782609],[1437582400154,"move",0.42696629213483145,0.38633540372670805],[1437582400177,"move",0.43820224719101125,0.3937888198757764],[1437582400195,"move",0.44569288389513106,0.3987577639751553],[1437582400213,"move",0.449438202247191,0.40248447204968946],[1437582400226,"move",0.449438202247191,0.40372670807453415],[1437582400242,"move",0.45068664169787764,0.40372670807453415],[1437582400962,"move",0.449438202247191,0.40372670807453415],[1437582400979,"move",0.42946317103620474,0.4],[1437582400994,"move",0.4044943820224719,0.3950310559006211],[1437582401012,"move",0.37702871410736577,0.39254658385093166],[1437582401029,"move",0.3408239700374532,0.391304347826087],[1437582401047,"move",0.32459425717852686,0.39006211180124223],[1437582401065,"move",0.3146067415730337,0.38881987577639754],[1437582401081,"move",0.31086142322097376,0.38881987577639754],[1437582401097,"move",0.3096129837702871,0.38881987577639754],[1437582401131,"move",0.3083645443196005,0.38881987577639754],[1437582401270,"click",0.3083645443196005,0.38881987577639754]]}
uneven = [e[2] for e in events['mouseCoor']]
sinc
'''
uneven = sample(f, jittered_grid(m))
hires  = sample(f, grid(10*n))

sinc   = uneven.sinc_resample(even.x)
spline = uneven.spline_resample(even.x)

sinc_err   = Error(sinc, even)
spline_err = Error(spline, even)
'''
# Plot Labels
sn = lambda x,n: "%sly Sampled (%s points)" % (x,n)
r  = lambda x: "%s Reconstruction" % x
re = lambda x: "%s Error" % r(x)

plots = [
    [even,       sn("Even", n)],
    [uneven,     sn("Uneven", m)],
    [sinc,       r("Sinc")],
    [sinc_err,   re("Sinc")],
    [spline,     r("Cubic Spline")],
    [spline_err, re("Cubic Spline")]
]

for i in range(0,len(plots)):
    py.subplot(3, 2, i+1)
    p = plots[i]
    p[0].plot(p[1])

py.show()

