import grab_data as gd
import seaborn as sns
import pandas as pd
import numpy as np
from scipy.stats import mstats
import scipy.special as sse
import scipy.stats as sss
import scipy.optimize as so
import rpy2.robjects as robjects
from rpy2.robjects import pandas2ri
import time

pandas2ri.activate()
r = robjects.r


def eg_pdf(p, x):
    m, s, t = p
    return 1/t * np.exp( (m/t) + (s*s/(2*t*t)) - x / t) * sse.erfc((x - m - (s*s)/t) / s)

def llh(p, f, x):
    return -np.sum(np.log(f(p,x)))

def fit_gamma(inp):
    a,l,b = sss.gamma.fit(inp)
    x = np.linspace(min(inp), max(inp), len(inp))
    count, bins = np.histogram(inp, density=True, bins=len(x))
    chi, p = sss.chisquare(count, sss.gamma(a,l,b).pdf(x))
    return pd.Series({'a': a, 'l': l, 'b': b, 'chi': chi, 'p': p})


st = gd.Study('ec2-52-27-131-155.us-west-2.compute.amazonaws.com:27017', 'target_second', 'targets', 'Dota2', limit=20)

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

all_data.save(time.strftime('%Y%m%d_%H%M%S') + '_' + str(len(all_data)) + '_CSGO')


rdata = pandas2ri.py2ri(all_data)
print(r.anova(r.lm('avg ~ a * b * l', data=rdata)))
print(r.anova(r.lm('rank ~ a * b * l * chi * p', data=rdata)))

'''
colors = 'rgb'
for i, section in enumerate(['round 1', 'round 2', 'round 3']):
    a,l,b = sss.gamma.fit(cdata[section])
    x = np.linspace(min(cdata[section]), max(cdata[section]), len(cdata[section]))
    count, bins = np.histogram(cdata[section], density=True, bins=len(x))
    print count
    plt.hist(cdata[section], bins=30, normed=True, color=colors[i], alpha=0.3)
    plt.plot(x, sss.gamma(a,l,b).pdf(x))
    chi, p = sss.chisquare(count, sss.gamma(a,l,b).pdf(x))
    plt.text(1200, 0.004 - 0.0005*i, '$\chi^2 = $%2.3f, $p = $%2.3f' % (chi, p), color=colors[i])

sns.distplot(cdata['round 1'])
sns.distplot(cdata['round 2'])
sns.distplot(cdata['round 3'])




sns.plt.text(1200, 0.004, '$ks_{1,2} = $%2.3f, $p = $%2.3f' % (ks_2samp(cdata['round 1'], cdata['round 2']))
sns.plt.text(1200, 0.003, '$ks_{2,3} = $%2.3f, $p = $%2.3f' % (ks_2samp(cdata['round 2'], cdata['round 3']))
sns.plt.text(1200, 0.002, '$ks_{1,3} = $%2.3f, $p = $%2.3f' % (ks_2samp(cdata['round 1'], cdata['round 3']))
#sns.plt.text(5, 800, '$n = $' + str(len(wdata)))
sns.plt.savefig('./learning_' + str(len(wdata)) + '.pdf')
'''
