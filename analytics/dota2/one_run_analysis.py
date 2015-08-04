import sys
import time
sys.path.insert(0, '../')

import seaborn as sns
import pandas as pd
import numpy as np
from scipy.stats import mstats
import scipy.special as sse
import scipy.stats as sss
import scipy.optimize as so
import rpy2.robjects as robjects
from rpy2.robjects import pandas2ri

import grab_data as gd


pandas2ri.activate()
r = robjects.r

def fit_gamma(inp):
    a,l,b = sss.gamma.fit(inp)
    x = np.linspace(min(inp), max(inp), len(inp))
    count, bins = np.histogram(inp, density=True, bins=len(x))
    chi, p = sss.chisquare(count, sss.gamma(a,l,b).pdf(x))
    return pd.Series({'a': a, 'l': l, 'b': b, 'chi': chi, 'p': p})


st = gd.Study('ec2-52-27-131-155.us-west-2.compute.amazonaws.com:27017', 'target_second', 'dota2', 'Dota2', limit=9999)



times = []
rank = []
round1 = []
round2 = []
round3 = []
for email, p in st.participants.items():
    times = p.time_to_clicks()
    round1.append(times[:50])
    round2.append(times[50:100])
    round3.append(times[100:150])
    rank.append(p.rank)


data = pd.DataFrame({'rank': rank, 'round 1': round1, 'round 2': round2, 'round 3': round3})
data['combined'] = data.apply(lambda x: x['round 1'] + x['round 2'] + x['round 3'], axis=1)
data['avg'] = data.apply(lambda x: np.mean(x['combined']), axis=1)

fit_round1 = data.apply(lambda x: fit_gamma(x['round 1']), axis=1)
fit_round2 = data.apply(lambda x: fit_gamma(x['round 2']), axis=1)
fit_round3 = data.apply(lambda x: fit_gamma(x['round 3']), axis=1)
fit_combined = data.apply(lambda x: fit_gamma(x['combined']), axis=1)
all_data = pd.concat([fit_combined, data], axis=1)

all_data.save(time.strftime('%Y%m%d_%H%M%S') + '_' + str(len(all_data)) + '_Dota2')


rdata = pandas2ri.py2ri(all_data)
print(r.anova(r.lm('avg ~ a * b * l', data=rdata)))
print(r.anova(r.lm('rank ~ a * b * l * chi * p', data=rdata)))
